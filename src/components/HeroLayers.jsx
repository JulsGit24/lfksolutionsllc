import React from 'react';

/**
 * Four hand-authored construction-stage illustrations of the same house,
 * adapted from the client-supplied reference photo (house_va.jpg — a
 * two-story Virginia home with a steep front cross-gable, brick/siding mix,
 * a covered entry, and a tall arch-top stairwell window). All four layers
 * share one viewBox (0 0 1200 800) and one massing/roofline so they are
 * perfectly superimposable when stacked and cross-faded by scroll position.
 * Vector illustration (no AI image-generation tool available) — gradients
 * and shading are used to push toward the photo's realism within that medium.
 *
 * Stacking order (bottom -> top): Plumbing, Foundation, Structure, Facade.
 */

const VIEWBOX = '0 0 1200 800';

// ── Shared massing every layer aligns to ──────────────────────────────────
const GROUND_Y = 660;
// Main two-story body (full width of the house)
const BODY = { x: 260, y: 260, width: 680, height: GROUND_Y - 260 };
// Steep front cross-gable (left-of-center, tallest element)
const GABLE = 'M 380 260 L 520 90 L 660 260 Z';
const GABLE_RIDGE_X = 520;
// Lower hip-roofed wing (right side)
const HIP = 'M 660 260 L 760 185 L 880 185 L 940 260 Z';
// Chimney (far left, rises above the hip wing but below the gable apex)
const CHIMNEY = { x: 300, y: 145, width: 46, height: 165 };
const CHIMNEY_CAP = { x: 292, y: 137, width: 62, height: 14 };

const wrapperStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

const svgProps = {
  viewBox: VIEWBOX,
  preserveAspectRatio: 'xMidYMid slice',
  xmlns: 'http://www.w3.org/2000/svg',
  style: { width: '100%', height: '100%', display: 'block' },
};

const Ground = ({ fill }) => <rect x="0" y={GROUND_Y} width="1200" height={800 - GROUND_Y} fill={fill} />;

const DashedMassing = () => (
  <>
    <path d={GABLE} fill="none" stroke="#c7ccc3" strokeWidth="2" strokeDasharray="6 8" />
    <path d={HIP} fill="none" stroke="#c7ccc3" strokeWidth="2" strokeDasharray="6 8" />
    <rect {...BODY} fill="none" stroke="#c7ccc3" strokeWidth="2" strokeDasharray="6 8" />
  </>
);

export const PlumbingLayer = () => (
  <div aria-hidden="true" style={wrapperStyle}>
    <svg {...svgProps}>
      <rect width="1200" height="800" fill="#fbfbf9" />
      <Ground fill="#e3e7de" />
      <DashedMassing />

      {/* Trench */}
      <rect x="240" y={GROUND_Y - 20} width="720" height="40" fill="#cdb89a" opacity="0.5" />

      {/* Main vertical stack, rising under the gable */}
      <line x1={GABLE_RIDGE_X} y1={GROUND_Y + 60} x2={GABLE_RIDGE_X} y2="300" stroke="#B8762E" strokeWidth="10" strokeLinecap="round" />
      <line x1={GABLE_RIDGE_X - 4} y1={GROUND_Y + 60} x2={GABLE_RIDGE_X - 4} y2="300" stroke="#e0a868" strokeWidth="2" strokeLinecap="round" />

      {/* Branch runs to wet walls left (entry bath) and right (kitchen wing) */}
      <line x1={GABLE_RIDGE_X} y1="420" x2="400" y2="420" stroke="#B8762E" strokeWidth="8" strokeLinecap="round" />
      <line x1="400" y1="420" x2="400" y2={GROUND_Y} stroke="#B8762E" strokeWidth="8" strokeLinecap="round" />
      <line x1={GABLE_RIDGE_X} y1="500" x2="820" y2="500" stroke="#B8762E" strokeWidth="8" strokeLinecap="round" />
      <line x1="820" y1="500" x2="820" y2={GROUND_Y} stroke="#B8762E" strokeWidth="8" strokeLinecap="round" />
      <line x1={GABLE_RIDGE_X} y1="580" x2="600" y2="580" stroke="#B8762E" strokeWidth="6" strokeLinecap="round" />
      <line x1="600" y1="580" x2="600" y2={GROUND_Y} stroke="#B8762E" strokeWidth="6" strokeLinecap="round" />
      {/* PVC vent stack through the hip wing */}
      <line x1="820" y1="230" x2="820" y2="500" stroke="#cfcfc9" strokeWidth="9" strokeLinecap="round" />

      {/* Fittings / cleanouts */}
      {[[GABLE_RIDGE_X, 420], [400, 420], [GABLE_RIDGE_X, 500], [820, 500], [GABLE_RIDGE_X, 580], [600, 580]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="9" fill="#8C5A22" />
      ))}
      {/* Shutoff valve */}
      <g transform={`translate(${GABLE_RIDGE_X},360)`}>
        <circle r="22" fill="none" stroke="#1B5E35" strokeWidth="3" />
        <rect x="-16" y="-3" width="32" height="6" rx="3" fill="#1B5E35" />
      </g>

      {/* Underground supply line */}
      <line x1="40" y1={GROUND_Y + 30} x2={GABLE_RIDGE_X} y2={GROUND_Y + 60} stroke="#5b6b5f" strokeWidth="5" strokeDasharray="2 10" strokeLinecap="round" />
      <circle cx="40" cy={GROUND_Y + 30} r="10" fill="#5b6b5f" />
    </svg>
  </div>
);

