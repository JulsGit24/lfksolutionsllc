import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

/* ── Material presets ─────────────────────────────────────────────────────── */
const MP = { metalness: 0.15, roughness: 0.8, color: '#b0b0b0' }; // darker gray pipe body
const MJ = { metalness: 0.2, roughness: 0.7, color: '#8d8d8d' }; // darker joints/caps
const MV = { metalness: 0.2, roughness: 0.7, color: '#555555' }; // darker gray valve wheel
const MT = { metalness: 0.2, roughness: 0.8, color: '#7a7a7a' }; // threading

/* ── Cylinder from (x1,y1) to (x2,y2) in the z=0 plane ─────────────────── */
function Pipe({ x1, y1, x2, y2, r = 0.21 }) {
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const q = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(dx / len, dy / len, 0),
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dx, dy, len],
  );
  return (
    <mesh position={[cx, cy, 0]} quaternion={q}>
      <cylinderGeometry args={[r, r, len, 16, 1]} />
      <meshPhysicalMaterial {...MP} />
    </mesh>
  );
}

/* ── Smooth quadratic-Bézier elbow ──────────────────────────────────────── */
function Elbow({ x0, y0, xm, ym, x2, y2, r = 0.21 }) {
  const curve = useMemo(
    () => new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x0, y0, 0),
      new THREE.Vector3(xm, ym, 0),
      new THREE.Vector3(x2, y2, 0),
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x0, y0, xm, ym, x2, y2],
  );
  return (
    <mesh>
      <tubeGeometry args={[curve, 12, r, 12, false]} />
      <meshPhysicalMaterial {...MP} />
    </mesh>
  );
}

/* ── Horizontal end-cap disc ─────────────────────────────────────────────── */
function Cap({ x, y }) {
  const q = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(1, 0, 0),
    ),
    [],
  );
  return (
    <mesh position={[x, y, 0]} quaternion={q} scale={1.275}>
      <cylinderGeometry args={[0.26, 0.26, 0.10, 12, 1]} />
      <meshPhysicalMaterial {...MJ} />
    </mesh>
  );
}

/* ── Threaded flange collar — screws / unscrews with scroll ─────────────── */
function Flange({ x, y, pipeAxis, scrub }) {
  const groupRef = useRef();

  const axis = useMemo(
    () => new THREE.Vector3(...pipeAxis).normalize(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const colQ = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis),
    [axis],
  );

  const bolts = useMemo(() => {
    const p1 = Math.abs(axis.x) < 0.9
      ? new THREE.Vector3().crossVectors(axis, new THREE.Vector3(1, 0, 0)).normalize()
      : new THREE.Vector3().crossVectors(axis, new THREE.Vector3(0, 1, 0)).normalize();
    const p2 = new THREE.Vector3().crossVectors(axis, p1).normalize();
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2, R = 0.30;
      return [
        p1.x * Math.cos(a) * R + p2.x * Math.sin(a) * R,
        p1.y * Math.cos(a) * R + p2.y * Math.sin(a) * R,
        p1.z * Math.cos(a) * R + p2.z * Math.sin(a) * R,
      ];
    });
  }, [axis]);

  useFrame(() => {
    const s = scrub.get();
    if (groupRef.current) {
      groupRef.current.setRotationFromAxisAngle(axis, s * Math.PI * 8);
      const travel = (s - 0.5) * 0.3; // translation for screw effect
      groupRef.current.position.set(axis.x * travel, axis.y * travel, axis.z * travel);
    }
  });

  return (
    <group position={[x, y, 0]} scale={1.275}>
      {/* Inner Thread Base (Stationary) */}
      <mesh quaternion={colQ}>
        <cylinderGeometry args={[0.24, 0.24, 0.4, 16, 1]} />
        <meshPhysicalMaterial {...MT} />
      </mesh>
      {/* Visual Thread Ridges */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[axis.x * (i - 2) * 0.06, axis.y * (i - 2) * 0.06, axis.z * (i - 2) * 0.06]} quaternion={colQ}>
          <torusGeometry args={[0.24, 0.015, 8, 16]} />
          <meshPhysicalMaterial {...MT} />
        </mesh>
      ))}

      <group ref={groupRef}>
        {/* Main collar ring */}
        <mesh quaternion={colQ}>
          <cylinderGeometry args={[0.34, 0.34, 0.24, 16, 1]} />
          <meshPhysicalMaterial {...MJ} />
        </mesh>
        {/* Six hex-head bolts around the flange face */}
        {bolts.map((p, i) => (
          <mesh key={i} position={p} quaternion={colQ}>
            <cylinderGeometry args={[0.045, 0.045, 0.30, 6, 1]} />
            <meshPhysicalMaterial {...MJ} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ── Gate-valve handwheel ────────────────────────────────────────────────── */
function Valve({ x, y, scrub }) {
  const ref = useRef();
  const stemRef = useRef();

  useFrame(() => {
    const s = scrub.get();
    if (ref.current) {
      ref.current.rotation.z = s * Math.PI * 6;
    }
    if (stemRef.current) {
      const travel = (s - 0.5) * 0.6; // Moves out towards the camera
      stemRef.current.position.set(0, 0, travel);
      stemRef.current.rotation.z = s * Math.PI * 6;
    }
  });

  return (
    <group position={[x, y, 0]} scale={1.275}>
      {/* Base valve housing on the pipe */}
      <mesh>
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshPhysicalMaterial {...MJ} />
      </mesh>
      
      {/* Stem/Thread going through */}
      <group ref={stemRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 16, 1]} />
          <meshPhysicalMaterial {...MT} />
        </mesh>
        {/* Thread ridges on stem */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, 0, (i - 3.5) * 0.08]}>
            <torusGeometry args={[0.08, 0.015, 8, 16]} />
            <meshPhysicalMaterial {...MT} />
          </mesh>
        ))}
        
        {/* Wheel assembly attached to stem */}
        <group ref={ref} position={[0, 0, 0.35]}>
          <mesh>
            <torusGeometry args={[0.40, 0.045, 16, 32]} />
            <meshPhysicalMaterial {...MV} />
          </mesh>
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((a, i) => (
            <mesh key={i} rotation={[0, 0, a]}>
              <cylinderGeometry args={[0.03, 0.03, 0.80, 8, 1]} />
              <meshPhysicalMaterial {...MV} />
            </mesh>
          ))}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshPhysicalMaterial {...MV} />
          </mesh>
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
             <cylinderGeometry args={[0.06, 0.06, 0.1, 16, 1]} />
             <meshPhysicalMaterial {...MJ} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ── Scroll-driven canvas invalidator (demand rendering) ─────────────────── */
