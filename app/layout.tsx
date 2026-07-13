import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://examcoachai.example"),
  title: "Exam Coach AI - SAT, ACT, AP Study Plans",
  description: "Create personalized study plans for SAT, ACT, and AP exams. Free test prep planning tool.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Exam Coach AI",
    description: "Create smarter SAT, ACT, and AP study plans with a free diagnostic coach.",
    url: "https://examcoachai.example",
    siteName: "Exam Coach AI",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Exam Coach AI preview" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <Navigation />
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="border-t border-white/10 bg-slate-900/50 py-8 px-4">
          <div className="mx-auto max-w-7xl text-center text-sm text-slate-400">
            <p className="mb-2">Exam Coach AI is an independent study planning tool.</p>
            <p>Not affiliated with College Board, ACT, or AP.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
