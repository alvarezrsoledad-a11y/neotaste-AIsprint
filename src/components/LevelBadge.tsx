"use client";

import { type LevelTier } from "@/data/people";

// 16×16 inline badge from /public/assets/levels/level-badge-*.svg
const LEVEL_FILES: Record<LevelTier, string> = {
  1: "/assets/levels/level-badge-1-taster.svg",
  2: "/assets/levels/level-badge-2-foodie.svg",
  3: "/assets/levels/level-badge-3-culinary-star.svg",
  4: "/assets/levels/level-badge-4-gourmet.svg",
  5: "/assets/levels/level-badge-5-food-legend.svg",
};

export function LevelBadge({ level }: { level: LevelTier }) {
  return (
    <img
      src={LEVEL_FILES[level]}
      alt={`Level ${level}`}
      width={16}
      height={16}
      style={{
        width:      16,
        height:     16,
        flexShrink: 0,
        display:    "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}
