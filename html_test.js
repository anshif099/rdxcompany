import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1536, height: 730 });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 8000 });
    await page.waitForTimeout(4000); // Wait for loader
    
    await page.evaluate(() => window.scrollTo(0, 3500));
    await page.waitForTimeout(1000);
    
    // Get the HTML of the viewport
    const html = await page.evaluate(() => {
      const el = document.querySelector('.rdx-hero-viewport');
      return el ? el.outerHTML : 'Not found';
    });
    
    fs.writeFileSync('C:\\Users\\Anshif\\.gemini\\antigravity-ide\\brain\\ccd0a42c-1e66-4042-a949-2f46299db178\\viewport_html.txt', html);
    console.log("HTML captured successfully!");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

run();
