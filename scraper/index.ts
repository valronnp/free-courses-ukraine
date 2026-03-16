/**
 * Scraping pipeline entry point.
 *
 * Usage:
 *   npm run scrape
 *
 * What it does:
 *   1. Runs three crawlers in parallel (freeCodeCamp, MIT OCW, Prometheus).
 *   2. Normalizes every raw record into a consistent schema.
 *   3. Deduplicates by URL, keeping the higher-confidence record.
 *   4. Writes the result to data/scraped-courses.json.
 *
 * After running:
 *   - Review courses with review_status === "pending".
 *   - Pay special attention to records with confidence < 0.6.
 *   - Set review_status to "approved" or "rejected" manually (or build a
 *     small review UI on top of the JSON file).
 *   - Approved records can be merged into lib/courses.ts or loaded directly
 *     by the frontend via a Server Component + fs.readFileSync call.
 */

import { normalize } from "./normalize";
import { dedup, writeOutput } from "./utils";
import { scrapeFreeCodeCamp } from "./crawlers/freecodecamp";
import { scrapeMitOcw } from "./crawlers/mit-ocw";
import { scrapePrometheus } from "./crawlers/prometheus";
import { scrapeEduhub } from "./crawlers/eduhub";
import { scrapeVumonline } from "./crawlers/vumonline";
import { scrapeEdEra } from "./crawlers/ed-era";
import { scrapeDiia } from "./crawlers/diia";

async function main() {
  console.log("🕷  Starting scraping pipeline…\n");

  // ── Run all crawlers in parallel ───────────────────────────────────────────
  // Promise.allSettled ensures one failing crawler doesn't abort the others.
  const [fccResult, mitResult, prometheusResult, eduhubResult, vumonlineResult, edEraResult, diiaResult] =
    await Promise.allSettled([
      scrapeFreeCodeCamp(),
      scrapeMitOcw(),
      scrapePrometheus(),
      scrapeEduhub(),
      scrapeVumonline(),
      scrapeEdEra(),
      scrapeDiia(),
    ]);

  function unwrap<T>(result: PromiseSettledResult<T[]>, label: string): T[] {
    if (result.status === "fulfilled") return result.value;
    console.warn(`⚠  ${label} failed: ${(result.reason as Error)?.message ?? result.reason}`);
    return [];
  }

  const allRaw = [
    ...unwrap(fccResult, "freeCodeCamp"),
    ...unwrap(mitResult, "MIT OCW"),
    ...unwrap(prometheusResult, "Prometheus"),
    ...unwrap(eduhubResult, "EduHub"),
    ...unwrap(vumonlineResult, "VUM Online"),
    ...unwrap(edEraResult, "EdEra"),
    ...unwrap(diiaResult, "Дія.Освіта"),
  ];

  console.log(`\n📦 Raw records collected: ${allRaw.length}`);

  // ── Normalize → deduplicate → write ───────────────────────────────────────
  const normalized = allRaw.map(normalize);
  const unique = dedup(normalized);

  console.log(`✂  After deduplication:  ${unique.length}`);

  writeOutput(unique, ["freecodecamp", "mit-ocw", "prometheus", "eduhub", "vumonline", "ed-era", "diia"]);

  // ── Summary report ─────────────────────────────────────────────────────────
  const bySource = unique.reduce<Record<string, number>>((acc, c) => {
    acc[c.source] = (acc[c.source] ?? 0) + 1;
    return acc;
  }, {});

  console.log("\n📊 Breakdown by source:");
  for (const [source, count] of Object.entries(bySource)) {
    console.log(`   ${source.padEnd(18)} ${count} courses`);
  }

  const pending = unique.filter((c) => c.review_status === "pending").length;
  const lowConf = unique.filter((c) => c.confidence < 0.6).length;

  console.log(`\n🔍 ${pending} courses awaiting review  (review_status = "pending")`);
  if (lowConf > 0) {
    console.log(`⚠  ${lowConf} courses with confidence < 0.6 — recommend manual check`);
  }

  console.log("\n✅ Done.\n");
}

main().catch((err: unknown) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
