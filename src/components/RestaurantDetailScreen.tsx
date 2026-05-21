"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { type MapPin, MAP_PINS } from "@/data/pins";
import { type DealEntry, type Review, getRestaurantDetail } from "@/data/restaurantDetails";

// ── Layout constants ──────────────────────────────────────────────────────────
const HERO_H      = 280;
const STATUS_H    = 44;
const BTN_ROW_H   = 52;   // back button row (doubles as name bar when past hero)
const TABBAR_H    = 44;   // tabs row
const FIXED_H     = STATUS_H + BTN_ROW_H + TABBAR_H; // 140 px
const HERO_SCROLL = HERO_H - STATUS_H - BTN_ROW_H; // ≈184 px — when hero scrolls away

type TabKey = "overview" | "reviews" | "about";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  pin: MapPin;
  onClose: () => void;
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
function DealCard({ deal }: { deal: DealEntry }) {
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
        <button style={{ width: "100%", height: 44, borderRadius: 12, background: "#11301D", color: "#FEFEFE", fontFamily: "var(--font-poppins)", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          Redeem Now
          <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>{deal.available} left</span>
        </button>
      </div>
    </div>
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
export function RestaurantDetailScreen({ pin, onClose }: Props) {
  const { restaurant } = pin;
  const detail = getRestaurantDetail(pin.id);

  const scrollRef    = useRef<HTMLDivElement>(null);
  const overviewRef  = useRef<HTMLDivElement>(null);
  const reviewsRef   = useRef<HTMLDivElement>(null);
  const aboutRef     = useRef<HTMLDivElement>(null);
  const similarRef   = useRef<HTMLDivElement>(null);

  const [scrollY,       setScrollY]       = useState(0);
  const [activeTab,     setActiveTab]     = useState<TabKey>("overview");
  const [reviewFilter,  setReviewFilter]  = useState<"friends" | "all">("friends");

  const pastHero = scrollY > HERO_SCROLL; // header becomes white + name appears

  const friendReviews    = detail?.reviews.filter(r => r.isFriend)  ?? [];
  const nonFriendReviews = detail?.reviews.filter(r => !r.isFriend) ?? [];
  const hasFriendReviews = friendReviews.length > 0;

  // "Friends" tab shows only friend reviews; "All people" shows the non-friend ones
  const allDisplayedReviews = (reviewFilter === "friends" && hasFriendReviews)
    ? friendReviews
    : nonFriendReviews;
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
    <div style={{ position: "absolute", inset: 0, width: 390, height: 844, overflow: "hidden", background: "#fff", zIndex: 50 }}>

      {/* ── FIXED OVERLAY: status bar ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: STATUS_H,
          zIndex: 51, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px 0",
          background: pastHero ? "white" : "transparent",
          transition: "background 0.25s ease",
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--font-poppins)", color: pastHero ? "#0A0A0A" : "white", letterSpacing: "-0.5px", transition: "color 0.25s ease" }}>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: pastHero ? "#0A0A0A" : "white", transition: "color 0.25s ease" }}>
          <span>●●●</span><span style={{ marginLeft: 4 }}>WiFi</span><span style={{ marginLeft: 4 }}>🔋</span>
        </div>
      </div>

      {/* ── FIXED OVERLAY: back button row (+ restaurant name when past hero) ── */}
      <div
        style={{
          position: "absolute", top: STATUS_H, left: 0, right: 0, height: BTN_ROW_H,
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
          position: "absolute", top: STATUS_H + BTN_ROW_H, left: 0, right: 0, height: TABBAR_H,
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
          {detail.dealEntries.map((deal, i) => <DealCard key={i} deal={deal} />)}
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
                💕 Friends ({friendReviews.length})
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

      {/* ── STICKY BOTTOM CTA ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(0,0,0,0.08)", padding: "12px 16px 28px", zIndex: 40 }}>
        <button style={{ width: "100%", height: 52, borderRadius: 16, background: "#11301D", color: "#FEFEFE", fontFamily: "var(--font-poppins)", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          ⚡ Book deal
        </button>
      </div>
    </div>
  );
}
