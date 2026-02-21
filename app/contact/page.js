import Link from "next/link";

export const metadata = {
  title: "Contact – LoclStor",
  description: "Get in touch with LoclStor. Questions, feedback, or list your shop.",
};

export default function ContactPage() {
  return (
    <main className="container simple-page">
      <nav className="simple-page-back">
        <Link href="/" className="simple-page-back-link">← Back to search</Link>
      </nav>

      <header className="simple-page-header">
        <h1 className="simple-page-title">Contact us</h1>
        <p className="simple-page-lead">
          Have a question, feedback, or want to list your shop? We’d love to hear from you.
        </p>
      </header>

      <section className="simple-page-section">
        <h2 className="simple-page-section-title">Email</h2>
        <p className="simple-page-text">
          <a href="mailto:hello@loclstor.com" className="simple-page-link">hello@loclstor.com</a>
        </p>
        <p className="simple-page-text simple-page-muted">
          We usually respond within 1–2 business days.
        </p>
      </section>

      <section className="simple-page-section">
        <h2 className="simple-page-section-title">For shop owners</h2>
        <p className="simple-page-text">
          Want your shop listed on LoclStor? Send us your shop name, area, contact number, and what products you offer. We’ll get back to you with next steps.
        </p>
      </section>

      <p className="simple-page-text">
        <Link href="/support" className="simple-page-link">Visit Support</Link> for FAQs and help.
      </p>
    </main>
  );
}
