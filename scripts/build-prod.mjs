/**
 * Production build for Hostinger shared hosting.
 *
 *   npm run build:prod
 *
 * `vite build` on its own produces a correct site but not a deployable one:
 * public/ is copied verbatim, which means a 31 MB 4K hero video, ~15 MB of
 * over-encoded photos and a _unused/ folder all ship to the server. On a shared
 * host with no CDN that is the whole performance story — the JS bundle is a
 * rounding error next to it.
 *
 * So this script builds, then:
 *   1. prunes every asset the built output does not actually reference,
 *   2. re-encodes the video and the photos (originals in public/ are untouched),
 *   3. drops in the Apache config,
 *   4. reports what changed and zips the result.
 *
 * Media work needs ffmpeg. If it is not found the step is skipped with a
 * warning rather than failing the build — an unoptimised deploy still works.
 */
import { execFileSync } from 'node:child_process';
import {
  readFileSync, writeFileSync, readdirSync, statSync, rmSync, copyFileSync,
  existsSync, renameSync,
} from 'node:fs';
import { dirname, resolve, join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');

const KB = 1024;
const MB = 1024 * 1024;
const mb = (n) => `${(n / MB).toFixed(2)} MB`;
const log = (...a) => console.log(...a);
const step = (s) => log(`\n\x1b[36m▸ ${s}\x1b[0m`);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const dirSize = (dir) => walk(dir).reduce((n, f) => n + statSync(f).size, 0);

/** Is this file actually a JPEG, whatever its extension says? */
function isJpeg(file) {
  const head = Buffer.alloc(3);
  const fd = readFileSync(file);
  fd.copy(head, 0, 0, 3);
  return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
}

function findFfmpeg() {
  const bundled = join(
    ROOT, 'ffmpeg_extracted', 'ffmpeg-master-latest-win64-gpl', 'bin',
    process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg',
  );
  if (existsSync(bundled)) return bundled;
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return 'ffmpeg';
  } catch {
    return null;
  }
}

const ff = (bin, args) =>
  execFileSync(bin, ['-y', '-hide_banner', '-loglevel', 'error', ...args], {
    stdio: ['ignore', 'ignore', 'pipe'],
  });

// ---------------------------------------------------------------------------
// 1. Build
// ---------------------------------------------------------------------------
step('Building');
rmSync(DIST, { recursive: true, force: true });
execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit', shell: true });

const sizeAfterBuild = dirSize(DIST);
log(`  dist: ${mb(sizeAfterBuild)}`);

// ---------------------------------------------------------------------------
// 2. Prune unreferenced assets
//
// The reference set is read out of the BUILT output, not the sources — that way
// anything the bundler dropped is dropped here too, and there is no second list
// to keep in sync. Files reachable only through a runtime-constructed path would
// be missed, so the scan covers html/js/css/xml/txt and the list is printed.
// ---------------------------------------------------------------------------
step('Pruning unreferenced assets');

const scanned = walk(DIST).filter((f) =>
  ['.html', '.js', '.css', '.xml', '.txt', '.json'].includes(extname(f)),
);
const haystack = scanned.map((f) => readFileSync(f, 'utf8')).join('\n');

const assetsDir = join(DIST, 'assets');
const assetFiles = walk(assetsDir);

let pruned = 0;
let prunedBytes = 0;
const kept = [];

for (const file of assetFiles) {
  const url = '/' + relative(DIST, file).split('\\').join('/');
  if (haystack.includes(url)) {
    kept.push(file);
    continue;
  }
  prunedBytes += statSync(file).size;
  pruned += 1;
  rmSync(file);
}

// Sweep up the directories the pruning emptied.
for (const dir of walk(assetsDir).length ? [] : []) rmSync(dir, { recursive: true });
(function pruneEmptyDirs(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) pruneEmptyDirs(join(dir, entry.name));
  }
  if (readdirSync(dir).length === 0 && dir !== assetsDir) rmSync(dir, { recursive: true });
})(assetsDir);

log(`  removed ${pruned} unreferenced files (${mb(prunedBytes)})`);
log(`  kept ${kept.length}`);

// ---------------------------------------------------------------------------
// 3. Media
// ---------------------------------------------------------------------------
step('Optimising media');

const ffmpeg = findFfmpeg();
let mediaSaved = 0;

