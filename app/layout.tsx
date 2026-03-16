import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: "Free Courses Ukraine — Безкоштовна освіта",
  description:
    "Добірка безкоштовних онлайн-курсів для людей в Україні. Вивчайте технології, бізнес, дизайн та багато іншого — без жодних витрат.",
  keywords: ["free courses Ukraine", "безкоштовні курси", "online learning", "Coursera Ukraine", "Prometheus"],
  openGraph: {
    title: "Free Courses Ukraine",
    description: "Добірка безкоштовних онлайн-курсів для людей в Україні",
    type: "website",
    images: [{ url: "/meta-main.png", width: 1456, height: 816 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/meta-main.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col bg-paper">
        <main className="flex-1">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
