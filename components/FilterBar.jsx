"use client";

const DISTANCE_OPTIONS = [
  { value: "", label: "Any distance" },
  { value: "2", label: "Within 2 km" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" },
];

const SORT_OPTIONS = [
  { value: "nearest", label: "Nearest first" },
  { value: "products", label: "Most models" },
];

const BRAND_OPTIONS = [
  { value: "", label: "All brands" },
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "oneplus", label: "OnePlus" },
  { value: "pixel", label: "Google Pixel" },
  { value: "xiaomi", label: "Xiaomi / Redmi" },
  { value: "realme", label: "realme" },
  { value: "vivo", label: "vivo" },
  { value: "oppo", label: "OPPO" },
  { value: "nothing", label: "Nothing" },
];

export default function FilterBar({
  within,
  sort,
  brand,
  only5g,
  onWithinChange,
  onSortChange,
  onBrandChange,
  onOnly5gChange,
}) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter and sort results">
      <div className="filter-group">
        <span className="filter-label">Distance</span>
        <select
          value={within}
          onChange={(e) => onWithinChange(e.target.value)}
          className="filter-select"
          aria-label="Filter by distance"
        >
          {DISTANCE_OPTIONS.map((opt) => (
            <option key={opt.value || "any"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <span className="filter-label">Brand</span>
        <select
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="filter-select"
          aria-label="Filter by brand"
        >
          {BRAND_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <span className="filter-label">Sort</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
          aria-label="Sort results"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <input
            type="checkbox"
            checked={only5g}
            onChange={(e) => onOnly5gChange(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          5G only
        </label>
      </div>
    </div>
  );
}
