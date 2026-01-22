"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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

      // Fetch products + related shop
      const { data, error } = await supabase
        .from("products")
        .select(`
          product_name,
          shops (
            id,
            name,
            area,
            phone
          )
        `)
        .ilike("product_name", `%${query}%`);

      if (error || !data) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Group products by shop
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

      setResults(Object.values(grouped));
      setLoading(false);
    }

    const delay = setTimeout(search, 300);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>LoclStor</h1>
      <p>Find mobile phones & accessories near you</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search phone or accessory…"
        style={{ width: "100%", padding: 12, fontSize: 16 }}
      />

      <div style={{ marginTop: 12 }}>
  <strong>Popular searches:</strong>{" "}
  {["iPhone", "Samsung", "AirPods", "Fast Charger"].map((item) => (
    <button
      key={item}
      onClick={() => setQuery(item)}
      style={{
        marginLeft: 8,
        background: "none",
        border: "1px solid #444",
        color: "#fff",
        padding: "4px 8px",
        cursor: "pointer",
      }}
    >
      {item}
    </button>
  ))}
</div>
 

      {loading && <p>Searching…</p>}

      {!loading && query && results.length === 0 && (
         <p style={{ marginTop: 16, opacity: 0.8 }}>
          No nearby shops sell “{query}” yet. Try another product.
         </p>
      )}

        {!loading && query && results.length > 0 && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
        {results.length} shop{results.length > 1 ? "s" : ""} found for “{query}”
        </p>
      )}

      <ul>
  {results.map((shop) => (
    <li
      key={shop.id}
      style={{
        marginTop: 20,
        padding: 12,
        border: "1px solid #333",
        borderRadius: 6,
      }}
    >
      <strong>{shop.name}</strong> — {shop.area} — {shop.phone}

      <ul>
        {shop.products.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </li>
  ))}
</ul>

    </main>
  );
}

