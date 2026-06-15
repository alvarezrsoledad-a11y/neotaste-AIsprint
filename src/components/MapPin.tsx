"use client";

import React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export type MapPinType  = "tiny" | "default" | "friends" | "neotaster";
export type MapPinState = "default" | "active";

export interface MapPinProps {
  type:        MapPinType;
  state?:      MapPinState;  // defaults to 'default'
  rank?:       number;       // 1–3, amber "#N" tag. Only on 'default' and 'friends'
  extraCount?: number;       // "+N" badge. Only on 'friends' and 'neotaster'
  avatarUrl?:  string;       // required for 'friends' and 'neotaster'
  onPress?:    () => void;
}

// ── Shared SVG path data — inlined from public/assets/pins/ ──────────────────
// All 32×32 pins share these three structural paths.
const D_SHADOW =
  "M32 16.0568C32 21.5455 12 32 12 32C12 32 9 21.5455 9 16.0568C9 14.1852 10.2116 12.3903 " +
  "12.3683 11.0669C14.5249 9.74348 17.45 9 20.5 9C23.55 9 26.4751 9.74348 28.6317 11.0669C" +
  "30.7884 12.3903 32 14.1852 32 16.0568Z";

const D_BODY =
  "M0 12V12.5853C0 15.4431 0.972602 18.2158 2.75783 20.4473L12 32L21.2422 20.4473C23.0274 " +
  "18.2158 24 15.4431 24 12.5853V12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12Z";

const D_STROKE =
  "M12 0.5C18.3513 0.5 23.5 5.64873 23.5 12V12.585C23.5 15.3292 22.5659 17.9919 20.8516 " +
  "20.1348L12 31.1992L3.14844 20.1348C1.43414 17.9919 0.5 15.3292 0.5 12.585V12C0.5 5.64873 " +
  "5.64873 0.5 12 0.5Z";

// "N" logo — present in default pins and tiny-active.
const D_N =
  "M17.4429 17.0429C17.7644 16.9861 18 16.6914 18 16.3462V5.35327C18 5.13502 17.8151 4.96901 " +
  "17.6119 5.00489L14.2785 5.59353C14.1178 5.62191 14 5.76925 14 5.9419V11.6468L10.2443 " +
  "6.6727C10.0935 6.47288 9.8524 6.37514 9.6142 6.41721L6.56039 6.95648L6.55707 6.95707C" +
  "6.23561 7.01384 6 7.30852 6 7.65382V18.6467C6 18.865 6.18495 19.031 6.38813 18.9951L" +
  "9.72147 18.4064C9.8822 18.3781 10 18.2307 10 18.058V12.3532L13.7557 17.3273C13.9065 " +
  "17.5271 14.1476 17.6248 14.3858 17.5828L14.3881 17.5824L17.4396 17.0435L17.4429 17.0429Z";

// Tiny-default paths — separate SVG (11×12 viewBox).
const D_TINY_SHADOW =
  "M10.6667 5.51953C10.6667 7.40625 4 11 4 11C4 11 3 7.40625 3 5.51953C3 4.87617 3.40387 " +
  "4.25917 4.12276 3.80424C4.84165 3.34932 5.81667 3.09375 6.83333 3.09375C7.85 3.09375 " +
  "8.82502 3.34932 9.54391 3.80424C10.2628 4.25917 10.6667 4.87617 10.6667 5.51953Z";

const D_TINY_BODY =
  "M0 4.6665V4.86161C0 5.8142 0.324201 6.73842 0.919278 7.48227L4 11.3332L7.08072 7.48227C" +
  "7.6758 6.73842 8 5.8142 8 4.86161V4.6665C8 2.45736 6.20914 0.666504 4 0.666504C1.79086 " +
  "0.666504 0 2.45737 0 4.6665Z";

const D_TINY_STROKE =
  "M4 1.1665C5.933 1.1665 7.5 2.73351 7.5 4.6665V4.86182C7.49995 5.70064 7.21435 6.51436 " +
  "6.69043 7.16943L4 10.5317L1.30957 7.16943C0.785648 6.51436 0.500047 5.70064 0.5 4.86182V" +
  "4.6665C0.5 2.73351 2.067 1.1665 4 1.1665Z";

