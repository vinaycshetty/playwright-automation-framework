#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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

function showSteps(stepsPath: string) {
  if (!fs.existsSync(stepsPath)) {
    console.error('Steps file not found:', stepsPath);
    process.exit(2);
  }
  const txt = fs.readFileSync(stepsPath, 'utf8');
  console.log('\n=== Navigation steps (follow these in the browser if headed) ===\n');
  console.log(txt);
  console.log('\n=============================================================\n');
}

async function runGenerator(args: string[]) {
  // Use npx ts-node to run scripts/generate-page-locators.ts
  const cmd = process.execPath; // node
  const tsNode = path.join(process.cwd(), 'node_modules', '.bin', 'ts-node');
  const useTsNode = fs.existsSync(tsNode);
  const script = path.join(process.cwd(), 'scripts', 'generate-page-locators.ts');
  const procArgs = useTsNode ? [tsNode, script, ...args] : [script, ...args];
  const spawnCmd = useTsNode ? 'npx' : cmd;
  const spawnArgs = useTsNode ? ['ts-node', script, ...args] : procArgs;

  return new Promise<number>((resolve) => {
    const child = spawn(spawnCmd, spawnArgs, { stdio: 'inherit', shell: true });
    child.on('exit', (code) => resolve(typeof code === 'number' ? code : 0));
  });
}

async function main() {
  const argv = parseArgs();
  const steps = argv.steps;
  const out = argv.out || path.join('Jira','Locator', `${argv.name || 'locators'}Locator.ts`);
  const credentialsFile = argv['credentials-file'] || path.join(process.cwd(), 'tools', 'agents', 'config', 'crawler.credentials.json');
  let username = argv.username;
  let password = argv.password;

  if (!argv.url) {
    console.error('Usage: --url <full-url> --steps <steps.md> --out <out.ts> [--username user --password pass] [--headed true] [--wait-for-user true]');
    process.exit(2);
  }

  if (steps) showSteps(steps as string);

  if (!username || !password) {
    if (fs.existsSync(credentialsFile)) {
      try {
        const c = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
        username = username || c.username;
        password = password || c.password;
      } catch (err) {
        console.warn('Failed to read credentials file:', credentialsFile);
      }
    }
  }

  const genArgs: string[] = [];
  genArgs.push('--url', argv.url);
  genArgs.push('--out', out);
  if (username) genArgs.push('--username', username);
  if (password) genArgs.push('--password', password);
  if (argv.headed) genArgs.push('--headed', String(argv.headed));
  // If steps provided, enable waitForUser so the user can follow steps in headed browser
  if (steps) genArgs.push('--waitForUser', 'true');
  if (argv['auto-nav'] || argv.autonav) genArgs.push('--autoNav', 'true');
  if (argv['wait-for-selector']) genArgs.push('--wait-for-selector', argv['wait-for-selector']);

  console.log('Launching crawler with args:', genArgs.join(' '));
  const code = await runGenerator(genArgs);
  if (code !== 0) {
    console.error('Crawler generator failed with code', code);
    process.exit(code);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(2);
  });
}
