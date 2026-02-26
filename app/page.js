"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentPosition, getDefaultCoords } from "@/lib/geo";
import { getDistanceKm } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import ShopCard from "@/components/ShopCard";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import RecentSearches from "@/components/RecentSearches";
import ShareSearch from "@/components/ShareSearch";
import ResultsMap from "@/components/ResultsMap";
import { getRecentSearches, addRecentSearch } from "@/lib/recentSearches";

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
  const [recentSearches, setRecentSearches] = useState([]);
  const [viewMode, setViewMode] = useState("list");

  // Sync URL -> state on mount and when URL changes
  useEffect(() => {
    setQuery(qFromUrl ?? "");
    setWithin(searchParams.get("within") ?? "");
    setSortBy(searchParams.get("sort") || "nearest");
  }, [qFromUrl, searchParams]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

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

  // Apply distance filter and use filtered count for display
  const filteredResults = useMemo(() => {
    if (!within) return results;
    const km = Number(within);
    if (!km) return results;
    return results.filter((shop) => shop.distanceKm != null && shop.distanceKm <= km);
  }, [results, within]);

  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    setError(false);
    const url = new URL(window.location.href);
    if (newQuery.trim()) url.searchParams.set("q", newQuery.trim());
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const updateFilters = useCallback((newWithin, newSort) => {
    setWithin(newWithin);
    setSortBy(newSort);
    const url = new URL(window.location.href);
    if (newWithin) url.searchParams.set("within", newWithin);
    else url.searchParams.delete("within");
    if (newSort && newSort !== "nearest") url.searchParams.set("sort", newSort);
    else url.searchParams.delete("sort");
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
      if (query.trim()) {
        addRecentSearch(query.trim());
        setRecentSearches(getRecentSearches());
      }
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, userLat, userLng, retryCount, sortBy]);

  return (
    <main className="container page-content" style={{ paddingBlock: "var(--space-10) var(--space-16)" }}>
      <header className="page-hero">
        <h1 className="page-title">Find it nearby</h1>
        <p className="page-desc">
          Search for smartphones at local shops. Find phones near you—see
          distance, call, or get directions.
        </p>
        {locationLoading && (
          <span className="page-location-hint" aria-live="polite">Getting your location…</span>
        )}
        {!locationLoading && !location && (
          <span className="page-location-hint">Using default area. Enable location for accurate distance.</span>
        )}
      </header>

      <div className="search-wrap">
        <SearchBar value={query} onChange={updateQuery} />
        <RecentSearches items={recentSearches} onSelect={updateQuery} />
      </div>

      {!loading && query.trim() && results.length > 0 && (
        <FilterBar
          within={within}
          sort={sortBy}
          onWithinChange={(v) => updateFilters(v, sortBy)}
          onSortChange={(v) => updateFilters(within, v)}
        />
      )}

      {loading && (
        <p className="results-status" aria-live="polite">Finding nearby shops…</p>
      )}
      {!loading && query.trim() && results.length > 0 && (
        <div className="results-status-row">
          <p className="results-status">
            {filteredResults.length} shop{filteredResults.length !== 1 ? "s" : ""} found for “{query}”
          {within && filteredResults.length !== results.length && ` (${results.length} total)`}
          </p>
          <ShareSearch />
        </div>
      )}

      {!error && !loading && filteredResults.length > 0 && (
        <div className="view-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "map" ? "active" : ""}`}
            onClick={() => setViewMode("map")}
          >
            Map
          </button>
        </div>
      )}

      {!error && !loading && filteredResults.length > 0 && viewMode === "map" && (
        <ResultsMap
          shops={filteredResults}
          centerLat={userLat}
          centerLng={userLng}
        />
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

      {!error && !loading && query.trim() && results.length > 0 && filteredResults.length === 0 && (
        <div className="results-list">
          <div className="empty-state">
            <p className="empty-state-title">No shops within {within} km</p>
            <p className="empty-state-desc">Try a wider distance or a different search.</p>
            <button type="button" onClick={() => updateFilters("", sortBy)} className="empty-state-chip" style={{ marginTop: "var(--space-4)" }}>
              Show all {results.length} shops
            </button>
          </div>
        </div>
      )}

      {!error && !loading && filteredResults.length > 0 && viewMode === "list" && (
        <ul className="results-list">
          {filteredResults.map((shop, index) => (
            <ShopCard key={shop.id} shop={shop} index={index} query={query} />
          ))}
        </ul>
      )}

      <section id="how-it-works" className="page-section">
        <h2 className="page-section-title">How it works</h2>
        <p className="page-section-text">
          Search for a smartphone. We show you local shops that have it, sorted
          by distance. Call them or open in Maps to get directions.
        </p>
      </section>
      <section id="about" className="page-section">
        <h2 className="page-section-title">About LoclStor</h2>
        <p className="page-section-text">
          LoclStor helps you find smartphones at nearby local shops. One search,
          multiple options—call or visit with a single tap.
        </p>
      </section>
    </main>
  );
}
