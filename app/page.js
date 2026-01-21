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

      {loading && <p>Searching…</p>}

      {!loading && query && results.length === 0 && (
        <p>No shops found for “{query}”.</p>
      )}

      <ul>
        {results.map((shop) => (
          <li key={shop.id} style={{ marginTop: 20 }}>
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

