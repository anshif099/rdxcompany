import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1536, height: 730 });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 8000 });
    await page.waitForTimeout(4000); // Wait for loader
    
    await page.evaluate(() => window.scrollTo(0, 3500));
    await page.waitForTimeout(1000);
    
    // Get computed styles
    const styles = await page.evaluate(() => {
      const el = document.querySelector('.rdx-hero-outro-wrapper');
      if (!el) return 'Element not found';
      const comp = window.getComputedStyle(el);
      return {
        display: comp.display,
        position: comp.position,
        top: comp.top,
        opacity: comp.opacity,
        visibility: comp.visibility,
        zIndex: comp.zIndex,
        color: comp.color,
        fontSize: comp.fontSize,
      };
    });
    
    console.log("Computed Styles:", JSON.stringify(styles, null, 2));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

run();
