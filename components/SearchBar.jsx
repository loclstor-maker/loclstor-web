"use client";

const POPULAR = ["iPhone", "Samsung", "AirPods", "Fast Charger"];

export default function SearchBar({ value, onChange, placeholder = "Search phone or accessory…", id = "search" }) {
  return (
    <div className="search-bar">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
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
