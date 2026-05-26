"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { type MapPin, MAP_PINS } from "@/data/pins";
import { type DealEntry, type Review, getRestaurantDetail } from "@/data/restaurantDetails";

// ── Layout constants ──────────────────────────────────────────────────────────
const HERO_H      = 280;
const BTN_ROW_H   = 52;   // back button row (doubles as name bar when past hero)
const TABBAR_H    = 44;   // tabs row
const FIXED_H     = BTN_ROW_H + TABBAR_H; // 96 px (no fake status bar)
const HERO_SCROLL = HERO_H - BTN_ROW_H;   // ≈228 px — when hero scrolls away

type TabKey = "overview" | "reviews" | "about";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  pin:             MapPin;
  onClose:         () => void;
  initialDealIdx?: number;
}

// ── Tiny helpers ──────────────────────────────────────────────────────────────
function StarRow({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: size, color: i < count ? "#53F293" : "rgba(0,0,0,0.15)", lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}

function getSimilarRestaurants(current: MapPin, count = 4): MapPin[] {
  const mainCategory = current.restaurant.category.split(",")[0].trim().toLowerCase();
  const same  = MAP_PINS.filter(p => p.id !== current.id && p.restaurant.category.toLowerCase().includes(mainCategory));
  const other = MAP_PINS.filter(p => p.id !== current.id && !same.find(s => s.id === p.id));
  return [...same, ...other].slice(0, count);
}

// ── Deal card (ticket style) ──────────────────────────────────────────────────
function DealCard({ deal, onBook }: { deal: DealEntry; onBook: () => void }) {
  return (
    <div style={{ position: "relative", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16, background: "#fff", overflow: "visible", marginBottom: 12 }}>
      <div style={{ padding: "16px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          {deal.isFlash && <span style={{ fontSize: 14, color: "#53F293" }}>⚡</span>}
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 700, color: "#0A0A0A", lineHeight: 1.2 }}>{deal.title}</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {[`🎁 ${deal.avgSpend}`, `🔄 ${deal.validity}`].map(chip => (
            <span key={chip} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(0,0,0,0.05)", fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#525252" }}>{chip}</span>
          ))}
        </div>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, color: "#737373", lineHeight: 1.5, margin: 0 }}>{deal.description}</p>
      </div>
      {/* ticket tear */}
      <div style={{ position: "relative", height: 1, margin: "0 8px" }}>
        <div style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", left: -13, top: -5, zIndex: 1 }} />
        <div style={{ borderTop: "1px dashed rgba(0,0,0,0.12)" }} />
        <div style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", right: -13, top: -5, zIndex: 1 }} />
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <button
          onClick={onBook}
          style={{ width: "100%", height: 44, borderRadius: 12, background: "#11301D", color: "#FEFEFE", fontFamily: "var(--font-poppins)", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          Book deal
          <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>{deal.available} left</span>
        </button>
      </div>
    </div>
  );
}

// ── Deal booking bottom sheet ─────────────────────────────────────────────────
const TODAY_SLOTS = [
  { label: "TODAY",    time: "12:00 – 15:00", deals: 5 },
  { label: "TODAY",    time: "15:00 – 18:00", deals: 3 },
  { label: "TOMORROW", time: "12:00 – 19:00", deals: 7 },
];

interface DealBookingSheetProps {
  deal: DealEntry;
  restaurantName: string;
  onClose: () => void;
  onConfirm: (slot: string) => void;
}

