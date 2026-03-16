import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-6">📚</p>
      <h1
        className="text-4xl font-display text-ink mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Курс не знайдено
      </h1>
      <p className="text-muted mb-8 max-w-sm">
        Цей курс не існує або був видалений. Перегляньте наш повний каталог нижче.
      </p>
      <Link
        href="/"
        className="bg-accent text-white font-medium px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
      >
        Переглянути всі курси →
      </Link>
    </div>
  );
}