// ── SVG renderers — inlined from public/assets/pins/ ─────────────────────────

/** pins-tiny-default.svg — 11×12 */
function SvgTinyDefault() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity={0.1} d={D_TINY_SHADOW} fill="#1C1D28" />
      <path fillRule="evenodd" clipRule="evenodd" d={D_TINY_BODY} fill="#53F293" />
      <path d={D_TINY_STROKE} stroke="#1C1D28" strokeOpacity={0.1} />
    </svg>
  );
}

/** pins-tiny-active.svg — 32×32 (dark N pin; shown when tiny pin is selected) */
function SvgTinyActive() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity={0.1} d={D_SHADOW} fill="#1C1D28" />
      <path fillRule="evenodd" clipRule="evenodd" d={D_BODY} fill="#11301D" />
      <path d={D_STROKE} stroke="#1C1D28" strokeOpacity={0.1} />
      <path fillRule="evenodd" clipRule="evenodd" d={D_N} fill="#FEFEFE" />
    </svg>
  );
}

/** pins-default-default.svg — green pin, dark N logo */
function SvgDefaultDefault() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity={0.1} d={D_SHADOW} fill="#1C1D28" />
      <path fillRule="evenodd" clipRule="evenodd" d={D_BODY} fill="#53F293" />
      <path d={D_STROKE} stroke="#1C1D28" strokeOpacity={0.1} />
      <path fillRule="evenodd" clipRule="evenodd" d={D_N} fill="#1C1D28" />
    </svg>
  );
}

/** pins-default-active.svg — dark pin, white N logo */
function SvgDefaultActive() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity={0.1} d={D_SHADOW} fill="#1C1D28" />
      <path fillRule="evenodd" clipRule="evenodd" d={D_BODY} fill="#11301D" />
      <path d={D_STROKE} stroke="#1C1D28" strokeOpacity={0.1} />
      <path fillRule="evenodd" clipRule="evenodd" d={D_N} fill="#FEFEFE" />
    </svg>
  );
}

/** pins-friends-default.svg — mango pin, no logo (avatar overlaid in code) */
function SvgFriendsDefault() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity={0.1} d={D_SHADOW} fill="#1C1D28" />
      <path fillRule="evenodd" clipRule="evenodd" d={D_BODY} fill="#FFC86A" />
      <path d={D_STROKE} stroke="#1C1D28" strokeOpacity={0.1} />
    </svg>
  );
}

/** pins-friends-active.svg — deep mango pin */
function SvgFriendsActive() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity={0.1} d={D_SHADOW} fill="#1C1D28" />
      <path fillRule="evenodd" clipRule="evenodd" d={D_BODY} fill="#FF9B20" />
      <path d={D_STROKE} stroke="#1C1D28" strokeOpacity={0.1} />
    </svg>
  );
}

/** pins-neotaster-default.svg — green pin, no logo (avatar overlaid in code) */
function SvgNeotasterDefault() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity={0.1} d={D_SHADOW} fill="#1C1D28" />
      <path fillRule="evenodd" clipRule="evenodd" d={D_BODY} fill="#53F293" />
      <path d={D_STROKE} stroke="#1C1D28" strokeOpacity={0.1} />
    </svg>
  );
}

/** pins-neotaster-active.svg — dark pin */
function SvgNeotasterActive() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity={0.1} d={D_SHADOW} fill="#1C1D28" />
      <path fillRule="evenodd" clipRule="evenodd" d={D_BODY} fill="#11301D" />
      <path d={D_STROKE} stroke="#1C1D28" strokeOpacity={0.1} />
    </svg>
  );
}

