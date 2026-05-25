import { log } from 'node:console';
import { chromium, Browser, Page } from 'playwright';

export type CrawlOptions = {
  url: string;
  username?: string;
  password?: string;
  headed?: boolean;
  waitForUser?: boolean;
  autoNav?: boolean;
  userGroup?: string;
  paymentType?: string;
  waitForSelector?: string;
  rootSelector?: string;
  maxElements?: number;
};

export async function crawl(opts: CrawlOptions) {
  const browser: Browser = await chromium.launch({ headless: !opts.headed });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page: Page = await context.newPage();

  try {
    await page.goto(opts.url, { waitUntil: 'networkidle' });

    // If credentials were provided, try a simple login flow using common selectors.
    if (opts.username && opts.password) {
      // try to dismiss cookie/privacy banners that can block the form
      const cookieSelectors = [
        '#onetrust-accept-btn-handler',
        'button:has-text("Accept")',
        'button.ot-sdk-show-settings',
        'button.cookie-accept',
      ];
      for (const s of cookieSelectors) {
        try { await page.click(s, { timeout: 500 }).catch(()=>{}); } catch(e) {}
      }

      // try to fill realm/userGroup first if provided
      if (opts.userGroup) {
        await page.fill("input[name='realm']", opts.userGroup).catch(()=>{});
        await page.waitForTimeout(250).catch(()=>{});
      }

      // Try multiple common selectors for username/password and submit
      const tryFill = async (selector: string, value: string) => {
        try {
          const el = await page.$(selector);
          if (el) {
            await el.fill(value);
            return true;
          }
        } catch (e) {}
        return false;
      };

      const usernameSelectors = [
        "#a11y-username",
        "input[name='username']",
        "input[name='user']",
        "input[type='email']",
        "input[id*='user']",
      ];
      const passwordSelectors = [
        "#a11y-password",
        "input[name='password']",
        "input[type='password']",
        "input[id*='pass']",
      ];

      for (const s of usernameSelectors) {
        if (await tryFill(s, opts.username!)) break;
      }
      for (const s of passwordSelectors) {
        if (await tryFill(s, opts.password!)) break;
      }

      const submitSelectors = [
        "#login-action-submit",
        "button:has-text('Sign In')",
        "button[type='submit']",
        "button:has-text('Log In')",
      ];
      let clicked = false;
      for (const s of submitSelectors) {
        try {
          await page.click(s).catch(()=>{});
          clicked = true;
          break;
        } catch (e) {}
      }
      if (!clicked) {
        try { await page.keyboard.press('Enter'); } catch(e){}
      }

      // wait for an indicator that login succeeded (home landing header), or small delay
      try {
        await page.waitForSelector('.landing-header', { timeout: 8000 });
      } catch (e) {
        await page.waitForTimeout(2000).catch(()=>{});
      }
    }

    // Ensure final navigation to target URL
    await page.goto(opts.url, { waitUntil: 'networkidle' });

    // If requested, pause and let the user interact with the opened headed browser
    if (opts.waitForUser) {
      // eslint-disable-next-line no-console
      console.log('\n[playwrightCrawler] Headed mode: complete any manual auth in the opened browser, then press ENTER to continue...');
      await new Promise<void>((resolve) => {
        process.stdin.resume();
        process.stdin.once('data', () => {
          process.stdin.pause();
          resolve();
        });
      });
      // Re-wait for network idle in case navigation occurred
      await page.waitForLoadState('networkidle').catch(() => {});
    }

    // If autoNav requested, perform navigation to payment -> add -> select payment type
    if (opts.autoNav) {
      try {
        const paymentsUrl = new URL('ui/PAYMENTS/managePayments', opts.url).href;
        await page.goto(paymentsUrl, { waitUntil: 'networkidle' });
      } catch (e) {
        await page.click('text=Payment Management').catch(()=>{});
        await page.click('text=Add a New Payment').catch(()=>{});
      }

        // open Add Payment modal and pick payment type
        const paymentTypeSelector =
    '//div[contains(@class, "container form-control")]//a[contains(@class, "choice select")]//span[contains(@class, "chosen")]';
      try { await page.getByText('Add a New Payment').click().catch(()=>{}); } catch(e){}
        const paymentType = opts.paymentType || 'Cash Concentration';
        await page.click(paymentTypeSelector).catch(()=>{});
      try { await page.click(`//li/div[text()="${paymentType}"]`).catch(()=>{}); } catch(e){}
      try { await page.getByRole("button", { name: "Continue" }).click().catch(() => { }); } catch (e) {
        console.log('Could not click Continue button');
        }
        try { await page.getByRole("button", { name: "Continue" }).click().catch(() => { }); } catch (e) {
        console.log('Could not click Continue button, may not be present on all flows - proceeding with crawl');
      }

      // give the page some time to render the requested form
      try { await page.waitForTimeout(1000); } catch (e) {}

      // ensure page load idle
      await page.waitForLoadState('networkidle').catch(()=>{});
    let waitSelector: string | undefined = typeof opts.waitForSelector === 'string' && opts.waitForSelector.trim() ? opts.waitForSelector.trim() : undefined;
      // If we have a waitSelector, wait longer here (after autoNav) and require it to be visible
      if (typeof waitSelector === 'string' && waitSelector.length) {
        try {
          await page.waitForSelector(waitSelector, { timeout: 60000, state: 'visible' });
          console.log(`[playwrightCrawler] waitForSelector satisfied after autoNav: ${waitSelector}`);
        } catch (err) {
          console.log('Warning: waitForSelector timed out after autoNav for', waitSelector);
          if (opts.waitForUser) {
            // let the user fix auth/navigation in headed mode
            // eslint-disable-next-line no-console
            console.log('\n[playwrightCrawler] Waiting for user interaction to complete (headed). Press ENTER to continue when the target form is visible...');
            await new Promise<void>((resolve) => {
              process.stdin.resume();
              process.stdin.once('data', () => {
                process.stdin.pause();
                resolve();
              });
            });
            // try one last time, but don't block indefinitely
            try { await page.waitForSelector(waitSelector, { timeout: 30000, state: 'visible' }); } catch(e) { console.log('Timeout after user wait; proceeding with crawl.'); }
          }
        }
      } else {
        // No explicit selector; wait briefly for the form to stabilize before crawling
        await page.waitForTimeout(2000).catch(()=>{});
      }
    }

    // Wait for a selector that indicates the target form is loaded. Prefer an explicit
    // option, otherwise use common payment-form selectors for known payment types.
    // Normalize waitForSelector: accept only non-empty strings. If a bare flag was passed
    // (e.g. --wait-for-selector without value) it may be boolean true; ignore that case.
    let waitSelector: string | undefined = typeof opts.waitForSelector === 'string' && opts.waitForSelector.trim() ? opts.waitForSelector.trim() : undefined;
    if (!waitSelector && opts.paymentType) {
      const pt = opts.paymentType.toLowerCase();
      if (pt.includes('cash')) waitSelector = 'input[name="AMOUNT"]';
      else if (pt.includes('wire')) waitSelector = 'input[name="AMOUNT"]';
    }
    if (waitSelector) {
      try {
        await page.waitForSelector(waitSelector, { timeout: 10000, state: 'visible' });
        console.log(`[playwrightCrawler] Initial waitForSelector satisfied: ${waitSelector}`);
      } catch (e) {
        console.log('Warning: initial waitForSelector timed out for', waitSelector, '- will attempt autoNav then wait again.');
      }
    }

    let elements: any[] = [];
    try {
      elements = await page.evaluate(({ max, rootSel }: { max: number; rootSel: string | null }) => {
      function getXPath(el: Element) {
        if (el.id) return `//*[@id=\"${el.id}\"]`;
        const parts: string[] = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
          let nb = 0;
          let sib = el.previousElementSibling;
          while (sib) {
            if (sib.nodeName === el.nodeName) nb++;
            sib = sib.previousElementSibling;
          }
          const index = nb ? `[${nb + 1}]` : '';
          parts.unshift(el.nodeName.toLowerCase() + index);
          // @ts-ignore
          el = el.parentElement;
        }
        return '/' + parts.join('/');
      }

      // Determine root scope for scanning
      const root = rootSel ? (document.querySelector(rootSel) as Element | null) : document;
      // If root not found, fall back to document
      const scope = (root || document) as Element | Document;

      // Only collect standard controls and elements exposing testing hooks within the scope
      // Broaden selector set to capture anchors, labels, div/span with roles or data hooks
      const nodeList = Array.from(scope.querySelectorAll('a,input,select,textarea,button,label,name,div,span,[data-qa],[data-action],[role="button"],[role="link"]'));
      const out = nodeList.slice(0, max || 500).map((n) => {
        const e = n as HTMLElement & { dataset: any };
        // ignore non-interactive or hidden elements
        try {
          // offsetParent null usually indicates display:none; also skip inputs[type=hidden]
          if ((e as HTMLInputElement).type === 'hidden') return null;
          const style = window.getComputedStyle(e);
          if (style && (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0')) return null;
        } catch (err) {}
        let dataQa = null as string|null;
        let dataAction = null as string|null;
        if (e.getAttribute) {
          dataQa = (e.getAttribute('data-qa') || e.getAttribute('dataQa')) || null;
          dataAction = (e.getAttribute('data-action') || e.getAttribute('dataAction')) || null;
        }
        // if the element itself doesn't have a testing hook, try its closest ancestor
        if (!dataQa) {
          const anc = (e.closest && e.closest('[data-qa]')) as Element | null;
          if (anc && anc.getAttribute) dataQa = (anc.getAttribute('data-qa') || anc.getAttribute('dataQa')) || null;
        }
        if (!dataAction) {
          const anc = (e.closest && e.closest('[data-action]')) as Element | null;
          if (anc && anc.getAttribute) dataAction = (anc.getAttribute('data-action') || anc.getAttribute('dataAction')) || null;
        }
        // include clickable detection: anchors with href, elements with onclick or role=button
        const onclick = (e.getAttribute && e.getAttribute('onclick')) || null;
        const href = (e.getAttribute && e.getAttribute('href')) || null;
        // Try to resolve an associated label for inputs/selects/textareas
        let labelText: string | null = null;
        try {
          const id = e.id;
          if (id) {
            const lab = document.querySelector(`label[for="${id}"]`);
            if (lab && lab.textContent) labelText = (lab.textContent || '').trim().replace(/\s+/g, ' ');
          }
          if (!labelText) {
            const closestLabel = (e.closest && e.closest('label')) as Element | null;
            if (closestLabel && closestLabel.textContent) labelText = (closestLabel.textContent || '').trim().replace(/\s+/g, ' ');
          }
        } catch (err) {}

        // Only return common control types or elements that expose role/label/hook
        const tagLower = e.tagName.toLowerCase();
        const allowedTags = ['input','select','textarea','button','a','label'];
        const roleAttr = e.getAttribute && e.getAttribute('role');
        const hasHook = dataQa || dataAction || (e.getAttribute && e.getAttribute('name')) || e.id || href || onclick || roleAttr || labelText;
        if (!allowedTags.includes(tagLower) && !hasHook) return null;

        return {
          tag: e.tagName.toLowerCase(),
          id: e.id || null,
          name: (e.getAttribute && e.getAttribute('name')) || null,
          dataQa,
          dataAction,
          role: e.getAttribute && e.getAttribute('role') || null,
          label: labelText || null,
          text: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 240),
          classes: e.className || null,
          href,
          onclick,
          xpath: getXPath(e),
        };
      });
      // filter nulls and only return interactive types
      return out.filter(Boolean) as any[];
      }, { max: opts.maxElements || 1000, rootSel: opts.rootSelector || null }) as any[];
    } catch (errEval) {
      // capture a small snapshot to help debugging
      try {
        const snap = await page.content();
        // eslint-disable-next-line no-console
        console.error('[playwrightCrawler] page.evaluate failed:', errEval);
        // eslint-disable-next-line no-console
        console.error('[playwrightCrawler] page content (first 2000 chars):\n', snap.slice(0, 2000));
      } catch (snapErr) {
        // eslint-disable-next-line no-console
        console.error('[playwrightCrawler] failed to capture page content', snapErr);
      }
      await browser.close();
      throw errEval;
    }

    // Simple scoring & dedupe on the Node side
    // Prefer data-qa / data-testid over id/name for stability
    const seen = new Set<string>();
    const scored = [] as any[];
    for (const e of elements) {
      const key = e.dataQa || e.dataTestId || e.id || e.name || (e.tag + '|' + e.text);
      if (seen.has(key)) continue;
      seen.add(key);
      let score = 0;
      if (e.dataQa || e.dataTestId) score += 100;
      if (e.id) score += 80;
      if (e.name) score += 70;
      if (e.role) score += 20;
      if (e.text) score += Math.min(20, e.text.length);
      scored.push({ ...e, score });
    }

    scored.sort((a,b) => b.score - a.score);
    await browser.close();
    return scored;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

export default { crawl };
