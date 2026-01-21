"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [query, setQuery] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setShops([]);
        return;
      }

      setLoading(true);

      // 1) find products matching the query
      const { data: products, error: prodErr } = await supabase
        .from("products")
        .select("shop_id")
        .ilike("product_name", `%${query}%`);

      if (prodErr || !products?.length) {
        setShops([]);
        setLoading(false);
        return;
      }

      // 2) unique shop IDs
      const shopIds = [...new Set(products.map(p => p.shop_id))];

      // 3) fetch shops
      const { data: shopsData } = await supabase
        .from("shops")
        .select("*")
        .in("id", shopIds);

      setShops(shopsData || []);
      setLoading(false);
    }

    const t = setTimeout(search, 300); // small debounce
    return () => clearTimeout(t);
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

      {query && <h3 style={{ marginTop: 30 }}>Shops with “{query}”</h3>}

      {loading && <p>Searching…</p>}

      {!loading && shops.length === 0 && query && (
        <p>No shops found for “{query}”.</p>
      )}

      <ul>
        {shops.map((shop) => (
          <li key={shop.id}>
            <b>{shop.name}</b> — {shop.area} — {shop.phone}
          </li>
        ))}
      </ul>
    </main>
  );
}