function DealBookingSheet({ deal, restaurantName, onClose, onConfirm }: DealBookingSheetProps) {
  const [selectedSlot, setSelectedSlot] = useState(0);

  return (
    <>
      {/* Dim backdrop */}
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 60 }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: "#fff", borderRadius: "24px 24px 0 0",
          zIndex: 61, padding: "12px 16px",
          paddingBottom: "max(36px, env(safe-area-inset-bottom))",
          animation: "slideInFromBottom 0.3s cubic-bezier(0.32,0.72,0,1) both",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Restaurant name */}
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 500, color: "#737373", margin: "0 0 4px" }}>{restaurantName}</p>

        {/* Deal title + chips */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            {deal.isFlash && <span style={{ fontSize: 14, color: "#53F293" }}>⚡</span>}
            <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: 20, fontWeight: 700, color: "#0A0A0A", margin: 0, lineHeight: 1.25 }}>{deal.title}</h3>
          </div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, color: "#737373", margin: "0 0 10px", lineHeight: 1.5 }}>{deal.description}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[`🎁 ${deal.avgSpend}`, `🔄 ${deal.validity}`].map(chip => (
              <span key={chip} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "rgba(0,0,0,0.05)", fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#525252" }}>{chip}</span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(0,0,0,0.08)", marginBottom: 20 }} />

        {/* Time slots grouped by day */}
        {(["TODAY", "TOMORROW"] as const).map(day => {
          const slots = TODAY_SLOTS.filter(s => s.label === day);
          return (
            <div key={day} style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: 11, fontWeight: 700, color: "#737373", letterSpacing: "0.06em", margin: "0 0 8px" }}>{day}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {slots.map((slot) => {
                  const idx = TODAY_SLOTS.indexOf(slot);
                  const isSelected = selectedSlot === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(idx)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                        borderRadius: 16, border: `2px solid ${isSelected ? "#11301D" : "rgba(0,0,0,0.08)"}`,
                        background: isSelected ? "rgba(17,48,29,0.04)" : "#fff",
                        cursor: "pointer", width: "100%", textAlign: "left",
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${isSelected ? "#11301D" : "rgba(0,0,0,0.2)"}`,
                        background: isSelected ? "#11301D" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 500, color: "#0A0A0A", flex: 1 }}>{slot.time}</span>
                      <span style={{ fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 500, color: "#737373" }}>{slot.deals} Deals</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Confirm CTA */}
        <button
          onClick={() => onConfirm(`${TODAY_SLOTS[selectedSlot].label} · ${TODAY_SLOTS[selectedSlot].time}`)}
          style={{ width: "100%", height: 52, borderRadius: 16, background: "#11301D", color: "#FEFEFE", fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", marginTop: 4 }}
        >
          Book deal
        </button>
      </div>
    </>
  );
}

// ── Booking confirmation screen ───────────────────────────────────────────────
// Generates a short booking reference, stable for the session
function makeRef() {
  return "NT-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

interface ConfirmedBooking {
  deal: DealEntry;
  slot: string;
  restaurantName: string;
  imageSrc: string;
  ref: string;
  address: string;
  neighborhood: string;
  distance: string;
  lat: number;
  lng: number;
}

// ── iOS-style native share sheet placeholder ─────────────────────────────────
const IOS_SHARE_APPS = [
  { icon: "💬", label: "Messages" },
  { icon: "📧", label: "Mail" },
  { icon: "🟢", label: "WhatsApp" },
  { icon: "📷", label: "Instagram" },
  { icon: "🔵", label: "Telegram" },
  { icon: "🐦", label: "X" },
];

function IOSShareSheet({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80 }}
      />
      <div
        style={{
          position: "absolute", left: 8, right: 8, bottom: 8,
          zIndex: 81,
          animation: "slideInFromBottom 0.28s cubic-bezier(0.32,0.72,0,1) both",
          display: "flex", flexDirection: "column", gap: 8,
        }}
      >
        {/* Main share card */}
        <div style={{ background: "rgba(242,242,247,0.97)", backdropFilter: "blur(40px)", borderRadius: 16, overflow: "hidden" }}>
          {/* Preview text */}
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, color: "#3C3C43", margin: 0, textAlign: "center", lineHeight: 1.5 }}>{text}</p>
          </div>

          {/* App grid */}
          <div style={{ padding: "16px 8px 8px", display: "flex", justifyContent: "space-around" }}>
            {IOS_SHARE_APPS.map(app => (
              <button
                key={app.label}
                onClick={onClose}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
                  {app.icon}
                </div>
                <span style={{ fontFamily: "var(--font-poppins)", fontSize: 11, color: "#0A0A0A", fontWeight: 500 }}>{app.label}</span>
              </button>
            ))}
          </div>

          {/* Copy link row */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>🔗</div>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 15, color: "#0A0A0A", fontWeight: 500 }}>Copy link</span>
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={onClose}
          style={{ background: "rgba(242,242,247,0.97)", backdropFilter: "blur(40px)", borderRadius: 16, height: 56, border: "none", cursor: "pointer", fontFamily: "var(--font-poppins)", fontSize: 17, fontWeight: 600, color: "#007AFF" }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

function BookingConfirmationScreen({ booking, onDone }: { booking: ConfirmedBooking; onDone: () => void }) {
  const [showShareSheet, setShowShareSheet] = useState(false);

  const slotDay  = booking.slot.split(" · ")[0]; // "TODAY" | "TOMORROW"
  const slotTime = booking.slot.split(" · ")[1]; // "12:00 – 15:00"

  const slotDateLabel = slotDay === "TODAY" ? "Today" : "Tomorrow";

  const directionsUrl = `https://maps.apple.com/?q=${encodeURIComponent(booking.address)}`;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `Deal booked at ${booking.restaurantName}!`,
        text: `I just booked "${booking.deal.title}" at ${booking.restaurantName}. Join me! 🎉`,
      }).catch(() => {});
    } else {
      setShowShareSheet(true);
    }
  };

  return (
    <>
      {/* Dim backdrop */}
      <div
        onClick={onDone}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 70 }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: "#fff", borderRadius: "24px 24px 0 0",
          zIndex: 71, display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "slideInFromBottom 0.35s cubic-bezier(0.32,0.72,0,1) both",
          height: "88%",
        }}
      >
        {/* Drag handle */}
        <div
          onClick={onDone}
          style={{ flexShrink: 0, display: "flex", justifyContent: "center", padding: "12px 0 4px", cursor: "pointer" }}
        >
          <div style={{ width: 44, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 24px 0" }}>

          {/* Illustration */}
          <div style={{ width: 240, margin: "0 auto 4px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustration-confirmation.svg"
              alt="Deal booked illustration"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {/* Heading */}
          <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: 24, fontWeight: 700, color: "#0A0A0A", margin: "0 0 8px", textAlign: "center", lineHeight: 1.25 }}>
            Deal booked!
          </h1>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373", margin: "0 0 24px", textAlign: "center", lineHeight: 1.55 }}>
            Enjoy the deal at {booking.restaurantName}.<br />
            If you need to reserve a table, please contact the restaurant.
          </p>

          {/* Detail rows */}
          <div style={{ width: "100%", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 20, overflow: "hidden", marginBottom: 20 }}>

            {/* Date row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>📅</div>
              <div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#737373", margin: "0 0 2px" }}>Date</p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 15, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{slotDateLabel}</p>
              </div>
            </div>

            {/* Time row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>🕐</div>
              <div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#737373", margin: "0 0 2px" }}>Time</p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 15, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{slotTime}</p>
              </div>
            </div>

            {/* Location row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>📍</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#737373", margin: "0 0 2px" }}>Location</p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: "#0A0A0A", margin: "0 0 1px", lineHeight: 1.4 }}>{booking.address}</p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 12, color: "#737373", margin: 0 }}>{booking.neighborhood} · {booking.distance} away</p>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flexShrink: 0, height: 34, borderRadius: 10, padding: "0 12px",
                  background: "rgba(17,48,29,0.07)", color: "#11301D",
                  fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 4,
                  textDecoration: "none",
                }}
              >
                🧭 Directions
              </a>
            </div>
          </div>

          {/* bottom breathing room so last card clears the sticky CTA bar (~160px tall) */}
          <div style={{ height: 160, flexShrink: 0 }} />
        </div>

        {/* Bottom CTA bar */}
        <div style={{ flexShrink: 0, padding: "12px 24px", paddingBottom: "max(36px, env(safe-area-inset-bottom))", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <button
            onClick={handleShare}
            style={{ width: "100%", height: 52, borderRadius: 16, background: "#11301D", color: "#FEFEFE", fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <span style={{ fontSize: 18 }}>↑</span> Share with friends
          </button>
          <button
            style={{ width: "100%", height: 44, borderRadius: 16, background: "transparent", color: "#737373", fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            Go to bookings
          </button>
        </div>
      </div>

      {/* iOS share sheet */}
      {showShareSheet && (
        <IOSShareSheet
          text={`I just booked "${booking.deal.title}" at ${booking.restaurantName}. Join me on NeoTaste! 🎉`}
          onClose={() => setShowShareSheet(false)}
        />
      )}
    </>
  );
}

// ── Review card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        {review.avatarSrc
          ? <img src={review.avatarSrc} alt={review.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          : <div style={{ width: 32, height: 32, borderRadius: "50%", background: review.avatarBg || "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>{review.initials}</span>
            </div>
        }
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{review.name}</span>
            {review.isFriend && <span style={{ fontSize: 10, background: "#FEE2E2", color: "#0A0A0A", borderRadius: 6, padding: "2px 6px", fontFamily: "var(--font-poppins)", fontWeight: 600 }}>💕 Friend</span>}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <StarRow count={review.stars} size={13} />
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D4D4D4", display: "inline-block" }} />
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, color: "#737373" }}>{review.timeAgo}</span>
      </div>
      <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#0A0A0A", lineHeight: 1.6, margin: "0 0 10px" }}>{review.text}</p>
      {review.photos && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {review.photos.map((src, i) => (
            <div key={i} style={{ flex: 1, height: 160, borderRadius: 12, overflow: "hidden" }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 14 }}>🤍</span>
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 500, color: "#737373" }}>{review.likes}</span>
      </div>
    </div>
  );
}

// ── Similar restaurant card (248px wide, matches Figma 245:27413) ─────────────
function SimilarCard({ pin, onOpen }: { pin: MapPin; onOpen: () => void }) {
  const { restaurant } = pin;
  const hasFriendTag = pin.type === "friends" && restaurant.trustTag;
  return (
    <button
      onClick={onOpen}
      style={{ display: "flex", flexDirection: "column", gap: 8, width: 248, flexShrink: 0, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
    >
      {/* Image with overlaid badges */}
      <div style={{ position: "relative", width: 248, height: 138, borderRadius: 16, overflow: "hidden" }}>
        <img src={restaurant.imageSrc} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />

        {/* Trust tag — top left */}
        {restaurant.trustTag && (
          <div
            style={{
              position: "absolute", top: 8, left: 8,
              background: hasFriendTag ? "#FEE2E2" : "#DFF0FF",
              borderRadius: 8, padding: "2px 6px",
              fontFamily: "var(--font-poppins)", fontSize: 10, fontWeight: 700, color: "#0A0A0A",
              whiteSpace: "nowrap",
            }}
          >
            {restaurant.trustTag.label}
          </div>
        )}

        {/* Social proof — bottom left (shown for community/friends pins) */}
        {(pin.type === "community" || pin.type === "friends") && restaurant.friendsCount && (
          <div
            style={{
              position: "absolute", bottom: 8, left: 8,
              background: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "2px 6px",
              fontFamily: "var(--font-poppins)", fontSize: 10, fontWeight: 700, color: "#FEFEFE",
              whiteSpace: "nowrap",
            }}
          >
            {pin.type === "friends" ? `💕 ${restaurant.friendsCount} Friends visited` : `👥 ${restaurant.friendsCount} people tried this week`}
          </div>
        )}
      </div>

      {/* Info block */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 248 }}>
        {/* Name */}
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 700, color: "#1C1D28", margin: 0, lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {restaurant.name}
        </p>

        {/* Rating · distance · category */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 12, lineHeight: 1 }}>⭐</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "rgba(28,29,40,0.6)" }}>{restaurant.rating}</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "rgba(28,29,40,0.6)" }}>({restaurant.reviewCount})</span>
          </div>
          <div style={{ width: 1, height: 12, background: "rgba(28,29,40,0.2)" }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "rgba(28,29,40,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{restaurant.distance}</span>
          <div style={{ width: 1, height: 12, background: "rgba(28,29,40,0.2)" }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "rgba(28,29,40,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{restaurant.category}</span>
        </div>

        {/* Deal chips */}
        {restaurant.deals.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "nowrap", overflow: "hidden" }}>
            {restaurant.deals.map((deal, i) => (
              <div
                key={i}
                style={{
                  background: "#53F293", borderRadius: 16, padding: "4px 8px",
                  fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 600, color: "#1C1D28",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  flexShrink: 0,
                }}
              >
                {deal}
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function RestaurantDetailScreen({ pin, onClose, initialDealIdx }: Props) {
  const { restaurant } = pin;
  const detail = getRestaurantDetail(pin.id);

  const scrollRef    = useRef<HTMLDivElement>(null);
  const overviewRef  = useRef<HTMLDivElement>(null);
  const reviewsRef   = useRef<HTMLDivElement>(null);
  const aboutRef     = useRef<HTMLDivElement>(null);
  const similarRef   = useRef<HTMLDivElement>(null);

  const [scrollY,          setScrollY]          = useState(0);
  const [activeTab,        setActiveTab]        = useState<TabKey>("overview");
  const [reviewFilter,     setReviewFilter]     = useState<"friends" | "all">("friends");
  const [dealsSectionVisible, setDealsSectionVisible] = useState(true);
  const [selectedDeal,     setSelectedDeal]     = useState<DealEntry | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  // Open booking sheet immediately if a deal index was passed in
  useEffect(() => {
    if (initialDealIdx !== undefined && detail?.dealEntries[initialDealIdx]) {
      setSelectedDeal(detail.dealEntries[initialDealIdx]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pastHero = scrollY > HERO_SCROLL; // header becomes white + name appears

  const friendReviews    = detail?.reviews.filter(r => r.isFriend)  ?? [];
  const nonFriendReviews = detail?.reviews.filter(r => !r.isFriend) ?? [];
  const hasFriendReviews = friendReviews.length > 0;

  // Score by completeness: written text + photo bonus (most trust-building content first)
  const reviewScore = (r: Review) =>
    (r.text?.length ?? 0) + (r.photos?.length ?? 0) * 200 + (r.likes ?? 0) * 2;

  // "Your friends" tab shows only friend reviews; "All people" shows the non-friend ones
  const poolReviews = (reviewFilter === "friends" && hasFriendReviews)
    ? friendReviews
    : nonFriendReviews;
  const allDisplayedReviews = [...poolReviews].sort((a, b) => reviewScore(b) - reviewScore(a));
  const displayedReviews = allDisplayedReviews.slice(0, 5);

  // Total count for the current filter (for the "See all" button)
  const totalForFilter = reviewFilter === "friends"
    ? friendReviews.length
    : (detail?.totalReviews ?? 0) - friendReviews.length;
  const showSeeAll = totalForFilter > 5;

  const similarPins = getSimilarRestaurants(pin);

  // ── Scroll handler: track position + active section ───────────────────────
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const st = el.scrollTop;
    setScrollY(st);

    // Active tab: which section's top is closest to top of viewport
    const offset = FIXED_H + 16;
    const tops = [
      { key: "overview" as TabKey, ref: overviewRef },
      { key: "reviews"  as TabKey, ref: reviewsRef  },
      { key: "about"    as TabKey, ref: aboutRef    },
    ];
    let active: TabKey = "overview";
    for (const { key, ref } of tops) {
      if (ref.current && ref.current.offsetTop - offset <= st) active = key;
    }
    setActiveTab(active);

    // Deals section visibility: visible when its area overlaps the viewport
    const dealsTop    = overviewRef.current?.offsetTop ?? 0;
    const dealsBottom = reviewsRef.current?.offsetTop ?? 999999;
    const vpTop       = st + FIXED_H;
    const vpBottom    = st + 844;
    setDealsSectionVisible(vpTop < dealsBottom && vpBottom > dealsTop);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Scroll to section ──────────────────────────────────────────────────────
  const scrollTo = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current || !scrollRef.current) return;
    const top = ref.current.offsetTop - FIXED_H + 8;
    scrollRef.current.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  if (!detail) return null;

  const priceActive = detail.priceLevel.length;
  const priceFaded  = Math.max(0, 4 - priceActive);

  const TABS: { key: TabKey; label: string; ref: React.RefObject<HTMLDivElement | null> }[] = [
    { key: "overview", label: "Overview", ref: overviewRef },
    { key: "reviews",  label: "Reviews",  ref: reviewsRef  },
    { key: "about",    label: "About",    ref: aboutRef    },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fff", zIndex: 50 }}>

      {/* ── FIXED OVERLAY: back button row (+ restaurant name when past hero) ── */}
      <div
        style={{
          position: "absolute", top: "env(safe-area-inset-top, 0px)", left: 0, right: 0, height: BTN_ROW_H,
          zIndex: 51, display: "flex", alignItems: "center", padding: "0 16px",
          background: pastHero ? "white" : "transparent",
          transition: "background 0.25s ease",
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            flexShrink: 0,
            background: pastHero ? "#F5F5F5" : "rgba(255,255,255,0.88)",
            backdropFilter: pastHero ? "none" : "blur(8px)",
            transition: "background 0.25s ease, backdropFilter 0.25s ease",
          }}
        >←</button>
        {/* Restaurant name appears beside the back arrow once past hero */}
        <p
          style={{
            fontFamily: "var(--font-poppins)", fontSize: 15, fontWeight: 700, color: "#0A0A0A",
            margin: "0 0 0 12px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            opacity: pastHero ? 1 : 0, transition: "opacity 0.25s ease",
            pointerEvents: "none",
          }}
        >
          {restaurant.name}
        </p>
      </div>

      {/* ── FIXED OVERLAY: tabs bar (fades in when past hero) ─────────── */}
      <div
        style={{
          position: "absolute", top: `calc(env(safe-area-inset-top, 0px) + ${BTN_ROW_H}px)`, left: 0, right: 0, height: TABBAR_H,
          zIndex: 40, background: "white", borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          opacity: pastHero ? 1 : 0, transition: "opacity 0.25s ease",
          pointerEvents: pastHero ? "auto" : "none",
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => scrollTo(tab.ref)}
            style={{
              flex: 1, padding: "10px 0 8px", background: "none", border: "none",
              borderBottom: activeTab === tab.key ? "2.5px solid #53F293" : "2.5px solid transparent",
              fontFamily: "var(--font-poppins)", fontSize: 14,
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? "#0A0A0A" : "#737373",
              cursor: "pointer",
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ── SCROLL AREA ─────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden" }}
      >
        {/* 1 ── Hero image */}
        <div style={{ position: "relative", height: HERO_H, flexShrink: 0 }}>
          <img src={restaurant.imageSrc} alt={restaurant.name} style={{ width: "100%", height: HERO_H, objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 55%)", pointerEvents: "none" }} />
        </div>

        {/* 2 ── Restaurant info */}
        <div style={{ padding: "18px 16px 0" }}>
          <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: 26, fontWeight: 700, color: "#0A0A0A", lineHeight: 1.2, margin: "0 0 8px" }}>{restaurant.name}</h1>

          {/* Row 1: rating · category · price */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>⭐ {restaurant.rating}</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373" }}>({restaurant.reviewCount})</span>
            <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373" }}>{restaurant.category}</span>
            <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
            <span style={{ display: "inline-flex" }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 500, color: "#0A0A0A" }}>{detail.priceLevel}</span>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.25)" }}>{"€".repeat(priceFaded)}</span>
            </span>
          </div>

          {/* Row 2: open · closes · neighborhood */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: "#16a34a" }}>Open</span>
            <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373" }}>Closes at {detail.closingTime}</span>
            <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373" }}>{detail.neighborhood} ({restaurant.distance})</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 2, marginBottom: 16 }}>
            {[{ icon: "📋", label: "Menu" }, { icon: "📍", label: "Location" }, { icon: "🤍", label: "Save" }, { icon: "🔗", label: "Share" }].map(btn => (
              <button key={btn.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 12, background: "#F5F5F5", fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 600, color: "#0A0A0A", whiteSpace: "nowrap", flexShrink: 0, border: "none", cursor: "pointer" }}>
                <span style={{ fontSize: 14 }}>{btn.icon}</span>{btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 ── Photo gallery */}
        <div style={{ paddingLeft: 16, marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingRight: 16 }}>
            {detail.galleryImages.map((src, i) => (
              <div key={i} style={{ flexShrink: 0, width: 130, height: 90, borderRadius: 12, overflow: "hidden" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* 4 ── Inline tabs (only visible before scrolling past hero) */}
        <div
          style={{
            display: "flex", borderBottom: "1px solid rgba(0,0,0,0.08)",
            marginTop: 16, paddingBottom: 0,
            opacity: pastHero ? 0 : 1, transition: "opacity 0.15s ease",
            pointerEvents: pastHero ? "none" : "auto",
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => scrollTo(tab.ref)}
              style={{
                flex: 1, padding: "12px 0 10px", background: "none", border: "none",
                borderBottom: activeTab === tab.key ? "2.5px solid #53F293" : "2.5px solid transparent",
                fontFamily: "var(--font-poppins)", fontSize: 14,
                fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? "#0A0A0A" : "#737373",
                cursor: "pointer",
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* ──────────────────────────────────────────────────────────────
            5 ── OVERVIEW / DEALS SECTION
        ────────────────────────────────────────────────────────────── */}
        <div ref={overviewRef} style={{ padding: "24px 16px 0", scrollMarginTop: FIXED_H }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 18, fontWeight: 700, color: "#0A0A0A" }}>Deals</span>
            <button style={{ fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 600, color: "#737373", background: "none", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>See all →</button>
          </div>
          {detail.dealEntries.map((deal, i) => <DealCard key={i} deal={deal} onBook={() => setSelectedDeal(deal)} />)}
        </div>

        {/* divider */}
        <div style={{ height: 8, background: "#F5F5F5", margin: "24px 0 0" }} />

        {/* ──────────────────────────────────────────────────────────────
            6 ── RATINGS & REVIEWS SECTION
        ────────────────────────────────────────────────────────────── */}
        <div ref={reviewsRef} style={{ padding: "24px 16px 0", scrollMarginTop: FIXED_H }}>
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: "0 0 16px" }}>Ratings & Reviews</h2>

          {/* Overall rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 52, fontWeight: 700, color: "#0A0A0A", lineHeight: 1 }}>{restaurant.rating}</span>
            <div>
              <StarRow count={5} size={24} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, color: "#737373", display: "block", marginTop: 4 }}>
                {detail.totalReviews.toLocaleString("de-DE")} Ratings & Reviews
              </span>
            </div>
          </div>

          {/* Filter chips — only shown when friend reviews exist */}
          {hasFriendReviews && (
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => setReviewFilter("friends")}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "7px 14px",
                  borderRadius: 20, fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                  background: reviewFilter === "friends" ? "#0A0A0A" : "transparent",
                  color: reviewFilter === "friends" ? "#FEFEFE" : "#737373",
                  outline: reviewFilter === "friends" ? "none" : "1px solid rgba(0,0,0,0.15)",
                }}
              >
                💕 Your friends ({friendReviews.length})
              </button>
              <button
                onClick={() => setReviewFilter("all")}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "7px 14px",
                  borderRadius: 20, fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                  background: reviewFilter === "all" ? "#0A0A0A" : "transparent",
                  color: reviewFilter === "all" ? "#FEFEFE" : "#737373",
                  outline: reviewFilter === "all" ? "none" : "1px solid rgba(0,0,0,0.15)",
                }}
              >
                👥 All people
              </button>
            </div>
          )}

          <div style={{ height: 1, background: "rgba(0,0,0,0.08)", marginBottom: 20 }} />

          {/* Reviews list — max 5 per filter */}
          {displayedReviews.map((review, i) => <ReviewCard key={i} review={review} />)}

          {/* See all — only shown when more than 5 reviews exist for this filter */}
          {showSeeAll && (
            <button style={{ width: "100%", height: 44, borderRadius: 12, background: "transparent", border: "1px solid rgba(0,0,0,0.15)", fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: "#0A0A0A", cursor: "pointer", marginBottom: 8 }}>
              See all {totalForFilter.toLocaleString("de-DE")} reviews →
            </button>
          )}
        </div>

        {/* divider */}
        <div style={{ height: 8, background: "#F5F5F5", margin: "24px 0 0" }} />

        {/* ──────────────────────────────────────────────────────────────
            7 ── ABOUT SECTION
        ────────────────────────────────────────────────────────────── */}
        <div ref={aboutRef} style={{ padding: "24px 16px 0", scrollMarginTop: FIXED_H }}>
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: "0 0 12px" }}>About</h2>

          {/* About text */}
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#525252", lineHeight: 1.65, margin: "0 0 16px" }}>{detail.about}</p>

          {/* Map — OpenStreetMap embed with restaurant coordinates */}
          <div style={{ borderRadius: 16, overflow: "hidden", height: 180, marginBottom: 12, border: "1px solid rgba(0,0,0,0.08)" }}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${pin.lng - 0.007},${pin.lat - 0.004},${pin.lng + 0.007},${pin.lat + 0.004}&layer=mapnik&marker=${pin.lat},${pin.lng}`}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title={`Map showing ${restaurant.name}`}
              loading="lazy"
            />
          </div>

          {/* Direction buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button style={{ flex: 1, height: 44, borderRadius: 12, background: "#11301D", color: "#FEFEFE", fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              🧭 Get Directions
            </button>
            <button style={{ flex: 1, height: 44, borderRadius: 12, background: "#F5F5F5", color: "#0A0A0A", fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              🔖 Save to List
            </button>
          </div>

          {/* Address row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.08)", marginBottom: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>📌</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 500, color: "#0A0A0A", margin: 0, lineHeight: 1.4 }}>{detail.address}</p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: 12, color: "#737373", margin: 0 }}>{detail.neighborhood} · {restaurant.distance} away</p>
            </div>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#737373", flexShrink: 0 }}>📋</button>
          </div>

          {/* Hours row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 14, paddingBottom: 14, borderTop: "1px solid rgba(0,0,0,0.08)", marginTop: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>🕐</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: "#16a34a", margin: 0 }}>Open now</p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, color: "#737373", margin: 0 }}>Closes at {detail.closingTime}</p>
            </div>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#737373", flexShrink: 0 }}>▾</button>
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 8, background: "#F5F5F5", margin: "24px 0 0" }} />

        {/* ──────────────────────────────────────────────────────────────
            8 ── SIMILAR RESTAURANTS
        ────────────────────────────────────────────────────────────── */}
        <div ref={similarRef} style={{ padding: "24px 0 0", scrollMarginTop: FIXED_H }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 16, paddingRight: 16, marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>Similar Restaurants</h2>
            <button style={{ fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 600, color: "#737373", background: "none", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>See all</button>
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", paddingLeft: 16, paddingRight: 16, paddingBottom: 4 }}>
            {similarPins.map(simPin => (
              <SimilarCard
                key={simPin.id}
                pin={simPin}
                onOpen={() => {
                  // Navigate to that restaurant's detail
                  // For now scroll back to top and let parent handle
                  if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom spacer for sticky CTA */}
        <div style={{ height: 100 }} />
      </div>

      {/* ── STICKY BOTTOM CTA — hidden when Deals section is visible ─── */}
      {!dealsSectionVisible && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(0,0,0,0.08)", padding: "12px 16px", paddingBottom: "max(28px, env(safe-area-inset-bottom))", zIndex: 40 }}>
          <button
            onClick={() => scrollTo(overviewRef)}
            style={{ width: "100%", height: 52, borderRadius: 16, background: "#11301D", color: "#FEFEFE", fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            View deals
          </button>
        </div>
      )}

      {/* ── DEAL BOOKING BOTTOM SHEET ─────────────────────────────────── */}
      {selectedDeal && (
        <DealBookingSheet
          deal={selectedDeal}
          restaurantName={restaurant.name}
          onClose={() => setSelectedDeal(null)}
          onConfirm={(slot) => {
            setConfirmedBooking({
              deal: selectedDeal,
              slot,
              restaurantName: restaurant.name,
              imageSrc: restaurant.imageSrc,
              ref: makeRef(),
              address: detail.address,
              neighborhood: detail.neighborhood,
              distance: restaurant.distance,
              lat: pin.lat,
              lng: pin.lng,
            });
            setSelectedDeal(null);
          }}
        />
      )}

      {/* ── BOOKING CONFIRMATION SCREEN ───────────────────────────────── */}
      {confirmedBooking && (
        <BookingConfirmationScreen
          booking={confirmedBooking}
          onDone={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
}
