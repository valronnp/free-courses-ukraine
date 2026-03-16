"use client";

import { useEffect, useState } from "react";

export function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function formatWait(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${seconds} секунд`;
    if (seconds === 0) return `${minutes} хвилин`;
    return `${minutes} хв ${seconds} сек`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) { setError("Будь ласка, заповніть поле відгуку."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.status === 429) {
        const data = await res.json();
        setError(`Ви вже надіслали 2 відгуки. Спробуйте через ${formatWait(data.retryAfterMs)}.`);
        return;
      }
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      setError("Не вдалося надіслати відгук. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Закрити"
            className="absolute top-4 right-4 text-muted hover:text-ink transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {submitted ? (
            <div className="p-8 text-center">
              <p className="text-4xl mb-3">🎉</p>
              <p className="font-semibold text-lg text-ink mb-1">Дякуємо за відгук!</p>
              <p className="text-sm text-muted mb-6">Ми обов'язково його розглянемо.</p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Закрити
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <h2 id="feedback-title" className="text-lg font-semibold text-ink">Залишити відгук</h2>
                <p className="text-sm text-muted mt-0.5">Ваші думки допомагають нам стати кращими.</p>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="fb-name" className="text-xs font-medium text-muted uppercase tracking-wide">
                  Ім'я <span className="normal-case font-normal">(необов'язково)</span>
                </label>
                <input
                  id="fb-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Іван Іваненко"
                  maxLength={100}
                  className="px-3 py-2 border border-border rounded-xl text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="fb-email" className="text-xs font-medium text-muted uppercase tracking-wide">
                  Email <span className="normal-case font-normal">(необов'язково)</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ivan@example.com"
                  maxLength={254}
                  className="px-3 py-2 border border-border rounded-xl text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label htmlFor="fb-message" className="text-xs font-medium text-muted uppercase tracking-wide">
                  Відгук
                </label>
                <textarea
                  id="fb-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Напишіть ваш відгук або пропозицію…"
                  rows={4}
                  required
                  maxLength={5000}
                  className="px-3 py-2 border border-border rounded-xl text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Надсилання…" : "Надіслати"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
