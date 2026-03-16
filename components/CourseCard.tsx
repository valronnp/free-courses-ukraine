"use client";

import type { Course } from "@/lib/courses";
import { CATEGORY_LABELS, LEVEL_LABELS } from "@/lib/courses";

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-50 text-blue-700 border-blue-100",
  Business: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Design: "bg-purple-50 text-purple-700 border-purple-100",
  Languages: "bg-orange-50 text-orange-700 border-orange-100",
  "Data Science": "bg-cyan-50 text-cyan-700 border-cyan-100",
  Marketing: "bg-pink-50 text-pink-700 border-pink-100",
  Finance: "bg-yellow-50 text-yellow-700 border-yellow-100",
  "Personal Development": "bg-indigo-50 text-indigo-700 border-indigo-100",
  Cybersecurity: "bg-red-50 text-red-700 border-red-100",
  Engineering: "bg-stone-50 text-stone-700 border-stone-100",
  Healthcare: "bg-green-50 text-green-700 border-green-100",
  Law: "bg-slate-50 text-slate-700 border-slate-100",
  Psychology: "bg-violet-50 text-violet-700 border-violet-100",
  HR: "bg-teal-50 text-teal-700 border-teal-100",
  Sales: "bg-amber-50 text-amber-700 border-amber-100",
  Education: "bg-sky-50 text-sky-700 border-sky-100",
  Architecture: "bg-lime-50 text-lime-700 border-lime-100",
  Science: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
  Media: "bg-rose-50 text-rose-700 border-rose-100",
  Art: "bg-purple-50 text-purple-700 border-purple-100",
};

/** Returns a display string, or null if no real duration is available. */
function toHours(duration: string): string | null {
  const lower = duration.toLowerCase().trim();
  const n = parseFloat(lower);
  if (lower.includes("self")) return null;
  if (lower.includes("hour")) return Number.isInteger(n) ? `${n} год` : `~${Math.round(n)} год`;
  if (lower.includes("month")) return `~${Math.round(n * 20)} год`;
  if (lower.includes("week")) return `~${Math.round(n * 5)} год`;
  if (lower.includes("lecture")) return `~${Math.round(n * 0.75)} год`;
  return null;
}

const providerDomains: [string, string][] = [
  ["freeCodeCamp", "freecodecamp.org"],
  ["HubSpot", "hubspot.com"],
  ["Khan Academy", "khanacademy.org"],
  ["DeepLearning.AI", "deeplearning.ai"],
  ["Duolingo", "duolingo.com"],
  ["Prometheus", "prometheus.org.ua"],
  ["Figma", "figma.com"],
  ["Harvard", "harvard.edu"],
  ["Stanford", "stanford.edu"],
  ["MIT", "mit.edu"],
  ["AWS", "aws.amazon.com"],
  ["Google", "google.com"],
  ["Meta", "meta.com"],
  ["Coursera", "coursera.org"],
  ["YouTube", "youtube.com"],
];

function getProviderLogo(provider: string): string | null {
  for (const [key, domain] of providerDomains) {
    if (provider.includes(key)) return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }
  return null;
}

const levelDots: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};


export function CourseCard({ course }: { course: Course }) {
  const colorClass = categoryColors[course.category] || "bg-gray-50 text-gray-700 border-gray-100";
  const dots = levelDots[course.level] || 1;

  return (
    <a href={course.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <article className="h-full border border-border rounded-2xl bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
<div className="p-4 flex flex-col gap-3 flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>
              {CATEGORY_LABELS[course.category] || course.category}
            </span>
            {course.certificate && (
              <span className="flex items-center gap-1 text-xs text-muted border border-border rounded-full px-2 py-0.5 shrink-0">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Сертифікат
              </span>
            )}
          </div>

          {/* Provider */}
          <div className="flex items-center gap-2">
            {getProviderLogo(course.provider) && (
              <img
                src={getProviderLogo(course.provider)!}
                alt={course.provider}
                className="w-4 h-4 rounded-sm object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <p className="text-xs font-medium text-muted truncate">{course.provider}</p>
          </div>

          {/* Title */}
          <h3
            className="font-display text-base leading-snug text-ink group-hover:text-accent transition-colors line-clamp-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted leading-relaxed line-clamp-2">
            {course.description}
          </p>

          <div className="flex-1" />

          {/* Footer meta */}
          <div className="pt-3 border-t border-border/50 flex items-center justify-between">
            {(() => { const h = toHours(course.duration); return h && <span className="text-xs text-muted">{h}</span>; })()}
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5">
                {[1, 2, 3].map((d) => (
                  <span
                    key={d}
                    className={`w-1.5 h-1.5 rounded-full ${d <= dots ? "bg-accent" : "bg-border"}`}
                  />
                ))}
              </span>
              <span className="text-xs text-muted">{LEVEL_LABELS[course.level] || course.level}</span>
            </div>
          </div>

        </div>
      </article>
    </a>
  );
}