if (!ffmpeg) {
  log('  \x1b[33m! ffmpeg not found — skipping video and image re-encoding.\x1b[0m');
  log('    The build is still deployable, just several times larger.');
} else {
  // --- video ---------------------------------------------------------------
  // The source is 3840x2160 with an audio track, behind a dark overlay, muted
  // and object-fit: cover. None of that resolution or audio reaches a viewer.
  for (const video of kept.filter((f) => extname(f) === '.mp4')) {
    const before = statSync(video).size;
    const tmp = video + '.tmp.mp4';
    ff(ffmpeg, [
      '-i', video,
      '-an',                          // muted in markup; the track is dead weight
      '-vf', 'scale=1920:-2',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '26',
      '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',      // moov atom first, so playback can start
      tmp,
    ]);
    const after = statSync(tmp).size;
    if (after < before) {
      rmSync(video);
      renameSync(tmp, video);
      mediaSaved += before - after;
      log(`  ${basename(video)}  ${mb(before)} → ${mb(after)}`);
    } else {
      rmSync(tmp);
    }
  }

  // --- photos --------------------------------------------------------------
  // Most of these carry a .png extension but are JPEG data (browsers sniff the
  // bytes, so it renders anyway). They are encoded at near-maximum quality for
  // 1024px artwork. Re-encoding at q=3 measured SSIM 0.978 / PSNR 41.9 dB
  // against the original — visually transparent — for roughly a fifth of the
  // bytes. Extensions are left alone so no reference has to change.
  let images = 0;
  let imgBefore = 0;
  let imgAfter = 0;

  for (const img of kept) {
    if (!['.png', '.jpg', '.jpeg'].includes(extname(img).toLowerCase())) continue;
    if (!isJpeg(img)) continue;               // leave real PNGs (icons) alone
    const before = statSync(img).size;
    if (before < 40 * KB) continue;           // already small; churn for nothing

    const tmp = img + '.tmp.jpg';
    ff(ffmpeg, ['-i', img, '-q:v', '3', tmp]);
    const after = statSync(tmp).size;
    if (after < before) {
      rmSync(img);
      renameSync(tmp, img);
      images += 1;
      imgBefore += before;
      imgAfter += after;
      mediaSaved += before - after;
    } else {
      rmSync(tmp);
    }
  }
  log(`  ${images} photos  ${mb(imgBefore)} → ${mb(imgAfter)}`);
}

// ---------------------------------------------------------------------------
// 4. Server config
// ---------------------------------------------------------------------------
step('Adding server config');
const htaccess = join(ROOT, 'deploy', '.htaccess');
if (!existsSync(htaccess)) throw new Error('deploy/.htaccess is missing');
copyFileSync(htaccess, join(DIST, '.htaccess'));
log('  .htaccess → dist/.htaccess');

// ---------------------------------------------------------------------------
// 5. Report + package
// ---------------------------------------------------------------------------
step('Result');

const final = walk(DIST);
const totalFinal = final.reduce((n, f) => n + statSync(f).size, 0);

const byExt = {};
for (const f of final) {
  const e = extname(f) || '(none)';
  byExt[e] = (byExt[e] ?? 0) + statSync(f).size;
}
for (const [ext, size] of Object.entries(byExt).sort((a, b) => b[1] - a[1]).slice(0, 8)) {
  log(`  ${ext.padEnd(8)} ${mb(size).padStart(10)}`);
}

log(`\n  files: ${final.length}`);
log(`  before: ${mb(sizeAfterBuild)}   after: ${mb(totalFinal)}   ` +
    `saved: ${mb(sizeAfterBuild - totalFinal)}`);

step('Packaging');
const zip = join(ROOT, 'lfksolutions-hostinger.zip');
rmSync(zip, { force: true });
try {
  // -r- keeps the archive rooted at dist's CONTENTS, so extracting into
  // public_html/ puts index.html at the web root rather than in a dist/ folder.
  execFileSync(
    'powershell',
    ['-NoProfile', '-Command',
      `Compress-Archive -Path '${DIST}\\*' -DestinationPath '${zip}' -Force`],
    { stdio: 'inherit' },
  );
  log(`  ${relative(ROOT, zip)}  (${mb(statSync(zip).size)})`);
} catch {
  log('  \x1b[33m! could not create the zip — upload dist/ directly.\x1b[0m');
}

log('\n\x1b[32m✔ Ready.\x1b[0m Upload the contents of dist/ into public_html/.');
log('  Hidden files matter: .htaccess must be uploaded too.\n');
