"use client";

import { useState } from "react";
import Link from "next/link";

const initialForm = {
  shopName: "",
  ownerName: "",
  phone: "",
  whatsapp: "",
  area: "",
  address: "",
  products: "",
  brands: "",
  notes: "",
};

export default function AddShopPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Frontend-only for now: just show a success message.
    // Later we can send this to Supabase or an API route.
    console.log("New shop submission", form);
    setSubmitted(true);
    setForm(initialForm);
  }

  return (
    <main className="container add-shop-page">
      <nav className="simple-page-back">
        <Link href="/" className="simple-page-back-link">
          ← Back to search
        </Link>
      </nav>

      <header className="simple-page-header">
        <h1 className="simple-page-title">Add your shop</h1>
        <p className="simple-page-lead">
          List your smartphone shop on LoclStor so people nearby can find you.
        </p>
      </header>

      <section className="simple-page-section">
        <form className="add-shop-form" onSubmit={handleSubmit}>
          <div className="add-shop-grid">
            <div className="add-shop-field">
              <label htmlFor="shopName">Shop name *</label>
              <input
                id="shopName"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-shop-field">
              <label htmlFor="ownerName">Owner name *</label>
              <input
                id="ownerName"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-shop-field">
              <label htmlFor="phone">Phone number *</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-shop-field">
              <label htmlFor="whatsapp">WhatsApp number</label>
              <input
                id="whatsapp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            <div className="add-shop-field">
              <label htmlFor="area">Area / locality *</label>
              <input
                id="area"
                name="area"
                value={form.area}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-shop-field add-shop-field-full">
              <label htmlFor="address">Full address *</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-shop-field add-shop-field-full">
              <label htmlFor="products">Key products *</label>
              <textarea
                id="products"
                name="products"
                rows={3}
                value={form.products}
                onChange={handleChange}
                placeholder="Example: iPhone 15, Samsung S24, OnePlus Nord, cases, chargers…"
                required
              />
            </div>

            <div className="add-shop-field">
              <label htmlFor="brands">Brands you stock</label>
              <input
                id="brands"
                name="brands"
                value={form.brands}
                onChange={handleChange}
                placeholder="Apple, Samsung, OnePlus, Xiaomi…"
              />
            </div>

            <div className="add-shop-field add-shop-field-full">
              <label htmlFor="notes">Anything else we should know?</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                placeholder="Opening hours, exchange/EMI offers, delivery options, etc."
              />
            </div>
          </div>

          <button type="submit" className="add-shop-submit">
            Submit shop details
          </button>

          {submitted && (
            <p className="add-shop-success">
              Thank you! We’ve received your shop details. We’ll review and add it to LoclStor soon.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

