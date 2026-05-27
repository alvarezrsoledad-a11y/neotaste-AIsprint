"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { type MapPin, MAP_PINS } from "@/data/pins";
import { type DealEntry, type Review, getRestaurantDetail } from "@/data/restaurantDetails";
import { type LevelTier } from "@/data/people";
import { Icon } from "./Icon";
import { LevelBadge } from "./LevelBadge";
import { useScrollElevation } from "@/hooks/useScrollElevation";

// ── Layout constants ──────────────────────────────────────────────────────────
const HERO_H      = 280;
const BTN_ROW_H   = 52;   // back button row (doubles as name bar when past hero)
const TABBAR_H    = 50;   // tabs row (16px top + 18px text + 16px bottom per Figma)
const FIXED_H     = BTN_ROW_H + TABBAR_H; // 102 px (no fake status bar)
const HERO_SCROLL = HERO_H - BTN_ROW_H;   // ≈228 px — when hero scrolls away

// CTA palette — used by every primary CTA on this page
const CTA_BG       = "#33E77F";
const CTA_TEXT     = "#0A0A0A";
const POSITIVE     = "#219750"; // green tint for inline icons (star, bolt, open)

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
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          color={i < count ? POSITIVE : "rgba(0,0,0,0.15)"}
        />
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

// Deterministic 1–5 level derived from reviewer name (mock data has no level field)
function levelForReviewer(name: string): LevelTier {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return (((Math.abs(h) % 5) + 1) as LevelTier);
}

// Pull the "name part" out of socialProof.names ("Mason Phillips and +13 visited" → "Mason Phillips")
function pickFirstName(names: string): string {
  const andIdx = names.indexOf(" and ");
  if (andIdx >= 0) return names.slice(0, andIdx);
  const visitedIdx = names.lastIndexOf(" visited");
  if (visitedIdx >= 0) return names.slice(0, visitedIdx);
  return names;
}

// ── Deal card ─────────────────────────────────────────────────────────────────
function DealCard({
  deal,
  primary,
  onBook,
}: {
  deal:    DealEntry;
  primary: boolean;   // true → dark brand card; false → light neutral card
  onBook:  () => void;
}) {
  const isLimited  = /Limited/i.test(deal.validity);
  const chipBorder = primary ? "1px solid rgba(83,242,147,0.2)" : "1px solid rgba(0,0,0,0.1)";
  const chipColor  = primary ? "#53F293" : "#0A0A0A";
  // Notch vertical position (ticket punch effect) — matches Figma absolute positions
  const notchTop   = primary ? 96 : 114;

  return (
    <div style={{
      borderRadius: 16,
      background:   primary ? "#11301D" : "#E5E5E5",
      padding:      16,
      marginBottom: 12,
      position:     "relative",
      overflow:     "hidden",
    }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {primary && <Icon name="bolt" size={16} color="#53F293" />}
        <span style={{
          fontFamily: "var(--font-poppins)",
          fontSize:   20,
          fontWeight: 700,
          color:      primary ? "#53F293" : "#0A0A0A",
          lineHeight: "26px",
        }}>
          {deal.title}
        </span>
      </div>

      {/* Chips row */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, border: chipBorder, borderRadius: 40, padding: "4px 8px" }}>
          <Icon name="gift" size={12} color={chipColor} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 600, color: chipColor, lineHeight: "16px" }}>
            {deal.avgSpend}
          </span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, border: chipBorder, borderRadius: 40, padding: "4px 8px" }}>
          <Icon name="refresh" size={12} color={chipColor} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 600, color: chipColor, lineHeight: "16px" }}>
            {isLimited ? "Limited" : deal.validity}
          </span>
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: "var(--font-poppins)",
        fontSize:   12,
        fontWeight: 500,
        color:      primary ? "#53F293" : "rgba(0,0,0,0.7)",
        lineHeight: "18px",
        margin:     "0 0 16px",
      }}>
        {deal.description}
      </p>

      {/* Ticket notches — semicircles cut into left + right edges */}
      <div style={{ position: "absolute", left: -4, top: notchTop, width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
      <div style={{ position: "absolute", right: -4, top: notchTop, width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />

      {/* Book deal CTA */}
      <button
        onClick={onBook}
        style={{
          width:        "100%",
          height:       42,
          borderRadius: 16,
          border:       "none",
          background:   primary ? "rgba(83,242,147,0.2)" : "#F5F5F5",
          color:        primary ? "#53F293" : "#0A0A0A",
          fontFamily:   "var(--font-poppins)",
          fontSize:     14,
          fontWeight:   600,
          cursor:       "pointer",
        }}
      >
        Book deal
      </button>
    </div>
  );
}

// ── Deal booking bottom sheet ─────────────────────────────────────────────────
export const TODAY_SLOTS = [
  { label: "TODAY",    time: "12:00 – 15:00", deals: 5 },
  { label: "TODAY",    time: "15:00 – 18:00", deals: 3 },
  { label: "TOMORROW", time: "12:00 – 19:00", deals: 7 },
];

export interface DealBookingSheetProps {
  deal: DealEntry;
  restaurantName: string;
  onClose: () => void;
  onConfirm: (slot: string) => void;
}

export function DealBookingSheet({ deal, restaurantName, onClose, onConfirm }: DealBookingSheetProps) {
  const [selectedSlot, setSelectedSlot] = useState(0);

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 60 }}
      />
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: "#fff", borderRadius: "24px 24px 0 0",
          zIndex: 61, padding: "12px 16px",
          paddingBottom: "max(36px, env(safe-area-inset-bottom))",
          animation: "slideInFromBottom 0.3s cubic-bezier(0.32,0.72,0,1) both",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.1)" }} />
        </div>

        <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 500, color: "#737373", margin: "0 0 4px" }}>{restaurantName}</p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            {deal.isFlash && <Icon name="bolt" size={16} color={POSITIVE} />}
            <h3 style={{ fontFamily: "var(--font-poppins)", fontSize: 20, fontWeight: 700, color: "#0A0A0A", margin: 0, lineHeight: 1.25 }}>{deal.title}</h3>
          </div>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, color: "#737373", margin: "0 0 10px", lineHeight: 1.5 }}>{deal.description}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="fire" size={12} color="#0A0A0A" />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#525252" }}>Avg. {deal.avgSpend}</span>
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D4D4D4" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="clock" size={12} color="#0A0A0A" />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#525252" }}>{deal.validity}</span>
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.08)", marginBottom: 20 }} />

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

        <button
          onClick={() => onConfirm(`${TODAY_SLOTS[selectedSlot].label} · ${TODAY_SLOTS[selectedSlot].time}`)}
          style={{ width: "100%", height: 52, borderRadius: 16, background: CTA_BG, color: CTA_TEXT, fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", marginTop: 4 }}
        >
          Book deal
        </button>
      </div>
    </>
  );
}