export const FoundationLayer = () => (
  <div aria-hidden="true" style={wrapperStyle}>
    <svg {...svgProps}>
      <rect width="1200" height="800" fill="#fbfbf9" />
      <Ground fill="#e3e7de" />
      <DashedMassing />

      {/* Footing trench */}
      <rect x="240" y={GROUND_Y - 4} width="720" height="34" fill="#9b8f7d" />
      {/* Foundation wall */}
      <rect x="260" y={GROUND_Y - 130} width="680" height="130" fill="#c9c2b4" stroke="#8d8472" strokeWidth="2" />

      {/* Rebar grid */}
      {Array.from({ length: 15 }).map((_, i) => (
        <line key={`v${i}`} x1={270 + i * 48} y1={GROUND_Y - 124} x2={270 + i * 48} y2={GROUND_Y - 10} stroke="#6b6354" strokeWidth="2" />
      ))}
      <line x1="265" y1={GROUND_Y - 92} x2="935" y2={GROUND_Y - 92} stroke="#6b6354" strokeWidth="2" />
      <line x1="265" y1={GROUND_Y - 50} x2="935" y2={GROUND_Y - 50} stroke="#6b6354" strokeWidth="2" />

      {/* Slab */}
      <rect x="260" y={GROUND_Y - 138} width="680" height="10" fill="#d8d2c4" stroke="#8d8472" strokeWidth="1.5" />

      {/* Pier footings under the hip wing */}
      {[760, 820, 880].map((x, i) => (
        <rect key={i} x={x - 18} y={GROUND_Y - 160} width="36" height="22" fill="#b3aa97" stroke="#8d8472" strokeWidth="1.5" />
      ))}
    </svg>
  </div>
);

export const StructureLayer = () => (
  <div aria-hidden="true" style={wrapperStyle}>
    <svg {...svgProps}>
      <rect width="1200" height="800" fill="#fbfbf9" />
      <Ground fill="#e3e7de" />

      {/* Foundation base carried up */}
      <rect x="260" y={GROUND_Y - 30} width="680" height="30" fill="#c9c2b4" />

      {/* Roof trusses — gable */}
      <path d={GABLE} fill="none" stroke="#1d1d1f" strokeWidth="4" />
      <line x1="450" y1="207" x2="450" y2="260" stroke="#1d1d1f" strokeWidth="3" />
      <line x1={GABLE_RIDGE_X} y1="90" x2={GABLE_RIDGE_X} y2="260" stroke="#1d1d1f" strokeWidth="3" />
      <line x1="590" y1="207" x2="590" y2="260" stroke="#1d1d1f" strokeWidth="3" />
      {/* Roof trusses — hip wing */}
      <path d={HIP} fill="none" stroke="#1d1d1f" strokeWidth="4" />
      <line x1="800" y1="185" x2="800" y2="260" stroke="#1d1d1f" strokeWidth="3" />

      <line x1="260" y1="260" x2="940" y2="260" stroke="#1d1d1f" strokeWidth="4" />

      {/* Stud wall frame */}
      <rect {...BODY} fill="#ffffff" stroke="#1d1d1f" strokeWidth="4" />
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`s${i}`} x1={280 + i * 42} y1="264" x2={280 + i * 42} y2={GROUND_Y - 6} stroke="#cfcfcf" strokeWidth="2" />
      ))}
      <line x1="264" y1="460" x2="936" y2="460" stroke="#cfcfcf" strokeWidth="2" />

      {/* Tall stairwell window framing (signature feature, right of entry) */}
      <rect x="610" y="320" width="120" height="280" fill="#ffffff" stroke="#1d1d1f" strokeWidth="4" />
      <line x1="610" y1="460" x2="730" y2="460" stroke="#1d1d1f" strokeWidth="2.5" />

      {/* Entry door framing under a covered porch header */}
      <rect x="430" y="500" width="100" height="160" fill="#ffffff" stroke="#1d1d1f" strokeWidth="4" />
      <line x1="400" y1="485" x2="560" y2="485" stroke="#1d1d1f" strokeWidth="4" />
      <line x1="400" y1="485" x2="400" y2="660" stroke="#1d1d1f" strokeWidth="3" />
      <line x1="560" y1="485" x2="560" y2="660" stroke="#1d1d1f" strokeWidth="3" />

      {/* Upper-floor window framing, gable face */}
      <rect x="460" y="330" width="80" height="80" fill="#ffffff" stroke="#1d1d1f" strokeWidth="4" />
      {/* Hip-wing windows, upper + lower */}
      {[790, 870].map((x, i) => (
        <rect key={`u${i}`} x={x} y="330" width="60" height="70" fill="#ffffff" stroke="#1d1d1f" strokeWidth="4" />
      ))}
      {[780, 860].map((x, i) => (
        <rect key={`l${i}`} x={x} y="500" width="70" height="80" fill="#ffffff" stroke="#1d1d1f" strokeWidth="4" />
      ))}
    </svg>
  </div>
);

