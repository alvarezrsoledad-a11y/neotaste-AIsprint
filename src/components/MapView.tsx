"use client";

import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MapTooltip } from "./MapTooltip";
import { MAP_PINS } from "@/data/pins";

interface MapViewProps {
  selectedPinId: number | null;
  onPinSelect: (id: number | null) => void;
}

export function MapView({ selectedPinId, onPinSelect }: MapViewProps) {
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const rootsRef       = useRef<Map<number, Root>>(new Map());

  // ── Initial map setup (runs once) ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      // Guard against Leaflet "already initialized" error during HMR / StrictMode
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((mapRef.current as any)._leaflet_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapRef.current as any)._leaflet_id = undefined;
      }

      const map = L.map(mapRef.current!, {
        center:             [52.508, 13.400],
        zoom:               12,
        zoomControl:        false,
        scrollWheelZoom:    false,
        doubleClickZoom:    false,
        dragging:           true,
        touchZoom:          false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom:    19,
      }).addTo(map);

      // Deselect when tapping the map background
      map.on("click", () => onPinSelect(null));

      // Create a marker for each pin
      MAP_PINS.forEach((pin) => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "position:relative;overflow:visible;background:transparent;border:none;width:50px;";

        const root = createRoot(wrapper);
        root.render(
          <MapTooltip
            type={pin.type}
            value={pin.value}
            avatarSrc={pin.tooltipAvatarSrc}
            selected={false}
          />
        );
        rootsRef.current.set(pin.id, root);

        const icon = L.divIcon({
          html:       wrapper,
          className:  "neotaste-pin",
          iconSize:   [50, 42],
          iconAnchor: [25, 42],
        });

        const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

        // Stop the click from bubbling to the map (which would deselect)
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onPinSelect(pin.id);
        });
      });

      setTimeout(() => map.invalidateSize(), 50);
      setTimeout(() => map.invalidateSize(), 300);

      mapInstanceRef.current = map;
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
    // onPinSelect is stable (useState setter), safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-render pin tooltips whenever selectedPinId changes ─────────────────
  useEffect(() => {
    rootsRef.current.forEach((root, id) => {
      const pin = MAP_PINS.find((p) => p.id === id);
      if (!pin) return;
      root.render(
        <MapTooltip
          type={pin.type}
          value={pin.value}
          avatarSrc={pin.tooltipAvatarSrc}
          selected={id === selectedPinId}
        />
      );
    });
  }, [selectedPinId]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
