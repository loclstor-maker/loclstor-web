"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapsUrl } from "@/lib/utils";

const BRAND_KEYWORDS = [
  { key: "apple", label: "Apple" },
  { key: "iphone", label: "Apple" },
  { key: "samsung", label: "Samsung" },
  { key: "oneplus", label: "OnePlus" },
  { key: "pixel", label: "Pixel" },
  { key: "xiaomi", label: "Xiaomi" },
  { key: "redmi", label: "Xiaomi" },
  { key: "realme", label: "realme" },
  { key: "vivo", label: "vivo" },
  { key: "oppo", label: "OPPO" },
  { key: "nothing", label: "Nothing" },
];

function getMetaFromProducts(products = []) {
  const lower = products.map((p) => (p.product_name || "").toLowerCase());

  const brandSet = new Set();
  lower.forEach((name) => {
    BRAND_KEYWORDS.forEach(({ key, label }) => {
      if (name.includes(key)) brandSet.add(label);
    });
  });

  const brands = Array.from(brandSet);
  const has5g = lower.some((name) => name.includes("5g"));

  return { brands, has5g };
}

export default function ShopPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const backQuery = searchParams.get("q") || "";

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchShop() {
      const { data: shopData, error: shopError } = await supabase
        .from("shops")
        .select("id, name, area, phone, lat, lng")
        .eq("id", id)
        .single();

      if (cancelled) return;

      if (shopError || !shopData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: productsData } = await supabase
        .from("products")
        .select("product_name")
        .eq("shop_id", id);

      if (!cancelled) {
        setShop(shopData);
        setProducts(productsData || []);
      }
      setLoading(false);
    }

    fetchShop();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <main className="container shop-page">
        <div className="shop-page-skeleton">
          <div className="skeleton skeleton-title" style={{ width: "70%", height: "1.5rem" }} />
          <div className="skeleton" style={{ width: "50%", height: "1rem", marginTop: "1rem" }} />
          <div className="skeleton" style={{ width: "8rem", height: "1rem", marginTop: "1rem" }} />
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="container shop-page">
        <div className="error-state">
          <p className="error-state-title">Shop not found</p>
          <p className="error-state-desc">This shop may have been removed or the link is incorrect.</p>
          <Link href={backQuery ? `/?q=${encodeURIComponent(backQuery)}` : "/"} className="error-state-btn shop-page-back-btn">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  const mapsLink = mapsUrl(shop.lat, shop.lng, shop.name);
  const backHref = backQuery ? `/?q=${encodeURIComponent(backQuery)}` : "/";
  const { brands, has5g } = getMetaFromProducts(products);

  return (
    <main className="container shop-page">
      <nav className="shop-page-back">
        <Link href={backHref} className="shop-page-back-link">
          ← Back to search
        </Link>
      </nav>

      <header className="shop-page-header">
        <h1 className="shop-page-title">{shop.name}</h1>
        <p className="shop-page-area">{shop.area}</p>
      </header>

      {(brands.length > 0 || has5g) && (
        <div className="shop-meta-row" style={{ marginBottom: "var(--space-4)" }}>
          {brands.length > 0 && (
            <span className="shop-meta-chip shop-meta-chip-brand">
              {brands.join(" • ")}
            </span>
          )}
          {has5g && <span className="shop-meta-chip shop-meta-chip-5g">5G</span>}
        </div>
      )}

      <div className="shop-page-actions">
        <a href={`tel:${shop.phone}`} className="shop-page-btn shop-page-btn-primary">
          Call {shop.phone}
        </a>
        {mapsLink && (
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="shop-page-btn shop-page-btn-secondary">
            Open in Maps
          </a>
        )}
      </div>

      <section className="shop-page-section">
        <h2 className="shop-page-section-title">Products available</h2>
        {products.length > 0 ? (
          <ul className="shop-page-products">
            {products.map((p, i) => (
              <li key={i} className="shop-tag">
                {p.product_name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="shop-page-empty">No products listed yet.</p>
        )}
      </section>
    </main>
  );
}
