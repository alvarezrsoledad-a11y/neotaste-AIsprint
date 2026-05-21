"use client";

import type { PinRestaurant, TrustTagType } from "@/data/pins";

// Re-export a convenience type the screen can use
export type { PinRestaurant as Restaurant };

const TRUST_TAG_STYLES: Record<TrustTagType, { bg: string; color: string }> = {
  friends:    { bg: "#FEE2E2", color: "#0A0A0A" },
  community:  { bg: "#DFF0FF", color: "#0A0A0A" },
  redemption: { bg: "rgba(0,0,0,0.5)", color: "#FEFEFE" },
};

interface RestaurantListItemProps {
  restaurant:    PinRestaurant;
  onViewDetail?: () => void;
}

export function RestaurantListItem({ restaurant, onViewDetail }: RestaurantListItemProps) {
  const {
    name, category, rating, reviewCount, distance,
    imageSrc, deals, trustTag, review, friendsCount, avatarSrcs,
  } = restaurant;

  return (
    <div
      className="flex flex-col gap-3 w-full"
      style={{ cursor: onViewDetail ? "pointer" : "default" }}
      onClick={onViewDetail}
    >
      {/* ── Main row ────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        {/* Thumbnail — 108×108 */}
        <div className="relative shrink-0 w-[108px] h-[108px] rounded-2xl overflow-hidden">
          <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Content column */}
        <div className="flex flex-col gap-2 flex-1 min-w-0 pt-0.5">
          {/* Trust tag ABOVE name, 4px gap (gap-1) */}
          <div className="flex flex-col gap-1">
            {trustTag && (
              <div
                className="self-start px-[6px] py-[2px] rounded-[8px] text-[10px] font-bold leading-3 whitespace-nowrap"
                style={{
                  background: TRUST_TAG_STYLES[trustTag.type].bg,
                  color: TRUST_TAG_STYLES[trustTag.type].color,
                  fontFamily: "var(--font-poppins)",
                }}
              >
                {trustTag.label}
              </div>
            )}
            {/* Name — Label/Medium: 14px SemiBold */}
            <p
              className="text-[14px] font-semibold leading-[18px] text-[#1C1D28] truncate"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {name}
            </p>
            {/* Meta — 12px Medium, Grey/500 */}
            <p
              className="text-[12px] font-medium leading-[18px] text-[#737373] whitespace-nowrap"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {category}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-[11px]">⭐</span>
              <span className="text-[12px] font-medium text-[#737373]">{rating}</span>
              <span className="text-[12px] text-[#737373]">({reviewCount})</span>
              <span className="w-1 h-1 rounded-full bg-[#737373] mx-0.5" />
              <span className="text-[12px] font-medium text-[#737373]">{distance}</span>
            </div>
          </div>

          {/* Deal chips */}
          <div
            className="flex items-center gap-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {deals.map((deal, i) => (
              <div
                key={i}
                className="shrink-0 px-2 py-1 rounded-full text-[12px] font-semibold leading-4 whitespace-nowrap"
                style={{ background: "#53F293", color: "#1C1D28", fontFamily: "var(--font-poppins)" }}
              >
                {deal}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Review snippet (friends type only) ──────────────────────── */}
      {review && friendsCount && (
        <div
          className="flex flex-col gap-1 p-3 rounded-[8px]"
          style={{ background: "#F5F5F5" }}
        >
          <p
            className="text-[12px] font-semibold leading-4"
            style={{ color: "rgba(0,0,0,0.9)", fontFamily: "var(--font-poppins)" }}
          >
            {review}
          </p>
          <div className="flex items-center gap-1">
            <span
              className="text-[10px] text-[#737373] whitespace-nowrap"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {friendsCount} Friends visited
            </span>
            {avatarSrcs && (
              <div className="flex items-center">
                {avatarSrcs.slice(0, 3).map((src, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border border-white overflow-hidden"
                    style={{ marginRight: -4 }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {Number(friendsCount) > 3 && (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold ml-[-4px]"
                    style={{ background: "#BAFAD4", color: "rgba(0,0,0,0.9)" }}
                  >
                    +{Number(friendsCount) - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
