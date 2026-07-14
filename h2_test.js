import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1536, height: 730 });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 8000 });
    await page.waitForTimeout(4000);
    
    await page.evaluate(() => window.scrollTo(0, 3500));
    await page.waitForTimeout(1000);
    
    const styles = await page.evaluate(() => {
      const el = document.querySelector('.rdx-hero-outro__heading h2');
      if (!el) return 'Element not found';
      const rect = el.getBoundingClientRect();
      const comp = window.getComputedStyle(el);
      return {
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        color: comp.color,
        fontSize: comp.fontSize,
        opacity: comp.opacity,
        visibility: comp.visibility,
        display: comp.display
      };
    });
    
    console.log("h2 Styles:", JSON.stringify(styles, null, 2));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

run();
