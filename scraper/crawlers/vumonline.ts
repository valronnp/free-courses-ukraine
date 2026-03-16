import { CheerioCrawler, Configuration } from "crawlee";
import type { RawCourse } from "../schema";

const PROVIDER = "VUM Online";
const SOURCE = "vumonline";

/**
 * Scrapes VUM Online (vumonline.ua) — Ukrainian Virtual University, free courses in Ukrainian.
 *
 * SELECTORS (verified against live DOM):
 *   - Course card: .course-card
 *   - Title: .course-card_title
 *   - Course URL: a.course-card_link
 *   - Category tags: .course-card_tag-wrap
 *   - Pagination next: a.next.page-numbers
 *
 * STRATEGY:
 *   Listing pages → enqueue detail pages for description.
 *   Detail pages → extract description, image, level.
 */
export async function scrapeVumonline(): Promise<RawCourse[]> {
  const results: RawCourse[] = [];

  const crawler = new CheerioCrawler(
    {
      async requestHandler({ $, request, enqueueLinks, log }) {
        const url = request.url;

        if (request.userData.detail) {
          const title = $("h1").first().text().trim();
          if (!title) { log.warning(`VUM: no title at ${url}`); return; }

          const description =
            $(".course-description, .course-about p, .entry-content p, main p")
              .first()
              .text()
              .trim() || title;

          const image =
            $('meta[property="og:image"]').attr("content") ||
            $("img.wp-post-image, img.attachment-thumbnail").first().attr("src") ||
            null;

          // "22 занять (30 год. 00 хв.)" → "30 год"
          let duration: string | undefined;
          $("div.text").each((_, el) => {
            const t = $(el).text();
            const m = t.match(/\((\d+)\s*год\.?\s*(\d+)\s*хв/);
            if (m) {
              const h = parseInt(m[1], 10);
              const min = parseInt(m[2], 10);
              duration = min > 0 ? `${h}.${Math.round(min / 60 * 10)} hours` : `${h} hours`;
            }
          });

          results.push({
            title,
            url,
            description,
            provider: PROVIDER,
            language: "Ukrainian",
            format: "Mixed",
            certificate: true,
            image: image ?? null,
            duration,
            source: SOURCE,
            tags: ["Ukrainian", "VUM", "Free"],
          });

          log.info(`VUM: scraped "${title}"`);
        } else {
          // Listing page
          const count = $(".course-card").length;
          log.info(`VUM listing ${url}: found ${count} cards`);

          await enqueueLinks({
            selector: "a.course-card_link",
            baseUrl: "https://vumonline.ua",
            userData: { detail: true },
          });

          await enqueueLinks({
            selector: "a.next.page-numbers",
            baseUrl: "https://vumonline.ua",
          });
        }
      },

      maxRequestsPerCrawl: 200,
    },
    new Configuration({ persistStorage: false }),
  );

  await crawler.run(["https://vumonline.ua/courses/"]);
  return results;
}
