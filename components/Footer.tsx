"use client";

import { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";

export function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <footer className="border-t border-border bg-paper mt-10">
      <div className="max-w-5xl mx-auto px-4 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <button
          onClick={() => setFeedbackOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-muted border border-border rounded-full px-3 py-1.5 bg-white hover:border-accent hover:text-accent transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Залишити відгук
        </button>
        <p className="text-xs text-muted">© 2026 Безкоштовні курси українською. Створено для тих, хто навчається.</p>
        <p className="text-xs text-muted">Слава Україні 🇺🇦</p>
      </div>
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
    </footer>
  );
}
