"use client";

export default function RecentSearches({ items, onSelect }) {
  if (!items?.length) return null;
  return (
    <div className="recent-searches">
      <span className="recent-searches-label">Recent:</span>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="search-chip"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
