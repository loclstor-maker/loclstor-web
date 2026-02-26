"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-logo">LoclStor</Link>
          <p className="site-footer-tagline">
            Find smartphones from local shops near you.
          </p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer">
          <Link href="/#how-it-works" className="site-footer-link">How it works</Link>
          <Link href="/#about" className="site-footer-link">About</Link>
          <Link href="/contact" className="site-footer-link">Contact</Link>
          <Link href="/support" className="site-footer-link">Support</Link>
        </nav>
        <p className="site-footer-copy">
          © {new Date().getFullYear()} LoclStor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
