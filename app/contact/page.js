import Link from "next/link";

export const metadata = {
  title: "Contact – LoclStor",
  description: "Get in touch with LoclStor.",
};

export default function ContactPage() {
  return (
    <main className="container simple-page">
      <nav className="simple-page-back">
        <Link href="/" className="simple-page-back-link">← Back</Link>
      </nav>

      <header className="simple-page-header">
        <h1 className="simple-page-title">Contact</h1>
        <p className="simple-page-lead">Have questions? We're here to help.</p>
      </header>

      <section className="simple-page-section">
        <h2 className="simple-page-section-title">Email us</h2>
        <p className="simple-page-text">
          <a href="mailto:hello@loclstor.com" className="simple-page-link">hello@loclstor.com</a>
        </p>
        <p className="simple-page-text" style={{ color: "var(--text-muted)" }}>
          We typically respond within 1-2 business days.
        </p>
      </section>

      <section className="simple-page-section">
        <h2 className="simple-page-section-title">List your shop</h2>
        <p className="simple-page-text">
          Want your shop on LoclStor? <Link href="/add-shop" className="simple-page-link">Submit your details</Link> and we'll review it.
        </p>
      </section>
    </main>
  );
}
