"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MapPin, type MapPinType } from "./MapPin";
import { MAP_PINS, type MapPin as MapPinData } from "@/data/pins";

interface MapViewProps {
  selectedPinId:  number | null;
  onPinSelect:    (id: number | null) => void;
  /** When provided, only pins with these ids are visible & interactive on the map. */
  visiblePinIds?: Set<number> | null;
  /** When the People filter is applied, forces all pins to render as the given variant. */
  peopleFilterTab?: "friends" | "neotasters" | null;
}

// Parse "+N" out of socialProof.names ("Mason and +73 visited" → 73)
function parseExtraFromNames(names?: string): number | undefined {
  if (!names) return undefined;
  const m = names.match(/\+(\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
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
export function MapView({ selectedPinId, onPinSelect, visiblePinIds, peopleFilterTab }: MapViewProps) {
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const rootsRef       = useRef<Map<number, Root>>(new Map());
  const markersRef     = useRef<Map<number, import("leaflet").Marker>>(new Map());
  const [markersReady, setMarkersReady] = useState(false);

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
        // All pin variants (including tiny) use a 32×32 wrapper.
        // The MapPin component positions tiny-default at (8,21) internally so
        // its geographic tip aligns with the shared anchor point (12,32).
        // overflow:visible (globals.css) lets rank tags bleed above the wrapper.
        const wrapper = document.createElement("div");
        wrapper.style.cssText =
          "position:relative;overflow:visible;background:transparent;border:none;width:32px;height:32px;";

        const root = createRoot(wrapper);
        rootsRef.current.set(pin.id, root);

        // Initial paint — the re-render effect will update on selection /
        // people-filter changes.
        root.render(
          <MapPin
            type={resolvePinType(pin)}
            state="default"
            rank={resolveRank(pin)}
            extraCount={pin.friendVisits?.[0]?.count}
            avatarUrl={pin.friendVisits?.[0]?.avatarUrl ?? pin.tooltipAvatarSrc}
          />
        );

        const icon = L.divIcon({
          html:       wrapper,
          className:  "neotaste-pin",
          iconSize:   [32, 32],
          iconAnchor: [12, 32],
        });

        const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);
        markersRef.current.set(pin.id, marker);

        // Stop click bubbling to the map (which would deselect)
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onPinSelect(pin.id);
        });
      });

      setTimeout(() => map.invalidateSize(), 50);
      setTimeout(() => map.invalidateSize(), 300);

      mapInstanceRef.current = map;
      setMarkersReady(true);
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
    // onPinSelect is stable (useState setter), safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-render pins whenever selection or people-filter tab changes ──────
  useEffect(() => {
    rootsRef.current.forEach((root, id) => {
      const pin = MAP_PINS.find((p) => p.id === id);
      if (!pin) return;

      // When the People filter is applied, force the variant + show avatar
      // and the additional-users badge (parsed from socialProof.names).
      let pinType  = resolvePinType(pin);
      let avatar:    string | undefined = pin.friendVisits?.[0]?.avatarUrl ?? pin.tooltipAvatarSrc;
      let extra:     number | undefined = pin.friendVisits?.[0]?.count;

      if (peopleFilterTab === "friends") {
        pinType = "friends";
        avatar  = pin.friendVisits?.[0]?.avatarUrl
                  ?? pin.restaurant.socialProof?.avatars?.[0]
                  ?? pin.tooltipAvatarSrc;
        extra   = pin.friendVisits?.[0]?.count ?? parseExtraFromNames(pin.restaurant.socialProof?.names);
      } else if (peopleFilterTab === "neotasters") {
        pinType = "neotaster";
        avatar  = pin.restaurant.socialProof?.avatars?.[0] ?? pin.tooltipAvatarSrc;
        extra   = parseExtraFromNames(pin.restaurant.socialProof?.names);
      }

      root.render(
        <MapPin
          type={pinType}
          state={id === selectedPinId ? "active" : "default"}
          rank={resolveRank(pin)}
          extraCount={extra}
          avatarUrl={avatar}
        />
      );
    });

    // Pan only if the active pin is hidden behind the RestaurantCard.
    // Card sits at bottom: TAB_BAR_H(82) + 12 = 94px from the container bottom.
    // Card height with social proof ≈ 196px  →  card top = 94 + 196 = 290px from bottom.
    if (selectedPinId !== null && mapInstanceRef.current) {
      const pin = MAP_PINS.find((p) => p.id === selectedPinId);
      if (pin) {
        const map                = mapInstanceRef.current;
        const mapH               = map.getSize().y;
        const CARD_TOP_FROM_BTOM = 290;                      // px from container bottom
        const CLEARANCE          = 16;                       // required gap above card top
        const cardTopY           = mapH - CARD_TOP_FROM_BTOM; // px from container top
        const maxAllowedPinY     = cardTopY - CLEARANCE;     // pin must be above this

        const pinPt = map.latLngToContainerPoint([pin.lat, pin.lng] as [number, number]);

        // Only pan when pin sits at or below the clearance line
        if (pinPt.y > maxAllowedPinY) {
          const deltaY = pinPt.y - maxAllowedPinY; // exact amount to pan down (content moves up)
          map.panBy([0, deltaY], { animate: true, duration: 0.4, easeLinearity: 0.5 });
        }
      }
    }
  }, [selectedPinId, peopleFilterTab, markersReady]);

  // ── Toggle marker visibility based on visiblePinIds ─────────────────────
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const visible = !visiblePinIds || visiblePinIds.has(id);
      const el = marker.getElement() as HTMLElement | undefined;
      if (el) {
        el.style.opacity        = visible ? "1" : "0";
        el.style.pointerEvents  = visible ? "auto" : "none";
        el.style.transition     = "opacity 0.25s ease";
      }
    });
  }, [visiblePinIds, markersReady]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
