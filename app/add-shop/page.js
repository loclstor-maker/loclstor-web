"use client";

import { useState } from "react";
import Link from "next/link";

export default function AddShopPage() {
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    area: "",
    address: "",
    products: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Shop submission:", form);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="container add-shop-page">
        <div className="message-box" style={{ marginTop: 48 }}>
          <p className="message-title">Thank you!</p>
          <p className="message-text">
            We've received your shop details. We'll review and add it to LoclStor soon.
          </p>
          <Link href="/" className="btn-primary" style={{ display: "inline-block", marginTop: 16 }}>
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container add-shop-page">
      <nav className="simple-page-back">
        <Link href="/" className="simple-page-back-link">← Back</Link>
      </nav>

      <header className="simple-page-header">
        <h1 className="simple-page-title">List your shop</h1>
        <p className="simple-page-lead">
          Add your shop to LoclStor so people nearby can find you.
        </p>
      </header>

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
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-shop-field">
            <label htmlFor="area">Area / Locality *</label>
            <input
              id="area"
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="e.g., Koregaon Park, Pune"
              required
            />
          </div>

          <div className="add-shop-field add-shop-field-full">
            <label htmlFor="address">Full address *</label>
            <textarea
              id="address"
              name="address"
              rows={2}
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-shop-field add-shop-field-full">
            <label htmlFor="products">Products you sell *</label>
            <textarea
              id="products"
              name="products"
              rows={3}
              value={form.products}
              onChange={handleChange}
              placeholder="e.g., iPhone 15, Samsung S24, OnePlus Nord, chargers, cases..."
              required
            />
          </div>
        </div>

        <button type="submit" className="add-shop-submit">
          Submit
        </button>
      </form>
    </main>
  );
}
