import Link from "next/link";

export const metadata = {
  title: "Help – LoclStor",
  description: "FAQs and help for LoclStor.",
};

const FAQ = [
  {
    q: "How do I search?",
    a: "Type what you're looking for (e.g., \"iPhone 15\" or \"Samsung\") in the search box. We'll show nearby shops that have it.",
  },
  {
    q: "How is distance calculated?",
    a: "We use your device's location (with permission) to show how far each shop is. Enable location for accurate distances.",
  },
  {
    q: "How do I contact a shop?",
    a: "Tap the phone number to call, or use \"Directions\" to open in Maps.",
  },
  {
    q: "How do I list my shop?",
    a: "Go to \"List your shop\" in the header or footer and submit your details. We'll review and add it.",
  },
  {
    q: "Is LoclStor free?",
    a: "Yes, searching and viewing shops is completely free.",
  },
];

export default function SupportPage() {
  return (
    <main className="container simple-page">
      <nav className="simple-page-back">
        <Link href="/" className="simple-page-back-link">← Back</Link>
      </nav>

      <header className="simple-page-header">
        <h1 className="simple-page-title">Help</h1>
        <p className="simple-page-lead">Frequently asked questions</p>
      </header>

      <section className="simple-page-section">
        <ul className="faq-list">
          {FAQ.map((item, i) => (
            <li key={i} className="faq-item">
              <h3 className="faq-q">{item.q}</h3>
              <p className="faq-a">{item.a}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="simple-page-text">
        Still need help? <Link href="/contact" className="simple-page-link">Contact us</Link>
      </p>
    </main>
  );
}
