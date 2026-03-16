import { PlaywrightCrawler, Configuration } from "crawlee";
import type { RawCourse } from "../schema";

const PROVIDER = "EdEra";
const SOURCE = "ed-era";

/**
 * Scrapes EdEra (ed-era.com) — Ukrainian e-learning platform, free Ukrainian courses only.
 *
 * WHY PlaywrightCrawler:
 *   Courses load via JavaScript. The page uses WordPress with a custom AJAX
 *   loader — CheerioCrawler sees an empty container.
 *
 * STRUCTURE (verified 2026-03-16):
 *   Card:     .post-card.card-courses
 *   Title:    a[href*='study.ed-era.com'] (link text, skipping the "БЕЗКОШТОВНИЙ" anchor)
 *   URL:      a.more-button[href*='study.ed-era.com']
 *   Free:     .more-button > .post > strong containing "Безкоштовн"
 *   Language: .card-tag[style*='2eaaa7'] or text "Українська" in .card-tag
 *
 * NOTE:
 *   Course URLs are on study.ed-era.com (the LMS subdomain). We store them
 *   as-is — the canonical course URL for users to open.
 */
export async function scrapeEdEra(): Promise<RawCourse[]> {
  const results: RawCourse[] = [];

  const crawler = new PlaywrightCrawler(
    {
      launchContext: {
        launchOptions: { headless: true },
      },

      async requestHandler({ page, log }) {
        await page
          .waitForSelector(".post-card.card-courses", { timeout: 20_000 })
          .catch(() => log.warning("EdEra: .post-card.card-courses not found"));

        // Click "Переглянути більше" (Load More) until no more cards appear
        let prevCount = 0;
        for (let attempt = 0; attempt < 15; attempt++) {
          const currentCount = await page.evaluate(
            () => document.querySelectorAll(".post-card.card-courses").length,
          );
          if (currentCount === prevCount && attempt > 0) break;
          prevCount = currentCount;

          const clicked = await page.evaluate(() => {
            const btn = Array.from(
              document.querySelectorAll("a, button"),
            ).find((el) =>
              /переглянути більше|завантажити|load more/i.test((el as HTMLElement).innerText),
            ) as HTMLElement | null;
            if (btn) { btn.click(); return true; }
            return false;
          });
          if (!clicked) break;
          await page.waitForTimeout(2000);
        }

        const courses = await page.evaluate(() => {
          const cards = Array.from(document.querySelectorAll(".post-card.card-courses"));
          return cards.map((card) => {
            // Free check: .more-button contains "Безкоштовн"
            const moreBtn = card.querySelector("a.more-button") as HTMLAnchorElement | null;
            const isFree = /безкоштовн/i.test(moreBtn?.innerText ?? "");

            // Language check: tag with "Українська" or teal background
            const tags = Array.from(card.querySelectorAll(".card-tag")).map(
              (t) => (t as HTMLElement).innerText.trim(),
            );
            const isUkrainian = tags.some((t) => /укра/i.test(t));

            if (!isFree || !isUkrainian) return null;

            // URL: on the more-button
            const url = moreBtn?.href ?? "";

            // Title: anchor to study.ed-era.com that is NOT the badge button
            const titleLink = Array.from(
              card.querySelectorAll<HTMLAnchorElement>("a[href*='study.ed-era.com']"),
            ).find((a) => {
              const t = a.innerText.trim();
              return t && !/безкоштовн/i.test(t) && t.length > 3;
            });
            const title = titleLink?.innerText.trim() ?? "";

            const image = (card.querySelector("img") as HTMLImageElement)?.src ?? null;
            const description =
              (card.querySelector("[class*='description'], [class*='excerpt'], p") as HTMLElement)
                ?.innerText?.trim() ?? "";

            // "5 годин" in .card-tags
            const durationTag = tags.find((t) => /\d+\s*годин/i.test(t));
            const durationMatch = durationTag?.match(/(\d+)\s*годин/i);
            const duration = durationMatch ? `${durationMatch[1]} hours` : undefined;

            return { title, url, image, description, tags, duration };
          }).filter((c): c is NonNullable<typeof c> => c !== null && !!c.title && !!c.url);
        });

        log.info(`EdEra: found ${courses.length} free Ukrainian courses`);

        for (const c of courses) {
          results.push({
            title: c.title,
            url: c.url,
            description: c.description || c.title,
            duration: c.duration,
            provider: PROVIDER,
            language: "Ukrainian",
            format: "Video",
            certificate: true,
            image: c.image,
            source: SOURCE,
            tags: Array.from(new Set(["Ukrainian", "EdEra", "Free", ...c.tags])),
          });
        }
      },

      maxRequestsPerCrawl: 5,
    },
    new Configuration({ persistStorage: false }),
  );

  await crawler.run(["https://ed-era.com/courses/"]);
  return results;
}
