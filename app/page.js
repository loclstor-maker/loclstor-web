"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Temporary user location (Andheri East – Marol)
const USER_LAT = 19.1197;
const USER_LNG = 72.8790;

function getDistanceKm(lat1, lng1, lat2, lng2) {
  if (!lat2 || !lng2) return null;

  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(`
          product_name,
          shops (
            id,
            name,
            area,
            phone,
            lat,
            lng
          )
        `)
        .ilike("product_name", `%${query}%`);

      if (error || !data) {
        setResults([]);
        setLoading(false);
        return;
      }

      const grouped = {};

      data.forEach((item) => {
        const shop = item.shops;
        if (!shop) return;

        if (!grouped[shop.id]) {
          grouped[shop.id] = {
            ...shop,
            products: [],
          };
        }

        grouped[shop.id].products.push(item.product_name);
      });

      const withDistance = Object.values(grouped).map((shop) => ({
        ...shop,
        distanceKm: getDistanceKm(
          USER_LAT,
          USER_LNG,
          shop.lat,
          shop.lng
        ),
      }));

      withDistance.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });

      setResults(withDistance);
      setLoading(false);
    }

    const delay = setTimeout(search, 300);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "Arial, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 28 }}>LoclStor</h1>
      <p style={{ opacity: 0.8 }}>
        Find mobile phones & accessories near you
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search phone or accessory…"
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 8,
          border: "1px solid #333",
          marginTop: 8,
        }}
      />

      <div style={{ marginTop: 12 }}>
        <strong>Popular searches:</strong>{" "}
        {["iPhone", "Samsung", "AirPods", "Fast Charger"].map((item) => (
          <button
            key={item}
            onClick={() => setQuery(item)}
            style={{
              marginLeft: 8,
              background: "#111",
              border: "1px solid #333",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
              color: "#ddd",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          Finding nearby shops…
        </p>
      )}

      {!loading && query && results.length === 0 && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          No nearby shops sell “{query}”. Try “Samsung” or “AirPods”.
        </p>
      )}

      {!loading && query && results.length > 0 && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          {results.length} shop{results.length > 1 ? "s" : ""} found for “{query}”
        </p>
      )}

      <ul style={{ padding: 0, listStyle: "none" }}>
        {results.map((shop, index) => (
          <li
            key={shop.id}
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              background: "#0f0f0f",
              border: "1px solid #262626",
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ fontSize: 17 }}>{shop.name}</strong>
                {index === 0 && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      background: "#14532d",
                      color: "#4ade80",
                      padding: "2px 6px",
                      borderRadius: 999,
                    }}
                  >
                    Nearest
                  </span>
                )}
              </div>

              {shop.distanceKm !== null && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#4ade80",
                  }}
                >
                  📍 {shop.distanceKm.toFixed(1)} km
                </span>
              )}
            </div>

            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              {shop.area}
            </div>

            <a
              href={`tel:${shop.phone}`}
              style={{
                display: "inline-block",
                marginTop: 6,
                fontSize: 13,
                color: "#60a5fa",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              📞 {shop.phone}
            </a>

            <div style={{ marginTop: 10 }}>
              <strong style={{ fontSize: 13 }}>Available</strong>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 6,
                }}
              >
                {shop.products.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#1f2933",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
