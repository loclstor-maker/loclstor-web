"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

function FitBounds({ shops }) {
  const map = useMap();
  const withCoords = shops.filter((s) => s.lat != null && s.lng != null);
  if (withCoords.length === 0) return null;
  const bounds = L.latLngBounds(withCoords.map((s) => [s.lat, s.lng]));
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  return null;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function ResultsMapInner({ shops, centerLat, centerLng }) {
  const withCoords = shops.filter((s) => s.lat != null && s.lng != null);
  if (withCoords.length === 0) return <div className="results-map-empty">No locations to show on map.</div>;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={12}
      className="results-map"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds shops={withCoords} />
      {withCoords.map((shop) => (
        <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={defaultIcon}>
          <Popup>
            <strong>{shop.name}</strong>
            <br />
            {shop.area}
            <br />
            <a href={`tel:${shop.phone}`}>{shop.phone}</a>
            <br />
            <Link href={`/shops/${shop.id}`}>View shop</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
