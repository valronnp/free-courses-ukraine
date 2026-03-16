import { CheerioCrawler, Configuration } from "crawlee";
import type { RawCourse } from "../schema";

const PROVIDER = "freeCodeCamp";
const SOURCE = "freecodecamp";

/**
 * Scrapes freeCodeCamp's /learn page.
 *
 * WHY CheerioCrawler:
 *   freeCodeCamp is a Gatsby app — the certification blocks are pre-rendered
 *   as static HTML in the initial response, so a full browser is unnecessary.
 *
 * ISOLATION:
 *   Each crawler gets its own Configuration({ persistStorage: false }) so
 *   parallel runs don't share in-memory request queues.
 *
 * SELECTORS:
 *   As of 2024, fCC wraps each curriculum area in <section class="superBlock">
 *   and each certification in <div class="block">. Verify against the live DOM
 *   if the scraper returns 0 results.
 */
export async function scrapeFreeCodeCamp(): Promise<RawCourse[]> {
  const results: RawCourse[] = [];

  const crawler = new CheerioCrawler(
    {
      async requestHandler({ $, request, enqueueLinks, log }) {
        const url = request.url;

        if (url === "https://www.freecodecamp.org/learn") {
          // ── Certification listing page ────────────────────────────────────
          $("section.superBlock, section[class*='super']").each((_, section) => {
            $(section)
              .find("div.block, div[class*='block']")
              .each((_, block) => {
                const el = $(block);
                const title = el.find("h2, h3, h4").first().text().trim();
                const description = el.find("p").first().text().trim();
                const href = el.find("a[href*='/learn/']").attr("href");
                const courseUrl = href
                  ? `https://www.freecodecamp.org${href}`
                  : `https://www.freecodecamp.org/learn`;

                if (!title) return;

                results.push({
                  title,
                  url: courseUrl,
                  description: description || `${title} — free interactive certification on freeCodeCamp.`,
                  provider: PROVIDER,
                  language: "English",
                  format: "Interactive",
                  certificate: true,
                  duration: "300 hours",
                  source: SOURCE,
                  tags: ["Free", "freeCodeCamp", "Certification", "Self-paced"],
                });
              });
          });

          log.info(`freeCodeCamp: found ${results.length} blocks on listing page`);

          // Only follow freeCodeCamp URLs — globs prevents external link pollution
          await enqueueLinks({
            selector: "a[href*='/learn/']",
            globs: ["https://www.freecodecamp.org/learn/**"],
            limit: 12,
          });
        } else {
          // ── Individual certification page ─────────────────────────────────
          const title = $("h1.cert-title, h1").first().text().trim();
          const description = $("p.cert-description, .certification-description p, section p").first().text().trim();
          const image = $('meta[property="og:image"]').attr("content") ?? null;

          if (!title) return;

          const alreadyCaptured = results.some((r) => r.url === url);
          if (!alreadyCaptured) {
            results.push({
              title,
              url,
              description: description || title,
              provider: PROVIDER,
              language: "English",
              format: "Interactive",
              certificate: true,
              duration: "300 hours",
              image,
              source: SOURCE,
              tags: ["Free", "freeCodeCamp", "Certification"],
            });
          } else {
            const existing = results.find((r) => r.url === url);
            if (existing && image) existing.image = image;
          }
        }
      },

      maxRequestsPerCrawl: 20,
    },
    // Each crawler gets its own isolated in-memory storage
    new Configuration({ persistStorage: false }),
  );

  await crawler.run(["https://www.freecodecamp.org/learn"]);

  return results;
}
