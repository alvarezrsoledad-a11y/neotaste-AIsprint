"use client";

import { type LevelTier } from "@/data/people";

// 16×16 inline badge showing the user's NeoTaste level (1–5).
// Color scale ramps from neutral (Taster) to gold (Food Legend).
const LEVEL_COLORS: Record<LevelTier, { bg: string; fg: string }> = {
  1: { bg: "#E5E5E5", fg: "#0A0A0A" }, // Taster
  2: { bg: "#A7E8C2", fg: "#0A0A0A" }, // Foodie
  3: { bg: "#53F293", fg: "#0A0A0A" }, // Culinary Star
  4: { bg: "#FFC86A", fg: "#0A0A0A" }, // Gourmet
  5: { bg: "#11301D", fg: "#FFC86A" }, // Food Legend
};

export function LevelBadge({ level }: { level: LevelTier }) {
  const { bg, fg } = LEVEL_COLORS[level];
  return (
    <span
      aria-label={`Level ${level}`}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          16,
        height:         16,
        borderRadius:   "50%",
        background:     bg,
        color:          fg,
        fontFamily:     "var(--font-poppins)",
        fontSize:       9,
        fontWeight:     700,
        lineHeight:     1,
        flexShrink:     0,
      }}
    >
      {level}
    </span>
  );
}
