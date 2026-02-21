const KEY = "loclstor_recent_searches";
const MAX = 5;

export function getRecentSearches() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query) {
  const q = query?.trim();
  if (!q) return;
  const list = getRecentSearches().filter((item) => item.toLowerCase() !== q.toLowerCase());
  list.unshift(q);
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {}
}
