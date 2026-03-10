"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentPosition, getDefaultCoords } from "@/lib/geo";
import { getDistanceKm } from "@/lib/utils";
import ShopCard from "@/components/ShopCard";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { addRecentSearch } from "@/lib/recentSearches";

const DEBOUNCE_MS = 300;

function groupAndSortShops(data, userLat, userLng, sortBy = "nearest") {
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

  if (sortBy === "products") {
    withDistance.sort((a, b) => (b.products?.length ?? 0) - (a.products?.length ?? 0));
  } else {
    withDistance.sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }
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
  const [within, setWithin] = useState("");
  const [sortBy, setSortBy] = useState("nearest");

  useEffect(() => {
    setQuery(qFromUrl ?? "");
    setWithin(searchParams.get("within") ?? "");
    setSortBy(searchParams.get("sort") || "nearest");
  }, [qFromUrl, searchParams]);

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

  const filteredResults = useMemo(() => {
    let list = results;
    if (within) {
      const km = Number(within);
      if (km) {
        list = list.filter((shop) => shop.distanceKm != null && shop.distanceKm <= km);
      }
    }
    return list;
  }, [results, within]);

  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    setError(false);
    const url = new URL(window.location.href);
    if (newQuery.trim()) url.searchParams.set("q", newQuery.trim());
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const updateWithin = useCallback((val) => {
    setWithin(val);
    const url = new URL(window.location.href);
    if (val) url.searchParams.set("within", val);
    else url.searchParams.delete("within");
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

      const sorted = groupAndSortShops(data || [], userLat, userLng, sortBy);
      setResults(sorted);
      if (query.trim()) addRecentSearch(query.trim());
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, userLat, userLng, retryCount, sortBy]);

  const popularSearches = ["iPhone", "Samsung", "OnePlus", "Pixel", "Charger"];

  return (
    <main className="container page-main">
      <section className="hero">
        <h1 className="hero-title">Find smartphones nearby</h1>
        <p className="hero-subtitle">
          Search local shops for phones and accessories. See distance, call, or get directions.
        </p>
      </section>

      <div className="search-section">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search phones, brands, accessories..."
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            aria-label="Search for products"
          />
        </div>

        {!query.trim() && (
          <div className="popular-searches">
            <span className="popular-label">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                className="popular-chip"
                onClick={() => updateQuery(term)}
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {locationLoading && (
          <p className="location-status">Getting your location...</p>
        )}
      </div>

      {query.trim() && results.length > 0 && (
        <div className="results-header">
          <p className="results-count">
            {filteredResults.length} shop{filteredResults.length !== 1 ? "s" : ""} found
            {within && ` within ${within} km`}
          </p>
          <select
            className="distance-filter"
            value={within}
            onChange={(e) => updateWithin(e.target.value)}
          >
            <option value="">Any distance</option>
            <option value="2">Within 2 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>
        </div>
      )}

      {error && (
        <ErrorState onRetry={() => { setError(false); setRetryCount((c) => c + 1); }} />
      )}

      {!error && loading && (
        <ul className="results-list" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </ul>
      )}

      {!error && !loading && query.trim() && results.length === 0 && (
        <EmptyState query={query} onTry={updateQuery} />
      )}

      {!error && !loading && query.trim() && results.length > 0 && filteredResults.length === 0 && (
        <div className="message-box">
          <p className="message-title">No shops within {within} km</p>
          <p className="message-text">Try a wider distance or different search term.</p>
          <button type="button" className="btn-secondary" onClick={() => updateWithin("")}>
            Show all {results.length} shops
          </button>
        </div>
      )}

      {!error && !loading && filteredResults.length > 0 && (
        <ul className="results-list">
          {filteredResults.map((shop, index) => (
            <ShopCard key={shop.id} shop={shop} index={index} query={query} />
          ))}
        </ul>
      )}

      {!query.trim() && (
        <section className="how-it-works">
          <h2 className="section-title">How it works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-text">
                <strong>Search</strong>
                <span>Type any phone, brand, or accessory</span>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-text">
                <strong>Find</strong>
                <span>See local shops sorted by distance</span>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-text">
                <strong>Connect</strong>
                <span>Call or get directions instantly</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