// ── Rank tag — amber pill, top-right of pin head ──────────────────────────────
function RankTag({ rank }: { rank: number }) {
  return (
    <div
      style={{
        position:      "absolute",
        left:          12,
        top:           -8,
        background:    "#262626",
        borderRadius:  8,
        padding:       "2px 4px",
        display:       "flex",
        alignItems:    "center",
        zIndex:        2,
        pointerEvents: "none",
        lineHeight:    0,
      }}
    >
      <span
        style={{
          fontSize:   10,
          fontWeight: 700,
          lineHeight: "12px",
          color:      "#FEFEFE",
          fontFamily: "var(--font-poppins)",
          whiteSpace: "nowrap",
        }}
      >
        #{rank}
      </span>
    </div>
  );
}

// ── Extra-count badge — bottom-right of pin head ──────────────────────────────
function ExtraBadge({
  count,
  type,
}: {
  count: number;
  type:  "friends" | "neotaster";
}) {
  const isFriends = type === "friends";
  return (
    <div
      style={{
        position:       "absolute",
        left:           14,
        top:            14,
        background:     isFriends ? "#FFF8EB" : "#D8FFE7",
        border:         "1px solid #FEFEFE",
        borderRadius:   100,
        padding:        2,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         2,
        pointerEvents:  "none",
        minWidth:       14,
        lineHeight:     0,
      }}
    >
      <span
        style={{
          fontSize:   10,
          fontWeight: 600,
          lineHeight: "10px",
          color:      isFriends ? "#FF9B20" : "#219750",
          fontFamily: "var(--font-poppins)",
          whiteSpace: "nowrap",
        }}
      >
        +{count}
      </span>
    </div>
  );
}

// ── MapPin ────────────────────────────────────────────────────────────────────
export function MapPin({
  type,
  state    = "default",
  rank,
  extraCount,
  avatarUrl,
  onPress,
}: MapPinProps) {
  const isActive   = state === "active";
  const showAvatar = (type === "friends" || type === "neotaster") && !!avatarUrl;
  const showRank   = !!rank && rank >= 1 && rank <= 3 && (type === "default" || type === "friends");
  const showBadge  = !!extraCount && (type === "friends" || type === "neotaster");

  // ── Tiny ─────────────────────────────────────────────────────────────────
  // All pins live in a 32×32 Leaflet wrapper (iconAnchor [12,32]).
  // tiny-default is 11×12; offset by (8, 21) so its tip aligns with anchor (12,32).
  // tiny-active is natively 32×32 and fills the container directly.
  if (type === "tiny") {
    return (
      <div
        onClick={onPress}
        style={{ width: 32, height: 32, position: "relative", cursor: onPress ? "pointer" : "default" }}
      >
        {isActive ? (
          <SvgTinyActive />
        ) : (
          <div style={{ position: "absolute", left: 8, top: 21 }}>
            <SvgTinyDefault />
          </div>
        )}
      </div>
    );
  }

  // ── Default / Friends / Neotaster ────────────────────────────────────────
  const SvgPin =
    type === "default"   && !isActive ? SvgDefaultDefault   :
    type === "default"   &&  isActive ? SvgDefaultActive    :
    type === "friends"   && !isActive ? SvgFriendsDefault   :
    type === "friends"   &&  isActive ? SvgFriendsActive    :
    type === "neotaster" && !isActive ? SvgNeotasterDefault :
                                        SvgNeotasterActive;

  return (
    <div
      onClick={onPress}
      style={{ width: 32, height: 32, position: "relative", cursor: onPress ? "pointer" : "default" }}
    >
      {/* Pin body — inlined SVG from /public/assets/pins/ */}
      <SvgPin />

      {/* Circular avatar — layered over pin head for friends / neotaster */}
      {showAvatar && (
        <div
          style={{
            position:      "absolute",
            left:          4,
            top:           4,
            width:         16,
            height:        16,
            borderRadius:  "50%",
            border:        "1px solid #FEFEFE",
            overflow:      "hidden",
            pointerEvents: "none",
          }}
        >
          <img
            src={avatarUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Rank tag */}
      {showRank && <RankTag rank={rank!} />}

      {/* Extra-count badge */}
      {showBadge && (
        <ExtraBadge
          count={extraCount!}
          type={type as "friends" | "neotaster"}
        />
      )}
    </div>
  );
}
