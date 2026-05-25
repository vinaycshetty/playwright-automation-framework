#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";
import { crawl } from "../src/tools/playwrightCrawler";

function parseArgs() {
  const args = process.argv.slice(2);
  const out: any = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.replace(/^--/, "");
      const val =
        args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
      out[key] = val;
    }
  }
  return out;
}

async function main() {
  const argv = parseArgs();
  if (!argv.url) {
    console.error(
      "Usage: --url <target> --out <file.ts> [--username user --password pass] [--headed true]",
    );
    process.exit(2);
  }

  const maxElements = argv.maxElements
    ? parseInt(String(argv.maxElements), 10)
    : 2000;
  const results = await crawl({
    url: argv.url,
    username: argv.username,
    password: argv.password,
    headed: argv.headed === "true" || argv.headed === true,
    waitForUser: argv.waitForUser === "true" || argv.waitForUser === true,
    autoNav: argv.autoNav === "true" || argv.autoNav === true,
    userGroup: argv["user-group"] || argv.userGroup || argv.user_group,
    paymentType: argv.paymentType || argv["payment-type"],
    waitForSelector: argv["wait-for-selector"] || argv.waitForSelector,
    rootSelector: argv["root-selector"] || argv.rootSelector,
    maxElements,
  });

  const outPath =
    argv.out ||
    path.join(
      "src",
      "web",
      "client",
      "pages",
      "payments",
      "Cash-Concentration",
      "CashConcentrationPage.generated.ts",
    );
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Pick top N selectors (default: all returned). Use --top to limit output.
  const topLimit = argv.top ? parseInt(String(argv.top), 10) : results.length;
  const topRaw = results.slice(0, topLimit);

  // Filter to only include visible/valid control types: inputs, selects, textareas, buttons, anchors, or elements with label/role/hooks
  const allowedTags = new Set([
    "input",
    "select",
    "textarea",
    "button",
    "a",
    "label",
  ]);
  const allowedRoles = new Set(["button", "textbox", "combobox", "link"]);
  let top = topRaw.filter((e: any) => {
    const tag = (e.tag || "").toLowerCase();
    const role = (e.role || "").toLowerCase();
    const hasHook =
      e.dataQa ||
      e.dataAction ||
      e.id ||
      e.name ||
      e.label ||
      e.href ||
      e.onclick;
    return allowedTags.has(tag) || allowedRoles.has(role) || Boolean(hasHook);
  });

  // Remove generic numeric hooks (e.g. button-134, select2-chosen-32) and elements without meaningful labels
  const genericHookRe = /^[a-zA-Z]+[-_]\d+$/;
  const hasMeaningfulName = (e: any) => {
    const txt = String(
      e.label || e.text || e.id || e.name || e.dataQa || e.dataAction || "",
    ).trim();
    if (!txt) return false;
    // if hook is generic like 'button-12' or 'select2-chosen-32', consider it meaningless unless a label/text exists
    if (
      (e.dataQa && genericHookRe.test(e.dataQa)) ||
      (e.dataAction && genericHookRe.test(e.dataAction))
    ) {
      return (
        Boolean(e.label && String(e.label).trim().length > 2) ||
        Boolean(e.text && String(e.text).trim().length > 2)
      );
    }
    return true;
  };

  top = top.filter((e: any) => {
    // For buttons/anchors, require a visible label/text or a non-generic hook
    const tag = (e.tag || "").toLowerCase();
    const role = (e.role || "").toLowerCase();
    if (tag === "button" || tag === "a" || role === "button") {
      return hasMeaningfulName(e);
    }
    // otherwise allow if meaningful
    return hasMeaningfulName(e);
  });

  const fieldLines: string[] = [];
  const methodLines: string[] = [];
  const seenFields = new Set<string>();

  const toVarName = (s: string) => {
    // insert space between camelCase transitions (e.g. "NumberDropdown" -> "Number Dropdown")
    const spaced = String(s || "").replace(/([a-z])([A-Z])/g, "$1 $2");
    return spaced
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .trim()
      .split(/\s+/)
      .map((w, i) =>
        i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1),
      )
      .join("")
      .replace(/^([0-9])/, "_$1");
  };
  for (const e of top) {
    // helper to sanitize attribute values for safe embedding in selectors and TS strings
    const escapeAttr = (v: any) => {
      if (v === null || v === undefined) return "";
      return String(v)
        .replace(/\\/g, "\\\\")
        .replace(/\"/g, '\\\"')
        .replace(/"/g, '\\"')
        .replace(/\'/g, "\\'")
        .replace(/\r?\n/g, " ")
        .trim();
    };

    let sel = "";
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
    } else if (e.href) {
      const v = escapeAttr(e.href);
      sel = `a[href="${v}"]`;
    } else if (e.onclick) {
      // fallback to xpath if onclick available but no stable attribute
      sel = e.xpath;
    } else if (e.classes)
      sel = `${e.tag}${"." + e.classes.split(/\s+/).filter(Boolean).join(".")}`;
    else sel = e.xpath;

    const rawKey =
      e.dataQa ||
      e.dataAction ||
      e.id ||
      e.name ||
      e.tag + "_" + (e.text || "").slice(0, 10);
    const toFieldConstName = (s: string) => {
      let n = String(s || "").replace(/[^a-zA-Z0-9]/g, "_");
      if (/^[0-9]/.test(n)) n = `_${n}`;
      return n.toUpperCase();
    };

    // determine selector string (same priority as before)
    let selStr = "";
    if (e.dataQa) selStr = `[data-qa="${escapeAttr(e.dataQa)}"]`;
    else if (e.dataAction)
      selStr = `[data-action="${escapeAttr(e.dataAction)}"]`;
    else if (e.id) selStr = `#${escapeAttr(e.id)}`;
    else if (e.name) selStr = `[name="${escapeAttr(e.name)}"]`;
    else if (e.href) selStr = `a[href="${escapeAttr(e.href)}"]`;
    else if (e.onclick) selStr = `xpath=${escapeAttr(e.xpath)}`;
    else if (e.classes)
      selStr = `${e.tag}${"." + String(e.classes).split(/\s+/).filter(Boolean).join(".")}`;
    else selStr = `xpath=${escapeAttr(e.xpath)}`;

    // reject brittle absolute xpaths like /html/body/... or deep table cell indexes unless element has a meaningful label/hook
    const isBadXpath = (xp: string | undefined) => {
      if (!xp) return false;
      try {
        const s = String(xp).trim();
        if (!s.startsWith("/")) return false; // relative ones may be ok
        if (/^\/html(\/body)?/i.test(s)) return true;
        if (/\/(table|tbody|tr|td)\//i.test(s)) return true;
        const indexCount = (s.match(/\[\d+\]/g) || []).length;
        if (indexCount >= 4) return true;
        return false;
      } catch (err) {
        return false;
      }
    };

    if (selStr.startsWith("xpath=") && isBadXpath(e.xpath)) {
      // skip xpath-only brittle selectors unless element has a meaningful label/text or a stable hook
      const meaningful =
        Boolean(e.label && String(e.label).trim().length > 1) ||
        Boolean(e.text && String(e.text).trim().length > 1) ||
        e.dataQa ||
        e.dataTestId ||
        e.id ||
        e.name;
      if (!meaningful) continue;
      // otherwise, prefer using text() based role/getByRole if available later; keep xpath only as last resort
    }

    const baseField = toFieldConstName(rawKey);
    let fieldName = baseField;
    let sfx = 1;
    while (seenFields.has(fieldName)) fieldName = `${baseField}_${sfx++}`;
    seenFields.add(fieldName);

    const isXpathSelector = String(selStr).startsWith("xpath=");
    const badXpath = isXpathSelector && isBadXpath(e.xpath);

    // If selector is a brittle absolute xpath, but element has meaningful label/text, generate a Playwright API method instead
    const hasLabel = Boolean(e.label && String(e.label).trim().length > 0);
    const hasText = Boolean(e.text && String(e.text).trim().length > 0);
    const hasStableHook = Boolean(e.dataQa || e.dataTestId || e.id || e.name);

    if (badXpath) {
      // skip if no meaningful identifier
      if (!hasLabel && !hasText && !hasStableHook) continue;

      // for inputs/selects with label prefer getByLabel
      const tag = (e.tag || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        if (hasLabel) {
          const label = escapeAttr(e.label);
          const methodKey = toVarName(
            e.label ||
              e.name ||
              e.id ||
              e.tag + "_" + (e.text || "").slice(0, 10),
          );
          methodLines.push(
            `  async set_${methodKey}(value: string) { await this.page.getByLabel("${label}").fill(value); }`,
          );
        } else if (e.name) {
          const namev = escapeAttr(e.name);
          const methodKey = toVarName(e.name);
          methodLines.push(
            `  async set_${methodKey}(value: string) { await this.page.locator("[name='${namev}']").fill(value); }`,
          );
        }
      } else {
        // buttons/links: prefer getByRole or getByText
        if (hasLabel || hasText) {
          const nameText = escapeAttr(e.label || e.text);
          const role = (e.role || "").toLowerCase();
          const methodKey = toVarName(
            e.label ||
              e.text ||
              e.id ||
              e.name ||
              e.tag + "_" + (e.text || "").slice(0, 10),
          );
          if (role === "button" || tag === "button") {
            methodLines.push(
              `  async click_${methodKey}() { await this.page.getByRole("button", { name: "${nameText}" }).click(); }`,
            );
          } else if (role === "link" || tag === "a") {
            methodLines.push(
              `  async click_${methodKey}() { await this.page.getByRole("link", { name: "${nameText}" }).click(); }`,
            );
          } else {
            methodLines.push(
              `  async click_${methodKey}() { await this.page.getByText("${nameText}").click(); }`,
            );
          }
        }
      }
      // do not create a brittle field constant
      continue;
    }

    // add private field line
    fieldLines.push(`  private ${fieldName} = '${selStr}';`);

    // method generation: set_ for input/select/textarea, click_ for buttons/others
    const tag = (e.tag || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") {
      methodLines.push(
        `  async set_${fieldName}(value: string) { await this.page.fill(this.${fieldName}, value); }`,
      );
    } else {
      methodLines.push(
        `  async click_${fieldName}() { await this.page.click(this.${fieldName}); }`,
      );
    }
  }

  const className = "CashConcentrationPageGenerated";
  const fileContent = `import { Page } from "@playwright/test";

export class ${className} {
  constructor(private page: Page) {}

${fieldLines.join("\n")}

${methodLines.join("\n")}

  // TODO: Review selectors above for stability and add domain-specific helpers.
}
`;

  fs.writeFileSync(outPath, fileContent, "utf8");

  // Also write locators JSON for smoke verifier
  const jsonPath = outPath.replace(/\.ts$/, ".locators.json");
  fs.writeFileSync(jsonPath, JSON.stringify(top, null, 2), "utf8");

  console.log("Generated:", outPath);
  console.log("Locators JSON:", jsonPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
