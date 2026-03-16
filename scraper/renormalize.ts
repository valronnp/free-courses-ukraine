/**
 * Re-applies category inference, slug generation, and title cleanup to the
 * existing scraped-courses.json without re-running the crawlers.
 *
 * Usage:  npx tsx scraper/renormalize.ts
 */

import fs from "fs";
import path from "path";
import { inferCategory } from "./normalize";

const FILE = path.resolve(process.cwd(), "data", "scraped-courses.json");

// Inline transliteration (mirrors normalize.ts)
const CYR_MAP: Record<string, string> = {
  а:"a", б:"b", в:"v", г:"h", ґ:"g", д:"d", е:"e", є:"ie", ж:"zh", з:"z",
  и:"y", і:"i", ї:"i", й:"i", к:"k", л:"l", м:"m", н:"n", о:"o", п:"p",
  р:"r", с:"s", т:"t", у:"u", ф:"f", х:"kh", ц:"ts", ч:"ch", ш:"sh",
  щ:"shch", ь:"", ю:"iu", я:"ia", ё:"yo", э:"e", ъ:"", ы:"y",
};

function transliterate(text: string): string {
  return text.toLowerCase().split("").map((c) => CYR_MAP[c] ?? c).join("");
}

function toSlug(title: string, provider: string): string {
  const clean = title.replace(/\s+/g, " ").trim();
  const base = transliterate(`${clean}-${provider}`)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .slice(0, 80)
    .replace(/^-+|-+$/g, "");
  // Make unique by appending a short hash of the original title if base is too short
  return base.length >= 4 ? base : `course-${Buffer.from(title).toString("base64").slice(0, 8)}`;
}

const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

// Track slugs to detect + resolve collisions
const slugCounts: Record<string, number> = {};

let fixed = 0;
let categoryChanged = 0;
let slugFixed = 0;
let titleFixed = 0;

for (const course of data.courses) {
  // 1. Fix title newlines
  const cleanTitle = course.title.replace(/\s+/g, " ").trim();
  if (cleanTitle !== course.title) {
    course.title = cleanTitle;
    course.longDescription = course.longDescription || cleanTitle;
    titleFixed++;
    fixed++;
  }

  // 2. Re-infer category
  const { category, subcategory } = inferCategory(
    course.title,
    course.description ?? "",
    course.tags ?? [],
  );
  if (category !== course.category || subcategory !== course.subcategory) {
    course.category = category;
    course.subcategory = subcategory;
    categoryChanged++;
    fixed++;
  }

  // 3. Regenerate slug
  const newSlug = toSlug(course.title, course.provider);
  if (newSlug !== course.slug) {
    course.slug = newSlug;
    slugFixed++;
    fixed++;
  }

  // Collect slug for collision check
  slugCounts[course.slug] = (slugCounts[course.slug] ?? 0) + 1;
}

// 4. Resolve slug collisions by appending -2, -3, etc.
const seen: Record<string, number> = {};
for (const course of data.courses) {
  if (slugCounts[course.slug] > 1) {
    seen[course.slug] = (seen[course.slug] ?? 0) + 1;
    if (seen[course.slug] > 1) {
      course.slug = `${course.slug}-${seen[course.slug]}`;
    }
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");

// Print category distribution
const cats: Record<string, number> = {};
for (const c of data.courses) cats[c.category] = (cats[c.category] ?? 0) + 1;

console.log("\n📊 New category distribution:");
for (const [cat, count] of Object.entries(cats).sort(([, a], [, b]) => b - a)) {
  console.log(`   ${cat.padEnd(22)} ${count}`);
}

console.log(`\n✅ Re-normalized ${data.courses.length} courses`);
console.log(`   Titles fixed:     ${titleFixed}`);
console.log(`   Categories fixed: ${categoryChanged}`);
console.log(`   Slugs fixed:      ${slugFixed}`);
