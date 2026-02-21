import Link from "next/link";

export const metadata = {
  title: "Support – LoclStor",
  description: "FAQs and help for using LoclStor to find products at local shops.",
};

const FAQ = [
  {
    q: "How do I search for a product?",
    a: "Type the product name in the search box on the home page. We’ll show you local shops that have it, sorted by distance. You can also use the popular search chips or your recent searches.",
  },
  {
    q: "How is distance calculated?",
    a: "We use your device’s location (with your permission) to show how far each shop is from you. If location is off, we use a default area. Enable location in your browser for accurate distances.",
  },
  {
    q: "How do I contact a shop?",
    a: "Each shop card has a phone number—tap it to call. You can also open the shop page and use “Open in Maps” to get directions.",
  },
  {
    q: "I want to add my shop to LoclStor. How?",
    a: "Head to our Contact page and email us with your shop name, area, phone number, and the products you offer. We’ll get in touch with next steps.",
  },
  {
    q: "Search isn’t finding what I need.",
    a: "Try different or broader search terms (e.g. “charger” instead of “USB-C fast charger”). If you still see no results, that product might not be listed yet in your area. Contact us to suggest adding more shops.",
  },
  {
    q: "Is LoclStor free to use?",
    a: "Yes. Searching and viewing local shops is free. Shop listings are subject to our listing policy.",
  },
];

export default function SupportPage() {
  return (
    <main className="container simple-page">
      <nav className="simple-page-back">
        <Link href="/" className="simple-page-back-link">← Back to search</Link>
      </nav>

      <header className="simple-page-header">
        <h1 className="simple-page-title">Support</h1>
        <p className="simple-page-lead">
          Common questions and how to get help.
        </p>
      </header>

      <section className="simple-page-section">
        <h2 className="simple-page-section-title">Frequently asked questions</h2>
        <ul className="faq-list">
          {FAQ.map((item, i) => (
            <li key={i} className="faq-item">
              <h3 className="faq-q">{item.q}</h3>
              <p className="faq-a">{item.a}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="simple-page-section">
        <p className="simple-page-text">
          Can’t find your answer? <Link href="/contact" className="simple-page-link">Contact us</Link> and we’ll help.
        </p>
      </section>
    </main>
  );
}
