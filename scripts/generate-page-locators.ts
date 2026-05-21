#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { crawl } from '../src/tools/playwrightCrawler';

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
  if (!argv.url) {
    console.error('Usage: --url <target> --out <file.ts> [--username user --password pass] [--headed true]');
    process.exit(2);
  }

  const results = await crawl({
    url: argv.url,
    username: argv.username,
    password: argv.password,
    headed: argv.headed === 'true' || argv.headed === true,
    waitForUser: argv.waitForUser === 'true' || argv.waitForUser === true,
    autoNav: argv.autoNav === 'true' || argv.autoNav === true,
    userGroup: argv['user-group'] || argv.userGroup || argv.user_group,
    paymentType: argv.paymentType || argv['payment-type'],
    waitForSelector: argv['wait-for-selector'] || argv.waitForSelector,
    rootSelector: argv['root-selector'] || argv.rootSelector,
    maxElements: 500,
  });

  const outPath = argv.out || path.join('src','web','client','pages','payments','Cash-Concentration','CashConcentrationPage.generated.ts');
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Pick top 25 selectors
  const top = results.slice(0, 25);

  const locatorLines: string[] = [];
  const helpers: string[] = [];
  const seenVars = new Set<string>();
  for (const e of top) {
    // helper to sanitize attribute values for safe embedding in selectors and TS strings
    const escapeAttr = (v: any) => {
      if (v === null || v === undefined) return '';
      return String(v).replace(/\\/g, '\\\\').replace(/\"/g, '\\\"').replace(/"/g, '\\"').replace(/\'/g, "\\'").replace(/\r?\n/g, ' ').trim();
    };

    let sel = '';
    // prefer data-qa/data-testid for selector stability
    if (e.dataQa) {
      const v = escapeAttr(e.dataQa);
      sel = `[data-qa=\"${v}\"]`;
    } else if (e.dataTestId) {
      const v = escapeAttr(e.dataTestId);
      sel = `[data-testid=\"${v}\"]`;
    } else if (e.id) {
      const v = escapeAttr(e.id);
      sel = `#${v}`;
    } else if (e.name) {
      const v = escapeAttr(e.name);
      sel = `[name=\"${v}\"]`;
    } else if (e.classes) sel = `${e.tag}${'.' + e.classes.split(/\s+/).filter(Boolean).join('.')}`;
    else sel = e.xpath;

    const rawKey = (e.dataQa || e.dataTestId || e.id || e.name || (e.tag + '_' + (e.text || '').slice(0,10)));
    let key = String(rawKey || '').replace(/[^a-zA-Z0-9_]/g, '_');
    if (/^[0-9]/.test(key)) key = `_${key}`;
    let varName = key || `${e.tag}`;
    let suffix = 1;
    while (seenVars.has(varName)) {
      varName = `${key}_${suffix++}`;
    }
    seenVars.add(varName);

    // Escape single quotes in selector
    const escSel = sel.replace(/'/g, "\\'");
    locatorLines.push(`  private ${varName} = '${escSel}';`);

    if (e.tag === 'input' || e.tag === 'textarea' || sel.includes('[name=')) {
      helpers.push(`  async set_${varName}(value: string) { await this.page.fill(this.${varName}, value); }`);
    } else if (e.tag === 'button' || e.tag === 'a') {
      helpers.push(`  async click_${varName}() { await this.page.click(this.${varName}); }`);
    }
  }

  const className = 'CashConcentrationPageGenerated';
  const fileContent = `import { Page } from "@playwright/test";

export class ${className} {
  constructor(private page: Page) {}

${locatorLines.join('\n')}

${helpers.join('\n')}

  // TODO: Review selectors above for stability and add domain-specific helpers.
}
`;

  fs.writeFileSync(outPath, fileContent, 'utf8');

  // Also write locators JSON for smoke verifier
  const jsonPath = outPath.replace(/\.ts$/, '.locators.json');
  fs.writeFileSync(jsonPath, JSON.stringify(top, null, 2), 'utf8');

  console.log('Generated:', outPath);
  console.log('Locators JSON:', jsonPath);
}

main().catch((e) => { console.error(e); process.exit(1); });
