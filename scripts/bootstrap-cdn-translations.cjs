#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * One-off: converts the human translations SmartCharts bundled until now (translation/*.json,
 * keyed by the English text, `[name]` placeholders) into the catalogue format of
 * `@deriv-com/translations` (keyed by crc32 of the English text, `{{name}}` placeholders),
 * so they can be uploaded to `deriv-smartcharts/<env>/translations/` before the first Makima
 * sync. The sync then reuses them as its translation memory instead of retranslating them.
 *
 * Delete this script, its workflow and translation/ once both environments are bootstrapped.
 * Besides the catalogues it writes protected-terms.suggested.json: the terms the translators
 * kept in English, as candidates for translations.protected-terms.json.
 *
 * Usage:
 *   npm run translations:extract            # writes translations/en.json from src
 *   node scripts/bootstrap-cdn-translations.cjs <outDir>
 */
const fs = require('fs');
const path = require('path');
const { str: crc32 } = require('crc-32');

const LOCALES = 'ar bn de es fr id it km ko mn pl pt ru si sw ta th tr uz vi zh_cn zh_tw'.split(' ');
// Makima supports neither Khmer nor Indonesian: their files are carried over as they are.
const MAKIMA_LOCALES = LOCALES.filter(locale => !['id', 'km'].includes(locale));

const args = process.argv.slice(2);
const outDir = args[0];
if (!outDir) {
    console.error('Usage: node scripts/bootstrap-cdn-translations.cjs <outDir>');
    process.exit(1);
}

const root = path.resolve(__dirname, '..');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

// The old extractor backslash-escaped `"` and `\` before JSON-encoding, so keys and values
// carry a literal `\"`; the old runtime undid that when it rendered them.
const unescape = s => s.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
const toNewPlaceholders = s => s.replace(/\[(\w+)\]/g, '{{$1}}');
const PLACEHOLDER = /\{\{\s*\w+\s*\}\}/g;
// A placeholder as found in a translation, possibly with a translated name: `{{Name}}`, `[نص]`.
const TOKEN = /\{\{[^{}]+\}\}|\[[^[\]]{1,30}\]/gu;
const placeholders = s =>
    (s.match(/\{\{\s*\w+\s*\}\}/g) || [])
        .map(p => p.replace(/\s/g, ''))
        .sort()
        .join('|');

const en = readJson(path.join(root, 'translations/en.json'));
const englishToKey = new Map(Object.entries(en).map(([key, english]) => [english, key]));
const oldKeys = Object.keys(readJson(path.join(root, 'translation/messages.json')));

const unmatched = [];
const keyFor = new Map();
for (const oldKey of oldKeys) {
    const english = toNewPlaceholders(unescape(oldKey));
    const key = englishToKey.get(english);
    if (key === undefined) unmatched.push(english);
    else {
        if (key !== String(crc32(english))) throw new Error(`Key mismatch for ${JSON.stringify(english)}`);
        keyFor.set(oldKey, { key, english });
    }
}

const report = [];
const catalogues = {};
for (const locale of LOCALES) {
    const committed = readJson(path.join(root, `translation/${locale}.json`));
    const catalogue = {};
    const dropped = [];
    const repaired = [];
    for (const [oldKey, { key, english }] of keyFor) {
        const value = committed[oldKey];
        if (!value) continue;
        let converted = toNewPlaceholders(unescape(value));
        if (placeholders(converted) !== placeholders(english)) {
            // Translators sometimes translated the placeholder's name (`[Name]`, `[texte]`),
            // which the old runtime never substituted. With a single placeholder there is
            // only one place it can go, so repair it; otherwise let Makima retranslate.
            const expected = english.match(PLACEHOLDER) || [];
            const found = converted.match(TOKEN) || [];
            if (expected.length === 1 && found.length === 1) {
                repaired.push({ english, before: converted });
                converted = converted.replace(TOKEN, expected[0]);
            } else {
                dropped.push({ english, value: converted });
                continue;
            }
        }
        catalogue[key] = converted;
    }
    catalogues[locale] = catalogue;
    report.push({ locale, repaired, dropped, untranslated: [] });
}

// A value identical to the English is either a term the translators keep in English (MACD,
// OHLC, SMA9 - most locales agree) or a string that was never translated (most locales
// translated it). Keep the first kind; drop the second so Makima translates it, as a key
// present in the catalogue is never sent again.
const keptEnglish = Object.keys(en).filter(
    key => MAKIMA_LOCALES.filter(locale => catalogues[locale][key] === en[key]).length >= MAKIMA_LOCALES.length / 2
);
for (const r of report) {
    if (!MAKIMA_LOCALES.includes(r.locale)) continue;
    const catalogue = catalogues[r.locale];
    for (const key of Object.keys(catalogue)) {
        if (catalogue[key] === en[key] && !keptEnglish.includes(key)) {
            r.untranslated.push(en[key]);
            delete catalogue[key];
        }
    }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'en.json'), JSON.stringify(en));
for (const r of report) {
    r.keys = Object.keys(catalogues[r.locale]).length;
    fs.writeFileSync(path.join(outDir, `${r.locale}.json`), JSON.stringify(catalogues[r.locale]));
}
// Candidates for translations.protected-terms.json: what the translators kept in English.
// Not PLACEHOLDER: `.test()` on a /g regex resumes from its previous match.
const HAS_PLACEHOLDER = /\{\{\s*\w+\s*\}\}/;
const suggestedTerms = keptEnglish.map(key => en[key]).filter(term => term.length > 1 && !HAS_PLACEHOLDER.test(term));
fs.writeFileSync(path.join(outDir, 'protected-terms.suggested.json'), `${JSON.stringify(suggestedTerms, null, 4)}\n`);

console.log(`en.json: ${Object.keys(en).length} strings; ${keyFor.size} have an existing translation key.`);
if (unmatched.length) {
    console.log(`\nOld strings no longer in src (not carried over): ${JSON.stringify(unmatched, null, 1)}`);
}
console.log('\nlocale  keys  repaired  dropped  untranslated');
for (const r of report) {
    console.log(
        `${r.locale.padEnd(6)}  ${String(r.keys).padStart(4)}  ${String(r.repaired.length).padStart(8)}  ${String(
            r.dropped.length
        ).padStart(7)}  ${String(r.untranslated.length).padStart(12)}`
    );
}
for (const r of report) {
    for (const d of r.repaired) {
        console.log(`repaired ${r.locale}: ${JSON.stringify(d.english)}: ${JSON.stringify(d.before)}`);
    }
    for (const d of r.dropped) {
        console.log(
            `dropped ${r.locale}: placeholders differ: ${JSON.stringify(d.english)} -> ${JSON.stringify(d.value)}`
        );
    }
}
