"use client";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DealOption {
  id:    string;
  title: string;
}

export interface SocialProofProps {
  variant: "friends" | "neotasters";
  quote:   string;
  names:   string;   // e.g. "Mason Phillips and +73 visited"
  avatars: string[]; // avatar URLs
}

export interface RestaurantCardProps {
  restaurantName: string;
  rating:         number;
  reviewCount:    number;
  distanceKm:     number;
  cuisines:       string[];
  imageUrl:       string;
  rank?:          number;                     // 1–3 → amber "#N" tag on image
  deals:          [DealOption, DealOption?];  // 1 or 2 deals
  socialProof:    SocialProofProps;           // always required
  /** Whether the card is currently exiting (triggers slide-down animation) */
  isExiting:      boolean;
  onClose:        () => void;
  onBookDeal:     (dealId: string) => void;
  onViewDetail:   () => void;
}

// Spring cubic-beziers
const SPRING_ENTER = "cubic-bezier(0.34, 1.3, 0.64, 1)";   // slight overshoot — iOS feel
const SPRING_EXIT  = "cubic-bezier(0.32, 0, 0.67, 0)";      // ease-in for exit

// Split "Mason Phillips and +73 visited" → bold name + regular suffix
function splitNames(names: string): { bold: string; rest: string } {
  const andIdx = names.indexOf(" and ");
  if (andIdx >= 0) return { bold: names.slice(0, andIdx), rest: names.slice(andIdx) };
  const visitedIdx = names.lastIndexOf(" visited");
  if (visitedIdx >= 0) return { bold: names.slice(0, visitedIdx), rest: " visited this week" };
  return { bold: names, rest: "" };
}

// ── Component ─────────────────────────────────────────────────────────────────
export function RestaurantCard({
  restaurantName,
  rating,
  reviewCount,
  distanceKm,
  cuisines,
  imageUrl,
  rank,
  deals,
  socialProof,
  isExiting,
  onClose,
  onBookDeal,
  onViewDetail,
}: RestaurantCardProps) {
  const isFriends  = socialProof.variant === "friends";
  const snippetBg  = isFriends ? "#FFF8EB" : "#EEFEF4";

  const transform  = isExiting ? "translateY(110%)" : "translateY(0)";
  const transition = isExiting
    ? `transform 0.30s ${SPRING_EXIT}`
    : `transform 0.42s ${SPRING_ENTER}`;

  return (
    <div
      style={{
        transform,
        transition,
        willChange: "transform",
      }}
    >
      <div
        onClick={onViewDetail}
        style={{
          background: "#FEFEFE",
          border:     "1px solid #E5E5E5",
          boxShadow:  "0px 2px 14px rgba(67,67,67,0.25)",
          borderRadius: 16,
          padding:    8,
          display:    "flex",
          flexDirection: "column",
          gap:        8,
          cursor:     "pointer",
        }}
      >
        {/* ── Top row: image + info ───────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", position: "relative" }}>

          {/* Image (96×96, rounded 12) */}
          <div style={{ position: "relative", flexShrink: 0, width: 96, height: 96, borderRadius: 12, overflow: "hidden" }}>
            <img
              src={imageUrl}
              alt={restaurantName}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Rank tag — only when rank prop provided */}
            {rank !== undefined && rank >= 1 && rank <= 3 && (
              <div
                style={{
                  position:     "absolute",
                  top:          8,
                  left:         8,
                  background:   "#262626",
                  borderRadius: 8,
                  padding:      "2px 4px",
                  fontFamily:   "var(--font-poppins)",
                  fontSize:     10,
                  fontWeight:   700,
                  lineHeight:   "12px",
                  color:        "#FEFEFE",
                  whiteSpace:   "nowrap",
                }}
              >
                #{rank}
              </div>
            )}
          </div>

          {/* Info column */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>

            {/* Name */}
            <p
              style={{
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
              }}
            >
              {restaurantName}
            </p>

            {/* Rating · distance · cuisines — single line, truncate with ellipsis */}
            <p
              style={{
                fontFamily:   "var(--font-poppins)",
                fontSize:     12,
                fontWeight:   500,
                color:        "#737373",
                margin:       0,
                whiteSpace:   "nowrap",
                overflow:     "hidden",
                textOverflow: "ellipsis",
              }}
            >
              ⭐ {rating} ({reviewCount}) · {distanceKm} km · {cuisines.join(", ")}
            </p>

            {/* Social proof snippet — always rendered */}
            {(() => {
              const { bold, rest } = splitNames(socialProof.names);
              return (
                <div
                  style={{
                    background:    snippetBg,
                    borderRadius:  8,
                    padding:       "6px 8px",
                    display:       "flex",
                    flexDirection: "column",
                    gap:           4,
                  }}
                >
                  {/* Quote — italic */}
                  <p
                    style={{
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
                    }}
                  >
                    {socialProof.quote}
                  </p>

                  {/* Names + avatars — text first, avatars after */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {/* Names text */}
                    <span style={{ fontFamily: "var(--font-poppins)", fontSize: 10, color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: 600 }}>{bold}</span>
                      {rest}
                    </span>

                    {/* Stacked avatars */}
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

          {/* ✕ close button — absolute top-right */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Close"
            style={{
              position:   "absolute",
              top:        0,
              right:      0,
              width:      20,
              height:     20,
              borderRadius: "50%",
              background: "transparent",
              border:     "none",
              cursor:     "pointer",
              display:    "flex",
              alignItems: "center",
              justifyContent: "center",
              padding:    0,
            }}
          >
            {/* Circle-X icon matching Figma chunk/circle-x */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#F5F5F5" />
              <path d="M7 7L13 13M13 7L7 13" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── CTA buttons ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {deals.map((deal, i) => {
            if (!deal) return null;
            const isPrimary = i === 0;
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
                  background:   isPrimary ? "#53F293" : "#F5F5F5",
                  color:        "#0A0A0A",
                  fontFamily:   "var(--font-poppins)",
                  fontSize:     14,
                  fontWeight:   600,
                  lineHeight:   "18px",
                  letterSpacing: 0,
                }}
              >
                Book deal – {deal.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
