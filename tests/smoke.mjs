// Minimal Puppeteer smoke suite for lfksolutions-proposal.
//
// Boots `npm run preview` against the production build, walks all four
// routes with a headless browser, and asserts:
//   - baseline health (no console errors, no failed requests, core landmarks)
//   - the specific copy/asset changes from workflow/cycle2-copy-updates
//   - cycle3: Client Login button removed from the navbar, and the Services
//     page card title/description updates from
//     "changes/Website Change Request (Client Intake Form) - lfksolutions - cycle3.md"
//   - Spanish-locale bug fix: content that only breaks in a non-English
//     locale (a raw i18n key rendered as visible text, hardcoded English
//     strings that never went through t()) — see git history for the fix
//
// Run with `npm test` (runs `npm run build` first, then this script).
// Plain Node + Puppeteer + node:assert — no test framework, matching the
// rest of this repo's tooling (see .claude/web-team/project-profile.md § 8).

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const ROUTES = ['/', '/about', '/services', '/why-us'];

let pass = 0;
let fail = 0;
const failures = [];

function check(label, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      pass++;
      console.log(`  ✓ ${label}`);
    })
    .catch((err) => {
      fail++;
      failures.push({ label, err });
      console.log(`  ✗ ${label}`);
      console.log(`      ${err.message}`);
    });
}

// ---------------------------------------------------------------------------
// Boot the preview server
// ---------------------------------------------------------------------------

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // not up yet
    }
    await sleep(300);
  }
  throw new Error(`Preview server did not become ready at ${url} within ${timeoutMs}ms`);
}

function startPreviewServer() {
  const isWin = process.platform === 'win32';
  // On Windows, npm is npm.cmd (a shell script) — spawn needs shell:true to
  // run it, and per Node's own guidance that means passing one command string
  // rather than an argv array (avoids the unescaped-args deprecation warning).
  const proc = isWin
    ? spawn(`npm run preview -- --port ${PORT} --strictPort`, {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
      })
    : spawn('npm', ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
  proc.stdout.on('data', () => {});
  proc.stderr.on('data', () => {});
  return proc;
}

// ---------------------------------------------------------------------------
// Static-file checks (no browser needed)
// ---------------------------------------------------------------------------

async function runStaticChecks() {
  console.log('\nStatic source checks:');

  await check('no "WSCC" typo anywhere in src/ or index.html', async () => {
    const files = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(js|jsx|ts|tsx|scss|html)$/.test(entry.name)) files.push(full);
      }
    };
    walk(path.join(ROOT, 'src'));
    files.push(path.join(ROOT, 'index.html'));
    const offenders = files.filter((f) => fs.readFileSync(f, 'utf8').includes('WSCC'));
    assert.deepEqual(offenders, [], `WSCC typo found in: ${offenders.join(', ')}`);
  });

  await check('no orphaned .svg-draw-path / .loader-svg-logo refs in src/ or index.html', async () => {
    const files = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(jsx?|scss)$/.test(entry.name)) files.push(full);
      }
    };
    walk(path.join(ROOT, 'src'));
    files.push(path.join(ROOT, 'index.html'));
    const offenders = files.filter((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('svg-draw-path') || c.includes('loader-svg-logo');
    });
    assert.deepEqual(offenders, [], `dead loader classes still referenced in: ${offenders.join(', ')}`);
  });

  await check('siteConfig.js SERVICES catalog still has Backflow Prevention and Testing', () => {
    const content = fs.readFileSync(path.join(ROOT, 'src/seo/siteConfig.js'), 'utf8');
    assert.match(content, /Backflow Prevention and Testing/);
  });

  await check('siteConfig.js BUSINESS.address is unchanged (full street address still present)', () => {
    const content = fs.readFileSync(path.join(ROOT, 'src/seo/siteConfig.js'), 'utf8');
    assert.match(content, /405 Greenstead Drive/);
    assert.match(content, /22554/);
  });

  await check('index.html JSON-LD address block + noscript still have full street address', () => {
    const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const occurrences = content.match(/405 Greenstead Drive/g) || [];
    assert.ok(occurrences.length >= 2, `expected full address in JSON-LD and noscript, found ${occurrences.length} occurrences`);
  });

  await check('index.html hasCredential array has WSSC fix + new DC entry, in spec order', () => {
    const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const vaIdx = content.indexOf('"name": "VA Master Plumber & Gasfitter"');
    const dcIdx = content.indexOf('"name": "DC Master Plumber & Gasfitter"');
    const wsscIdx = content.indexOf('"name": "WSSC Master Plumber & Gasfitter"');
    assert.ok(vaIdx > -1, 'VA credential missing');
    assert.ok(dcIdx > -1, 'DC credential missing');
    assert.ok(wsscIdx > -1, 'WSSC credential missing (or still misspelled)');
    assert.ok(vaIdx < dcIdx && dcIdx < wsscIdx, 'credential order should be VA, DC, WSSC');
  });

  await check('siteConfig.js CREDENTIALS array has WSSC fix + new DC entry, in spec order', () => {
    const content = fs.readFileSync(path.join(ROOT, 'src/seo/siteConfig.js'), 'utf8');
    const vaIdx = content.indexOf("'VA Master Plumber & Gasfitter'");
    const dcIdx = content.indexOf("'DC Master Plumber & Gasfitter'");
    const wsscIdx = content.indexOf("'WSSC Master Plumber & Gasfitter'");
    assert.ok(vaIdx > -1 && dcIdx > -1 && wsscIdx > -1, 'one or more credentials missing from CREDENTIALS array');
    assert.ok(vaIdx < dcIdx && dcIdx < wsscIdx, 'credential order should be VA, DC, WSSC');
  });

  await check('es.js has non-empty, non-placeholder counterparts for all changed keys', () => {
    const es = fs.readFileSync(path.join(ROOT, 'src/locales/es.js'), 'utf8');
    const keysToCheck = [
      /seq1Title: '([^']+)'/,
      /seq1Subtitle: '([^']+)'/,
      /seq2Title: '([^']+)'/,
      /seq2Subtitle: '([^']+)'/,
    ];
    for (const re of keysToCheck) {
      const m = es.match(re);
      assert.ok(m && m[1].trim().length > 0, `missing/empty Spanish value for ${re}`);
      assert.doesNotMatch(m[1], /^(TODO|TBD|\[.*\])$/i, `placeholder Spanish value for ${re}`);
    }
  });
}