// ── Booking confirmation screen ───────────────────────────────────────────────
export function makeRef() {
  return "NT-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export interface ConfirmedBooking {
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
        <div style={{ background: "rgba(242,242,247,0.97)", backdropFilter: "blur(40px)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: 13, color: "#3C3C43", margin: 0, textAlign: "center", lineHeight: 1.5 }}>{text}</p>
          </div>
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
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>🔗</div>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 15, color: "#0A0A0A", fontWeight: 500 }}>Copy link</span>
          </div>
        </div>
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

export function BookingConfirmationScreen({ booking, onDone }: { booking: ConfirmedBooking; onDone: () => void }) {
  const [showShareSheet, setShowShareSheet] = useState(false);

  const slotDay  = booking.slot.split(" · ")[0];
  const slotTime = booking.slot.split(" · ")[1];
  const slotDateLabel = slotDay === "TODAY" ? "Today" : "Tomorrow";

  const directionsUrl = `https://maps.apple.com/?q=${encodeURIComponent(booking.address)}`;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `Deal booked at ${booking.restaurantName}!`,
        text: `I just booked "${booking.deal.title}" at ${booking.restaurantName}. Join me!`,
      }).catch(() => {});
    } else {
      setShowShareSheet(true);
    }
  };

  return (
    <>
      <div
        onClick={onDone}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 70 }}
      />
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: "#fff", borderRadius: "24px 24px 0 0",
          zIndex: 71, display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "slideInFromBottom 0.35s cubic-bezier(0.32,0.72,0,1) both",
          height: "88%",
        }}
      >
        <div
          onClick={onDone}
          style={{ flexShrink: 0, display: "flex", justifyContent: "center", padding: "12px 0 4px", cursor: "pointer" }}
        >
          <div style={{ width: 44, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 24px 0" }}>
          <div style={{ width: 240, margin: "0 auto 4px" }}>
            <img src="/illustration-confirmation.svg" alt="Deal booked illustration" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-poppins)", fontSize: 24, fontWeight: 700, color: "#0A0A0A", margin: "0 0 8px", textAlign: "center", lineHeight: 1.25 }}>
            Deal booked!
          </h1>
          <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373", margin: "0 0 24px", textAlign: "center", lineHeight: 1.55 }}>
            Enjoy the deal at {booking.restaurantName}.<br />
            If you need to reserve a table, please contact the restaurant.
          </p>
          <div style={{ width: "100%", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 20, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="clock" size={16} color="#0A0A0A" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#737373", margin: "0 0 2px" }}>Date</p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 15, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{slotDateLabel}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="clock" size={16} color="#0A0A0A" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "#737373", margin: "0 0 2px" }}>Time</p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: 15, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{slotTime}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="location" size={16} color="#0A0A0A" />
              </div>
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
                  display: "flex", alignItems: "center", gap: 6,
                  textDecoration: "none",
                }}
              >
                <Icon name="location" size={16} color="#11301D" />
                Directions
              </a>
            </div>
          </div>
          <div style={{ height: 160, flexShrink: 0 }} />
        </div>
        <div style={{ flexShrink: 0, padding: "12px 24px", paddingBottom: "max(36px, env(safe-area-inset-bottom))", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <button
            onClick={handleShare}
            style={{ width: "100%", height: 52, borderRadius: 16, background: CTA_BG, color: CTA_TEXT, fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Icon name="arrow-up-right-from-square" size={18} color={CTA_TEXT} />
            Share with friends
          </button>
          <button
            style={{ width: "100%", height: 44, borderRadius: 16, background: "transparent", color: "#737373", fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            Go to bookings
          </button>
        </div>
      </div>
      {showShareSheet && (
        <IOSShareSheet
          text={`I just booked "${booking.deal.title}" at ${booking.restaurantName}. Join me on NeoTaste!`}
          onClose={() => setShowShareSheet(false)}
        />
      )}
    </>
  );
}

// ── Review card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const level = levelForReviewer(review.name);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        {review.avatarSrc
          ? <img src={review.avatarSrc} alt={review.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          : <div style={{ width: 32, height: 32, borderRadius: "50%", background: review.avatarBg || "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>{review.initials}</span>
            </div>
        }
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{review.name}</span>
          <LevelBadge level={level} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <StarRow count={review.stars} size={14} />
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D4D4D4", display: "inline-block" }} />
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, color: "#737373" }}>{review.timeAgo}</span>
      </div>
      <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#0A0A0A", lineHeight: 1.6, margin: "0 0 10px" }}>{review.text}</p>
      {review.photos && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10, overflowX: "auto", scrollbarWidth: "none" }}>
          {review.photos.map((src, i) => (
            <div key={i} style={{ flex: "1 1 0", minWidth: 160, height: 160, borderRadius: 12, overflow: "hidden" }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="heart-1" size={16} color="#0A0A0A" />
        <span style={{ fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 500, color: "#737373" }}>{review.likes}</span>
      </div>
    </div>
  );
}

// ── Similar restaurant card ───────────────────────────────────────────────────
function SimilarCard({ pin, onOpen }: { pin: MapPin; onOpen: () => void }) {
  const { restaurant } = pin;
  const hasFriendTag = pin.type === "friends" && restaurant.trustTag;
  return (
    <button
      onClick={onOpen}
      style={{ display: "flex", flexDirection: "column", gap: 8, width: 248, flexShrink: 0, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
    >
      <div style={{ position: "relative", width: 248, height: 138, borderRadius: 16, overflow: "hidden" }}>
        <img src={restaurant.imageSrc} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
        {(pin.type === "community" || pin.type === "friends") && restaurant.friendsCount && (
          <div
            style={{
              position: "absolute", bottom: 8, left: 8,
              background: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "2px 6px",
              fontFamily: "var(--font-poppins)", fontSize: 10, fontWeight: 700, color: "#FEFEFE",
              whiteSpace: "nowrap",
            }}
          >
            {pin.type === "friends" ? `${restaurant.friendsCount} friends visited` : `${restaurant.friendsCount} people tried this week`}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 248 }}>
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 700, color: "#1C1D28", margin: 0, lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {restaurant.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="star" size={12} color={POSITIVE} />
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "rgba(28,29,40,0.6)" }}>{restaurant.rating}</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "rgba(28,29,40,0.6)" }}>({restaurant.reviewCount})</span>
          </div>
          <div style={{ width: 1, height: 12, background: "rgba(28,29,40,0.2)" }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "rgba(28,29,40,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{restaurant.distance}</span>
          <div style={{ width: 1, height: 12, background: "rgba(28,29,40,0.2)" }} />
          <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, fontWeight: 500, color: "rgba(28,29,40,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{restaurant.category}</span>
        </div>
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

// ── Social proof banner (NEW) ─────────────────────────────────────────────────
function SocialProofBanner({
  pin,
  onViewReviews,
}: {
  pin:           MapPin;
  onViewReviews: () => void;
}) {
  const sp = pin.restaurant.socialProof;
  if (!sp) return null;

  const isFriends = sp.variant === "friends";
  const bg        = "#fef2f2";
  const firstName = pickFirstName(sp.names);

  return (
    <div style={{
      background:    bg,
      borderRadius:  8,
      padding:       "12px 16px",
      display:       "flex",
      flexDirection: "column",
      gap:           8,
    }}>
      <p style={{
        fontFamily: "var(--font-poppins)",
        fontSize:   14,
        fontWeight: 600,
        fontStyle:  "italic",
        color:      "rgba(0,0,0,0.9)",
        margin:     0,
        lineHeight: 1.4,
      }}>
        {sp.quote}
      </p>

      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {/* Name text first */}
          <span style={{
            fontFamily:   "var(--font-poppins)",
            fontSize:     12,
            color:        "rgba(0,0,0,0.75)",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}>
            <span style={{ fontWeight: 600 }}>{firstName}</span>
            {sp.names.slice(firstName.length)}
          </span>
          {/* Avatars second: 1 for Friends, stacked up to 3 for NeoTasters */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {sp.avatars.slice(0, isFriends ? 1 : 3).map((src, i, arr) => (
              <div
                key={i}
                style={{
                  width:        20,
                  height:       20,
                  borderRadius: "50%",
                  overflow:     "hidden",
                  border:       "1.5px solid #FEFEFE",
                  marginRight:  i < arr.length - 1 ? -4 : 0,
                }}
              >
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onViewReviews}
          style={{
            flexShrink:     0,
            background:     "transparent",
            border:         "none",
            padding:        0,
            cursor:         "pointer",
            fontFamily:     "var(--font-poppins)",
            fontSize:       12,
            fontWeight:     600,
            color:          "#0A0A0A",
            textDecoration: "underline",
          }}
        >
          View reviews
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function RestaurantDetailScreen({ pin, onClose, initialDealIdx }: Props) {
  const { restaurant } = pin;
  const detail = getRestaurantDetail(pin.id);

  const scrollRef      = useRef<HTMLDivElement>(null);
  const overviewRef    = useRef<HTMLDivElement>(null);
  const reviewsRef     = useRef<HTMLDivElement>(null);
  const aboutRef       = useRef<HTMLDivElement>(null);
  const similarRef     = useRef<HTMLDivElement>(null);
  // Used to measure when title / inline-tabs leave the viewport
  const titleRef       = useRef<HTMLHeadingElement>(null);
  const inlineTabsRef  = useRef<HTMLDivElement>(null);

  const isHeaderElevated = useScrollElevation(scrollRef);

  const [scrollY,             setScrollY]             = useState(0);
  const [activeTab,           setActiveTab]           = useState<TabKey>("overview");
  const [dealsSectionVisible, setDealsSectionVisible] = useState(true);
  const [pastDeals,           setPastDeals]           = useState(false);
  // pastTitle  → h1 has scrolled behind the nav bar  → show white nav + restaurant name
  // pastTabs   → inline tabs have scrolled past      → move tabs into the fixed nav bar
  const [pastTitle,           setPastTitle]           = useState(false);
  const [pastTabs,            setPastTabs]            = useState(false);
  const [selectedDeal,        setSelectedDeal]        = useState<DealEntry | null>(null);
  const [confirmedBooking,    setConfirmedBooking]    = useState<ConfirmedBooking | null>(null);

  // Filter default: Friends if any friend reviews exist, else NeoTasters.
  const friendReviews    = detail?.reviews.filter(r => r.isFriend)  ?? [];
  const nonFriendReviews = detail?.reviews.filter(r => !r.isFriend) ?? [];
  const hasFriendReviews = friendReviews.length > 0;
  const [reviewFilter, setReviewFilter] = useState<"friends" | "neotasters">(
    hasFriendReviews ? "friends" : "neotasters"
  );

  useEffect(() => {
    if (initialDealIdx !== undefined && detail?.dealEntries[initialDealIdx]) {
      setSelectedDeal(detail.dealEntries[initialDealIdx]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Legacy alias kept so derived vars below (headerShadow, etc.) still compile
  const pastHero = pastTabs;

  const reviewScore = (r: Review) =>
    (r.text?.length ?? 0) + (r.photos?.length ?? 0) * 200 + (r.likes ?? 0) * 2;

  const poolReviews = reviewFilter === "friends" ? friendReviews : nonFriendReviews;
  const allDisplayedReviews = [...poolReviews].sort((a, b) => reviewScore(b) - reviewScore(a));
  const displayedReviews = allDisplayedReviews.slice(0, 5);

  const totalForFilter = reviewFilter === "friends"
    ? friendReviews.length
    : (detail?.totalReviews ?? 0) - friendReviews.length;
  const showSeeAll = totalForFilter > 5;

  const similarPins = getSimilarRestaurants(pin);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const st = el.scrollTop;
    setScrollY(st);

    // ── Tab active tracking ────────────────────────────────────────────────
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

    // ── Scroll-state thresholds ────────────────────────────────────────────
    // pastTitle: bottom of h1 has scrolled above the nav bar
    if (titleRef.current) {
      const titleBottom = titleRef.current.offsetTop + titleRef.current.offsetHeight;
      setPastTitle(st + BTN_ROW_H >= titleBottom);
    }
    // pastTabs: Deals section title has reached the nav bar
    if (overviewRef.current) {
      setPastTabs(st + BTN_ROW_H >= overviewRef.current.offsetTop);
    }

    // ── Deals section visibility (for sticky CTA) ─────────────────────────
    const dealsTop    = overviewRef.current?.offsetTop ?? 0;
    const dealsBottom = reviewsRef.current?.offsetTop ?? 999999;
    const vpTop       = st + FIXED_H;
    const vpBottom    = st + 844;
    setDealsSectionVisible(vpTop < dealsBottom && vpBottom > dealsTop);
    // Sticky CTA appears only after deals section fully scrolled past
    setPastDeals(vpTop >= dealsBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current || !scrollRef.current) return;
    const top = ref.current.offsetTop - FIXED_H + 8;
    scrollRef.current.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  if (!detail) return null;

  const priceActive = detail.priceLevel.length;
  const priceFaded  = Math.max(0, 4 - priceActive);

  const TABS: { key: TabKey; label: string; ref: React.RefObject<HTMLDivElement | null> }[] = [
    { key: "overview", label: "Overview",          ref: overviewRef },
    { key: "reviews",  label: "Ratings & Reviews", ref: reviewsRef  },
    { key: "about",    label: "About",             ref: aboutRef    },
  ];

  // Shadow only when nav is opaque AND content is elevated below it
  const headerShadow = pastTitle && isHeaderElevated ? "0 2px 8px rgba(0,0,0,0.08)" : "none";

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fff", zIndex: 50 }}>

      {/* ── FIXED OVERLAY: nav bar ────────────────────────────────────── */}
      {/* State 0 → transparent, back pill only                           */}
      {/* State 1 (pastTitle) → white bg + restaurant name fades in       */}
      {/* State 2 (pastTabs)  → container height expands to reveal tabs   */}
      {/*                                                                  */}
      {/* Height animation is used (not translateY) so the tabs row never */}
      {/* occupies layout space while hidden — avoids a 50px dead zone    */}
      {/* blocking scroll content below the nav bar.                      */}
      <div
        style={{
          position:   "absolute",
          top:        "env(safe-area-inset-top, 0px)",
          left:       0, right: 0,
          zIndex:     51,
          overflow:   "hidden",
          // Expand from nav-only height to nav+tabs height
          height:     pastTabs ? BTN_ROW_H + TABBAR_H : BTN_ROW_H,
          transition: pastTabs
            ? "height 0.32s cubic-bezier(0.32,0.72,0,1)"
            : "height 0.22s cubic-bezier(0.32,0,0.67,0)",
        }}
      >
        {/* Nav row */}
        <div
          style={{
            height:         BTN_ROW_H,
            flexShrink:     0,
            display:        "flex", alignItems: "center", padding: "0 16px",
            background:     pastTitle ? "rgba(255,255,255,0.97)" : "transparent",
            backdropFilter: pastTitle ? "blur(12px)" : "none",
            transition:     "background 0.28s ease, box-shadow 0.2s ease",
            boxShadow:      !pastTabs ? headerShadow : "none",
          }}
        >
          <button
            onClick={onClose}
            aria-label="Back"
            style={{
              width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              background:     pastTitle ? "#F5F5F5" : "rgba(255,255,255,0.9)",
              backdropFilter: pastTitle ? "none" : "blur(8px)",
              transition:     "background 0.28s ease",
            }}
          >
            <Icon name="angle-left" size={24} color="#0A0A0A" />
          </button>
          <p
            style={{
              fontFamily:  "var(--font-poppins)", fontSize: 15, fontWeight: 700, color: "#0A0A0A",
              margin:      "0 0 0 12px", flex: 1,
              overflow:    "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              opacity:     pastTitle ? 1 : 0,
              transform:   pastTitle ? "translateY(0)" : "translateY(6px)",
              transition:  pastTitle
                ? "opacity 0.28s ease, transform 0.32s cubic-bezier(0.32,0.72,0,1)"
                : "opacity 0.18s ease, transform 0.2s cubic-bezier(0.32,0,0.67,0)",
              pointerEvents: "none",
            }}
          >
            {restaurant.name}
          </p>
        </div>

        {/* Tabs row — revealed as the container height expands */}
        <div
          style={{
            height:       TABBAR_H,
            flexShrink:   0,
            display:      "flex", alignItems: "center", padding: "0 16px",
            background:   "rgba(255,255,255,0.97)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            boxShadow:    pastTabs ? headerShadow : "none",
            pointerEvents: pastTabs ? "auto" : "none",
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => scrollTo(tab.ref)}
              style={{
                flex: 1, padding: "16px", background: "none", border: "none",
                borderBottom: activeTab === tab.key ? "4px solid #11301D" : "4px solid transparent",
                fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600,
                color: activeTab === tab.key ? "#0A0A0A" : "#737373",
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Tabs are now inside the nav container above — nothing here */}

      {/* ── SCROLL AREA ──────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden" }}
      >
        {/* 2 ── Restaurant header — sits below back button overlay */}
        <div style={{ padding: `${BTN_ROW_H + 12}px 16px 0` }}>
          <h1 ref={titleRef} style={{ fontFamily: "var(--font-poppins)", fontSize: 32, fontWeight: 700, color: "#0A0A0A", lineHeight: 1.2, margin: "0 0 8px" }}>{restaurant.name}</h1>

          {/* Row 1: star + rating + (count) · cuisines · €€€ */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="star" size={14} color="#53F293" />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>{restaurant.rating}</span>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373", textDecoration: "underline" }}>({restaurant.reviewCount})</span>
            </span>
            <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373" }}>{restaurant.category}</span>
            <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
            <span style={{ display: "inline-flex" }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 500, color: "#0A0A0A" }}>{detail.priceLevel}</span>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.25)" }}>{"€".repeat(priceFaded)}</span>
            </span>
          </div>

          {/* Row 2: Open · Closes at … · district (dist) */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: POSITIVE }}>Open</span>
            <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373" }}>Closes at {detail.closingTime}</span>
            <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373" }}>{detail.neighborhood} ({restaurant.distance})</span>
          </div>

          {/* 3 ── Action row: secondary/default/small — horizontal scroll */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", scrollbarWidth: "none", marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
            {[
              { name: "book-open"                  as const, label: "Menu"     },
              { name: "heart"                      as const, label: "Save"     },
              { name: "arrow-up-right-from-square" as const, label: "Share"    },
              { name: "location"                   as const, label: "Location" },
            ].map(btn => (
              <button
                key={btn.label}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  height: 42, borderRadius: 16,
                  background: "#F5F5F5",
                  border: "none",
                  padding: "0 16px",
                  cursor: "pointer",
                  flexShrink: 0,
                  fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: "#0A0A0A",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon name={btn.name} size={16} color="#0A0A0A" />
                {btn.label}
              </button>
            ))}
          </div>

          {/* 4 ── Social proof banner (NEW) */}
          <div style={{ marginBottom: 16 }}>
            <SocialProofBanner pin={pin} onViewReviews={() => scrollTo(reviewsRef)} />
          </div>
        </div>

        {/* 5 ── Photo gallery — bento: hero as big square, gallery images as pairs of smalls */}
        <div style={{ overflowX: "auto", scrollbarWidth: "none", marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 8, width: "max-content", paddingLeft: 16, paddingRight: 16 }}>
            {/* Hero image: large square (274×274) */}
            <div style={{ flexShrink: 0, width: 274, height: 274, borderRadius: 12, overflow: "hidden" }}>
              <img src={restaurant.imageSrc} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {/* Gallery images: pairs as columns of 2 smalls (133×133) */}
            {Array.from({ length: Math.ceil(detail.galleryImages.length / 2) }).map((_, colIdx) => {
              const imgA = detail.galleryImages[colIdx * 2];
              const imgB = detail.galleryImages[colIdx * 2 + 1];
              return (
                <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                  {imgA && (
                    <div style={{ width: 133, height: 133, borderRadius: 12, overflow: "hidden" }}>
                      <img src={imgA} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  {imgB && (
                    <div style={{ width: 133, height: 133, borderRadius: 12, overflow: "hidden" }}>
                      <img src={imgB} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6 ── Inline tabs — visible until they scroll up into the fixed header */}
        <div
          ref={inlineTabsRef}
          style={{
            display: "flex", alignItems: "center", padding: "0 16px",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            marginTop: 16,
            // Fade out once tabs have migrated to the fixed nav bar
            opacity:       pastTabs ? 0 : 1,
            transition:    "opacity 0.2s ease",
            pointerEvents: pastTabs ? "none" : "auto",
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => scrollTo(tab.ref)}
              style={{
                flex: 1, padding: "16px", background: "none", border: "none",
                borderBottom: activeTab === tab.key ? "4px solid #11301D" : "4px solid transparent",
                fontFamily: "var(--font-poppins)", fontSize: 14,
                fontWeight: 600,
                color: activeTab === tab.key ? "#0A0A0A" : "#737373",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* ───── OVERVIEW / DEALS ───── */}
        <div ref={overviewRef} style={{ padding: "24px 16px 0", scrollMarginTop: FIXED_H }}>
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: 20, fontWeight: 700, color: "#0A0A0A", lineHeight: "26px", margin: "0 0 16px" }}>Deals</h2>
          {detail.dealEntries.map((deal, i) => (
            <DealCard
              key={i}
              deal={deal}
              primary={i === 0}
              onBook={() => setSelectedDeal(deal)}
            />
          ))}

          {/* "How deals work?" row */}
          <div style={{ paddingTop: 8, paddingBottom: 8 }}>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: "none", padding: 0, cursor: "pointer",
            }}>
              <Icon name="circle-info" size={16} color="#0A0A0A" />
              <span style={{
                fontFamily:     "var(--font-poppins)",
                fontSize:       13,
                fontWeight:     600,
                color:          "#0A0A0A",
                textDecoration: "underline",
              }}>
                How deals work?
              </span>
            </button>
          </div>
        </div>

        <div style={{ height: 8, background: "#F5F5F5", margin: "24px 0 0" }} />

        {/* ───── RATINGS & REVIEWS ───── */}
        <div ref={reviewsRef} style={{ padding: "24px 16px 0", scrollMarginTop: FIXED_H }}>
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: "0 0 16px" }}>Ratings &amp; Reviews</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-poppins)", fontSize: 52, fontWeight: 700, color: "#0A0A0A", lineHeight: 1 }}>{restaurant.rating}</span>
            <div>
              <StarRow count={5} size={16} />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 12, color: "#737373", display: "block", marginTop: 4 }}>
                {detail.totalReviews.toLocaleString("de-DE")} Ratings &amp; Reviews
              </span>
            </div>
          </div>

          {/* Filter chips — always shown. Default = Friends if any exist, else NeoTasters. */}
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
              Friends ({friendReviews.length})
            </button>
            <button
              onClick={() => setReviewFilter("neotasters")}
              style={{
                display: "flex", alignItems: "center", gap: 4, padding: "7px 14px",
                borderRadius: 20, fontFamily: "var(--font-poppins)", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                background: reviewFilter === "neotasters" ? "#0A0A0A" : "transparent",
                color: reviewFilter === "neotasters" ? "#FEFEFE" : "#737373",
                outline: reviewFilter === "neotasters" ? "none" : "1px solid rgba(0,0,0,0.15)",
              }}
            >
              NeoTasters
            </button>
          </div>

          <div style={{ height: 1, background: "rgba(0,0,0,0.08)", marginBottom: 20 }} />

          {displayedReviews.map((review, i) => <ReviewCard key={i} review={review} />)}

          {showSeeAll && (
            <button style={{
              width: "100%", height: 44, borderRadius: 12,
              background: "transparent", border: "none",
              fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600,
              color: "#0A0A0A", cursor: "pointer", marginBottom: 8,
              textDecoration: "underline",
            }}>
              See all reviews
            </button>
          )}
        </div>

        <div style={{ height: 8, background: "#F5F5F5", margin: "24px 0 0" }} />

        {/* ───── ABOUT ───── */}
        <div ref={aboutRef} style={{ padding: "24px 16px 0", scrollMarginTop: FIXED_H }}>
          <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: "0 0 12px" }}>About</h2>

          <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#525252", lineHeight: 1.65, margin: "0 0 16px" }}>{detail.about}</p>

          {/* Map preview */}
          <div style={{ borderRadius: 16, overflow: "hidden", height: 180, marginBottom: 12, border: "1px solid rgba(0,0,0,0.08)" }}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${pin.lng - 0.007},${pin.lat - 0.004},${pin.lng + 0.007},${pin.lat + 0.004}&layer=mapnik&marker=${pin.lat},${pin.lng}`}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              title={`Map showing ${restaurant.name}`}
              loading="lazy"
            />
          </div>

          {/* Get directions + Call — outlined side by side */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button style={{
              flex: 1, height: 44, borderRadius: 12,
              background: "#FEFEFE", color: "#0A0A0A",
              border: "1px solid rgba(0,0,0,0.12)",
              fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Icon name="location" size={20} color="#0A0A0A" />
              Get directions
            </button>
            <button style={{
              flex: 1, height: 44, borderRadius: 12,
              background: "#FEFEFE", color: "#0A0A0A",
              border: "1px solid rgba(0,0,0,0.12)",
              fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Icon name="phone" size={20} color="#0A0A0A" />
              Call
            </button>
          </div>

          {/* Address row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.08)",
          }}>
            <Icon name="location" size={16} color="#0A0A0A" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 500, color: "#0A0A0A", margin: 0, lineHeight: 1.4 }}>{detail.address}</p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: 12, color: "#737373", margin: 0 }}>{detail.neighborhood} · {restaurant.distance} away</p>
            </div>
          </div>

          {/* Hours row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            paddingTop: 14, paddingBottom: 14, borderTop: "1px solid rgba(0,0,0,0.08)", marginTop: 14,
          }}>
            <Icon name="clock" size={16} color={POSITIVE} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, fontWeight: 600, color: POSITIVE }}>Open</span>
              <span style={{ color: "#D4D4D4", fontSize: 12 }}>·</span>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 14, color: "#737373" }}>Closes at {detail.closingTime}</span>
            </div>
            <button
              aria-label="Expand hours"
              style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 4 }}
            >
              <Icon name="angle-down" size={12} color="#0A0A0A" />
            </button>
          </div>
        </div>

        <div style={{ height: 8, background: "#F5F5F5", margin: "24px 0 0" }} />

        {/* ───── SIMILAR RESTAURANTS ───── */}
        <div ref={similarRef} style={{ padding: "24px 0 0", scrollMarginTop: FIXED_H }}>
          <div style={{ paddingLeft: 16, paddingRight: 16, marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-poppins)", fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>Similar Restaurants</h2>
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", paddingLeft: 16, paddingRight: 16, paddingBottom: 4 }}>
            {similarPins.map(simPin => (
              <SimilarCard
                key={simPin.id}
                pin={simPin}
                onOpen={() => {
                  if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
                }}
              />
            ))}
          </div>
        </div>

        {/* ───── REPORT ISSUE ───── */}
        <div style={{
          display:        "flex",
          justifyContent: "center",
          alignItems:     "center",
          gap:            6,
          padding:        "24px 16px",
        }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6, padding: 0,
          }}>
            <Icon name="flag" size={16} color="#0A0A0A" />
            <span style={{
              fontFamily:     "var(--font-poppins)",
              fontSize:       13,
              fontWeight:     600,
              color:          "#0A0A0A",
              textDecoration: "underline",
            }}>
              Report Issue
            </span>
          </button>
        </div>

        <div style={{ height: 100 }} />
      </div>

      {/* ── STICKY BOTTOM CTA — only after deals section scrolled past ─── */}
      {pastDeals && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          padding: "12px 16px",
          paddingBottom: "max(28px, env(safe-area-inset-bottom))",
          zIndex: 40,
        }}>
          <button
            onClick={() => scrollTo(overviewRef)}
            style={{
              width: "100%", height: 52, borderRadius: 16,
              background: CTA_BG, color: CTA_TEXT,
              fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 600,
              border: "none", cursor: "pointer",
            }}
          >
            View deals
          </button>
        </div>
      )}

      {/* ── DEAL BOOKING + CONFIRMATION ─────────────────────────────── */}
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

      {confirmedBooking && (
        <BookingConfirmationScreen
          booking={confirmedBooking}
          onDone={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
}
