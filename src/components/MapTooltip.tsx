"use client";

import type { TooltipType } from "@/data/pins";

interface MapTooltipProps {
  type:            TooltipType;
  value?:          string;
  communityCount?: string;
  avatarSrcs?:     string[];
  selected?:       boolean;
}

// ── Google Maps-style pill ────────────────────────────────────────────────────
function GMPill({ children, selected }: { children: React.ReactNode; selected: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Pill */}
      <div
        style={{
          position: "relative",
          background: "#FFFFFF",
          border: `1px solid ${selected ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)"}`,
          borderRadius: 9999,
          padding: "4px 9px",
          boxShadow: selected
            ? "0 2px 8px rgba(0,0,0,0.22)"
            : "0 1px 4px rgba(0,0,0,0.14)",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          whiteSpace: "nowrap",
          transition: "box-shadow 0.15s ease, border-color 0.15s ease",
        }}
      >
        {children}
      </div>

      {/* Tip — rotated square clipped to show bottom-right triangle */}
      <div
        style={{
          width: 8,
          height: 8,
          background: "#FFFFFF",
          border: `1px solid ${selected ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.18)"}`,
          borderTop: "none",
          borderLeft: "none",
          transform: "rotate(45deg) translateX(-50%)",
          marginTop: -5,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

// ── Green dot (for all non-social pins) ──────────────────────────────────────
function GreenDot({ selected }: { selected: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        width:        selected ? 13 : 9,
        height:       selected ? 13 : 9,
        borderRadius: "50%",
        background:   selected ? "#3EE380" : "#53F293",
        border:       `2px solid ${selected ? "#11301D" : "#3EE380"}`,
        transition:   "all 0.15s ease",
      }} />
    </div>
  );
}

// ── Prefix badge (#N or NEW) ──────────────────────────────────────────────────
function Prefix({ label }: { label: string }) {
  const isNew = label === "NEW";
  return (
    <span style={{
      fontSize:     9,
      fontWeight:   700,
      lineHeight:   1,
      padding:      "1px 4px",
      borderRadius: 4,
      background:   isNew ? "#0A0A0A" : "#FFC86A",
      color:        isNew ? "#FFFFFF" : "#0A0A0A",
      fontFamily:   "var(--font-poppins)",
      letterSpacing: "0.02em",
      flexShrink:   0,
    }}>
      {label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MapTooltip({ type, value, communityCount, avatarSrcs, selected = false }: MapTooltipProps) {

  // ── Green dot: rating, redemption, plain ─────────────────────────────────
  if (type === "rating" || type === "redemption" || type === "plain") {
    return <GreenDot selected={selected} />;
  }

  // ── Tier 1: Friend proof ──────────────────────────────────────────────────
  if (type === "friends") {
    const count = value ? value.replace("+", "") : "?";
    const shown = (avatarSrcs ?? []).slice(0, 2);

    return (
      <GMPill selected={selected}>
        {/* Stacked avatars */}
        {shown.length > 0 && (
          <div style={{ display: "flex", alignItems: "center" }}>
            {shown.map((src, i) => (
              <div
                key={i}
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "1.5px solid #FFFFFF",
                  overflow: "hidden",
                  marginLeft: i === 0 ? 0 : -5,
                  flexShrink: 0,
                  position: "relative",
                  zIndex: shown.length - i,
                }}
              >
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#0A0A0A",
          fontFamily: "var(--font-poppins)", lineHeight: 1,
        }}>
          {count} friends
        </span>
      </GMPill>
    );
  }

  // ── Tier 2: Community proof ───────────────────────────────────────────────
  if (type === "community") {
    return (
      <GMPill selected={selected}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#0A0A0A",
          fontFamily: "var(--font-poppins)", lineHeight: 1,
        }}>
          {value ?? "?"} tried this week
        </span>
      </GMPill>
    );
  }

  // ── Ranking: prefix + community count ────────────────────────────────────
  if (type === "ranking") {
    return (
      <GMPill selected={selected}>
        <Prefix label={value ?? "#?"} />
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#0A0A0A",
          fontFamily: "var(--font-poppins)", lineHeight: 1,
        }}>
          {communityCount ?? "?"} tried this week
        </span>
      </GMPill>
    );
  }

  // ── New: prefix + tried count ─────────────────────────────────────────────
  if (type === "new") {
    return (
      <GMPill selected={selected}>
        <Prefix label="NEW" />
        <span style={{
          fontSize: 11, fontWeight: 600, color: "#0A0A0A",
          fontFamily: "var(--font-poppins)", lineHeight: 1,
        }}>
          {value ?? "?"} tried
        </span>
      </GMPill>
    );
  }

  // Fallback
  return <GreenDot selected={selected} />;
}
