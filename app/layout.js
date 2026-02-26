import { Suspense } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "LoclStor – Find smartphones from local shops near you",
  description:
    "Search for smartphones at local shops. Find phones near you—see distance, call, or get directions.",
  openGraph: {
    title: "LoclStor – Find smartphones from local shops near you",
    description:
      "Search for smartphones at local shops. Find phones near you—see distance, call, or get directions.",
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
        <div className="site-header-right">
          <span className="site-tagline">Local marketplace search</span>
          <Link href="/add-shop" className="add-shop-btn">
            + Add shop
          </Link>
        </div>
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
      <body className="layout-body">
        <Header />
        <main className="layout-main">
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
