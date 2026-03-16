/**
 * Types for the scraping pipeline.
 *
 * RawCourse     — loosely typed data straight from a crawler, before normalization.
 * ScrapedCourse — fully typed record matching the frontend Course shape + audit fields.
 * ScrapedOutput — the JSON envelope written to data/scraped-courses.json.
 */

/** Loosely typed data returned by a crawler before normalization. */
export type RawCourse = {
  title: string;
  url: string;
  description: string;
  provider: string;
  language?: string;
  duration?: string;
  level?: string;
  format?: string;
  image?: string | null;
  certificate?: boolean;
  deadline?: string | null;
  tags?: string[];
  /** Identifies which crawler produced this record (e.g. "freecodecamp"). */
  source: string;
};

/** Normalized course record — ready to be consumed by the frontend. */
export type ScrapedCourse = {
  // — Identity —
  slug: string;
  title: string;
  provider: string;
  url: string;

  // — Content —
  description: string;     // ≤200 chars, used as card summary
  longDescription: string; // full scraped text
  category: string;
  subcategory: string;

  // — Metadata —
  language: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: "Video" | "Text" | "Interactive" | "Mixed";
  certificate: boolean;
  tags: string[];
  rating: number;    // 0 = placeholder; fill in after human review
  students: number;  // 0 = placeholder; fill in after human review
  updatedAt: string; // YYYY-MM
  featured: boolean;
  image: string | null;
  deadline: string | null;

  // — Provenance —
  source: string;
  review_status: "pending" | "approved" | "rejected";
  /** 0–1: proportion of expected fields that were successfully extracted. */
  confidence: number;
  /** ISO 8601 timestamp of the last scrape run. */
  last_checked: string;
};

/** Top-level envelope written to data/scraped-courses.json. */
export type ScrapedOutput = {
  scraped_at: string;
  sources: string[];
  total: number;
  courses: ScrapedCourse[];
};
