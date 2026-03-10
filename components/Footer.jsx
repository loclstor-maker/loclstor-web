import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-logo">LoclStor</Link>
          <p className="site-footer-tagline">Find phones at local shops near you</p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer navigation">
          <Link href="/add-shop" className="site-footer-link">List your shop</Link>
          <Link href="/contact" className="site-footer-link">Contact</Link>
          <Link href="/support" className="site-footer-link">Help</Link>
        </nav>
      </div>
    </footer>
  );
}
