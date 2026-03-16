import { PlaywrightCrawler, Configuration } from "crawlee";
import type { RawCourse } from "../schema";

const PROVIDER = "Prometheus";
const SOURCE = "prometheus";

/**
 * Scrapes Prometheus (prometheus.org.ua) — Ukraine's largest free MOOC platform.
 *
 * WHY PlaywrightCrawler:
 *   Prometheus is built on Open edX, which renders the course catalog
 *   client-side via JavaScript. CheerioCrawler would receive an empty shell;
 *   Playwright runs a real Chromium browser so the JS executes and the course
 *   cards appear in the DOM before we query them.
 *
 * PREREQUISITE:
 *   Install the Playwright browser binaries once after `npm install`:
 *     npx playwright install chromium
 *
 * SELECTORS:
 *   Open edX uses BEM-style class names that vary slightly across versions.
 *   The selector list below tries multiple patterns in order of specificity.
 *   Verify against the live DOM (DevTools → inspect a course card) if the
 *   scraper returns 0 results.
 *
 * PAGINATION:
 *   If Prometheus uses "Load More" (infinite scroll), the enqueueLinks call
 *   below won't help — replace it with a loop that clicks the button and
 *   waits for new cards to appear.
 */
export async function scrapePrometheus(): Promise<RawCourse[]> {
  const results: RawCourse[] = [];

  const crawler = new PlaywrightCrawler({
    launchContext: {
      launchOptions: { headless: true },
    },

    async requestHandler({ page, request, enqueueLinks, log }) {
      const url = request.url;

      if (url.includes("/courses-catalog")) {
        // ── Course catalog page ─────────────────────────────────────────────
        //
        // Free Prometheus courses use <article class="course-card"> (note: NOT
        // "course-card-plus", which is paid/PLUS content).
        // Each article is wrapped in an <a> element — the URL lives on the
        // parent, not inside the card itself.
        //
        // Selector verified against prometheus.org.ua/courses-catalog?price=0
        // on 2026-03-16.
        await page
          .waitForSelector("article.course-card", { timeout: 15_000 })
          .catch(() => log.warning("Prometheus: article.course-card not found — selector may have changed"));

        const cards = await page.evaluate(() => {
          const articles = Array.from(document.querySelectorAll("article.course-card"));
          return articles.map((el) => {
            // URL is on the wrapping <a> — walk up the DOM to find it
            let wrapper = el.parentElement;
            let href = "";
            for (let i = 0; i < 5; i++) {
              if (!wrapper) break;
              if (wrapper.tagName === "A") { href = (wrapper as HTMLAnchorElement).href; break; }
              wrapper = wrapper.parentElement;
            }
            const title = (el.querySelector("[class*='title'], h2, h3, h4") as HTMLElement)?.innerText?.trim() ?? "";
            const image = (el.querySelector("img") as HTMLImageElement)?.src ?? null;
            const availability = (el.querySelector("[class*='start'], [class*='date']") as HTMLElement)?.innerText?.trim() ?? "";
            return { title, href, image, availability };
          }).filter(c => c.title && c.href);
        });

        log.info(`Prometheus: found ${cards.length} free course cards`);

        for (const card of cards) {
          results.push({
            title: card.title,
            url: card.href,
            description: card.title,  // detail page scraped separately for richer text
            provider: PROVIDER,
            language: "Ukrainian",
            format: "Video",
            certificate: true,
            image: card.image,
            deadline: card.availability || null,
            source: SOURCE,
            tags: ["Ukrainian", "Prometheus", "Free"],
          });
        }

        // Enqueue all course detail pages for richer descriptions
        await enqueueLinks({
          globs: ["https://prometheus.org.ua/prometheus-free/**"],
          limit: 30,
        });
      } else if (url.includes("/prometheus-free/")) {
        // ── Individual free course detail page ──────────────────────────────
        await page.waitForSelector("h1", { timeout: 10_000 }).catch(() => {});

        const data = await page.evaluate(() => {
          const text = (sel: string) =>
            (document.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? "";
          const attr = (sel: string, a: string) =>
            (document.querySelector(sel) as HTMLElement)?.getAttribute(a) ?? null;
          return {
            title: text("h1"),
            description: text(".course-description p, [class*='about'] p, [class*='description'] p, main p"),
            image:
              (document.querySelector("img.course-hero, [class*='hero'] img, [class*='cover'] img") as HTMLImageElement)?.src ??
              attr('meta[property="og:image"]', "content"),
            level: text("[class*='level'], [class*='difficulty']"),
            duration: text("[class*='duration'], [class*='effort'], [class*='hours']"),
          };
        });

        if (!data.title) return;

        // Enrich the listing-page record with description/level/duration
        const existing = results.find((r) => r.url === url);
        if (existing) {
          if (data.description) existing.description = data.description;
          if (data.level) existing.level = data.level;
          if (data.duration) existing.duration = data.duration;
          if (data.image && !existing.image) existing.image = data.image;
        } else {
          results.push({
            title: data.title,
            url,
            description: data.description || data.title,
            provider: PROVIDER,
            language: "Ukrainian",
            level: data.level || undefined,
            duration: data.duration || undefined,
            format: "Video",
            certificate: true,
            image: data.image ?? null,
            source: SOURCE,
            tags: ["Ukrainian", "Prometheus", "Free"],
          });
        }
      }
    },

    maxRequestsPerCrawl: 25,
  },
  new Configuration({ persistStorage: false }),
  );

  await crawler.run(["https://prometheus.org.ua/courses-catalog?price=0"]);

  return results;
}
