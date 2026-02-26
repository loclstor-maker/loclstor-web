"use client";

import Link from "next/link";
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
  const lower = products.map((p) => (p || "").toLowerCase());

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

export default function ShopCard({ shop, index, query }) {
  const isNearest = index === 0 && shop.distanceKm != null;
  const mapsLink = mapsUrl(shop.lat, shop.lng, shop.name);
  const { brands, has5g } = getMetaFromProducts(shop.products || []);

  return (
    <li className="shop-card">
      <div className="shop-card-header">
        <div className="shop-card-title-row">
          <Link
            href={`/shops/${shop.id}?q=${encodeURIComponent(query || "")}`}
            className="shop-card-title-link"
          >
            <strong className="shop-card-title">{shop.name}</strong>
          </Link>
          {isNearest && <span className="shop-badge">Nearest</span>}
        </div>
        {shop.distanceKm != null && (
          <span
            className="shop-distance"
            aria-label={`${shop.distanceKm.toFixed(1)} km away`}
          >
            {shop.distanceKm.toFixed(1)} km
          </span>
        )}
      </div>

      <p className="shop-card-area">{shop.area}</p>

      {(brands.length > 0 || has5g) && (
        <div className="shop-meta-row">
          {brands.length > 0 && (
            <span className="shop-meta-chip shop-meta-chip-brand">
              {brands.join(" • ")}
            </span>
          )}
          {has5g && <span className="shop-meta-chip shop-meta-chip-5g">5G</span>}
        </div>
      )}

      <div className="shop-card-actions">
        <a href={`tel:${shop.phone}`} className="shop-card-link">
          {shop.phone}
        </a>
        {mapsLink && (
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-card-link"
          >
            Open in Maps
          </a>
        )}
      </div>

      <div className="shop-card-products">
        <span className="shop-card-products-label">Available</span>
        <div className="shop-card-tags">
          {shop.products.map((p, i) => (
            <span key={i} className="shop-tag">
              {p}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}
