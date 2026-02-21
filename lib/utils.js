/**
 * Haversine distance in km. Returns null if coords missing.
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  if (lat2 == null || lng2 == null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function mapsUrl(lat, lng, label = "") {
  if (lat != null && lng != null) {
    return `https://www.google.com/maps?q=${lat},${lng}${label ? `&query=${encodeURIComponent(label)}` : ""}`;
  }
  return null;
}