// ---------------------------------------------------------------------------
// Browser checks
// ---------------------------------------------------------------------------

// Desktop viewport for every page — this site's nav collapses to a mobile
// menu below 1025px (see Navigation.jsx's `.ib-menu` media query), which
// would hide `.ib-lang` and other desktop-only nav elements our checks rely on.
async function newPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  return page;
}

async function runBrowserChecks(browser) {
  // ---- Baseline: walk all 4 routes ----
  for (const route of ROUTES) {
    console.log(`\nRoute ${route}:`);
    const page = await newPage(browser);
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.toString()));
    page.on('requestfailed', (req) => {
      // ignore aborted requests caused by navigation itself
      const failure = req.failure();
      if (failure && failure.errorText !== 'net::ERR_ABORTED') {
        failedRequests.push(`${req.url()} (${failure.errorText})`);
      }
    });

    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    // let the loader intro / GSAP timeline settle before asserting console state
    await sleep(2200);

    await check(`${route} — no console errors`, () => {
      assert.deepEqual(consoleErrors, [], `console errors: ${consoleErrors.join(' | ')}`);
    });

    await check(`${route} — no failed network requests`, () => {
      assert.deepEqual(failedRequests, [], `failed requests: ${failedRequests.join(' | ')}`);
    });

    await check(`${route} — has an <h1>`, async () => {
      const h1 = await page.$('h1');
      assert.ok(h1, 'no <h1> found');
    });

    await check(`${route} — nav renders`, async () => {
      const nav = await page.$('header.ib-header, nav');
      assert.ok(nav, 'no header/nav element found');
    });

    await check(`${route} — footer renders`, async () => {
      const footer = await page.$('footer');
      assert.ok(footer, 'no <footer> found');
    });

    await page.close();
  }

  // ---- Item 1 & 2: Hero sequence text (EN) ----
  {
    console.log('\nHero scroll sequence text (items 1-2):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(2200);

    await check('seq1 title is "Premium Plumbing" (no trailing period)', async () => {
      const text = await page.$eval('h1', (el) => el.innerText.trim());
      assert.equal(text, 'Premium Plumbing');
    });

    await check('seq1 subtitle is "Engineering precision for the modern world" (no period)', async () => {
      const texts = await page.$$eval('p', (els) => els.map((e) => e.innerText.trim()));
      assert.ok(texts.includes('Engineering precision for the modern world'), 'subtitle not found verbatim');
    });

    await check('seq2 title is "Master Craftsmanship" (no trailing period)', async () => {
      const texts = await page.$$eval('h2', (els) => els.map((e) => e.innerText.trim()));
      assert.ok(texts.includes('Master Craftsmanship'), 'seq2 title not found verbatim');
    });

    await check('seq2 subtitle is "Certified, bonded and insured across the DMV" (no Oxford comma, no period)', async () => {
      const texts = await page.$$eval('p', (els) => els.map((e) => e.innerText.trim()));
      assert.ok(texts.includes('Certified, bonded and insured across the DMV'), 'seq2 subtitle not found verbatim');
    });

    await page.close();
  }

  // ---- Item 3 & 4: WhyUs items ----
  {
    console.log('\nWhyUs items (items 3-4):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(500);

    await check('WhyUs item 1 title mentions WSSC', async () => {
      const titles = await page.$$eval('.wcu-item-title', (els) => els.map((e) => e.innerText));
      const match = titles.find((t) => t.includes('WSSC'));
      assert.ok(match, `WSSC not found in any WhyUs title: ${titles.join(' | ')}`);
      assert.equal(match.trim(), 'Licensed in DC, MD, WSSC, & VA');
    });

    await check('WhyUs item 4 desc updated, no trailing period', async () => {
      const descs = await page.$$eval('.wcu-item-desc', (els) => els.map((e) => e.innerText.trim()));
      assert.ok(descs.includes('From home remodels to commercial plumbing systems'), `updated desc not found: ${descs.join(' | ')}`);
    });

    await page.close();
  }

  // ---- Item 5 & 6: Services bodies ----
  {
    console.log('\nServices bodies (items 5-6):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(500);

    const bodyText = await page.evaluate(() => document.body.innerText);

    await check('Residential Plumbing title unchanged', () => {
      assert.match(bodyText, /Residential Plumbing/);
    });

    await check('Residential body has new "full plumbing remodels" text', () => {
      assert.match(bodyText, /full plumbing remodels/);
    });

    await check('Commercial Plumbing title unchanged', () => {
      assert.match(bodyText, /Commercial Plumbing/);
    });

    await check('Commercial body mentions restaurants', () => {
      assert.match(bodyText, /offices, restaurants, retail/);
    });

    await check('Commercial body no longer has the old backflow/WSSC-certified clause', () => {
      assert.doesNotMatch(bodyText, /VA Class A licensed and WSSC certified/);
      assert.match(bodyText, /VA Class A licensed and certified throughout the region/);
    });

    await page.close();
  }

  // ---- Item 7: unified "We do things right" subtext across 3 pages ----
  {
    console.log('\n"We do things right" unified subtext (item 7):');
    const unified = 'At LFK Solutions, plumbing is more than a trade—it is an exact science. We bring precision, transparency, and a commitment to doing things right the first time to every home and business in the D.C. Metropolitan Area.';

    for (const route of ['/', '/about', '/services']) {
      const page = await newPage(browser);
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
      await sleep(500);
      await check(`${route} renders the unified subtext verbatim`, async () => {
        const bodyText = await page.evaluate(() => document.body.innerText);
        assert.ok(bodyText.includes(unified), `unified paragraph not found on ${route}`);
      });
      await page.close();
    }

    // Specifically confirm the OLD hardcoded ServicesPage string is gone.
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/services`, { waitUntil: 'networkidle0' });
    await sleep(500);
    await check('/services no longer shows old hardcoded English paragraph', async () => {
      const bodyText = await page.evaluate(() => document.body.innerText);
      assert.doesNotMatch(bodyText, /Northern Virginia recognition/i);
    });
    await page.close();
  }

  // ---- Items 8-11: Footer (EN) ----
  {
    console.log('\nFooter copy — EN (items 8-11):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(500);

    await check('footer tagline has no trailing period', async () => {
      const text = await page.evaluate(() => {
        const el = [...document.querySelectorAll('footer p')].find((p) =>
          p.textContent.includes('Trusted Experts')
        );
        return el ? el.textContent.trim() : null;
      });
      assert.ok(text, 'tagline paragraph not found');
      assert.equal(text, 'Your Trusted Experts in Residential and Commercial Plumbing in the DMV');
    });

    await check('footer services line has no "backflow testing"', async () => {
      const text = await page.evaluate(() => {
        const el = [...document.querySelectorAll('footer .ft-value')].find((v) =>
          v.textContent.includes('Residential & commercial plumbing')
        );
        return el ? el.textContent.trim() : null;
      });
      assert.ok(text, 'services fact-sheet line not found');
      assert.doesNotMatch(text, /backflow/i);
      assert.equal(text, 'Residential & commercial plumbing, remodeling, renovations and gas fitting');
    });

    await check('footer address shows only "Stafford, Virginia"', async () => {
      const text = await page.evaluate(() => {
        const el = [...document.querySelectorAll('footer .ft-value')].find((v) =>
          v.textContent.trim() === 'Stafford, Virginia' || v.textContent.includes('Stafford, Virginia')
        );
        return el ? el.textContent.trim() : null;
      });
      assert.equal(text, 'Stafford, Virginia');
    });

    await check('footer license heading reads "Licensed throughout the DMV:"', async () => {
      const text = await page.$eval('.ft-card-title', (el) => el.textContent.trim());
      assert.equal(text, 'Licensed throughout the DMV:');
    });

    await check('footer license list has exactly 6 entries, WSSC + new DC credential correct', async () => {
      const items = await page.$$eval('.ft-license', (els) => els.map((e) => e.textContent.trim()));
      assert.equal(items.length, 6, `expected 6 license entries, got ${items.length}: ${items.join(' | ')}`);
      assert.ok(items.includes('WSSC Master Plumber & Gasfitter'), `WSSC entry wrong/missing: ${items.join(' | ')}`);
      assert.ok(items.includes('DC Master Plumber & Gasfitter'), `new DC entry missing: ${items.join(' | ')}`);
      assert.ok(items.includes('VA Master Plumber & Gasfitter'), `VA entry missing/changed: ${items.join(' | ')}`);
      assert.ok(items.includes('Bonded & Insured'), 'Bonded & Insured entry missing');
      // order: ..., VA, DC, WSSC, Bonded & Insured
      const vaIdx = items.indexOf('VA Master Plumber & Gasfitter');
      const dcIdx = items.indexOf('DC Master Plumber & Gasfitter');
      const wsscIdx = items.indexOf('WSSC Master Plumber & Gasfitter');
      assert.ok(vaIdx < dcIdx && dcIdx < wsscIdx, `expected order VA < DC < WSSC, got: ${items.join(' | ')}`);
      // no two-word "Gas Fitter" anywhere in the rendered list
      assert.ok(items.every((i) => !/Gas Fitter/.test(i)), `two-word "Gas Fitter" found: ${items.join(' | ')}`);
    });

    await page.close();
  }

  // ---- Items 8-11: Footer (ES) — language toggle ----
  {
    console.log('\nFooter copy — ES via language toggle (items 8-11):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(500);

    await check('language toggle switches to Spanish', async () => {
      const btn = await page.$('.ib-lang');
      assert.ok(btn, 'language toggle button not found');
      await btn.click();
      await sleep(400);
      const label = await page.$eval('.ft-card-title', (el) => el.textContent.trim());
      assert.equal(label, 'Con licencia en todo el DMV:');
    });

    await check('ES footer tagline has no trailing period', async () => {
      const text = await page.evaluate(() => {
        const el = [...document.querySelectorAll('footer p')].find((p) =>
          p.textContent.includes('Expertos de Confianza')
        );
        return el ? el.textContent.trim() : null;
      });
      assert.ok(text, 'ES tagline not found');
      assert.equal(text, 'Sus Expertos de Confianza en Plomería Residencial y Comercial en el DMV');
    });

    await check('ES footer license list has 6 entries incl. WSSC + DC credentials', async () => {
      const items = await page.$$eval('.ft-license', (els) => els.map((e) => e.textContent.trim()));
      assert.equal(items.length, 6, `expected 6 entries, got: ${items.join(' | ')}`);
      assert.ok(items.includes('Maestro Plomero y Gasfitter WSSC'), `ES WSSC entry wrong/missing: ${items.join(' | ')}`);
      assert.ok(items.includes('Maestro Plomero y Gasfitter de DC'), `ES DC entry missing: ${items.join(' | ')}`);
    });

    await check('ES address still reads "Stafford, Virginia"', async () => {
      const text = await page.evaluate(() => {
        const el = [...document.querySelectorAll('footer .ft-value')].find((v) =>
          v.textContent.includes('Stafford, Virginia')
        );
        return el ? el.textContent.trim() : null;
      });
      assert.equal(text, 'Stafford, Virginia');
    });

    await page.close();
  }

  // ---- Item 12: Loader logo ----
  {
    console.log('\nLoader logo (item 12):');
    const page = await newPage(browser);
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.toString()));

    // Fresh context — no prior visits, no cache/localStorage to suppress the loader.
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

    await check('loader img uses the real logo-badge-white.svg asset', async () => {
      const src = await page.$eval('.loader-logo-img', (el) => el.getAttribute('src'));
      assert.equal(src, '/assets/brand/logo-badge-white.svg');
    });

    await check('loader has no leftover .svg-draw-path / .loader-svg-logo nodes in the DOM', async () => {
      const counts = await page.evaluate(() => ({
        drawPath: document.querySelectorAll('.svg-draw-path').length,
        svgLogo: document.querySelectorAll('.loader-svg-logo').length,
      }));
      assert.equal(counts.drawPath, 0, 'found .svg-draw-path nodes still in DOM');
      assert.equal(counts.svgLogo, 0, 'found .loader-svg-logo nodes still in DOM');
    });

    // Let the full intro timeline play out: clip-path (1.6s) + progress-fill
    // (2.5s) in parallel from t=0, then panel wipe (+0.2s after, 1s duration)
    // -> onComplete fires around t=3.7s. Add buffer for real-time overhead.
    await sleep(5000);

    await check('loader does not error or hang (loader element hidden after intro)', async () => {
      const display = await page.evaluate(() => {
        const el = document.getElementById('sofi-loader');
        return el ? getComputedStyle(el).display : 'missing';
      });
      assert.equal(display, 'none');
    });

    await check('no console errors during loader intro', () => {
      assert.deepEqual(consoleErrors, [], `console errors: ${consoleErrors.join(' | ')}`);
    });

    await page.close();
  }

  // ---- cycle3: Client Login button removed from the navbar ----
  {
    console.log('\nClient Login removed from navbar (cycle3):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await sleep(500);

    await check('no client-hub login link in the desktop nav', async () => {
      const link = await page.$('a[href*="login/new"]');
      assert.equal(link, null, 'a Jobber login link is still present in the DOM');
    });

    await check('no "Client Login" text anywhere on the page', async () => {
      const found = await page.evaluate(() =>
        document.body.innerText.includes('Client Login')
      );
      assert.equal(found, false, '"Client Login" text still rendered somewhere on the page');
    });

    await check('mobile menu has no Client Login link either', async () => {
      await page.setViewport({ width: 390, height: 844 });
      await page.click('.ib-hamburger');
      await sleep(600);
      const link = await page.$('a[href*="login/new"]');
      assert.equal(link, null, 'mobile menu still has a client-hub login link');
    });

    await page.close();
  }

  // ---- cycle3: Services page card titles/descriptions ----
  {
    console.log('\nServices page cards updated (cycle3):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/services`, { waitUntil: 'domcontentloaded' });
    await sleep(1000);

    const readCard = async (index, sectionSelector) => {
      const wraps = await page.$$(`${sectionSelector} [style*="cursor: default"]`);
      const el = wraps[index];
      await el.hover();
      await sleep(400);
      return page.evaluate((node) => {
        const h4 = node.querySelector('h4');
        const p = node.querySelector('p');
        return { title: h4?.textContent ?? null, desc: p?.textContent ?? null };
      }, el);
    };

    await check('Bathroom Plumbing card: title + "mach specs" wording preserved verbatim', async () => {
      const card = await readCard(1, '#residential');
      assert.equal(card.title, 'Bathroom Plumbing');
      assert.equal(
        card.desc,
        'Full kitchen and bathroom renovations. We handle everything from rough-in to finish. Done clean and to mach specs.'
      );
    });

    await check('Kitchen & Bathroom Plumbing card: new title + desc', async () => {
      const card = await readCard(2, '#residential');
      assert.equal(card.title, 'Kitchen & Bathroom Plumbing');
      assert.equal(
        card.desc,
        'Sink and faucet replacement, dishwasher and disposal installation, shower replacements, vanity and toilet installs.'
      );
    });

    await check('Water Heater Services card: retitled, desc untouched', async () => {
      const card = await readCard(3, '#residential');
      assert.equal(card.title, 'Water Heater Services');
    });

    await check('Fixture replacement card: new desc, title unchanged', async () => {
      const card = await readCard(4, '#residential');
      assert.equal(card.title, 'Fixture replacement');
      assert.equal(
        card.desc,
        'Toilets, showers, faucets, laundry sinks, dishwashers, garbage disposals, lavatory sinks — full swap including removal of old fixtures and cleanup.'
      );
    });

    await check('Full Home Remodel card: new title + desc', async () => {
      const card = await readCard(5, '#residential');
      assert.equal(card.title, 'Full Home Remodel');
      assert.equal(
        card.desc,
        'Multi-room plumbing for complete home renovations. We coordinate directly with your general contractor and handle all inspections.'
      );
    });

    await check('Drain pipe cleaning card: new high-pressure-jetter desc', async () => {
      const card = await readCard(7, '#residential');
      assert.equal(card.title, 'Drain pipe cleaning');
      assert.equal(
        card.desc,
        "Blast away buildup with our high-pressure water jetters. It's the fastest way to clear grease, scale, and stubborn clogs — restoring your pipes to full flow without harsh chemicals."
      );
    });

    await check('Commercial plumbing card: desc now mentions restaurants, drops code-doc sentence', async () => {
      const card = await readCard(0, '#commercial');
      assert.equal(card.title, 'Commercial plumbing');
      assert.equal(
        card.desc,
        'Full-service commercial installations and repairs for offices, restaurants, retail spaces, and multi-unit properties.'
      );
    });

    await check('New construction plumbing card ("boososo" in the intake): new desc', async () => {
      const card = await readCard(1, '#commercial');
      assert.equal(card.title, 'New construction plumbing');
      assert.equal(
        card.desc,
        'Ground work, rough-in and finish plumbing for new builds. We work from blueprints, coordinate permits and inspections, and work with you to hit every milestone on your timeline.'
      );
    });

    await page.close();
  }

  // ---- Spanish-locale regressions: content that only breaks under a
  // non-English locale, because it was derived from translated text instead
  // of a stable, language-independent key ----
  {
    console.log('\nSpanish-locale content (no raw i18n keys, no stranded English):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await sleep(500);

    await check('language toggle switches to Spanish', async () => {
      await page.click('.ib-lang');
      await sleep(500);
      const label = await page.$eval('.ib-emergency', (el) => el.textContent.trim());
      assert.equal(label, 'Plomería de Emergencia');
    });

    await check('nav emergency button is translated (not stuck in English)', async () => {
      const text = await page.$eval('.ib-emergency', (el) => el.textContent.trim());
      assert.equal(text, 'Plomería de Emergencia');
    });

    await check('floating "discover services" button is translated', async () => {
      const found = await page.evaluate(() => document.body.innerText.includes('Descubra nuestros servicios'));
      assert.ok(found, 'expected Spanish floating-button text not found');
      const stale = await page.evaluate(() => document.body.innerText.includes('Discover our services'));
      assert.equal(stale, false, 'English floating-button text still present in Spanish');
    });

    await check(
      'home Services teaser CTAs render real Spanish text, not a raw i18n key',
      async () => {
        await page.evaluate(() => document.querySelector('#services').scrollIntoView());
        await sleep(600);
        const texts = await page.$$eval('#services a', (els) => els.map((e) => e.textContent.trim()));
        assert.ok(texts.includes('Explorar Servicios Residenciales'), `residential CTA wrong: ${texts.join(' | ')}`);
        assert.ok(texts.includes('Explorar Servicios Comerciales'), `commercial CTA wrong: ${texts.join(' | ')}`);
        // The literal failure mode this regression-tests: t(`services.cta${svc.label}`)
        // built "services.ctaResidencial"/"services.ctaComercial" from the
        // Spanish label, which matched no key in either locale file, so
        // i18next rendered the raw key string instead of text.
        assert.ok(
          texts.every((t) => !t.startsWith('services.cta')),
          `a raw i18n key leaked into the page: ${texts.join(' | ')}`
        );
      }
    );

    await check(
      'Services teaser CTA hrefs still point at the real English anchor ids, in Spanish',
      async () => {
        const hrefs = await page.$$eval('#services a', (els) =>
          els.map((e) => e.getAttribute('href')).filter((h) => h && h.includes('#'))
        );
        assert.ok(hrefs.includes('/services#residential'), `residential href wrong: ${hrefs.join(' | ')}`);
        assert.ok(hrefs.includes('/services#commercial'), `commercial href wrong: ${hrefs.join(' | ')}`);
      }
    );

    await check('/services still has id="residential" and id="commercial" (anchor targets exist)', async () => {
      await page.goto(`${BASE_URL}/services`, { waitUntil: 'domcontentloaded' });
      await sleep(600);
      const [res, com] = await page.evaluate(() => [
        !!document.getElementById('residential'),
        !!document.getElementById('commercial'),
      ]);
      assert.ok(res, 'id="residential" missing from /services');
      assert.ok(com, 'id="commercial" missing from /services');
    });

    await page.close();
  }

  // ---- Regression: switching language must not blank out content ----
  //
  // The bug this guards against: list items were keyed on their own translated
  // text (key={item.title}), so every key changed when the language toggle was
  // clicked. React unmounted and remounted each item, which reset its Framer
  // Motion entrance animation to the `hidden` initial state (opacity 0 / a
  // clipPath circle(0%) image reveal). Because those reveals are `whileInView`
  // with `once: true`, any item the visitor had already scrolled past never
  // re-fired and stayed invisible until a page reload.
  //
  // Reproducing it REQUIRES scrolling through the page first and only then
  // toggling — the order a real visitor uses. Toggling at the top of the page
  // hides the bug, because everything then animates in on the way down.
  {
    console.log('\nLanguage switch does not blank out content (scroll, then toggle):');

    const auditRoute = async (route, waitMs) => {
      const page = await newPage(browser);
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      await sleep(waitMs);

      // read down the whole page so every reveal has fired
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const vh = await page.evaluate(() => window.innerHeight);
      for (let y = 0; y <= total; y += Math.floor(vh * 0.8)) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await sleep(200);
      }
      await sleep(1000);

      const countHidden = () =>
        page.evaluate(() => {
          let hidden = 0;
          let tracked = 0;
          document.querySelectorAll('h1,h2,h3,h4,p,li,img,.wcu-item,.rv-item').forEach((el) => {
            const text = (el.innerText || el.getAttribute('src') || '').trim();
            if (!text) return;
            tracked++;
            let node = el;
            let opacity = 1;
            while (node && node !== document.body) {
              opacity = Math.min(opacity, parseFloat(getComputedStyle(node).opacity));
              node = node.parentElement;
            }
            if (opacity < 0.05) hidden++;
          });
          return { hidden, tracked };
        });

      const before = await countHidden();

      // nudge up to reveal the auto-hiding header, then toggle language
      await page.evaluate(() => window.scrollBy(0, -80));
      await sleep(800);
      await page.click('.ib-lang');
      await sleep(1800);

      const after = await countHidden();
      await page.close();
      return { before, after };
    };

    await check('home: no content hidden by the language toggle mid-page', async () => {
      const { before, after } = await auditRoute('/', 4500);
      assert.equal(
        after.tracked,
        before.tracked,
        `element count changed (${before.tracked} -> ${after.tracked}), which means items remounted`
      );
      assert.ok(
        after.hidden <= before.hidden,
        `content went invisible after the toggle: ${before.hidden} hidden before, ${after.hidden} after`
      );
    });

    await check('services: no content hidden by the language toggle mid-page', async () => {
      const { before, after } = await auditRoute('/services', 2000);
      assert.equal(
        after.tracked,
        before.tracked,
        `element count changed (${before.tracked} -> ${after.tracked}), which means items remounted`
      );
      assert.ok(
        after.hidden <= before.hidden,
        `content went invisible after the toggle: ${before.hidden} hidden before, ${after.hidden} after`
      );
    });

    await check('no list is keyed on translated text (source-level guard)', async () => {
      const files = [
        'src/components/WhyUs.jsx',
        'src/components/Services.jsx',
        'src/components/Reviews.jsx',
        'src/components/FAQ.jsx',
        'src/components/Footer.jsx',
        'src/pages/ServicesPage.jsx',
      ];
      const offenders = [];
      for (const rel of files) {
        const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        // key={x.title} / {x.q} / {x.author} / {x.desc} / {x.label} — all
        // translated fields. A key must never be derived from those.
        const bad = src.match(/key=\{[a-zA-Z_$]+\.(title|q|a|author|desc|label|body|quote|text|name)\}/g);
        if (bad) offenders.push(`${rel}: ${bad.join(', ')}`);
      }
      assert.deepEqual(offenders, [], `key derived from translated content:\n  ${offenders.join('\n  ')}`);
    });
  }

  // ---- Spanish-locale regression: AboutPage's Culture & Values cards ----
  {
    console.log('\nAbout page Culture & Values cards are translated (ES):');
    const page = await newPage(browser);
    await page.goto(`${BASE_URL}/about`, { waitUntil: 'domcontentloaded' });
    await sleep(500);
    await page.click('.ib-lang');
    await sleep(800);

    await check('all 5 culture card titles render in Spanish, not the hardcoded English array', async () => {
      // These titles used to live in a plain JS array (CULTURE_CARDS) inside
      // AboutPage.jsx with no t() call at all, so they rendered in English
      // regardless of the selected language. Now sourced from
      // aboutPageFull.cultureCards in both locale files.
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const vh = await page.evaluate(() => window.innerHeight);
      for (let y = 0; y < total; y += vh) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await sleep(150);
      }
      const text = await page.evaluate(() => document.body.innerText);
      const spanishTitles = ['Compromiso', 'Fortaleza', 'Confianza', 'Sabiduría', 'Respeto'];
      const englishTitles = ['Commitment', 'Strength', 'Trust', 'Wisdom', 'Respect'];
      for (const title of spanishTitles) {
        assert.ok(text.includes(title), `missing Spanish culture card title: ${title}`);
      }
      for (const title of englishTitles) {
        assert.equal(text.includes(title), false, `stranded English culture card title still present: ${title}`);
      }
    });

    await page.close();
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Starting preview server...');
  const server = startPreviewServer();
  let browser;
  try {
    await waitForServer(BASE_URL);
    console.log(`Preview server ready at ${BASE_URL}`);

    await runStaticChecks();

    browser = await puppeteer.launch({ headless: 'new' });
    await runBrowserChecks(browser);
  } finally {
    if (browser) await browser.close();
    // On Windows, `shell: true` spawns cmd.exe -> npm.cmd -> node, so
    // server.kill() alone only kills the shell, leaving the actual preview
    // server running. Kill the whole process tree instead.
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      server.kill();
    }
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail > 0) {
    console.log('\nFailures:');
    for (const f of failures) {
      console.log(`  - ${f.label}: ${f.err.message}`);
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Suite crashed:', err);
  process.exitCode = 1;
});
