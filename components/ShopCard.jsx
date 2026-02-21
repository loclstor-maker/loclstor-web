"use client";

import Link from "next/link";
import { mapsUrl } from "@/lib/utils";

export default function ShopCard({ shop, index, query }) {
  const isNearest = index === 0 && shop.distanceKm != null;
  const mapsLink = mapsUrl(shop.lat, shop.lng, shop.name);

  return (
    <li className="shop-card">
      <div className="shop-card-header">
        <div className="shop-card-title-row">
          <Link href={`/shops/${shop.id}?q=${encodeURIComponent(query || "")}`} className="shop-card-title-link">
            <strong className="shop-card-title">{shop.name}</strong>
          </Link>
          {isNearest && <span className="shop-badge">Nearest</span>}
        </div>
        {shop.distanceKm != null && (
          <span className="shop-distance" aria-label={`${shop.distanceKm.toFixed(1)} km away`}>
            {shop.distanceKm.toFixed(1)} km
          </span>
        )}
      </div>
      <p className="shop-card-area">{shop.area}</p>
      <div className="shop-card-actions">
        <a href={`tel:${shop.phone}`} className="shop-card-link">
          {shop.phone}
        </a>
        {mapsLink && (
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="shop-card-link">
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
