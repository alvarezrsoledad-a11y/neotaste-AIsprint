"use client";

import type { PinRestaurant, TooltipType } from "@/data/pins";

interface PinDetailCardProps {
  restaurant:    PinRestaurant;
  pinType:       TooltipType;
  pinValue?:     string;
  onClose:       () => void;
  onViewDetail?: () => void;
}

// ── Trust-tag colour map (used as trailing tag in the card) ───────────────────
const TRAILING_TAG_STYLES: Record<string, { bg: string; color: string }> = {
  friends:    { bg: "#FEE2E2", color: "#0A0A0A" },
  community:  { bg: "#DFF0FF", color: "#0A0A0A" },
  redemption: { bg: "#FFE8E1", color: "#0A0A0A" },
};

// ── Derive the image-overlay (leading) tag from the pin type ─────────────────
function getLeadingTag(pinType: TooltipType, pinValue?: string, isNew?: boolean) {
  if (pinType === "ranking" && pinValue)
    return { text: pinValue, bg: "#FFC86A", color: "#0A0A0A" };
  if (pinType === "new" || isNew)
    return { text: "NEW", bg: "#0A0A0A", color: "#FEFEFE" };
  return null;
}

export function PinDetailCard({ restaurant, pinType, pinValue, onClose, onViewDetail }: PinDetailCardProps) {
  const {
    name, category, rating, reviewCount, distance,
    imageSrc, deals, isNew, trustTag, review, friendsCount, avatarSrcs,
  } = restaurant;

  const leadingTag    = getLeadingTag(pinType, pinValue, isNew);
  const isFriends     = pinType === "friends";
  const trailingStyle = trustTag ? (TRAILING_TAG_STYLES[trustTag.type] ?? TRAILING_TAG_STYLES.community) : null;

  return (
    <div
      className="flex flex-col gap-2 p-2 bg-white rounded-2xl"
      style={{
        border:    "1px solid #E5E5E5",
        boxShadow: "0px 2px 14px rgba(67,67,67,0.25)",
        cursor:    onViewDetail ? "pointer" : "default",
      }}
      onClick={onViewDetail}
    >
      <div className="flex gap-4 items-start relative">
        <div className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden">
          <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
          {leadingTag && (
            <div
              className="absolute top-2 left-2 px-[6px] py-[2px] rounded-[8px] text-[10px] font-bold leading-3"
              style={{ background: leadingTag.bg, color: leadingTag.color, fontFamily: "var(--font-poppins)" }}
            >
              {leadingTag.text}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            {trustTag && trailingStyle && (
              <div
                className="self-start px-[6px] py-[2px] rounded-[8px] text-[10px] font-bold leading-3 whitespace-nowrap"
                style={{
                  background: trailingStyle.bg,
                  color:      trailingStyle.color,
                  fontFamily: "var(--font-poppins)",
                }}
              >
                {trustTag.label}
              </div>
            )}
            <p
              className="text-[16px] font-bold leading-5 text-[#0A0A0A] truncate"
              style={{ letterSpacing: "0.25px", fontFamily: "var(--font-poppins)" }}
            >
              {name}
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[11px]">⭐</span>
              <span className="text-[12px] font-medium text-[#737373]">{rating}</span>
              <span className="text-[12px] text-[#737373]">({reviewCount})</span>
              <span className="w-1 h-1 rounded-full bg-[#737373]" />
              <span className="text-[12px] font-medium text-[#737373]">{distance}</span>
              <span className="w-1 h-1 rounded-full bg-[#737373]" />
              <span className="text-[12px] font-medium text-[#737373]">{category}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 justify-end flex-wrap">
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

        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-[#737373] hover:text-[#0A0A0A] transition-colors"
          aria-label="Close"
          style={{ fontSize: 16, lineHeight: 1 }}
        >
          ✕
        </button>
      </div>

      {/* Review snippet — FRIENDS type only */}
      {isFriends && review && friendsCount && (
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
                    style={{ marginRight: i < 2 ? -4 : 0 }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {Number(friendsCount) > 3 && (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold"
                    style={{ background: "#BAFAD4", color: "rgba(0,0,0,0.9)", marginLeft: -4 }}
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
