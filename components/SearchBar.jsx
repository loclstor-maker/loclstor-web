"use client";

const POPULAR = ["iPhone", "Samsung", "AirPods", "Fast Charger"];

function SearchIcon() {
  return (
    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function SearchBar({ value, onChange, placeholder = "Search phone or accessory…", id = "search" }) {
  return (
    <div className="search-bar">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <div className="search-input-wrap">
        <SearchIcon />
        <input
          id={id}
          type="search"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          aria-describedby="popular-searches"
        />
      </div>
      <p id="popular-searches" className="search-popular-label">
        Popular:{" "}
        {POPULAR.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className="search-chip"
          >
            {item}
          </button>
        ))}
      </p>
    </div>
  );
}
