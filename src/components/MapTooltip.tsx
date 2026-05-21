"use client";

import type { TooltipType } from "@/data/pins";

// Design system: default bg = Grey/500 #737373, selected bg = Grey/600 #525252
// Count badge: default = Background/Brand/Subtle #BAFAD4, selected = Background/Brand/Default #53F293

interface MapTooltipProps {
  type: TooltipType;
  value?: string;
  avatarSrc?: string;
  selected?: boolean;
}

export function MapTooltip({ type, value, avatarSrc, selected = false }: MapTooltipProps) {
  const pillBg = selected ? "#525252" : "#737373";
  const countBadgeBg = selected ? "#53F293" : "#BAFAD4";

  // Plain pin: just a green dot, no pill
  if (type === "plain") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={{
          width: selected ? 14 : 10, height: selected ? 14 : 10,
          borderRadius: "50%",
          background: selected ? "#3EE380" : "#53F293",
          border: `2px solid ${selected ? "#11301D" : "#3EE380"}`,
          transition: "all 0.15s ease",
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      {/* Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: 4,
          borderRadius: 9999,
          background: pillBg,
          boxShadow: "0px 12px 8px rgba(10,13,18,0.08), 0px 4px 3px rgba(10,13,18,0.03)",
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
      >
        {type === "friends" && (
          <div style={{ display: "flex", alignItems: "center" }}>
            {avatarSrc && (
              <div style={{
                width: 16, height: 16, borderRadius: "50%",
                border: "1px solid #FEFEFE", overflow: "hidden",
                marginRight: -4, flexShrink: 0,
              }}>
                <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              background: countBadgeBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 6, fontWeight: 700, color: "rgba(0,0,0,0.9)", lineHeight: 1 }}>
                {value || "+2"}
              </span>
            </div>
          </div>
        )}

        {type === "redemption" && (
          <span style={{ fontSize: 10, fontWeight: 600, color: "#FEFEFE", whiteSpace: "nowrap", lineHeight: "16px" }}>
            🔥 {value || "3k+"}
          </span>
        )}

        {type === "rating" && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 10 }}>⭐</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#FEFEFE", whiteSpace: "nowrap", lineHeight: "14px" }}>
              {value || "4.7"}
            </span>
          </div>
        )}

        {type === "ranking" && (
          <div style={{
            padding: "2px 6px", borderRadius: 8,
            background: "#FFC86A", color: "#0A0A0A",
            fontSize: 10, fontWeight: 700, lineHeight: "12px", whiteSpace: "nowrap",
          }}>
            {value || "#1"}
          </div>
        )}

        {type === "new" && (
          <div style={{
            padding: "2px 6px", borderRadius: 8,
            background: "#0A0A0A", color: "#FEFEFE",
            fontSize: 10, fontWeight: 700, lineHeight: "12px", whiteSpace: "nowrap",
          }}>
            NEW
          </div>
        )}

        {type === "community" && (
          <span style={{ fontSize: 10, fontWeight: 600, color: "#FEFEFE", whiteSpace: "nowrap", lineHeight: "16px", padding: "0 2px" }}>
            👥 {value || "8"}
          </span>
        )}
      </div>

      {/* Anchor dot */}
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: "#53F293", border: "1px solid #3EE380",
      }} />
    </div>
  );
}
