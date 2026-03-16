import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCourse, courses, CATEGORY_LABELS, LEVEL_LABELS, FORMAT_LABELS, LANGUAGE_LABELS } from "@/lib/courses";

const UA_MONTHS = ["Січ", "Лют", "Бер", "Квіт", "Трав", "Черв", "Лип", "Серп", "Вер", "Жовт", "Лист", "Груд"];
function formatYearMonth(ym: string): string {
  const [year, month] = ym.split("-");
  return `${UA_MONTHS[parseInt(month, 10) - 1] ?? month} ${year}`;
}

function toHours(duration: string): string {
  const lower = duration.toLowerCase().trim();
  const n = parseFloat(lower);
  if (lower.includes("hour")) return `${n} год`;
  if (lower.includes("month")) return `~${Math.round(n * 20)} год`;
  if (lower.includes("week")) return `~${Math.round(n * 5)} год`;
  if (lower.includes("lecture")) return `~${Math.round(n * 0.75)} год`;
  if (lower.includes("self")) return "Свій темп";
  return duration;
}
import { CourseCard } from "@/components/CourseCard";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse(params.slug);
  if (!course) return {};
  return {
    title: `${course.title} — Free Courses Ukraine`,
    description: course.description,
  };
}

function InfoPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-3">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function CoursePage({ params }: Props) {
  const course = getCourse(params.slug);
  if (!course) notFound();

  // Related: same category, different course
  const related = courses
    .filter((c) => c.category === course.category && c.slug !== course.slug)
    .slice(0, 3);

  const levelDots = { Beginner: 1, Intermediate: 2, Advanced: 3 }[course.level] || 1;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-12 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-ink transition-colors">Головна</Link>
        <span>›</span>
        <Link href="/" className="hover:text-ink transition-colors">Курси</Link>
        <span>›</span>
        <Link
          href={`/?category=${encodeURIComponent(course.category)}`}
          className="hover:text-ink transition-colors"
        >
          {course.category}
        </Link>
        <span>›</span>
        <span className="text-ink truncate max-w-xs">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Category tag */}
          <span className="inline-block text-xs font-medium bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1 mb-4">
            {course.category} · {course.subcategory}
          </span>

          <h1
            className="text-3xl sm:text-4xl font-display text-ink leading-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {course.title}
          </h1>

          <p className="text-lg text-muted mb-6 leading-relaxed">{course.description}</p>

          {/* Meta pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <InfoPill icon="⏱" label="Годин на проходження" value={toHours(course.duration)} />
            <InfoPill icon="📚" label="Формат" value={FORMAT_LABELS[course.format] || course.format} />
            <InfoPill icon="🌐" label="Мова" value={LANGUAGE_LABELS[course.language] || course.language} />
            <InfoPill icon="📶" label="Рівень" value={LEVEL_LABELS[course.level] || course.level} />
          </div>

          {/* Long description */}
          <div className="prose prose-sm max-w-none mb-8">
            <h2
              className="text-xl font-display text-ink mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Про цей курс
            </h2>
            <p className="text-muted leading-relaxed">{course.longDescription}</p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">Теми курсу</p>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/courses?q=${encodeURIComponent(tag)}`}
                  className="text-sm px-3 py-1 bg-white border border-border rounded-full text-muted hover:border-accent hover:text-accent transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Ukraine note */}
          {course.ukraineNote && (
            <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
              <span className="text-2xl shrink-0">🇺🇦</span>
              <div>
                <p className="text-sm font-semibold text-yellow-900 mb-0.5">Доступ для України</p>
                <p className="text-sm text-yellow-800 leading-relaxed">{course.ukraineNote}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar CTA card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-ukraine-blue to-ukraine-yellow" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-display text-accent" style={{ fontFamily: "var(--font-display)" }}>
                  Безкоштовно
                </span>
                <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">
                  Без оплати
                </span>
              </div>

              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors mb-4"
              >
                Перейти до курсу →
              </a>

              <p className="text-xs text-muted text-center mb-6">Відкривається на {course.provider.split("/")[0].trim()}</p>

              {/* Details list */}
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-muted">Провайдер</span>
                  <span className="font-medium text-ink text-right max-w-[160px] truncate">{course.provider}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted">Рівень</span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex gap-0.5">
                      {[1, 2, 3].map((d) => (
                        <span
                          key={d}
                          className={`w-2 h-2 rounded-full ${d <= levelDots ? "bg-accent" : "bg-border"}`}
                        />
                      ))}
                    </span>
                    <span className="font-medium text-ink">{LEVEL_LABELS[course.level] || course.level}</span>
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted">Сертифікат</span>
                  <span className={`font-medium ${course.certificate ? "text-green-600" : "text-muted"}`}>
                    {course.certificate ? "✓ Так" : "Ні"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted">Рейтинг</span>
                  <span className="flex items-center gap-1 font-medium text-ink">
                    <svg className="w-4 h-4 text-ukraine-yellow fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {course.rating.toFixed(1)}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted">Студентів</span>
                  <span className="font-medium text-ink">
                    {course.students >= 1000000
                      ? `${(course.students / 1000000).toFixed(1)}M`
                      : `${Math.round(course.students / 1000)}K`}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted">Оновлено</span>
                  <span className="font-medium text-ink">
                    {formatYearMonth(course.updatedAt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related courses */}
      {related.length > 0 && (
        <section className="mt-16 pt-10 border-t border-border">
          <div className="flex items-end justify-between mb-6">
            <h2
              className="text-2xl font-display text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Більше з {CATEGORY_LABELS[course.category] || course.category}
            </h2>
            <Link
              href={`/?category=${encodeURIComponent(course.category)}`}
              className="text-sm text-accent hover:underline"
            >
              Переглянути всі →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {related.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
