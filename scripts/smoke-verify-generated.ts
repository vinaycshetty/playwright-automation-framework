#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

function parseArgs() {
  const args = process.argv.slice(2);
  const out: any = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.replace(/^--/, '');
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[++i] : true;
      out[key] = val;
    }
  }
  return out;
}

async function main() {
  const argv = parseArgs();
  if (!argv.file) {
    console.error('Usage: --file <generatedPage.ts> --url <pageUrl> [--username user --password pass --headed true]');
    process.exit(2);
  }

  const jsonPath = argv.file.replace(/\.ts$/, '.locators.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('Locators JSON not found:', jsonPath);
    process.exit(2);
  }

  const locators = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as any[];
  const browser = await chromium.launch({ headless: !(argv.headed === 'true' || argv.headed === true) });
  const page = await browser.newPage();

  try {
    await page.goto(argv.url, { waitUntil: 'networkidle' });
    if (argv.username && argv.password) {
      await page.fill("input[name='username']", argv.username).catch(() => {});
      await page.fill("input[name='password']", argv.password).catch(() => {});
      await page.click("button:has-text('Sign In')").catch(() => {});
      await page.waitForLoadState('networkidle');
      await page.goto(argv.url, { waitUntil: 'networkidle' });
    }

    const results: any[] = [];
    for (const loc of locators.slice(0, 25)) {
      // prefer data-qa / data-testid for verification
      let sel = loc.dataQa ? `[data-qa=\"${loc.dataQa}\"]` : loc.dataTestId ? `[data-testid=\"${loc.dataTestId}\"]` : loc.id ? `#${loc.id}` : loc.name ? `[name=\"${loc.name}\"]` : (loc.classes ? `${loc.tag}.${loc.classes.split(/\s+/).filter(Boolean).join('.')}` : loc.xpath);
      const visible = await page.locator(sel).first().isVisible().catch(() => false);
      results.push({ selector: sel, visible });
      console.log(sel, '=>', visible);
    }

    const visibleCount = results.filter(r => r.visible).length;
    console.log(`Visible selectors: ${visibleCount}/${results.length}`);
    await browser.close();
    process.exit(visibleCount > 0 ? 0 : 3);
  } catch (err) {
    await browser.close();
    console.error(err);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
