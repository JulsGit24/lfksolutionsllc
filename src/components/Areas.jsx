import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { US_STATES, SERVICE_CITIES, MAP_VIEWBOX } from '../data/usStates';

/**
 * Service-area map, drawn from real US state boundaries.
 *
 * Geometry comes from the US Census 1:10m state file (via `us-atlas`),
 * projected at build time by scripts/generate-us-map.mjs — see src/data/usStates.js.
 * The city pins run through the same projection as the state outlines, so a pin
 * cannot drift relative to the state it belongs to.
 *
 * Two views: the whole country, and a zoom on the DMV. The zoom exists because
 * all ten service cities fall inside roughly 8x16 units of a 960x600 US map —
 * real geography, but an unreadable cluster at national scale.
 */

const FULL_VIEW = (() => {
  const [x, y, w, h] = MAP_VIEWBOX.split(' ').map(Number);
  return { x, y, w, h };
})();

/**
 * The zoom frames the licensed states in full, from their projected bounds.
 *
 * Framing the pin cluster instead would crop VA and MD at the viewBox edge, and
 * a state cropped to a straight edge reads as a green panel — the card this
 * design is specifically meant to avoid. Whole states keep an organic outline
 * with white page around it.
 *
 * The aspect ratio is forced to match the national view so the SVG never
 * letterboxes, which is what lets the hover label be positioned in percentages.
 */
const AREA_VIEW = (() => {
  const licensed = US_STATES.filter(s => s.region);
  const x0 = Math.min(...licensed.map(s => s.b[0]));
  const y0 = Math.min(...licensed.map(s => s.b[1]));
  const x1 = Math.max(...licensed.map(s => s.b[2]));
  const y1 = Math.max(...licensed.map(s => s.b[3]));
  const pad = 6;
  const aspect = FULL_VIEW.w / FULL_VIEW.h;
  let w = (x1 - x0) + pad * 2;
  let h = (y1 - y0) + pad * 2;
  if (w / h < aspect) w = h * aspect; else h = w / aspect;
  return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h };
})();

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * Tweens the viewBox between views. Animating the attribute directly rather
 * than transforming a <g>: SVG transform-origin behaviour varies across
 * browsers, and a viewBox tween is exact everywhere.
 */
function useViewBox(target, duration = 620) {
  const [vb, setVb] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const e = easeInOut(t);
      const next = {
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        w: from.w + (target.w - from.w) * e,
        h: from.h + (target.h - from.h) * e,
      };
      setVb(next);
      fromRef.current = next;
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return vb;
}

/**
 * The map has no card behind it any more, so the colours invert: the landmass
 * is the brand green and the state borders are hairlines cut out of it.
 * Licensed states lift a shade; the selected one goes to the brand amber.
 */
const STATE_IDLE = { fill: '#003E1E', stroke: 'rgba(255,255,255,0.26)' };
const STATE_LICENSED = { fill: '#0B5C33', stroke: 'rgba(255,255,255,0.42)' };
const STATE_ACTIVE = { fill: '#FAA747', stroke: '#FFFFFF' };

