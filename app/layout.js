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
        <span className="site-tagline">Local marketplace search</span>
      </div>
    </header>
  );
}

function LoadingFallback() {
  return (
    <div className="container page-loading">
      <div className="skeleton" style={{ width: "40%", height: "1.5rem", borderRadius: 8 }} />
      <div className="skeleton" style={{ width: "60%", height: "1rem", marginTop: 12, borderRadius: 8 }} />
      <div className="skeleton" style={{ width: "100%", height: "3rem", marginTop: 24, borderRadius: 16 }} />
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
