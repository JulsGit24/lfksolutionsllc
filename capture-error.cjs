const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Page loaded successfully.');
    
    // Check if body is empty or has content
    const html = await page.content();
    if (!html.includes('id="main-content"')) {
      console.log('CRASH: main-content not found in DOM.');
    } else {
      console.log('App seems to be rendering fine.');
    }
  } catch (err) {
    console.error('Failed to load page:', err);
  } finally {
    await browser.close();
  }
})();