const Areas = () => {
  const { t } = useTranslation();
  const [region, setRegion] = useState('va');
  const [city, setCity] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  const target = zoomed ? AREA_VIEW : FULL_VIEW;
  const vb = useViewBox(target);

  // Screen-constant sizing: viewBox units shrink as we zoom, so anything that
  // should stay the same size on screen scales with the viewBox width.
  const u = vb.w / FULL_VIEW.w;

  const regionData = {
    dc: t('areas.dc', { returnObjects: true }),
    md: t('areas.md', { returnObjects: true }),
    va: t('areas.va', { returnObjects: true }),
  };
  const active = regionData[region] ?? null;

  const focusCity = (c) => { setCity(c.name); setRegion(c.region); setZoomed(true); };

  const stateStyle = (s) => {
    if (s.region && s.region === region) return STATE_ACTIVE;
    if (s.region) return STATE_LICENSED;
    return STATE_IDLE;
  };

  const hoveredCity = useMemo(
    () => SERVICE_CITIES.find(c => c.name === city) ?? null,
    [city],
  );

  const cluster = useMemo(() => {
    const xs = SERVICE_CITIES.map(c => c.x);
    const ys = SERVICE_CITIES.map(c => c.y);
    return {
      cx: (Math.min(...xs) + Math.max(...xs)) / 2,
      cy: (Math.min(...ys) + Math.max(...ys)) / 2,
    };
  }, []);

  return (
    <section id="service-areas" style={{ padding: 'clamp(100px, 12vw, 160px) 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="sa-layout">

          {/* Left — heading and location index */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="sa-eyebrow">{t('areas.sectionLabel')}</div>
            <h2 className="sa-title">{t('areas.title')}</h2>
            <p className="sa-sub">{t('areas.subtitle')}</p>

            <div className="sa-index">
              {SERVICE_CITIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`sa-city${city === c.name ? ' is-active' : ''}`}
                  onMouseEnter={() => focusCity(c)}
                  onFocus={() => focusCity(c)}
                  onClick={() => focusCity(c)}
                  onMouseLeave={() => setCity(null)}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="sa-viewtoggle"
              onClick={() => { setZoomed(!zoomed); setCity(null); }}
            >
              {zoomed ? t('areas.viewUS') : t('areas.viewArea')}
            </button>

            <motion.div
              className="sa-readout"
              key={city ?? region}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="sa-readout-name">
                <span className="sa-key-dot" style={{ background: 'var(--secondary)' }} />
                {city ?? active?.title}
              </div>
              <p className="sa-readout-desc">{active?.desc}</p>
            </motion.div>
          </motion.div>

          {/* Right — the map */}
          <motion.div
            className="sa-map"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <svg
              viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
              role="img"
              aria-label={t('areas.title')}
            >
              {/* Real state boundaries. Non-licensed states are inert scenery. */}
              <g>
                {US_STATES.map((s) => {
                  const st = stateStyle(s);
                  const interactive = Boolean(s.region);
                  // Zoomed in, the rest of the country only serves to fill the
                  // frame with green. Fade it out and leave the DMV on white.
                  const hidden = zoomed && !interactive;
                  return (
                    <path
                      key={s.id}
                      d={s.d}
                      className={interactive ? 'sa-region' : undefined}
                      fill={st.fill}
                      stroke={st.stroke}
                      strokeWidth={(s.region === region ? 1.6 : 0.8) * u}
                      strokeLinejoin="round"
                      opacity={hidden ? 0 : 1}
                      style={{ transition: 'opacity 0.45s ease' }}
                      pointerEvents={hidden ? 'none' : undefined}
                      onMouseEnter={interactive ? () => { setRegion(s.region); setCity(null); } : undefined}
                      onFocus={interactive ? () => { setRegion(s.region); setCity(null); } : undefined}
                      tabIndex={interactive ? 0 : undefined}
                      role={interactive ? 'button' : undefined}
                      aria-label={interactive ? s.name : undefined}
                    />
                  );
                })}
              </g>

              {/* Locator ring — at national scale the DMV is a speck, so mark it. */}
              {!zoomed && (
                <g pointerEvents="none">
                  {/* Dark green rather than amber: the ring straddles the amber
                      service states and the white ocean, and amber disappears
                      into both. */}
                  <circle
                    cx={cluster.cx} cy={cluster.cy} r={26 * u}
                    fill="none" stroke="#003E1E" strokeWidth={1.6 * u} opacity="0.8"
                  />
                  <circle
                    cx={cluster.cx} cy={cluster.cy} r={38 * u}
                    fill="none" stroke="#003E1E" strokeWidth={1 * u} opacity="0.28"
                  />
                </g>
              )}

              {/* Pins */}
              {SERVICE_CITIES.map((c) => {
                const on = city === c.name;
                const r = (on ? 7 : 4.5) * u;
                return (
                  <g
                    key={c.name}
                    className="sa-pin"
                    onMouseEnter={() => { setCity(c.name); setRegion(c.region); }}
                    onMouseLeave={() => setCity(null)}
                  >
                    <circle cx={c.x} cy={c.y} r={16 * u} fill="transparent" />
                    {/* White core with a green rim: the selected state turns
                        amber, so an amber pin would vanish into it. */}
                    <circle
                      cx={c.x} cy={c.y} r={r}
                      fill="#ffffff"
                      stroke={on ? '#003E1E' : 'rgba(0,62,30,0.55)'}
                      strokeWidth={(on ? 1.8 : 1) * u}
                    />
                    {on && (
                      <circle
                        cx={c.x} cy={c.y} r={13 * u}
                        fill="none" stroke="#003E1E" strokeWidth={1.5 * u} opacity="0.55"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover label as an HTML overlay rather than SVG <text>: SVG text
                scaled down by the zoom factor renders inconsistently at small
                font sizes. The viewBox keeps a constant aspect ratio in both
                views, so the SVG never letterboxes and this percentage maps
                exactly onto the pin. */}
            {hoveredCity && (
              <div
                className="sa-tip"
                style={{
                  left: `${((hoveredCity.x - vb.x) / vb.w) * 100}%`,
                  top: `${((hoveredCity.y - vb.y) / vb.h) * 100}%`,
                }}
              >
                {hoveredCity.name}
              </div>
            )}

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Areas;
