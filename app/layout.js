import { Suspense } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "LoclStor – Find phones & accessories near you",
  description: "Search for mobile phones and accessories at local shops. See distance, call, or get directions.",
  openGraph: {
    title: "LoclStor – Find phones & accessories near you",
    description: "Search for mobile phones and accessories at local shops. See distance, call, or get directions.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-logo">
          LoclStor
        </Link>
        <p className="site-tagline">Local marketplace search</p>
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Suspense fallback={<div className="container" style={{ paddingBlock: "2rem", color: "var(--text-muted)" }}>Loading…</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
