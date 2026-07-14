import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1536, height: 730 });

  try {
    console.log("Navigating to http://localhost:5173/ ...");
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 8000 });
    await page.waitForTimeout(4000); // Wait for loader
    
    // Scroll to p = 0.6 (approx 3500px down)
    console.log("Scrolling to 3500px (Intro Block phase)...");
    await page.evaluate(() => window.scrollTo(0, 3500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:\\Users\\Anshif\\.gemini\\antigravity-ide\\brain\\ccd0a42c-1e66-4042-a949-2f46299db178\\intro_block.png' });

    // Scroll to p = 0.85 (approx 5000px down)
    console.log("Scrolling to 5000px (Services Slider phase)...");
    await page.evaluate(() => window.scrollTo(0, 5000));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:\\Users\\Anshif\\.gemini\\antigravity-ide\\brain\\ccd0a42c-1e66-4042-a949-2f46299db178\\services_slider.png' });

    console.log("Screenshots captured successfully!");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

run();
