"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-0.5">
              <span className="w-3 h-5 bg-ukraine-blue rounded-sm" />
              <span className="w-3 h-5 bg-ukraine-yellow rounded-sm" />
            </div>
            <span
              className="font-display text-lg leading-none text-ink group-hover:text-accent transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Free Courses Ukraine
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/courses"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith("/courses")
                  ? "text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              All Courses
            </Link>
            <a
              href="https://coursera.org/ukraine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              Coursera Access ↗
            </a>
          </nav>

          {/* CTA */}
          <Link
            href="/courses"
            className="hidden sm:inline-flex items-center gap-2 bg-accent text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Browse courses
          </Link>
        </div>
      </div>
    </header>
  );
}
