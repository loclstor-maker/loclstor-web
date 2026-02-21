"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./ResultsMapInner"), { ssr: false });

export default function ResultsMap({ shops, centerLat, centerLng }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !shops?.length) return null;

  const lat = centerLat ?? 19.12;
  const lng = centerLng ?? 72.88;

  return (
    <div className="results-map-wrap">
      <MapInner shops={shops} centerLat={lat} centerLng={lng} />
    </div>
  );
}
