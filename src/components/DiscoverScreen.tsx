"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useCallback } from "react";
import { RestaurantListItem } from "./RestaurantListItem";
import { PinDetailCard } from "./PinDetailCard";
import { RestaurantDetailScreen } from "./RestaurantDetailScreen";
import { MAP_PINS } from "@/data/pins";

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

// When peeking: sheet top = 844 - 82 - 196 = 566
const SHEET_PEEK_H   = 196;
const SHEET_PEEK_TOP = SCREEN_H - TAB_BAR_H - SHEET_PEEK_H; // 566

const FILTER_CHIPS = [
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
  const [sheetMode, setSheetMode]         = useState<"peek" | "expanded">("peek");
  const [detailPinId, setDetailPinId]     = useState<number | null>(null);

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
    if (delta < -40) setSheetMode("expanded");
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

  // ── Pin selection callback (stable ref avoids re-creating MapView) ────────
  const handlePinSelect = useCallback((id: number | null) => {
    setSelectedPinId(id);
    if (id !== null) setSheetMode("peek"); // collapse sheet when pin opens
  }, []);

  const selectedPin = selectedPinId
    ? MAP_PINS.find((p) => p.id === selectedPinId) ?? null
    : null;

  // Show floating buttons only in default map mode (no pin selected, sheet peeking)
  const showFloatingButtons = selectedPinId === null && sheetMode === "peek";

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

      {/* ── SEARCH BAR + FILTER CHIPS ─────────────────────────────────── */}
      <div className="absolute left-4 right-4 z-40 flex flex-col gap-3" style={{ top: "env(safe-area-inset-top, 12px)", paddingTop: 8 }}>
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
      </div>

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
          style={{ bottom: TAB_BAR_H + SHEET_PEEK_H + 12 }}
        >
          <button
            onClick={() => setSheetMode("expanded")}
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

      {/* ── MAP BUTTON (visible when sheet is expanded) ───────────────── */}
      {sheetMode === "expanded" && selectedPinId === null && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-40"
          style={{ bottom: TAB_BAR_H + 16 }}
        >
          <button
            onClick={() => setSheetMode("peek")}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{
              background: "#11301D",
              color: "#FEFEFE",
              fontFamily: "var(--font-poppins)",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <span>🗺️</span>
            <span>Map</span>
          </button>
        </div>
      )}

      {/* ── PIN DETAIL CARD (shown when a pin is selected) ────────────── */}
      {selectedPin && (
        <div
          className="absolute left-4 right-4 z-35"
          style={{ bottom: TAB_BAR_H + 12 }}
        >
          <PinDetailCard
            restaurant={selectedPin.restaurant}
            pinType={selectedPin.type}
            pinValue={selectedPin.value}
            onClose={() => setSelectedPinId(null)}
            onViewDetail={() => setDetailPinId(selectedPin.id)}
          />
        </div>
      )}

      {/* ── BOTTOM SHEET (hidden when pin selected) ───────────────────── */}
      {selectedPinId === null && (
        <div
          className="absolute left-0 right-0 z-30 bg-white flex flex-col"
          style={{
            top:          sheetTop,
            bottom:       TAB_BAR_H,
            borderRadius: sheetMode === "expanded" ? "0" : "24px 24px 0 0",
            boxShadow:    sheetMode === "expanded" ? "none" : "0px -5px 6px rgba(160,160,160,0.25)",
            transition:   "top 0.32s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.32s ease, box-shadow 0.32s ease",
            overflow:     "hidden",
          }}
        >
          {/* ── Drag handle area (always visible at top of sheet) ──── */}
          <div
            className="flex-none flex flex-col items-center gap-3 px-4 pt-2 pb-0 cursor-grab active:cursor-grabbing"
            onPointerDown={onHandlePointerDown}
            onPointerUp={onHandlePointerUp}
            style={{ touchAction: "none" }}
          >
            <div className="w-11 h-1 rounded-full bg-[rgba(0,0,0,0.1)]" />
            {sheetMode === "peek" && (
              <h2
                className="text-[20px] font-bold leading-[26px] text-[#0A0A0A] w-full"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Browse all deals
              </h2>
            )}
          </div>

          {/* ── Scrollable restaurant list ────────────────────────── */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto"
            onPointerDown={onScrollAreaPointerDown}
            onPointerUp={onScrollAreaPointerUp}
            style={{ touchAction: "pan-y" }}
          >
            <div className="px-4 pt-3 pb-24 flex flex-col">
              {MAP_PINS.map((pin, i) => (
                <div key={pin.id}>
                  <RestaurantListItem
                    restaurant={pin.restaurant}
                    onViewDetail={() => setDetailPinId(pin.id)}
                  />
                  {i < MAP_PINS.length - 1 && (
                    <div className="h-px bg-[rgba(0,0,0,0.1)] my-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
