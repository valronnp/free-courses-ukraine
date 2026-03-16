import { CheerioCrawler, Configuration } from "crawlee";
import type { RawCourse } from "../schema";

const PROVIDER = "EduHub";
const SOURCE = "eduhub";

/**
 * Scrapes EduHub (eduhub.in.ua) — all courses are free and in Ukrainian.
 *
 * SELECTORS (verified against live DOM):
 *   - Course card wrapper: .card-full
 *   - Title + URL: a.like-h3.card-title
 *   - Pagination next: a.next.page-numbers
 *
 * STRATEGY:
 *   Listing pages → enqueue detail pages (title only on listing).
 *   Detail pages → extract description, image.
 */
export async function scrapeEduhub(): Promise<RawCourse[]> {
  const results: RawCourse[] = [];

  const crawler = new CheerioCrawler(
    {
      async requestHandler({ $, request, enqueueLinks, log }) {
        const url = request.url;

        if (request.userData.detail) {
          const title = $("h1").first().text().trim();
          if (!title) { log.warning(`EduHub: no title at ${url}`); return; }

          const description =
            $(".course-description, .entry-content p, .description p, main p")
              .first()
              .text()
              .trim() || title;

          const image =
            $('meta[property="og:image"]').attr("content") ||
            $("img.wp-post-image, img.course-img, .course-thumbnail img")
              .first()
              .attr("src") ||
            null;

          results.push({
            title,
            url,
            description,
            provider: PROVIDER,
            language: "Ukrainian",
            format: "Video",
            certificate: false,
            image: image ?? null,
            source: SOURCE,
            tags: ["Ukrainian", "EduHub", "Free"],
          });

          log.info(`EduHub: scraped "${title}"`);
        } else {
          // Listing page
          const count = $(".card-full").length;
          log.info(`EduHub listing ${url}: found ${count} cards`);

          await enqueueLinks({
            selector: ".card-full a.like-h3.card-title",
            baseUrl: "https://eduhub.in.ua",
            userData: { detail: true },
          });

          // Follow numbered pagination
          await enqueueLinks({
            selector: "a.next.page-numbers",
            baseUrl: "https://eduhub.in.ua",
          });
        }
      },

      maxRequestsPerCrawl: 200,
    },
    new Configuration({ persistStorage: false }),
  );

  await crawler.run(["https://eduhub.in.ua/courses/"]);
  return results;
}
