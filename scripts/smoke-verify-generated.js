#!/usr/bin/env node
const fs = require('fs');
const { chromium } = require('playwright');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
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
  if (!argv.file || !argv.url) { console.error('Usage: --file <generated.ts> --url <pageUrl> [--headed true]'); process.exit(2); }
  const jsonPath = argv.file.replace(/\.ts$/, '.locators.json');
  if (!fs.existsSync(jsonPath)) { console.error('Locators JSON not found:', jsonPath); process.exit(2); }
  const locators = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const browser = await chromium.launch({ headless: !(argv.headed==='true' || argv.headed===true) });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  await page.goto(argv.url, { waitUntil: 'networkidle' });
  const results = [];
  for (const loc of locators.slice(0,25)) {
    // prefer data-qa / data-testid for verification
    const sel = loc.dataQa ? `[data-qa="${loc.dataQa}"]` : loc.dataTestId ? `[data-testid="${loc.dataTestId}"]` : loc.id ? `#${loc.id}` : loc.name ? `[name="${loc.name}"]` : (loc.classes ? `${loc.tag}.${loc.classes.split(/\s+/).filter(Boolean).join('.')}` : loc.xpath);
    const visible = await page.locator(sel).first().isVisible().catch(()=>false);
    console.log(sel,'=>',visible);
    results.push({selector:sel,visible});
  }
  const visibleCount = results.filter(r=>r.visible).length;
  console.log(`Visible selectors: ${visibleCount}/${results.length}`);
  await browser.close();
  process.exit(visibleCount>0?0:3);
}

main().catch(e=>{ console.error(e); process.exit(1); });
