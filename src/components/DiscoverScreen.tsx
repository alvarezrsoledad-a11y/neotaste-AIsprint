"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useCallback } from "react";
import { useScrollElevation } from "@/hooks/useScrollElevation";
import { RestaurantListItem } from "./RestaurantListItem";
import { RestaurantCard }     from "./RestaurantCard";
import { RestaurantListCard } from "./RestaurantListCard";
import { RestaurantDetailScreen, DealBookingSheet, BookingConfirmationScreen, type ConfirmedBooking, makeRef } from "./RestaurantDetailScreen";
import { PeopleFilterSheet, type PeopleFilters } from "./PeopleFilterSheet";
import { MAP_PINS } from "@/data/pins";
import { type DealEntry, getRestaurantDetail } from "@/data/restaurantDetails";
import { FRIENDS } from "@/data/people";

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
  { label: "People",      icon: "👥" },
  { label: "Filters",     icon: "⚙️" },
  { label: "Now",         icon: "🕐" },
  { label: "Cuisine",     icon: "🍽️" },
  { label: "Sort",        icon: "↕️" },
  { label: "Flash Deals", icon: "⚡" },
  { label: "Loyalty",     icon: "🏆" },
];

const TABS = [
  { label: "Home",     icon: "🏠",  active: false },
  { label: "Friends",  icon: "👥",  active: false },
  { label: "Discover", icon: "📍",  active: true  },
  { label: "Bookings", icon: "✓",   active: false },
  { label: "Profile",  icon: "👤",  active: false },
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeFilters, setActiveFilters]       = useState<PeopleFilters | null>(null);

  // ── Fix 4: List overlay swipe-to-dismiss state ───────────────────────────
  const [listOverlayDragY, setListOverlayDragY]     = useState(0);
  const listOverlayDragStartY = useRef<number | null>(null);
  const listOverlayDragStartT = useRef(0);

  // ── Fix 1: Scroll refs for elevation shadow ───────────────────────────────
  const listScrollRef  = useRef<HTMLDivElement>(null);
  const isHeaderElevated = useScrollElevation(listScrollRef);

  // ── Swipe gesture on bottom sheet drag handle ─────────────────────────────
  const dragStartY    = useRef<number | null>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);

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
    setTimeout(() => {
      setSelectedPinId(null);
      setCardClosing(false);
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

  return (
    <div
      className="relative bg-white overflow-hidden"
      style={{ width: "100vw", height: "100dvh" }}
    >
      {/* ── MAP (full bleed) ──────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <MapView
          selectedPinId={selectedPinId}
          onPinSelect={handlePinSelect}
        />
      </div>

      {/* ── SEARCH BAR + FILTER CHIPS (hidden when list overlay is open) ── */}
      {!listOverlayOpen && <div className="absolute left-4 right-4 z-40 flex flex-col gap-3" style={{ top: "env(safe-area-inset-top, 12px)", paddingTop: 8 }}>
        <div
          className="w-full h-12 bg-white rounded-full flex items-center gap-2 px-4"
          style={{ boxShadow: "0px 2px 7px rgba(67,67,67,0.25)" }}
        >
          <span className="text-base">🔍</span>
          <span
            className="text-base font-medium"
            style={{ color: "rgba(0,0,0,0.7)", fontFamily: "var(--font-poppins)" }}
          >
            Search deals &amp; more
          </span>
        </div>
        <div
          className="flex items-center gap-1 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.label === "People" ? () => setPeopleFilterOpen(true) : undefined}
              className="shrink-0 flex items-center gap-1 bg-white rounded-2xl px-3 py-2"
              style={{ boxShadow: "0px 2px 7px rgba(67,67,67,0.25)", fontFamily: "var(--font-poppins)" }}
            >
              <span className="text-[11px]">{chip.icon}</span>
              <span className="text-[14px] font-semibold text-[#0A0A0A] whitespace-nowrap">
                {chip.label}
              </span>
            </button>
          ))}
        </div>
      </div>}

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
          ➤
        </button>
      )}

      {/* ── LIST VIEW BUTTON (hidden when pin selected or sheet expanded) ─ */}
      {showFloatingButtons && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{ bottom: TAB_BAR_H + SHEET_PEEK_H + 16 }}
        >
          <button
            onClick={() => setListOverlayOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{
              background: "#11301D",
              color: "#FEFEFE",
              fontFamily: "var(--font-poppins)",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <span>☰</span>
            <span>List view</span>
          </button>
        </div>
      )}


      {/* ── RESTAURANT CARD (slides up when a pin is selected) ──────────── */}
      <div
        className="absolute left-4 right-4 z-35"
        style={{ bottom: TAB_BAR_H + 12, pointerEvents: cardVisible ? "auto" : "none" }}
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
            socialProof={{
              variant: selectedPin.restaurant.socialProof!.variant,
              quote:   selectedPin.restaurant.socialProof!.quote,
              names:   selectedPin.restaurant.socialProof!.names,
              avatars: selectedPin.restaurant.socialProof!.avatars,
            }}
            isExiting={cardClosing}
            onClose={handleCardClose}
            onViewDetail={() => { if (selectedPin) setDetailPinId(selectedPin.id); }}
            onBookDeal={(dealId) => {
              if (!selectedPin) return;
              const idx    = parseInt(dealId.split("-").pop() ?? "0", 10);
              const detail = getRestaurantDetail(selectedPin.id);
              const deal   = detail?.dealEntries[idx];
              if (deal && detail) setBookingDeal({
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
          // Sheet position / size — respects peek vs expanded mode
          ...(sheetMode === "peek"
            ? { bottom: TAB_BAR_H, height: SHEET_PEEK_H }
            : { top: SHEET_EXPANDED_TOP, bottom: TAB_BAR_H }),
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
        return (
          <div
            className="absolute inset-0 z-50"
            style={{
              transform: "translateX(0)",
              animation: "slideInFromRight 0.32s cubic-bezier(0.32, 0.72, 0, 1) both",
            }}
          >
            <RestaurantDetailScreen
              pin={detailPin}
              onClose={() => setDetailPinId(null)}
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

        {/* Pinned header: search bar + filter chips (Fix 1: elevation shadow) */}
        <div
          className="flex-none flex flex-col gap-3 px-4"
          style={{
            paddingTop:    8,
            paddingBottom: 8,
            boxShadow:     isHeaderElevated ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
            transition:    "box-shadow 0.2s ease",
          }}
        >
          <div
            className="w-full h-12 bg-white rounded-full flex items-center gap-2 px-4"
            style={{ boxShadow: "0px 2px 7px rgba(67,67,67,0.25)" }}
          >
            <span className="text-base">🔍</span>
            <span
              className="text-base font-medium"
              style={{ color: "rgba(0,0,0,0.7)", fontFamily: "var(--font-poppins)" }}
            >
              Search deals &amp; more
            </span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.label === "People" ? () => setPeopleFilterOpen(true) : undefined}
                className="shrink-0 flex items-center gap-1 bg-white rounded-2xl px-3 py-2"
                style={{ boxShadow: "0px 2px 7px rgba(67,67,67,0.25)", fontFamily: "var(--font-poppins)" }}
              >
                <span className="text-[11px]">{chip.icon}</span>
                <span className="text-[14px] font-semibold text-[#0A0A0A] whitespace-nowrap">{chip.label}</span>
              </button>
            ))}
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
                socialProof={{
                  variant: pin.restaurant.socialProof!.variant,
                  quote:   pin.restaurant.socialProof!.quote,
                  names:   pin.restaurant.socialProof!.names,
                  avatars: pin.restaurant.socialProof!.avatars,
                }}
                onViewDetail={() => {
                  // Keep overlay open — detail screen (z-50) covers it.
                  // Closing detail naturally reveals the list again (Fix 2).
                  setDetailPinId(pin.id);
                }}
                onBookDeal={(dealId) => {
                  const idx    = parseInt(dealId.split("-").pop() ?? "0", 10);
                  const detail = getRestaurantDetail(pin.id);
                  const deal   = detail?.dealEntries[idx];
                  if (deal && detail) setBookingDeal({
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
            <span>🗺️</span>
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* ── PEOPLE FILTER SHEET ─────────────────────────────────────── */}
      <PeopleFilterSheet
        isOpen={peopleFilterOpen}
        onClose={() => setPeopleFilterOpen(false)}
        onApply={(filters) => setActiveFilters(filters)}
        userHasFriends={FRIENDS.length > 0}
        friendCount={FRIENDS.length}
        neotasterCount={10000}
        resultCount={MAP_PINS.length}
      />

      {/* ── TAB BAR ───────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-40 flex items-start justify-around px-4 pt-3"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          paddingBottom: "max(24px, env(safe-area-inset-bottom))",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.label}
            className="flex flex-col items-center gap-0.5 relative px-2 py-1"
            onClick={() => {
              // Tapping any tab deselects pins and collapses sheet
              if (tab.label === "Discover") {
                setSelectedPinId(null);
                setSheetMode("peek");
              }
            }}
          >
            {tab.active && (
              <div className="absolute inset-0 rounded-full" style={{ background: "rgba(0,0,0,0.05)" }} />
            )}
            <span className="text-[22px] relative z-10 leading-none">{tab.icon}</span>
            <span
              className="text-[12px] font-semibold leading-4 relative z-10"
              style={{
                color: tab.active ? "#53F293" : "#737373",
                fontFamily: "var(--font-poppins)",
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
