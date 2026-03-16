import fs from "fs";
import path from "path";
import type { ScrapedCourse, ScrapedOutput } from "./schema";

const OUTPUT_PATH = path.resolve(process.cwd(), "data", "scraped-courses.json");

/**
 * Deduplicate courses by URL.
 * When two scrapers return the same course, keeps the record with the higher
 * confidence score so we don't lose detail from a more thorough crawl.
 */
export function dedup(courses: ScrapedCourse[]): ScrapedCourse[] {
  const map = new Map<string, ScrapedCourse>();
  for (const course of courses) {
    const existing = map.get(course.url);
    if (!existing || course.confidence > existing.confidence) {
      map.set(course.url, course);
    }
  }
  return Array.from(map.values());
}

/**
 * Persist the final course list to data/scraped-courses.json.
 * Creates the data/ directory if it does not exist.
 */
export function writeOutput(courses: ScrapedCourse[], sources: string[]): void {
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const output: ScrapedOutput = {
    scraped_at: new Date().toISOString(),
    sources,
    total: courses.length,
    courses,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`✔  Saved ${courses.length} courses → ${OUTPUT_PATH}`);
}