function ScrollDriver({ scrub }) {
  const { invalidate } = useThree();
  React.useEffect(() => scrub.on('change', invalidate), [scrub, invalidate]);
  return null;
}

/* ── Variant scenes ──────────────────────────────────────────────────────── */

function StraightScene({ scrub }) {
  const { viewport: { width: vw } } = useThree();
  const hw = (vw / 2) * 0.75, g = hw * 0.4;
  const leftRef = useRef();
  const rightRef = useRef();
  
  useFrame(() => {
     const s = scrub.get();
     const offset = (1 - s) * 3.0; // wider offset for bigger pieces
     if (leftRef.current) leftRef.current.position.x = -offset;
     if (rightRef.current) rightRef.current.position.x = offset;
  });

  return (
    <>
      <group ref={leftRef}>
        <Pipe x1={-hw} y1={0} x2={-g} y2={0} />
        <Flange x={-g} y={0} pipeAxis={[1, 0, 0]} scrub={scrub} />
        <Cap x={-hw} y={0} />
      </group>
      <Valve x={0} y={0} scrub={scrub} />
      <group ref={rightRef}>
        <Pipe x1={g} y1={0} x2={hw} y2={0} />
        <Flange x={g} y={0} pipeAxis={[-1, 0, 0]} scrub={scrub} />
        <Cap x={hw} y={0} />
      </group>
    </>
  );
}

function ElbowScene({ scrub }) {
  const { viewport: { width: vw, height: vh } } = useThree();
  const hw = (vw / 2) * 0.75, ex = hw - 0.9, ey = 0.2, bot = -(vh / 2) - 0.5;
  const leftRef = useRef();
  const bottomRef = useRef();

  useFrame(() => {
     const s = scrub.get();
     const offset = (1 - s) * 3.0;
     if (leftRef.current) leftRef.current.position.x = -offset;
     if (bottomRef.current) bottomRef.current.position.y = -offset;
  });

  return (
    <>
      <group ref={leftRef}>
        <Pipe x1={-hw} y1={ey} x2={ex - 0.12} y2={ey} />
        <Flange x={ex - 0.12} y={ey} pipeAxis={[1, 0, 0]} scrub={scrub} />
        <Cap x={-hw} y={ey} />
      </group>
      <group ref={bottomRef}>
        <Elbow x0={ex - 0.12} y0={ey} xm={ex + 0.55} ym={ey} x2={ex + 0.55} y2={bot} />
      </group>
    </>
  );
}

function TeeScene({ scrub }) {
  const { viewport: { width: vw, height: vh } } = useThree();
  const hw = (vw / 2) * 0.75, py = 0.3, bot = -(vh / 2) - 0.5;
  const bottomRef = useRef();

  useFrame(() => {
     const s = scrub.get();
     const offset = (1 - s) * 3.0;
     if (bottomRef.current) bottomRef.current.position.y = -offset;
  });

  return (
    <>
      <Pipe x1={-hw} y1={py} x2={hw} y2={py} />
      <Cap x={-hw} y={py} />
      <Cap x={hw}  y={py} />
      <group ref={bottomRef}>
        <Pipe x1={0} y1={py - 0.12} x2={0} y2={bot} />
        <Flange x={0} y={py - 0.12} pipeAxis={[0, 1, 0]} scrub={scrub} />
      </group>
    </>
  );
}

/* ── Root component (same external API as the previous SVG version) ───────── */

const SCENES = { straight: StraightScene, elbow: ElbowScene, tee: TeeScene };

const PipeConnector = ({ variant = 'straight', topPadding = 0 }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const Scene = SCENES[variant] ?? SCENES.straight;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ width: '100%', padding: '0 48px', paddingTop: topPadding, lineHeight: 0 }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 28, near: 0.1, far: 100 }}
        style={{ width: '100%', height: '195px', display: 'block' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        frameloop="demand"
      >
        <Environment preset="studio" />

        {/* Key light — upper right front */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 8, 6]} intensity={1.8} />
        {/* Cool fill from lower left */}
        <directionalLight position={[-5, -3, 4]} intensity={0.6} color="#aaccff" />
        {/* Soft top-centre fill */}
        <pointLight position={[0, 4, 4]} intensity={1.0} />

        {/* Perfectly aligned layout as requested */}
        <group rotation={[0, 0, 0]}>
          <Suspense fallback={null}>
            <Scene scrub={scrollYProgress} />
          </Suspense>
        </group>

        <ScrollDriver scrub={scrollYProgress} />
      </Canvas>
    </div>
  );
};

export default PipeConnector;
