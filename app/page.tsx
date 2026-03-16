"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { courses, searchCourses } from "@/lib/courses";
import { CourseCard } from "@/components/CourseCard";
import { Filters, FilterState, DEFAULT_FILTERS } from "@/components/Filters";
import { FeedbackModal } from "@/components/FeedbackModal";

const categoryIcons: Record<string, string> = {
  Technology: "💻",
  Business: "📈",
  Design: "🎨",
  Languages: "🌍",
  "Data Science": "📊",
  Marketing: "📣",
  Finance: "💰",
  "Personal Development": "🧠",
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") || "",
    level: searchParams.get("level") || "",
    provider: searchParams.get("provider") || "",
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const coursesRef = useRef<HTMLDivElement>(null);

  const results = searchCourses(query, {
    category: filters.category || undefined,
    level: (filters.level as "Beginner" | "Intermediate") || undefined,
    provider: filters.provider || undefined,
  });

  const updateUrl = useCallback(
    (q: string, f: FilterState) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (f.category) params.set("category", f.category);
      if (f.level) params.set("level", f.level);
      if (f.provider) params.set("provider", f.provider);
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    const t = setTimeout(() => updateUrl(query, filters), 300);
    return () => clearTimeout(t);
  }, [query, filters, updateUrl]);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  useEffect(() => {
    const onScroll = () => {
      const threshold = coursesRef.current
        ? coursesRef.current.offsetTop + 100
        : 400;
      setShowBackToTop(window.scrollY > threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeFilterCount = [
    filters.category,
    filters.level,
    filters.provider,
  ].filter(Boolean).length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,91,187,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-ukraine-blue" />
          <div className="flex-1 bg-ukraine-yellow" />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-12 pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-1.5 text-xs text-muted mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Регулярно оновлюється · Всі курси 100% безкоштовно
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-display leading-tight text-ink mb-6 max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Безкоштовні курси для{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Українців</span>
              <span
                className="absolute bottom-1 left-0 right-0 h-3 -z-0 opacity-40"
                style={{ background: "#FFD500" }}
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto mb-4 leading-relaxed">
            Добірка безкоштовних онлайн-курсів — з технологій, бізнесу, дизайну, мов та багато іншого —
            доступних українською мовою.
          </p>

          <button
            onClick={() => setFeedbackOpen(true)}
            className="inline-flex items-center gap-2 text-sm text-muted border border-border rounded-full px-4 py-1.5 bg-white hover:border-accent hover:text-accent transition-colors mb-6 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Залишити відгук
          </button>

          {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}

          {/* Stats */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {[
                { value: "302", label: "курси" },
                { value: "20", label: "категорій" },
                { value: "100%", label: "безкоштовні" },
              ].map((s) => (
                <div key={s.label} className="bg-white py-4 px-4 text-center">
                  <p
                    className="text-2xl font-display text-accent"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <div ref={coursesRef} className="max-w-5xl mx-auto px-4 md:px-12 py-5 pb-24 lg:pb-5">
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Пошук курсів, тем, провайдерів…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={200}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-muted hover:text-ink"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
              <Filters filters={filters} onChange={setFilters} totalCount={results.length} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Result count — mobile */}
            <div className="mb-4 lg:hidden">
              <span className="text-sm text-muted">
                <span className="font-semibold text-ink">{results.length}</span> результатів
              </span>
            </div>

            {/* Results */}
            {results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-display text-xl text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Курсів не знайдено
                </p>
                <p className="text-muted text-sm">Спробуйте змінити запит або очистити фільтри.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {results.map((course, i) => (
                  <div
                    key={course.slug}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i * 40, 400)}ms`, animationFillMode: "both" }}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${filtersOpen ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${filtersOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setFiltersOpen(false)}
          aria-hidden="true"
        />
        {/* Sheet */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Фільтри"
          className={`absolute inset-0 bg-paper flex flex-col transition-transform duration-300 ease-in-out ${filtersOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-white shrink-0">
            <h2 className="font-semibold text-ink">Фільтри</h2>
            <button
              onClick={() => setFiltersOpen(false)}
              aria-label="Закрити"
              className="text-muted hover:text-ink transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable filters */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <Filters filters={filters} onChange={setFilters} totalCount={results.length} />
          </div>

          {/* Footer CTA */}
          <div className="shrink-0 px-4 py-4 border-t border-border bg-white">
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Показати {results.length} курсів
            </button>
          </div>
        </div>
      </div>

      {/* Sticky mobile filter bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="px-4 pb-5 pt-3 bg-gradient-to-t from-paper via-paper/90 to-transparent">
          <button
            onClick={() => setFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-border shadow-lg text-sm font-medium text-ink hover:border-accent transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Фільтри
            {activeFilterCount > 0 && (
              <span className="bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Back to top — desktop only */}
      <button
        onClick={() => coursesRef.current?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Вгору"
        className={`fixed bottom-6 right-6 z-50 hidden lg:flex w-10 h-10 rounded-full bg-accent text-white shadow-lg items-center justify-center transition-all duration-300 hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
