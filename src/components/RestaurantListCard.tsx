"use client";

import { type DealOption, type SocialProofProps } from "./RestaurantCard";

export interface RestaurantListCardProps {
  restaurantName: string;
  rating:         number;
  reviewCount:    number;
  distanceKm:     number;
  cuisines:       string[];
  imageUrl:       string;
  rank?:          number;
  deals:          [DealOption, DealOption?];
  socialProof:    SocialProofProps;
  onViewDetail:   () => void;
  onBookDeal:     (dealId: string) => void;
}

function splitNames(names: string): { bold: string; rest: string } {
  const andIdx = names.indexOf(" and ");
  if (andIdx >= 0) return { bold: names.slice(0, andIdx), rest: names.slice(andIdx) };
  const visitedIdx = names.lastIndexOf(" visited");
  if (visitedIdx >= 0) return { bold: names.slice(0, visitedIdx), rest: " visited" };
  return { bold: names, rest: "" };
}

export function RestaurantListCard({
  restaurantName,
  rating,
  reviewCount,
  distanceKm,
  cuisines,
  imageUrl,
  rank,
  deals,
  socialProof,
  onViewDetail,
  onBookDeal,
}: RestaurantListCardProps) {
  const isFriends = socialProof.variant === "friends";
  const snippetBg = isFriends ? "#FFF8EB" : "#EEFEF4";

  return (
    <div
      onClick={onViewDetail}
      style={{
        display:        "flex",
        flexDirection:  "column",
        gap:            8,
        paddingTop:     16,
        paddingBottom:  16,
        borderBottom:   "1px solid rgba(0,0,0,0.1)",
        cursor:         "pointer",
      }}
    >
      {/* ── Top row: image + info ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>

        {/* Image (96×96, rounded 12) */}
        <div style={{ position: "relative", flexShrink: 0, width: 96, height: 96, borderRadius: 12, overflow: "hidden" }}>
          <img
            src={imageUrl}
            alt={restaurantName}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {rank !== undefined && rank >= 1 && rank <= 3 && (
            <div style={{
              position:     "absolute",
              top:          8,
              left:         8,
              background:   "#FFC86A",
              borderRadius: 8,
              padding:      "2px 4px",
              fontFamily:   "var(--font-poppins)",
              fontSize:     10,
              fontWeight:   700,
              lineHeight:   "12px",
              color:        "#0A0A0A",
              whiteSpace:   "nowrap",
            }}>
              #{rank}
            </div>
          )}
        </div>

        {/* Info column */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>

          {/* Name */}
          <p style={{
            fontFamily:    "var(--font-poppins)",
            fontSize:      16,
            fontWeight:    700,
            lineHeight:    "20px",
            letterSpacing: "0.25px",
            color:         "#0A0A0A",
            margin:        0,
            overflow:      "hidden",
            textOverflow:  "ellipsis",
            whiteSpace:    "nowrap",
          }}>
            {restaurantName}
          </p>

          {/* Single-line secondary details */}
          <p style={{
            fontFamily:   "var(--font-poppins)",
            fontSize:     12,
            fontWeight:   500,
            color:        "#737373",
            margin:       0,
            whiteSpace:   "nowrap",
            overflow:     "hidden",
            textOverflow: "ellipsis",
          }}>
            ⭐ {rating} ({reviewCount}) · {distanceKm} km · {cuisines.join(", ")}
          </p>

          {/* Social proof snippet */}
          {(() => {
            const { bold, rest } = splitNames(socialProof.names);
            return (
              <div style={{
                background:    snippetBg,
                borderRadius:  8,
                padding:       "6px 8px",
                display:       "flex",
                flexDirection: "column",
                gap:           4,
              }}>
                {/* Quote — italic, first */}
                <p style={{
                  fontFamily:   "var(--font-poppins)",
                  fontSize:     12,
                  fontWeight:   600,
                  fontStyle:    "italic",
                  lineHeight:   "16px",
                  color:        "rgba(0,0,0,0.9)",
                  margin:       0,
                  overflow:     "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace:   "nowrap",
                }}>
                  {socialProof.quote}
                </p>

                {/* Names text then stacked avatars */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-poppins)", fontSize: 10, color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 600 }}>{bold}</span>
                    {rest}
                  </span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {socialProof.avatars.slice(0, 3).map((src, i) => (
                      <div
                        key={i}
                        style={{
                          width:        16,
                          height:       16,
                          borderRadius: "50%",
                          border:       "1px solid #FEFEFE",
                          overflow:     "hidden",
                          flexShrink:   0,
                          marginRight:  i < Math.min(socialProof.avatars.length, 3) - 1 ? -3 : 0,
                        }}
                      >
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── CTA buttons ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {deals.map((deal, i) => {
          if (!deal) return null;
          return (
            <button
              key={deal.id}
              onClick={(e) => { e.stopPropagation(); onBookDeal(deal.id); }}
              style={{
                width:        "100%",
                height:       36,
                borderRadius: 8,
                border:       "none",
                cursor:       "pointer",
                background:   i === 0 ? "#53F293" : "#F5F5F5",
                color:        "#0A0A0A",
                fontFamily:   "var(--font-poppins)",
                fontSize:     14,
                fontWeight:   600,
                lineHeight:   "18px",
              }}
            >
              Book deal – {deal.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
