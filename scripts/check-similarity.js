const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const THRESHOLD = 0.6;

function walkHtml(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkHtml(full, list);
    else if (name === "index.html") list.push(full);
  }
  return list;
}

function extractMain(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i);
  let text = main ? main[0] : html;
  text = text
    .replace(/<section class="related-section"[\s\S]*?<\/section>/gi, " ")
    .replace(/<section class="contact-section"[\s\S]*?<\/section>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function shingles(text, n = 4) {
  const s = text.replace(/\s+/g, "");
  const set = new Set();
  if (s.length < n) {
    set.add(s);
    return set;
  }
  for (let i = 0; i <= s.length - n; i++) set.add(s.slice(i, i + n));
  return set;
}

function jaccard(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const uni = a.size + b.size - inter;
  return uni ? inter / uni : 0;
}

const files = [
  path.join(ROOT, "index.html"),
  ...walkHtml(path.join(ROOT, "regions"))
];

const pages = files
  .filter((f) => fs.existsSync(f))
  .map((file) => ({
    file: path.relative(ROOT, file).replace(/\\/g, "/"),
    set: shingles(extractMain(fs.readFileSync(file, "utf8")))
  }));

const pairs = [];
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const score = jaccard(pages[i].set, pages[j].set);
    pairs.push({ a: pages[i].file, b: pages[j].file, score });
  }
}

pairs.sort((x, y) => y.score - x.score);
const over = pairs.filter((p) => p.score > THRESHOLD);
const max = pairs[0];

console.log(`Compared ${pages.length} pages, ${pairs.length} pairs`);
console.log(`Max similarity: ${(max.score * 100).toFixed(1)}%  (${max.a} ↔ ${max.b})`);
console.log(`Pairs over ${THRESHOLD * 100}%: ${over.length}`);
pairs.slice(0, 8).forEach((p) => {
  console.log(`  ${(p.score * 100).toFixed(1)}%  ${p.a}  |  ${p.b}`);
});

if (over.length) {
  console.error("SIMILARITY_FAIL");
  process.exit(1);
}
console.log("SIMILARITY_OK");
