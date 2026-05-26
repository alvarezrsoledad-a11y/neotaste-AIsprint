"use client";

import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MapPin, type MapPinType } from "./MapPin";
import { MAP_PINS, type MapPin as MapPinData } from "@/data/pins";

interface MapViewProps {
  selectedPinId: number | null;
  onPinSelect:   (id: number | null) => void;
}

// ── Pin-type mapping logic (lives here, not inside MapPin) ────────────────────
// Hierarchy: friends > plain(tiny) > everything else(default)
// neotaster: reserved for future "NeoTasters" filter — never shown by default
function resolvePinType(pin: MapPinData): MapPinType {
  if (pin.type === "plain")   return "tiny";
  if (pin.type === "friends") return "friends";
  return "default";
}

// Parse "#1" / "#2" / "#3" → 1 / 2 / 3. Anything outside 1–3 → undefined.
function resolveRank(pin: MapPinData): number | undefined {
  if (pin.type !== "ranking" || !pin.value) return undefined;
  const n = parseInt(pin.value.replace("#", ""), 10);
  return n >= 1 && n <= 3 ? n : undefined;
}

// ── Main component ─────────────────────────────────────────────────────────────
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

      MAP_PINS.forEach((pin) => {
        const pinType = resolvePinType(pin);

        // All pin variants (including tiny) use a 32×32 wrapper.
        // The MapPin component positions tiny-default at (8,21) internally so
        // its geographic tip aligns with the shared anchor point (12,32).
        // overflow:visible (globals.css) lets rank tags bleed above the wrapper.
        const wrapper = document.createElement("div");
        wrapper.style.cssText =
          "position:relative;overflow:visible;background:transparent;border:none;width:32px;height:32px;";

        const root = createRoot(wrapper);
        root.render(
          <MapPin
            type={pinType}
            state="default"
            rank={resolveRank(pin)}
            extraCount={pin.friendVisits?.[0]?.count}
            avatarUrl={pin.friendVisits?.[0]?.avatarUrl ?? pin.tooltipAvatarSrc}
          />
        );
        rootsRef.current.set(pin.id, root);

        const icon = L.divIcon({
          html:       wrapper,
          className:  "neotaste-pin",
          iconSize:   [32, 32],
          iconAnchor: [12, 32],
        });

        const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

        // Stop click bubbling to the map (which would deselect)
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

  // ── Re-render pins + pan map whenever selectedPinId changes ─────────────
  useEffect(() => {
    rootsRef.current.forEach((root, id) => {
      const pin = MAP_PINS.find((p) => p.id === id);
      if (!pin) return;
      const pinType = resolvePinType(pin);
      root.render(
        <MapPin
          type={pinType}
          state={id === selectedPinId ? "active" : "default"}
          rank={resolveRank(pin)}
          extraCount={pin.friendVisits?.[0]?.count}
          avatarUrl={pin.friendVisits?.[0]?.avatarUrl ?? pin.tooltipAvatarSrc}
        />
      );
    });

    // Smooth pan so the active pin is visible above the RestaurantCard
    if (selectedPinId !== null && mapInstanceRef.current) {
      const pin = MAP_PINS.find((p) => p.id === selectedPinId);
      if (pin) {
        const map = mapInstanceRef.current;
        // Visible map area above the card (~260px) + tab bar (82px) = 342px from bottom.
        // Center of visible area above card = (mapH - 342) / 2 from top.
        const CARD_AND_TAB   = 342;
        const mapH           = map.getSize().y;
        const visibleCenterY = (mapH - CARD_AND_TAB) / 2;
        const pinContainerPt = map.latLngToContainerPoint([pin.lat, pin.lng] as [number, number]);
        const deltaY         = pinContainerPt.y - visibleCenterY;
        if (Math.abs(deltaY) > 10) {
          map.panBy([0, deltaY], { animate: true, duration: 0.4, easeLinearity: 0.5 });
        }
      }
    }
  }, [selectedPinId]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
