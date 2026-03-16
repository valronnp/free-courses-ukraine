import { PlaywrightCrawler, Configuration } from "crawlee";
import type { RawCourse } from "../schema";

const PROVIDER = "Дія.Освіта";
const SOURCE = "diia";

/**
 * Scrapes Дія.Освіта (osvita.diia.gov.ua) — Ukrainian government free learning platform.
 *
 * WHY PlaywrightCrawler:
 *   The site is a Nuxt.js SPA — all course cards are rendered client-side.
 *   CheerioCrawler would only see framework boilerplate.
 *
 * ALL FREE:
 *   Дія.Освіта is a government initiative; all content is free.
 *
 * SCROLL STRATEGY:
 *   The catalog may use infinite scroll. We scroll to the bottom 6 times
 *   (with 1.5 s pauses) to trigger lazy-loading before extracting cards.
 *
 * SELECTORS (verified against live DOM):
 *   .category-card-full, .category-card-minimized, .category-card-small
 *   Title:       [class*="title"]
 *   Description: [class*="description"]
 */
export async function scrapeDiia(): Promise<RawCourse[]> {
  const results: RawCourse[] = [];

  const crawler = new PlaywrightCrawler(
    {
      launchContext: {
        launchOptions: { headless: true },
      },

      async requestHandler({ page, log }) {
        await page
          .waitForSelector(".category-card-full, .category-card-minimized, .category-card-small", {
            timeout: 25_000,
          })
          .catch(() => log.warning("Diia: course cards not found — selector may have changed"));

        // Trigger infinite scroll
        for (let i = 0; i < 6; i++) {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(1500);
        }

        const cards = await page.evaluate(() => {
          const cardSelectors = [
            ".category-card-full",
            ".category-card-minimized",
            ".category-card-small",
          ];
          const seen = new Set<string>();
          const items: Array<{
            title: string;
            description: string;
            url: string;
            image: string | null;
          }> = [];

          for (const sel of cardSelectors) {
            for (const card of Array.from(document.querySelectorAll(sel))) {
              const titleEl = card.querySelector("[class*='title']") as HTMLElement | null;
              const descEl = card.querySelector("[class*='description']") as HTMLElement | null;
              const imgEl = card.querySelector("img") as HTMLImageElement | null;

              // URL can be on the card itself or a wrapping <a>
              const linkEl =
                (card.tagName === "A" ? card : card.closest("a") ?? card.querySelector("a")) as
                  | HTMLAnchorElement
                  | null;

              const title = titleEl?.innerText?.trim() ?? "";
              const description = descEl?.innerText?.trim() ?? "";
              const href = linkEl?.getAttribute("href") ?? "";
              const url = href
                ? new URL(href, location.origin).href
                : "";

              if (!title || seen.has(url || title)) continue;
              seen.add(url || title);

              items.push({ title, description, url, image: imgEl?.src ?? null });
            }
          }

          return items;
        });

        log.info(`Diia: found ${cards.length} course cards`);

        for (const card of cards) {
          results.push({
            title: card.title,
            url: card.url || "https://osvita.diia.gov.ua/",
            description: card.description || card.title,
            provider: PROVIDER,
            language: "Ukrainian",
            format: "Mixed",
            certificate: true,
            image: card.image,
            source: SOURCE,
            tags: ["Ukrainian", "Diia", "Free", "Government"],
          });
        }
      },

      maxRequestsPerCrawl: 5,
    },
    new Configuration({ persistStorage: false }),
  );

  await crawler.run(["https://osvita.diia.gov.ua/"]);
  return results;
}
