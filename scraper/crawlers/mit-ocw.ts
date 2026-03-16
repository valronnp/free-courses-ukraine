import { CheerioCrawler, Configuration } from "crawlee";
import type { RawCourse } from "../schema";

const PROVIDER = "MIT OpenCourseWare";
const SOURCE = "mit-ocw";

/**
 * Scrapes MIT OpenCourseWare individual course pages.
 *
 * WHY CheerioCrawler:
 *   MIT OCW course pages are fully server-rendered static HTML — no JavaScript
 *   execution needed. The search/listing page uses Algolia client-side, so we
 *   instead seed from a curated list of well-known course URLs and follow
 *   "Related Courses" links to discover more.
 *
 * SELECTORS:
 *   As of 2024, MIT OCW uses a Django-rendered template with these patterns:
 *     - <h1 class="course-title">  — course name
 *     - <p class="course-description-body">  — description paragraph
 *     - <dt>Level</dt><dd>Undergraduate</dd>  — metadata pairs
 *   These should be verified against the live DOM if results are empty.
 *
 * EXTENDING COVERAGE:
 *   Add more URLs to SEED_URLS below. A richer seed list is the simplest way
 *   to expand coverage without needing to scrape the dynamic search page.
 */

const SEED_URLS = [
  "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/",
  "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
  "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
  "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/",
  "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/",
  "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/",
  "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/",
  "https://ocw.mit.edu/courses/15-501-introduction-to-financial-and-managerial-accounting-spring-2004/",
  "https://ocw.mit.edu/courses/6-00sc-introduction-to-computer-science-and-programming-spring-2011/",
  "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/",
];

export async function scrapeMitOcw(): Promise<RawCourse[]> {
  const results: RawCourse[] = [];

  const crawler = new CheerioCrawler({
    async requestHandler({ $, request, enqueueLinks, log }) {
      const url = request.url;

      // ── Extract course data from a single course page ─────────────────────
      const title =
        $("h1.course-title, h1[class*='course-title']").first().text().trim() ||
        $("h1").first().text().trim();

      if (!title) {
        log.warning(`MIT OCW: no title found at ${url}`);
        return;
      }

      const description =
        $("p.course-description-body, div.course-description p, .description p")
          .first()
          .text()
          .trim() ||
        $('meta[name="description"]').attr("content") ||
        "";

      const image =
        $("img.course-image, img[class*='hero'], img[class*='course']").first().attr("src") ||
        $('meta[property="og:image"]').attr("content") ||
        null;

      // MIT OCW uses <dt>/<dd> pairs for course metadata.
      // Common keys: "Level", "As Taught In", "Topics", "Instructors"
      let level: string | undefined;
      let duration: string | undefined;

      $("dt").each((_, dt) => {
        const label = $(dt).text().trim().toLowerCase();
        const value = $(dt).next("dd").text().trim();
        if (label.includes("level")) level = value;
        if (label.includes("taught in") || label.includes("term")) duration = value;
      });

      // Collect topic tags from breadcrumb or topic links
      const tags: string[] = ["MIT", "OpenCourseWare", "Free"];
      $("a[href*='/topics/'], a[class*='topic'], .course-topic a").each((_, el) => {
        const tag = $(el).text().trim();
        if (tag && !tags.includes(tag)) tags.push(tag);
      });

      results.push({
        title,
        url,
        description: description || title,
        provider: PROVIDER,
        language: "English",
        level,
        format: "Video",
        certificate: false, // MIT OCW is open courseware — no certificates issued
        image: image ?? null,
        duration,
        source: SOURCE,
        tags: tags.slice(0, 10),
      });

      log.info(`MIT OCW: scraped "${title}"`);

      // Follow only root course pages — never subpages like /pages/syllabus/.
      // The regex matches https://ocw.mit.edu/courses/{id}/ with no extra path segments.
      await enqueueLinks({
        regexps: [/https:\/\/ocw\.mit\.edu\/courses\/[^/]+\/$/],
        baseUrl: "https://ocw.mit.edu",
        limit: 4,
      });
    },

    maxRequestsPerCrawl: 30,
  },
  new Configuration({ persistStorage: false }),
  );

  await crawler.run(SEED_URLS);

  return results;
}
