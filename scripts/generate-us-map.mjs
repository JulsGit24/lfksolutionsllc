/**
 * Generates real US state geometry for the service-area map.
 *
 * Run once (or after changing SERVICE_CITIES / the viewBox):
 *   npm run map
 *
 * Source data is the US Census Bureau's 1:10m state boundaries, shipped as
 * TopoJSON in the `us-atlas` package. We project it here at build time and write
 * plain SVG path strings to src/data/usStates.js, so the browser bundle carries
 * no d3/topojson dependency — just the finished paths.
 *
 * Critically, the city pins are projected with the SAME projection instance as
 * the state outlines, so a pin cannot drift relative to the state it sits in.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoAlbersUsa, geoPath } from 'd3-geo';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 960;
const HEIGHT = 600;

// Cities LFK actually serves. Coordinates are [longitude, latitude].
const SERVICE_CITIES = [
  { name: 'Silver Spring, MD',   region: 'md', coords: [-77.026, 38.991] },
  { name: 'Bethesda, MD',        region: 'md', coords: [-77.100, 38.981] },
  { name: 'Washington, DC',      region: 'dc', coords: [-77.037, 38.907] },
  { name: 'Arlington, VA',       region: 'va', coords: [-77.087, 38.880] },
  { name: 'Fairfax, VA',         region: 'va', coords: [-77.307, 38.846] },
  { name: "Prince George's, MD", region: 'md', coords: [-76.849, 38.826] },
  { name: 'Alexandria, VA',      region: 'va', coords: [-77.047, 38.805] },
  { name: 'Woodbridge, VA',      region: 'va', coords: [-77.250, 38.658] },
  { name: 'Stafford, VA',        region: 'va', coords: [-77.408, 38.422] },
  { name: 'Fredericksburg, VA',  region: 'va', coords: [-77.460, 38.302] },
];

// The three jurisdictions LFK is licensed in, by Census FIPS id.
const HIGHLIGHT = { '51': 'va', '24': 'md', '11': 'dc' };

const topo = JSON.parse(
  readFileSync(require.resolve('us-atlas/states-10m.json'), 'utf8'),
);
const states = feature(topo, topo.objects.states);

// fitSize computes the scale/translate that fits the whole country in the box.
const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], states);
const path = geoPath(projection);

// geoPath emits full float precision, which roughly triples the file size for
// sub-pixel detail nobody can see. One decimal in a 960-unit viewBox is ~0.08px
// on screen at typical render widths.
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(+(+n).toFixed(1)));

const r1 = (n) => +n.toFixed(1);

const shapes = states.features
  .map(f => ({
    id: f.id,
    name: f.properties.name,
    region: HIGHLIGHT[f.id] ?? null,
    d: path(f),
    // Projected bounding box [[x0,y0],[x1,y1]] — the map component frames its
    // zoom view from these, so it never has to parse the path strings back.
    b: path.bounds(f),
  }))
  .filter(s => s.d) // geoAlbersUsa returns null for anything outside the US
  .map(s => ({
    ...s,
    d: round(s.d),
    b: [r1(s.b[0][0]), r1(s.b[0][1]), r1(s.b[1][0]), r1(s.b[1][1])],
  }));

const cities = SERVICE_CITIES.map(c => {
  const p = projection(c.coords);
  if (!p) throw new Error(`${c.name} did not project — check its coordinates`);
  return { name: c.name, region: c.region, x: +p[0].toFixed(2), y: +p[1].toFixed(2) };
});

const out = `// GENERATED FILE — do not edit by hand.
// Regenerate with: npm run map   (scripts/generate-us-map.mjs)
//
// Real US state boundaries (US Census 1:10m via us-atlas), projected with
// d3-geo's Albers USA projection into a ${WIDTH}x${HEIGHT} viewBox. City pins are
// projected through the same projection, so they land on the correct state.

export const MAP_VIEWBOX = '0 0 ${WIDTH} ${HEIGHT}';

/** Every US state. \`region\` is set only for the three LFK is licensed in.
 *  \`b\` is the projected bounding box, [x0, y0, x1, y1]. */
export const US_STATES = ${JSON.stringify(shapes, null, 0)};

/** Service cities, pre-projected to viewBox coordinates. */
export const SERVICE_CITIES = ${JSON.stringify(cities, null, 2)};
`;

const dest = resolve(__dirname, '..', 'src', 'data', 'usStates.js');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, out, 'utf8');

console.log(`usStates.js — ${shapes.length} states, ${cities.length} cities, viewBox ${WIDTH}x${HEIGHT}`);
console.log('highlighted:', shapes.filter(s => s.region).map(s => `${s.name}(${s.region})`).join(', '));
console.log('pin extent :',
  `x ${Math.min(...cities.map(c => c.x)).toFixed(0)}-${Math.max(...cities.map(c => c.x)).toFixed(0)}`,
  `y ${Math.min(...cities.map(c => c.y)).toFixed(0)}-${Math.max(...cities.map(c => c.y)).toFixed(0)}`);