export const FacadeLayer = () => (
  <div aria-hidden="true" style={wrapperStyle}>
    <svg {...svgProps}>
      <defs>
        <linearGradient id="dusk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b3a5c" />
          <stop offset="55%" stopColor="#5a6f93" />
          <stop offset="100%" stopColor="#aab6c8" />
        </linearGradient>
        <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4c6b45" />
          <stop offset="100%" stopColor="#3a5536" />
        </linearGradient>
        <linearGradient id="brick" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9b08a" />
          <stop offset="100%" stopColor="#b89a6e" />
        </linearGradient>
        <linearGradient id="roof-shingle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#46494a" />
          <stop offset="100%" stopColor="#2b2d2e" />
        </linearGradient>
        <radialGradient id="window-glow" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#ffe4ad" />
          <stop offset="100%" stopColor="#f3b95b" />
        </radialGradient>
      </defs>

      {/* Dusk sky + tree silhouette band */}
      <rect width="1200" height={GROUND_Y} fill="url(#dusk-sky)" />
      {Array.from({ length: 14 }).map((_, i) => (
        <ellipse key={i} cx={40 + i * 90} cy="245" rx="60" ry={120 + (i % 3) * 20} fill="#1f2a22" opacity="0.55" />
      ))}
      <Ground fill="url(#lawn)" />

      {/* Roofs */}
      <path d={HIP} fill="url(#roof-shingle)" />
      <path d={GABLE} fill="url(#roof-shingle)" />
      <path d="M 380 260 L 520 90 L 660 260" fill="none" stroke="#1c1d1e" strokeWidth="3" />
      {/* Gable vertical board accent */}
      <path d="M 470 260 L 520 175 L 570 260 Z" fill="#e7ddc8" stroke="#cfc3a4" strokeWidth="1.5" />
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1={483 + i * 14} y1="258" x2={500 + i * 4.4} y2="190" stroke="#cfc3a4" strokeWidth="1" opacity="0.7" />
      ))}
      {/* Small arched attic vent in the gable peak */}
      <path d="M 505 215 Q 520 195 535 215 L 535 235 L 505 235 Z" fill="#1c2230" stroke="#0e1118" strokeWidth="2" />

      {/* Fascia / roof return */}
      <rect x="260" y="256" width="680" height="8" fill="#f4efe2" />

      {/* Chimney */}
      <rect {...CHIMNEY} fill="url(#brick)" stroke="#8a7250" strokeWidth="1.5" />
      <rect {...CHIMNEY_CAP} fill="#6e6e6e" />

      {/* Brick veneer base band across full facade */}
      <rect x="260" y="520" width="680" height={GROUND_Y - 520} fill="url(#brick)" stroke="#8a7250" strokeWidth="1.5" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`b${i}`} x1="260" y1={528 + i * 17} x2="940" y2={528 + i * 17} stroke="#8a7250" strokeWidth="1" opacity="0.55" />
      ))}

      {/* Upper siding (cream lap siding) */}
      <rect x="260" y="260" width="680" height="260" fill="#f3efe2" stroke="#ddd5bf" strokeWidth="1.5" />
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`ln${i}`} x1="260" y1={266 + i * 19} x2="940" y2={266 + i * 19} stroke="#e3dcc8" strokeWidth="1" />
      ))}

      {/* Corner trim boards */}
      <rect x="256" y="260" width="10" height="400" fill="#ffffff" />
      <rect x="934" y="260" width="10" height="400" fill="#ffffff" />

      {/* Upper-floor gable window (lit, dark sash) */}
      <g>
        <rect x="460" y="330" width="80" height="80" fill="url(#window-glow)" stroke="#1c1d1e" strokeWidth="4" />
        <line x1="500" y1="330" x2="500" y2="410" stroke="#1c1d1e" strokeWidth="2.5" />
        <line x1="460" y1="370" x2="540" y2="370" stroke="#1c1d1e" strokeWidth="2.5" />
      </g>

      {/* Hip-wing windows */}
      {[790, 870].map((x, i) => (
        <g key={`u${i}`}>
          <rect x={x} y="330" width="60" height="70" fill="url(#window-glow)" stroke="#1c1d1e" strokeWidth="3.5" />
          <line x1={x + 30} y1="330" x2={x + 30} y2="400" stroke="#1c1d1e" strokeWidth="2" />
        </g>
      ))}
      {[780, 860].map((x, i) => (
        <g key={`l${i}`}>
          <rect x={x} y="500" width="70" height="80" fill="url(#window-glow)" stroke="#1c1d1e" strokeWidth="3.5" />
          <line x1={x + 35} y1="500" x2={x + 35} y2="580" stroke="#1c1d1e" strokeWidth="2" />
        </g>
      ))}

      {/* Signature tall stairwell window, right of the entry, arch-top */}
      <path
        d="M 610 380 L 610 600 L 730 600 L 730 380 Q 730 320 670 320 Q 610 320 610 380 Z"
        fill="url(#window-glow)" stroke="#1c1d1e" strokeWidth="4"
      />
      <line x1="670" y1="320" x2="670" y2="600" stroke="#1c1d1e" strokeWidth="2.5" />
      <line x1="610" y1="460" x2="730" y2="460" stroke="#1c1d1e" strokeWidth="2.5" />
      <line x1="610" y1="530" x2="730" y2="530" stroke="#1c1d1e" strokeWidth="2" />

      {/* Covered entry porch roof + slender columns */}
      <rect x="400" y="478" width="160" height="14" fill="#f4efe2" stroke="#ddd5bf" strokeWidth="1" />
      <rect x="412" y="492" width="8" height="90" fill="#ffffff" />
      <rect x="540" y="492" width="8" height="90" fill="#ffffff" />
      {/* Lantern sconces */}
      <circle cx="416" cy="500" r="6" fill="#f3b95b" opacity="0.9" />
      <circle cx="544" cy="500" r="6" fill="#f3b95b" opacity="0.9" />

      {/* Entry double door, lit transom */}
      <rect x="430" y="500" width="100" height="160" fill="#2c2c2e" stroke="#161616" strokeWidth="3" />
      <line x1="480" y1="500" x2="480" y2="660" stroke="#161616" strokeWidth="2.5" />
      <rect x="438" y="510" width="34" height="60" fill="none" stroke="#161616" strokeWidth="1.5" />
      <rect x="488" y="510" width="34" height="60" fill="none" stroke="#161616" strokeWidth="1.5" />
      <circle cx="520" cy="582" r="3" fill="#D4891A" />
      <circle cx="440" cy="582" r="3" fill="#D4891A" />

      {/* Steps + brick walkway */}
      <rect x="420" y="660" width="120" height="10" fill="#f4efe2" />
      <rect x="428" y="670" width="104" height="10" fill="#cdb89a" />
      <path d="M 446 800 L 514 800 L 500 680 L 460 680 Z" fill="#b89a6e" />

      {/* Landscaping + path lights */}
      <circle cx="330" cy="640" r="26" fill="#33502f" />
      <circle cx="370" cy="648" r="18" fill="#3d5d38" />
      <circle cx="870" cy="640" r="26" fill="#33502f" />
      <circle cx="830" cy="648" r="18" fill="#3d5d38" />
      <rect x="392" y="700" width="4" height="26" fill="#dcdcdc" />
      <circle cx="394" cy="698" r="6" fill="#ffe4ad" />
      <rect x="564" y="700" width="4" height="26" fill="#dcdcdc" />
      <circle cx="566" cy="698" r="6" fill="#ffe4ad" />
    </svg>
  </div>
);
