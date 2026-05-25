# End-to-End Flow — NH-250271

This document records the exact end-to-end steps performed in this session for story `NH-250271` and shows the commands used where applicable.

## Overview

Work performed:
- Fetched Jira issue `NH-250271` and exported it to `Jira/NH-250271/NH-250271.md`.
- Created a suite of test case markdown files under `testcases/NH-250271/` (TC-01..TC-20).
- Ran the Playwright crawler (headed) to capture page locators and saved output under `Jira/Locator/NH-250271/`.
- Created `Jira/NH-250271/steps.md` to guide manual login during the crawler run.
- Converted generated locators into a page-object (`WiresFromTemplatePage`) and added a flow (`WiresFromTemplateFlow`) plus a spec skeleton (`WiresFromTemplate.spec.ts`).

## Files created (important ones)

- `Jira/NH-250271/NH-250271.md` — Jira story export (summary, description, acceptance criteria, comments).
- `testcases/NH-250271/TC-NH-250271-01_Smoke-Import-Drawdown.md` … `TC-NH-250271-20_End-to-End-Happy-Path.md` — 20 test-case files.
- `Jira/NH-250271/steps.md` — manual login / crawl instructions.
- `Jira/Locator/NH-250271/NH-250271Locator.ts` — generated Playwright locator class (and a companion `.locators.json`).
- `src/web/client/pages/imports/WiresFromTemplatePage.ts` — page-object using key selectors from generated locators.
- `src/web/client/flows/WiresFromTemplateFlow.ts` — flow orchestrating the import steps.
- `src/web/client/tests/imports/WiresFromTemplate.spec.ts` — test skeleton that uses the flow.

## Chronological step-by-step actions (what I did and the commands used)

1) Fetch Jira issue NH-250271
- Action: Retrieved the story from Jira and exported details into a Markdown file.
- Output file:
  - `Jira/NH-250271/NH-250271.md`

2) Create test-case files
- Action: Wrote 20 test-case markdown files covering positive, negative, edge, performance, and E2E scenarios.
- Location: `testcases/NH-250271/`

3) Prepare crawler steps file
- Action: Created a short `steps.md` in `Jira/NH-250271/` to instruct manual login during a headed crawler run.
- File: `Jira/NH-250271/steps.md`

4) Run Playwright crawler (headed) to capture locators
- Purpose: Open the application in a headed browser so the tester can log in manually and navigate; crawler captures DOM locators and emits a Playwright page object.
- Command executed (run in repository root):

```powershell
npx ts-node tools/agents/agent-crawler.ts --url "https://dgb-qa8-fi4423-web02.saas-n.com/ui" --steps "Jira/NH-250271/steps.md" --out "Jira/Locator/NH-250271/NH-250271Locator.ts" --headed true
```

- Notes:
  - The crawler prints the steps file, opens a headed browser, waits for manual login/navigation, then resumes after you press Enter in the terminal.
  - Output produced:
    - `Jira/Locator/NH-250271/NH-250271Locator.ts`
    - `Jira/Locator/NH-250271/NH-250271Locator.locators.json`

5) Convert generated locators into project page-object + flow + spec
- Files added:
  - `src/web/client/pages/imports/WiresFromTemplatePage.ts` — page object (wraps import map selection, template code field, file upload, test-mode toggle, start import, wait for result).
  - `src/web/client/flows/WiresFromTemplateFlow.ts` — flow to navigate to payment management and perform the import steps.
  - `src/web/client/tests/imports/WiresFromTemplate.spec.ts` — spec skeleton that logs in and calls the flow. Replace the placeholder `sampleFile` path with a real sample file to run the test.

- How the flow is used in the spec (example):

```ts
const sampleFile = 'test-data/wires-from-template-sample.csv';
await WiresFromTemplateFlow.importFromTemplate(page, sampleFile, {
  mapName: 'Wires from Template',
  templateCode: 'DRAWDOWN-EXAMPLE',
  testMode: true,
});
```

6) Page-object implementation notes
- The page-object created uses selectors discovered by the crawler and provides helper methods:
  - `selectImportMap(mapName)`
  - `enableCreateFromTemplate(enable)`
  - `setTemplateCode(code)`
  - `uploadFile(filePath)`
  - `setTestMode(enabled)`
  - `clickImport()` and `waitForImportComplete()`

7) How to run the new spec locally
- Ensure dependencies are installed and Playwright browsers are available per the project's README.
- Example command to run the single spec (from repository root):

```bash
npx cross-env TEST_TYPE=web APP=client playwright test src/web/client/tests/imports/WiresFromTemplate.spec.ts
```

- If your environment uses npm scripts, you can run the suite as specified in `AGENTS.md` or `README.md` (example scripts):

```powershell
npm install
npx playwright install chromium
npm run test:web:client
```

- Notes:
  - The spec skeleton uses the project's fixtures. It pulls login credentials with `login.get(getFeeder('feeder1', 1))` — ensure the configured test login exists in the test DB or replace with a suitable feeder key.
  - Add or generate a sample import file at `test-data/wires-from-template-sample.csv` (or update `sampleFile` in the spec to point to a real file path accessible to the test runner).

## Verification & artifacts

- Locator file verified at:
  - `Jira/Locator/NH-250271/NH-250271Locator.ts`
- Steps file used during crawling:
  - `Jira/NH-250271/steps.md`
- Testcases:
  - `testcases/NH-250271/` (20 markdown files)
- New page, flow, spec files added in `src/web/client/` as listed above.

## Next recommended actions

- Add a real sample import file under `test-data/` and update the spec to point to it.
- Extend the spec assertions to verify the import result (e.g., query the UI for success snackbar text or inspect created payment entries).
- Optionally refactor `WiresFromTemplatePage` to extend `BasePage` and use `safeClick` / `gotoPath` helpers for consistency with project patterns.

---

Generated on: 2026-05-25
Session: actions performed interactively via the assistant

