"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentPosition, getDefaultCoords } from "@/lib/geo";
import { getDistanceKm } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

const DEBOUNCE_MS = 300;

function groupAndSortShops(data, userLat, userLng) {
  const grouped = {};
  data.forEach((item) => {
    const shop = item.shops;
    if (!shop) return;
    if (!grouped[shop.id]) {
      grouped[shop.id] = { ...shop, products: [] };
    }
    grouped[shop.id].products.push(item.product_name);
  });

  const withDistance = Object.values(grouped).map((shop) => ({
    ...shop,
    distanceKm: getDistanceKm(userLat, userLng, shop.lat, shop.lng),
  }));

  withDistance.sort((a, b) => {
    if (a.distanceKm === null) return 1;
    if (b.distanceKm === null) return -1;
    return a.distanceKm - b.distanceKm;
  });
  return withDistance;
}

export default function Home() {
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Sync URL -> state on mount and when URL changes (e.g. back button)
  useEffect(() => {
    setQuery(qFromUrl);
  }, [qFromUrl]);

  // Get user location once
  useEffect(() => {
    let cancelled = false;
    setLocationLoading(true);
    getCurrentPosition()
      .then((coords) => {
        if (!cancelled) {
          setLocation(coords || getDefaultCoords());
        }
      })
      .finally(() => {
        if (!cancelled) setLocationLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const userLat = location?.lat ?? getDefaultCoords().lat;
  const userLng = location?.lng ?? getDefaultCoords().lng;

  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    setError(false);
    const url = new URL(window.location.href);
    if (newQuery.trim()) {
      url.searchParams.set("q", newQuery.trim());
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(false);

      const { data, error: err } = await supabase
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
        .ilike("product_name", `%${query.trim()}%`);

      if (cancelled) return;

      if (err) {
        setError(true);
        setResults([]);
        setLoading(false);
        return;
      }

      const sorted = groupAndSortShops(data || [], userLat, userLng);
      setResults(sorted);
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, userLat, userLng, retryCount]);

  return (
    <main className="container page-content" style={{ paddingBlock: "var(--space-10) var(--space-16)" }}>
      <header className="page-hero">
        <h1 className="page-title">Find it nearby</h1>
        <p className="page-desc">Search for any product at local shops. Find what you need nearby—see distance, call, or get directions.</p>
        {locationLoading && (
          <span className="page-location-hint" aria-live="polite">Getting your location…</span>
        )}
        {!locationLoading && !location && (
          <span className="page-location-hint">Using default area. Enable location for accurate distance.</span>
        )}
      </header>

      <div className="search-wrap">
        <SearchBar value={query} onChange={updateQuery} />
      </div>

      {loading && (
        <p className="results-status" aria-live="polite">Finding nearby shops…</p>
      )}
      {!loading && query.trim() && results.length > 0 && (
        <p className="results-status">
          {results.length} shop{results.length !== 1 ? "s" : ""} found for “{query}”
        </p>
      )}

      {error && (
        <div className="results-list">
          <ErrorState onRetry={() => { setError(false); setRetryCount((c) => c + 1); }} />
        </div>
      )}

      {!error && loading && (
        <ul className="results-list" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </ul>
      )}

      {!error && !loading && query.trim() && results.length === 0 && (
        <div className="results-list">
          <EmptyState query={query} onTry={updateQuery} />
        </div>
      )}

      {!error && !loading && results.length > 0 && (
        <ul className="results-list">
          {results.map((shop, index) => (
            <ShopCard key={shop.id} shop={shop} index={index} query={query} />
          ))}
        </ul>
      )}
    </main>
  );
}
