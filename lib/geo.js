/**
 * Browser geolocation with timeout and fallback.
 * Returns { lat, lng } or null if denied/unsupported/error.
 */
const DEFAULT_COORDS = { lat: 19.1197, lng: 72.879 }; // Andheri East – Marol
const TIMEOUT_MS = 5000;
const MAX_AGE_MS = 300000; // 5 min cache

export function getDefaultCoords() {
  return { ...DEFAULT_COORDS };
}

export function getCurrentPosition() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: TIMEOUT_MS, maximumAge: MAX_AGE_MS }
    );
  });
}
