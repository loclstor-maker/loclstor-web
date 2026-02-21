"use client";

export default function EmptyState({ query, onTry }) {
  const suggestions = ["Laptop", "Groceries", "Medicines", "iPhone"].filter((s) => s !== query);
  return (
    <div className="empty-state">
      <p className="empty-state-title">No shops found for “{query}”</p>
      <p className="empty-state-desc">Try a different search or one of these:</p>
      <div className="empty-state-chips">
        {suggestions.slice(0, 3).map((item) => (
          <button key={item} type="button" onClick={() => onTry(item)} className="empty-state-chip">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
