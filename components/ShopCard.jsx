import Link from "next/link";
import { mapsUrl } from "@/lib/utils";

export default function ShopCard({ shop, query }) {
  const mapsLink = mapsUrl(shop.lat, shop.lng, shop.name);
  const displayProducts = shop.products?.slice(0, 5) || [];
  const moreCount = (shop.products?.length || 0) - 5;

  return (
    <li className="shop-card">
      <div className="shop-card-header">
        <Link
          href={`/shops/${shop.id}?q=${encodeURIComponent(query || "")}`}
          className="shop-card-title-link"
        >
          <h3 className="shop-card-title">{shop.name}</h3>
        </Link>
        {shop.distanceKm != null && (
          <span className="shop-distance">{shop.distanceKm.toFixed(1)} km</span>
        )}
      </div>

      <p className="shop-card-area">{shop.area}</p>

      <div className="shop-card-actions">
        <a href={`tel:${shop.phone}`} className="shop-card-link">
          Call {shop.phone}
        </a>
        {mapsLink && (
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="shop-card-link">
            Directions
          </a>
        )}
      </div>

      {displayProducts.length > 0 && (
        <div className="shop-card-products">
          <span className="shop-card-products-label">Matching products</span>
          <div className="shop-card-tags">
            {displayProducts.map((p, i) => (
              <span key={i} className="shop-tag">{p}</span>
            ))}
            {moreCount > 0 && (
              <span className="shop-tag">+{moreCount} more</span>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
