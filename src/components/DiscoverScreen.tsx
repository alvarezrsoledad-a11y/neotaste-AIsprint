"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useCallback, useMemo } from "react";
import { useScrollElevation } from "@/hooks/useScrollElevation";
import { RestaurantListItem } from "./RestaurantListItem";
import { RestaurantCard }     from "./RestaurantCard";
import { RestaurantListCard } from "./RestaurantListCard";
import { RestaurantDetailScreen, DealBookingSheet, BookingConfirmationScreen, type ConfirmedBooking, makeRef } from "./RestaurantDetailScreen";
import { PeopleFilterSheet, type PeopleFilters } from "./PeopleFilterSheet";
import { MAP_PINS } from "@/data/pins";
import { type DealEntry, getRestaurantDetail } from "@/data/restaurantDetails";
import { FRIENDS, NEOTASTERS } from "@/data/people";

// ── Leaflet is client-only ────────────────────────────────────────────────────
const MapView = dynamic(
  () => import("./MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#E8EBE4] flex items-center justify-center">
        <span className="text-sm font-medium text-[#737373]">Loading map…</span>
      </div>
    ),
  }
);

// ── Layout constants ──────────────────────────────────────────────────────────
const SCREEN_H        = 844;
const TAB_BAR_H       = 82;
const STATUS_BAR_H    = 48;
const SEARCH_BAR_H    = 48;
const FILTER_CHIPS_H  = 40;
const SEARCH_GAP      = 12; // gap-3 between search bar and chips
const SEARCH_TOP      = 44; // top-11 = 44px

// When expanded: sheet top = below status + search + chips + some breathing room
const CONTENT_AREA_TOP = STATUS_BAR_H + SEARCH_BAR_H + FILTER_CHIPS_H + SEARCH_GAP + SEARCH_TOP - 44 + 44 + 12; // ~162px
// Simpler: top-11 (44px) + h-12 (48px) + gap-3 (12px) + filter row (40px) + 8px = 152
const SHEET_EXPANDED_TOP = 152;

// When peeking: drag handle + one restaurant name only
const SHEET_PEEK_H   = 68;
const SHEET_PEEK_TOP = SCREEN_H - TAB_BAR_H - SHEET_PEEK_H; // 694

const FILTER_CHIPS = [
  { label: "People",      icon: "logo",               hasDropdown: false },
  { label: "Filters",     icon: "sliders",             hasDropdown: true  },
  { label: "Now",         icon: "clock",               hasDropdown: false },
  { label: "Cuisine",     icon: "utensils",            hasDropdown: true  },
  { label: "Sort",        icon: "arrow-up-arrow-down", hasDropdown: true  },
  { label: "Flash Deals", icon: "bolt",                hasDropdown: false },
  { label: "Loyalty",     icon: "trophy",              hasDropdown: false },
];

