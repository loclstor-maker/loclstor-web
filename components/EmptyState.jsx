export default function EmptyState({ query, onTry }) {
  const suggestions = ["iPhone", "Samsung", "OnePlus", "Pixel", "Charger"];
  
  return (
    <div className="empty-state">
      <p className="empty-state-title">No results for "{query}"</p>
      <p className="empty-state-desc">Try a different search term</p>
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