// ── Tab bar — inline SVG icons (paths extracted from Figma assets) ──────────
const TABS = [
  {
    label: "Home", active: false,
    viewBox: "0 0 21 22.5",
    paths: [{ d: "M0 9V22.5H7.5V16.5C7.5 14.8431 8.84315 13.5 10.5 13.5C12.1569 13.5 13.5 14.8431 13.5 16.5V22.5H21V9L10.5 0L0 9Z" }],
  },
  {
    label: "Friends", active: false,
    viewBox: "0 0 24 21",
    paths: [
      { d: "M12 3.75C12 5.82107 10.3211 7.5 8.25 7.5C6.17893 7.5 4.5 5.82107 4.5 3.75C4.5 1.67893 6.17893 0 8.25 0C10.3211 0 12 1.67893 12 3.75Z" },
      { d: "M4.5 10.5C2.01472 10.5 0 12.5147 0 15V21H12V10.5H4.5Z" },
      { d: "M19.5 10.5H15V21H24V15C24 12.5147 21.9853 10.5 19.5 10.5Z" },
      { d: "M18 7.5C19.6569 7.5 21 6.15685 21 4.5C21 2.84315 19.6569 1.5 18 1.5C16.3431 1.5 15 2.84315 15 4.5C15 6.15685 16.3431 7.5 18 7.5Z" },
    ],
  },
  {
    label: "Discover", active: true,
    viewBox: "0 0 18 24",
    paths: [{ d: "M2.06838 15.3355L9 24L15.9316 15.3355C17.2705 13.6618 18 11.5823 18 9.43898V9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9V9.43898C0 11.5823 0.729452 13.6618 2.06838 15.3355ZM9 12C10.6569 12 12 10.6569 12 9C12 7.34315 10.6569 6 9 6C7.34315 6 6 7.34315 6 9C6 10.6569 7.34315 12 9 12Z", fillRule: "evenodd" as const, clipRule: "evenodd" as const }],
  },
  {
    label: "Bookings", active: false,
    viewBox: "0 0 21 21",
    paths: [{ d: "M21 0H0V21H21V0ZM17.5607 7.06066L15.4393 4.93934L8.25 12.1287L5.56066 9.43934L3.43934 11.5607L8.25 16.3713L17.5607 7.06066Z", fillRule: "evenodd" as const, clipRule: "evenodd" as const }],
  },
  {
    label: "Profile", active: false,
    viewBox: "0 0 18 21",
    paths: [
      { d: "M9 9C11.4853 9 13.5 6.98528 13.5 4.5C13.5 2.01472 11.4853 0 9 0C6.51472 0 4.5 2.01472 4.5 4.5C4.5 6.98528 6.51472 9 9 9Z" },
      { d: "M18 16.5C18 14.0147 15.9853 12 13.5 12H4.5C2.01472 12 0 14.0147 0 16.5V21H18V16.5Z" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function DiscoverScreen() {
  const [selectedPinId, setSelectedPinId] = useState<number | null>(null);
  const [cardClosing, setCardClosing]     = useState(false);
  const [sheetMode, setSheetMode]         = useState<"peek" | "expanded">("peek");
  const [listOverlayOpen, setListOverlayOpen] = useState(false);
  const [detailPinId, setDetailPinId]     = useState<number | null>(null);
  const [bookingDeal, setBookingDeal]         = useState<{ deal: DealEntry; restaurantName: string; imageSrc: string; address: string; neighborhood: string; distance: string; lat: number; lng: number } | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);
  const [peopleFilterOpen, setPeopleFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters]       = useState<PeopleFilters | null>(null);

  // ── Fix 4: List overlay swipe-to-dismiss state ───────────────────────────
  const [listOverlayDragY, setListOverlayDragY]     = useState(0);
  const listOverlayDragStartY = useRef<number | null>(null);
  const listOverlayDragStartT = useRef(0);

  // ── Timer ref — prevents stale close-animation timer from nulling a new selection
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fix 1: Scroll refs for elevation shadow ───────────────────────────────
  const listScrollRef  = useRef<HTMLDivElement>(null);
  const isHeaderElevated = useScrollElevation(listScrollRef);

  // ── Swipe gesture on bottom sheet drag handle ─────────────────────────────
  const dragStartY    = useRef<number | null>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);

  // ── Card horizontal swipe (pin-to-pin navigation) ──────────────────────────
  const cardWrapperRef  = useRef<HTMLDivElement>(null);
  const swipeX0         = useRef<number | null>(null);
  const swipeY0         = useRef<number | null>(null);
  const swipeT0         = useRef(0);
  const swipeIsH        = useRef<boolean | null>(null); // null=undecided, true=H, false=V
  const swipeLiveX      = useRef(0);
  const swipeExitTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onHandlePointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHandlePointerUp = (e: React.PointerEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.clientY - dragStartY.current;
    if (delta < -40) setListOverlayOpen(true); // drag up → open overlay
    if (delta > 40)  setSheetMode("peek");
    dragStartY.current = null;
  };

  // ── Scroll-based collapse (drag down from top of list) ────────────────────
  const scrollDragStartY = useRef<number | null>(null);

  const onScrollAreaPointerDown = (e: React.PointerEvent) => {
    if (sheetMode !== "expanded") return;
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    if (scrollTop <= 2) {
      scrollDragStartY.current = e.clientY;
    }
  };

  const onScrollAreaPointerUp = (e: React.PointerEvent) => {
    if (scrollDragStartY.current === null) return;
    const delta = e.clientY - scrollDragStartY.current;
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    if (delta > 50 && scrollTop <= 2) {
      setSheetMode("peek");
    }
    scrollDragStartY.current = null;
  };

  // ── Fix 4: List overlay swipe-to-dismiss handlers ────────────────────────
  const onListOverlayPointerDown = (e: React.PointerEvent) => {
    listOverlayDragStartY.current = e.clientY;
    listOverlayDragStartT.current = Date.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onListOverlayPointerMove = (e: React.PointerEvent) => {
    if (listOverlayDragStartY.current === null) return;
    const dy = e.clientY - listOverlayDragStartY.current;
    if (dy > 0) setListOverlayDragY(dy);
  };

  const onListOverlayPointerUp = (e: React.PointerEvent) => {
    if (listOverlayDragStartY.current === null) return;
    const dy = e.clientY - listOverlayDragStartY.current;
    const dt = Math.max(Date.now() - listOverlayDragStartT.current, 1);
    const velocity = (dy / dt) * 1000; // px/s
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.3 : 250;
    if (dy > threshold || velocity > 500) {
      setListOverlayOpen(false);
    }
    setListOverlayDragY(0);
    listOverlayDragStartY.current = null;
  };

  // Scroll-area variant: only initiates drag when list is scrolled to top
  const listScrollDragStartY = useRef<number | null>(null);
  const listScrollDragStartT = useRef(0);

  const onListScrollPointerDown = (e: React.PointerEvent) => {
    if ((listScrollRef.current?.scrollTop ?? 0) <= 2) {
      listScrollDragStartY.current = e.clientY;
      listScrollDragStartT.current = Date.now();
    }
  };

  const onListScrollPointerMove = (e: React.PointerEvent) => {
    if (listScrollDragStartY.current === null) return;
    const dy = e.clientY - listScrollDragStartY.current;
    if (dy > 0) setListOverlayDragY(dy);
  };

  const onListScrollPointerUp = (e: React.PointerEvent) => {
    if (listScrollDragStartY.current === null) return;
    const dy = e.clientY - listScrollDragStartY.current;
    const dt = Math.max(Date.now() - listScrollDragStartT.current, 1);
    const velocity = (dy / dt) * 1000;
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.3 : 250;
    if (dy > threshold || velocity > 500) {
      setListOverlayOpen(false);
    }
    setListOverlayDragY(0);
    listScrollDragStartY.current = null;
  };

  // ── Pin selection callback (stable ref avoids re-creating MapView) ────────
  const handlePinSelect = useCallback((id: number | null) => {
    // Cancel any in-flight close animation so a fresh pin tap always wins.
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    // Cancel any in-flight swipe-exit animation.
    if (swipeExitTimer.current !== null) {
      clearTimeout(swipeExitTimer.current);
      swipeExitTimer.current = null;
    }
    if (cardWrapperRef.current) {
      cardWrapperRef.current.style.transition = "none";
      cardWrapperRef.current.style.transform  = "translateX(0)";
    }
    setCardClosing(false);
    setSelectedPinId(id);
    if (id !== null) {
      setSheetMode("peek");      // collapse sheet when card opens
      setListOverlayOpen(false); // close overlay when pin card opens
    }
  }, []);

  // Close card: animate out, then clear selection and restore sheet
  const handleCardClose = useCallback(() => {
    setCardClosing(true);
    if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setSelectedPinId(null);
      setCardClosing(false);
      closeTimerRef.current = null;
    }, 320);
  }, []);

  const selectedPin = selectedPinId
    ? MAP_PINS.find((p) => p.id === selectedPinId) ?? null
    : null;

  // Card is "in" when a pin is selected and we're not in the closing animation
  const cardVisible = selectedPinId !== null && !cardClosing;
  // Sheet is "in" when no pin is selected OR we're closing the card (sheet slides back in)
  const sheetIn = selectedPinId === null || cardClosing;

  // Show floating buttons only in default map mode (no pin selected, sheet peeking, overlay closed)
  const showFloatingButtons = selectedPinId === null && sheetMode === "peek" && !listOverlayOpen;

  const sheetTop = sheetMode === "expanded" ? SHEET_EXPANDED_TOP : SHEET_PEEK_TOP;

  // ── People-filter active state + map filtering (Fix 10) ─────────────────
  const peopleFilterActive = activeFilters !== null;

  // Number to show in the People-chip numeric badge: count of filter
  // categories actually configured (1 for tab + each non-empty section).
  const peopleFilterBadgeCount = activeFilters === null
    ? 0
    : 1 +
      (activeFilters.cuisines.length > 0 ? 1 : 0) +
      (activeFilters.searchAreaKm !== null ? 1 : 0) +
      (activeFilters.selectedPersonIds.length > 0 ? 1 : 0);

  // ── Filter logic — single source of truth shared by sheet + map ─────────
  // Rules:
  //   - If 1+ people are selected → visible = UNION of their visitedRestaurantIds.
  //     (Tab only determines which user pool we draw from; it does NOT restrict
  //     restaurants by socialProof.variant — Mason's 47 visited restaurants
  //     should all appear regardless of each pin's variant.)
  //   - If NO people are selected → fall back to restaurants whose
  //     socialProof.variant matches the active tab.
  //   - Cuisine + searchArea always intersect the result.
  const computeFilteredPinIds = useCallback((f: PeopleFilters): Set<number> => {
    const people = f.tab === "friends" ? FRIENDS : NEOTASTERS;
    let baseAllowed: Set<number>;
    if (f.selectedPersonIds.length > 0) {
      baseAllowed = new Set<number>();
      for (const pid of f.selectedPersonIds) {
        const p = people.find(x => x.id === pid);
        if (!p) continue;
        for (const rid of p.visitedRestaurantIds) baseAllowed.add(rid);
      }
    } else {
      baseAllowed = new Set<number>();
      for (const pin of MAP_PINS) {
        if (!pin.restaurant.socialProof || pin.restaurant.socialProof.variant === f.tab) {
          baseAllowed.add(pin.id);
        }
      }
    }

    const out = new Set<number>();
    for (const pin of MAP_PINS) {
      if (!baseAllowed.has(pin.id)) continue;

      if (f.cuisines.length > 0) {
        const cat = pin.restaurant.category.toLowerCase();
        if (!f.cuisines.some(c => cat.includes(c.toLowerCase()))) continue;
      }
      if (f.searchAreaKm !== null) {
        const d = parseFloat(pin.restaurant.distance);
        if (!isNaN(d) && d > f.searchAreaKm) continue;
      }
      out.add(pin.id);
    }
    return out;
  }, []);

  const visiblePinIds = useMemo<Set<number> | null>(() => {
    if (activeFilters === null) {
      // Default map: hide community/NeoTaster-only pins.
      // They surface only when "People → NeoTasters" filter is active (Fix 3).
      return new Set(MAP_PINS.filter(p => p.type !== "community").map(p => p.id));
    }
    return computeFilteredPinIds(activeFilters);
  }, [activeFilters, computeFilteredPinIds]);

  // Ordered list of visible pins — used for card swipe navigation.
  const visiblePinsOrdered = useMemo(
    () => MAP_PINS.filter(p => !visiblePinIds || visiblePinIds.has(p.id)),
    [visiblePinIds]
  );

  // Avatar of first selected person — overrides per-pin avatar on the map.
  const peopleFilterAvatarOverride = useMemo<string | null>(() => {
    if (!activeFilters || activeFilters.selectedPersonIds.length === 0) return null;
    const people = activeFilters.tab === "friends" ? FRIENDS : NEOTASTERS;
    const first = people.find(p => p.id === activeFilters.selectedPersonIds[0]);
    return first?.avatarUrl ?? null;
  }, [activeFilters]);

  // ── Card swipe handlers ───────────────────────────────────────────────────
  const onCardPointerDown = (e: React.PointerEvent) => {
    if (!selectedPin || swipeExitTimer.current !== null) return;
    swipeX0.current    = e.clientX;
    swipeY0.current    = e.clientY;
    swipeT0.current    = Date.now();
    swipeIsH.current   = null;
    swipeLiveX.current = 0;
  };

  const onCardPointerMove = (e: React.PointerEvent) => {
    if (swipeX0.current === null) return;
    const dx = e.clientX - swipeX0.current;
    const dy = e.clientY - (swipeY0.current ?? 0);
    if (swipeIsH.current === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      swipeIsH.current = Math.abs(dx) > Math.abs(dy);
      if (swipeIsH.current) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      else return;
    }
    if (!swipeIsH.current) return;
    const idx     = visiblePinsOrdered.findIndex(p => p.id === selectedPinId);
    const atStart = idx <= 0;
    const atEnd   = idx >= visiblePinsOrdered.length - 1;
    const clamped = dx < 0 && atEnd ? dx * 0.2 : dx > 0 && atStart ? dx * 0.2 : dx;
    swipeLiveX.current = clamped;
    if (cardWrapperRef.current) {
      cardWrapperRef.current.style.transition = "none";
      cardWrapperRef.current.style.transform  = `translateX(${clamped}px)`;
    }
  };

  const onCardPointerUp = (e: React.PointerEvent) => {
    if (swipeX0.current === null) return;
    const rawDx = e.clientX - swipeX0.current;
    const dt    = Math.max(Date.now() - swipeT0.current, 1);
    const vel   = rawDx / dt * 1000; // px/s
    const dx    = swipeLiveX.current;
    swipeX0.current  = null;
    swipeIsH.current = null;
    if (!selectedPin) return;
    const idx    = visiblePinsOrdered.findIndex(p => p.id === selectedPinId);
    const goNext = (dx < -50 || vel < -300) && idx < visiblePinsOrdered.length - 1;
    const goPrev = (dx > 50  || vel > 300)  && idx > 0;
    if (goNext || goPrev) {
      const screenW = typeof window !== "undefined" ? window.innerWidth : 390;
      const exitX   = goNext ? -screenW * 1.1 : screenW * 1.1;
      if (cardWrapperRef.current) {
        cardWrapperRef.current.style.transition = "transform 0.28s cubic-bezier(0.32,0,0.67,0)";
        cardWrapperRef.current.style.transform  = `translateX(${exitX}px)`;
      }
      const nextId = visiblePinsOrdered[goNext ? idx + 1 : idx - 1].id;
      swipeExitTimer.current = setTimeout(() => {
        swipeExitTimer.current = null;
        if (cardWrapperRef.current) {
          cardWrapperRef.current.style.transition = "none";
          cardWrapperRef.current.style.transform  = "translateX(0)";
        }
        handlePinSelect(nextId);
      }, 280);
    } else {
      if (cardWrapperRef.current) {
        cardWrapperRef.current.style.transition = "transform 0.28s cubic-bezier(0.34,1.3,0.64,1)";
        cardWrapperRef.current.style.transform  = "translateX(0)";
      }
    }
  };

  const onCardPointerCancel = () => {
    swipeX0.current  = null;
    swipeIsH.current = null;
    if (cardWrapperRef.current) {
      cardWrapperRef.current.style.transition = "transform 0.28s cubic-bezier(0.34,1.3,0.64,1)";
      cardWrapperRef.current.style.transform  = "translateX(0)";
    }
  };

  return (
    <div
      className="relative bg-white overflow-hidden"
      style={{ width: "100%", height: "100%" }}
    >
      {/* ── MAP (full bleed) ──────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <MapView
          selectedPinId={selectedPinId}
          onPinSelect={handlePinSelect}
          visiblePinIds={visiblePinIds}
          peopleFilterTab={activeFilters?.tab ?? null}
          peopleFilterAvatarOverride={peopleFilterAvatarOverride}
        />
      </div>

      {/* ── SEARCH BAR + FILTER CHIPS (hidden when list overlay is open) ── */}
      {!listOverlayOpen && (
        <div
          className="absolute left-4 right-4 z-40 flex flex-col"
          style={{ top: "env(safe-area-inset-top, 12px)", paddingTop: 8, gap: 16 }}
        >
          {/* Search bar */}
          <div
            style={{
              width: "100%", height: 48,
              background: "#FEFEFE", borderRadius: 32,
              boxShadow: "0px 2px 7px rgba(67,67,67,0.25)",
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 16px", boxSizing: "border-box",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/16px/magnifying-glass.svg" width={16} height={16} alt="" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 500, lineHeight: "24px", color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
              Search deals &amp; more
            </span>
          </div>
          {/* Filter chips — extra vertical padding so drop-shadows are not clipped */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", scrollbarWidth: "none", paddingTop: 6, paddingBottom: 6, marginTop: -6, marginBottom: -6, marginRight: -16 }}
          >
            {FILTER_CHIPS.map((chip) => {
              const isPeople = chip.label === "People";
              const isActive = isPeople && peopleFilterActive;
              return (
                <button
                  key={chip.label}
                  onClick={isPeople ? () => setPeopleFilterOpen(true) : undefined}
                  style={{
                    flexShrink: 0,
                    display: "inline-flex", alignItems: "center",
                    gap: chip.hasDropdown ? 8 : 4,
                    borderRadius: 16,
                    padding: "8px 12px",
                    background: isActive ? "#11301D" : "#FEFEFE",
                    boxShadow: "0px 2px 7px rgba(67,67,67,0.25)",
                    border: "none", cursor: "pointer",
                    fontFamily: "var(--font-poppins)",
                  }}
                >
                  {/* Icon + label group */}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/icons/12px/${chip.icon}.svg`}
                      width={chip.icon === "logo" ? 12 : 12}
                      height={chip.icon === "logo" ? 14 : 12}
                      alt=""
                      style={{ flexShrink: 0, filter: isActive ? "brightness(0) invert(1)" : "none" }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600, lineHeight: "18px", color: isActive ? "#FEFEFE" : "#0A0A0A", whiteSpace: "nowrap" }}>
                      {chip.label}
                    </span>
                  </span>
                  {/* Dropdown arrow */}
                  {chip.hasDropdown && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/assets/icons/12px/angle-down.svg"
                      width={12} height={12} alt=""
                      style={{ flexShrink: 0, filter: isActive ? "brightness(0) invert(1)" : "none" }}
                    />
                  )}
                  {/* Active badge count (People chip) */}
                  {isActive && peopleFilterBadgeCount > 0 && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 18, height: 18, padding: "0 5px", marginLeft: 2,
                      borderRadius: 9, background: "#53F293",
                      color: "#0A0A0A", fontSize: 11, fontWeight: 700, lineHeight: 1,
                    }}>
                      {peopleFilterBadgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LOCATION BUTTON (hidden when pin selected or sheet expanded) ── */}
      {showFloatingButtons && (
        <button
          className="absolute right-4 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl"
          style={{
            bottom: TAB_BAR_H + SHEET_PEEK_H + 16,
            boxShadow: "0px 2px 7px rgba(67,67,67,0.25)",
          }}
          aria-label="My location"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icons/20px/map-pin.svg" width={20} height={20} alt="" />
        </button>
      )}


      {/* ── RESTAURANT CARD (slides up when a pin is selected) ──────────── */}
      <div
        ref={cardWrapperRef}
        className="absolute left-4 right-4"
        style={{ bottom: TAB_BAR_H + 12, zIndex: 35, pointerEvents: cardVisible ? "auto" : "none", touchAction: "pan-y" }}
        onPointerDown={onCardPointerDown}
        onPointerMove={onCardPointerMove}
        onPointerUp={onCardPointerUp}
        onPointerCancel={onCardPointerCancel}
      >
        {selectedPin && (
          <RestaurantCard
            restaurantName={selectedPin.restaurant.name}
            rating={parseFloat(selectedPin.restaurant.rating)}
            reviewCount={parseInt(selectedPin.restaurant.reviewCount.replace(/[^0-9]/g, ""), 10) || 0}
            distanceKm={parseFloat(selectedPin.restaurant.distance)}
            cuisines={selectedPin.restaurant.category.split(", ")}
            imageUrl={selectedPin.restaurant.imageSrc}
            rank={selectedPin.type === "ranking" && selectedPin.value
              ? (parseInt(selectedPin.value.replace("#", ""), 10) || undefined)
              : undefined}
            deals={[
              { id: `${selectedPin.id}-0`, title: selectedPin.restaurant.deals[0] ?? "" },
              selectedPin.restaurant.deals[1]
                ? { id: `${selectedPin.id}-1`, title: selectedPin.restaurant.deals[1] }
                : undefined,
            ]}
            socialProof={(() => {
              const sp        = selectedPin.restaurant.socialProof!;
              const isDefault = selectedPin.type !== "friends" && (selectedPin.type !== "community" || activeFilters?.tab === "neotasters");
              const countMatch = isDefault ? sp.names.match(/\+(\d+) visited/) : null;
              return {
                // When a People filter is active, force the variant to match the
                // filter tab so the quote-box colour always agrees with the pin.
                variant: activeFilters?.tab ?? sp.variant,
                quote:   sp.quote,
                names:   countMatch ? `${countMatch[1]} visited` : sp.names,
                avatars: sp.avatars,
              };
            })()}
            isExiting={cardClosing}
            onClose={handleCardClose}
            onViewDetail={() => { if (selectedPin) setDetailPinId(selectedPin.id); }}
            onBookDeal={(dealId) => {
              if (!selectedPin) return;
              const idx    = parseInt(dealId.split("-").pop() ?? "0", 10);
              const detail = getRestaurantDetail(selectedPin.id);
              const deal   = detail.dealEntries[idx];
              if (deal) setBookingDeal({
                deal,
                restaurantName: selectedPin.restaurant.name,
                imageSrc:       selectedPin.restaurant.imageSrc,
                address:        detail.address,
                neighborhood:   detail.neighborhood,
                distance:       selectedPin.restaurant.distance,
                lat:            selectedPin.lat,
                lng:            selectedPin.lng,
              });
            }}
          />
        )}
      </div>

      {/* ── BOTTOM SHEET ──────────────────────────────────────────────────
           Always rendered. Slides down when card is active, up when card closes.
      ─────────────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 z-30 bg-white flex flex-col"
        style={{
          // Sheet position / size — extends to bottom:0 so the tab bar's
          // transparent outer area shows the sheet (white) not the map.
          ...(sheetMode === "peek"
            ? { bottom: 0, height: SHEET_PEEK_H + TAB_BAR_H }
            : { top: SHEET_EXPANDED_TOP, bottom: 0 }),
          borderRadius: sheetMode === "expanded" ? "0" : "24px 24px 0 0",
          boxShadow:    sheetMode === "expanded" ? "none" : "0px -5px 6px rgba(160,160,160,0.25)",
          overflow:     "hidden",
          // Slide in/out based on whether card is visible
          transform:  sheetIn ? "translateY(0)" : "translateY(110%)",
          transition: `transform 0.38s cubic-bezier(0.32, 0.72, 0, 1), height 0.32s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.32s ease`,
          pointerEvents: sheetIn ? "auto" : "none",
        }}
      >
          {/* ── Drag handle + single restaurant name snippet ──────── */}
          <div
            className="flex flex-col items-center gap-3 px-4 pt-2 pb-3 cursor-grab active:cursor-grabbing"
            onPointerDown={onHandlePointerDown}
            onPointerUp={onHandlePointerUp}
            style={{ touchAction: "none" }}
          >
            <div className="w-11 h-1 rounded-full bg-[rgba(0,0,0,0.1)]" />
            <p
              className="w-full text-[15px] font-semibold leading-[20px] text-[#0A0A0A] overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Browse all deals
            </p>
          </div>
        </div>

      {/* ── RESTAURANT DETAIL SCREEN (full-screen overlay) ───────────── */}
      {detailPinId !== null && (() => {
        const detailPin = MAP_PINS.find((p) => p.id === detailPinId);
        if (!detailPin) return null;
        // Override socialProof.variant to match the active People filter tab
        // so the detail-page quote box always agrees with the pin visual.
        const filterTab = activeFilters?.tab;
        const pinForDetail: typeof detailPin = filterTab && detailPin.restaurant.socialProof
          ? {
              ...detailPin,
              restaurant: {
                ...detailPin.restaurant,
                socialProof: { ...detailPin.restaurant.socialProof, variant: filterTab },
              },
            }
          : detailPin;
        return (
          <div
            className="absolute inset-0 z-50"
            style={{
              transform: "translateX(0)",
              animation: "slideInFromRight 0.32s cubic-bezier(0.32, 0.72, 0, 1) both",
            }}
          >
            <RestaurantDetailScreen
              pin={pinForDetail}
              onClose={() => setDetailPinId(null)}
              filterTab={filterTab}
            />
          </div>
        );
      })()}

      {/* ── DEAL BOOKING SHEET (from RestaurantCard CTA) ─────────────── */}
      {bookingDeal && (
        <div className="absolute inset-0 z-50">
          <DealBookingSheet
            deal={bookingDeal.deal}
            restaurantName={bookingDeal.restaurantName}
            onClose={() => setBookingDeal(null)}
            onConfirm={(slot) => {
              setConfirmedBooking({
                deal:         bookingDeal.deal,
                slot,
                restaurantName: bookingDeal.restaurantName,
                imageSrc:     bookingDeal.imageSrc,
                ref:          makeRef(),
                address:      bookingDeal.address,
                neighborhood: bookingDeal.neighborhood,
                distance:     bookingDeal.distance,
                lat:          bookingDeal.lat,
                lng:          bookingDeal.lng,
              });
              setBookingDeal(null);
            }}
          />
        </div>
      )}

      {confirmedBooking && (
        <div className="absolute inset-0 z-50">
          <BookingConfirmationScreen
            booking={confirmedBooking}
            onDone={() => setConfirmedBooking(null)}
          />
        </div>
      )}

      {/* ── LIST VIEW OVERLAY ────────────────────────────────────────────
           Always mounted; slides in/out via CSS transition.
           z-39: sits above map/sheet/card, below tab bar (z-40).
      ─────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-white flex flex-col"
        style={{
          zIndex:        39,
          // During drag: follow finger; otherwise spring in/out
          transform:     listOverlayDragY > 0
                           ? `translateY(${listOverlayDragY}px)`
                           : listOverlayOpen ? "translateY(0)" : "translateY(100%)",
          transition:    listOverlayDragY > 0
                           ? "none"
                           : "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
          pointerEvents: listOverlayOpen ? "auto" : "none",
          willChange:    "transform",
        }}
      >
        {/* ── Drag handle (Fix 4: swipe-to-dismiss) ─────────────────────── */}
        <div
          className="flex-none flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onPointerDown={onListOverlayPointerDown}
          onPointerMove={onListOverlayPointerMove}
          onPointerUp={onListOverlayPointerUp}
        >
          <div className="w-11 h-1 rounded-full bg-[rgba(0,0,0,0.1)]" />
        </div>

        {/* Pinned header: search bar + filter chips */}
        <div
          style={{
            flexShrink: 0,
            display: "flex", flexDirection: "column", gap: 16,
            padding: "8px 16px",
            boxShadow: isHeaderElevated ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
            transition: "box-shadow 0.2s ease",
          }}
        >
          {/* Search bar */}
          <div
            style={{
              width: "100%", height: 48,
              background: "#FEFEFE", borderRadius: 32,
              boxShadow: "0px 2px 7px rgba(67,67,67,0.25)",
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 16px", boxSizing: "border-box",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/16px/magnifying-glass.svg" width={16} height={16} alt="" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 500, lineHeight: "24px", color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
              Search deals &amp; more
            </span>
          </div>
          {/* Filter chips */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", scrollbarWidth: "none", paddingTop: 6, paddingBottom: 6, marginTop: -6, marginBottom: -6, marginRight: -16 }}
          >
            {FILTER_CHIPS.map((chip) => {
              const isPeople = chip.label === "People";
              const isActive = isPeople && peopleFilterActive;
              return (
                <button
                  key={chip.label}
                  onClick={isPeople ? () => setPeopleFilterOpen(true) : undefined}
                  style={{
                    flexShrink: 0,
                    display: "inline-flex", alignItems: "center",
                    gap: chip.hasDropdown ? 8 : 4,
                    borderRadius: 16,
                    padding: "8px 12px",
                    background: isActive ? "#11301D" : "#FEFEFE",
                    boxShadow: "0px 2px 7px rgba(67,67,67,0.25)",
                    border: "none", cursor: "pointer",
                    fontFamily: "var(--font-poppins)",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/icons/12px/${chip.icon}.svg`}
                      width={12}
                      height={chip.icon === "logo" ? 14 : 12}
                      alt=""
                      style={{ flexShrink: 0, filter: isActive ? "brightness(0) invert(1)" : "none" }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600, lineHeight: "18px", color: isActive ? "#FEFEFE" : "#0A0A0A", whiteSpace: "nowrap" }}>
                      {chip.label}
                    </span>
                  </span>
                  {chip.hasDropdown && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/assets/icons/12px/angle-down.svg"
                      width={12} height={12} alt=""
                      style={{ flexShrink: 0, filter: isActive ? "brightness(0) invert(1)" : "none" }}
                    />
                  )}
                  {isActive && peopleFilterBadgeCount > 0 && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 18, height: 18, padding: "0 5px", marginLeft: 2,
                      borderRadius: 9, background: "#53F293",
                      color: "#0A0A0A", fontSize: 11, fontWeight: 700, lineHeight: 1,
                    }}>
                      {peopleFilterBadgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable restaurant list (Fix 1: elevation ref; Fix 4: scroll-drag dismiss) */}
        <div
          ref={listScrollRef}
          className="flex-1 min-h-0 overflow-y-auto"
          style={{ touchAction: "pan-y" }}
          onPointerDown={onListScrollPointerDown}
          onPointerMove={onListScrollPointerMove}
          onPointerUp={onListScrollPointerUp}
        >
          <div className="px-4">
            {MAP_PINS.map((pin) => (
              <RestaurantListCard
                key={pin.id}
                restaurantName={pin.restaurant.name}
                rating={parseFloat(pin.restaurant.rating)}
                reviewCount={parseInt(pin.restaurant.reviewCount.replace(/[^0-9]/g, ""), 10) || 0}
                distanceKm={parseFloat(pin.restaurant.distance)}
                cuisines={pin.restaurant.category.split(", ")}
                imageUrl={pin.restaurant.imageSrc}
                rank={
                  pin.type === "ranking" && pin.value
                    ? (parseInt(pin.value.replace("#", ""), 10) || undefined)
                    : undefined
                }
                deals={[
                  { id: `${pin.id}-0`, title: pin.restaurant.deals[0] ?? "" },
                  pin.restaurant.deals[1]
                    ? { id: `${pin.id}-1`, title: pin.restaurant.deals[1] }
                    : undefined,
                ]}
                socialProof={(() => {
                  const sp        = pin.restaurant.socialProof!;
                  const isDefault = pin.type !== "friends" && (pin.type !== "community" || activeFilters?.tab === "neotasters");
                  const countMatch = isDefault ? sp.names.match(/\+(\d+) visited/) : null;
                  return {
                    // Same filter-tab override as the floating card.
                    variant: activeFilters?.tab ?? sp.variant,
                    quote:   sp.quote,
                    names:   countMatch ? `${countMatch[1]} visited` : sp.names,
                    avatars: sp.avatars,
                  };
                })()}
                onViewDetail={() => {
                  // Keep overlay open — detail screen (z-50) covers it.
                  // Closing detail naturally reveals the list again (Fix 2).
                  setDetailPinId(pin.id);
                }}
                onBookDeal={(dealId) => {
                  const idx    = parseInt(dealId.split("-").pop() ?? "0", 10);
                  const detail = getRestaurantDetail(pin.id);
                  const deal   = detail.dealEntries[idx];
                  if (deal) setBookingDeal({
                    deal,
                    restaurantName: pin.restaurant.name,
                    imageSrc:       pin.restaurant.imageSrc,
                    address:        detail.address,
                    neighborhood:   detail.neighborhood,
                    distance:       pin.restaurant.distance,
                    lat:            pin.lat,
                    lng:            pin.lng,
                  });
                }}
              />
            ))}
            {/* Spacer so last card clears Map button + tab bar */}
            <div style={{ height: TAB_BAR_H + 72 }} />
          </div>
        </div>

        {/* Map button — above tab bar */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: TAB_BAR_H + 16, zIndex: 1 }}
        >
          <button
            onClick={() => setListOverlayOpen(false)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{
              background: "#11301D",
              color:      "#FEFEFE",
              fontFamily: "var(--font-poppins)",
              fontSize:   16,
              fontWeight: 600,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/20px/map.svg" width={20} height={20} alt="" style={{ filter: "brightness(0) invert(1)" }} />
            <span>Map view</span>
          </button>
        </div>
      </div>

      {/* ── PEOPLE FILTER SHEET ─────────────────────────────────────── */}
      <PeopleFilterSheet
        isOpen={peopleFilterOpen}
        onClose={() => setPeopleFilterOpen(false)}
        onApply={(filters) => setActiveFilters(filters)}
        onReset={() => setActiveFilters(null)}
        initialFilters={activeFilters}
        userHasFriends={FRIENDS.length > 0}
        friendCount={FRIENDS.length}
        neotasterCount={10000}
        resultCount={MAP_PINS.length}
        computeResultCount={(draft) => computeFilteredPinIds(draft).size}
      />

      {/* ── TAB BAR ───────────────────────────────────────────────────── */}
      {/* ── TAB BAR (rebuilt from scratch) ────────────────────────────── */}
      {/*
        Outer wrapper: transparent gradient bg + progressive blur (0→4px top→bottom).
        z-40 sits above sheet (z-30), card (z-35), search (z-40 same level), below
        detail/filter screens (z-50).
      */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 40,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 100%)",
          paddingTop: 16,
          paddingBottom: "max(25px, env(safe-area-inset-bottom))",
          paddingLeft: 25,
          paddingRight: 25,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {/* Progressive blur layer (0→4px, top→bottom) on outer container */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          pointerEvents: "none",
        }} />

        {/*
          Pill — Figma layer stack (bottom to top):
            1. Solid #FFFFFF base  ← blocks map bleed-through on all screens
            2. rgba(255,255,255,0.5) secondary overlay
            3. #333333 color-dodge
            4. rgba(0,0,0,0.04) hard-light + backdrop-blur(20px) glass shimmer
        */}
        <div style={{
          flex: "1 0 0",
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          borderRadius: 296,
          overflow: "hidden",
          padding: 4,
          // Layer 1: solid white — Figma: linear-gradient(90deg,#FFF,#FFF)
          // This is the critical opaque base; nothing behind it bleeds through.
          background: "#FFFFFF",
        }}>
          {/* Layer 2: rgba(255,255,255,0.5) secondary overlay */}
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            background: "rgba(255,255,255,0.5)",
            pointerEvents: "none",
          }} />
          {/* Layer 3: #333333 · color-dodge */}
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            background: "#333333",
            mixBlendMode: "color-dodge",
            pointerEvents: "none",
          }} />
          {/* Layer 4: backdrop-blur(20px) + rgba(0,0,0,0.04) · hard-light */}
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(0,0,0,0.04)",
            mixBlendMode: "hard-light",
            pointerEvents: "none",
          }} />

          {/* Tab buttons */}
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => {
                if (tab.label === "Discover") {
                  setSelectedPinId(null);
                  setSheetMode("peek");
                }
              }}
              style={{
                flex: "1 0 0", minWidth: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 1,
                position: "relative",
                padding: "6px 8px 7px",
                marginRight: i < TABS.length - 1 ? -5.5 : 0,
                background: "none", border: "none", cursor: "pointer",
                opacity: tab.active ? 1 : 0.5,
                zIndex: tab.active ? 2 : 1,
              }}
            >
              {/* Active indicator pill: full height, 72.4px wide, centred on tab */}
              {tab.active && (
                <div style={{
                  position: "absolute", top: 0, bottom: 0,
                  left: "calc(50% + 0.2px)", transform: "translateX(-50%)",
                  width: 72.4, borderRadius: 100,
                  background: "rgba(0,0,0,0.05)",
                  zIndex: 0,
                }} />
              )}

              {/* Icon: 24×24, inside a 28px-tall centring container */}
              <div style={{
                height: 28, width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", zIndex: 1, flexShrink: 0,
              }}>
                <svg
                  width={24} height={24}
                  viewBox={tab.viewBox}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: "block", flexShrink: 0 }}
                  aria-hidden
                >
                  {tab.paths.map((p, pi) => (
                    <path
                      key={pi}
                      d={p.d}
                      fill="#0A0A0A"
                      fillRule={"fillRule" in p ? p.fillRule : undefined}
                      clipRule={"clipRule" in p ? p.clipRule : undefined}
                    />
                  ))}
                </svg>
              </div>

              {/* Label: Poppins Medium 10px */}
              <span style={{
                fontFamily: "var(--font-poppins)",
                fontSize: 10, fontWeight: 500, lineHeight: "12px",
                color: "#0A0A0A", textAlign: "center",
                width: "100%", position: "relative", zIndex: 1, flexShrink: 0,
              }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
