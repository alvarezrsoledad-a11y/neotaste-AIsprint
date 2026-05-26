"use client";

import { useState, useRef, useEffect } from "react";
import { type Person, FRIENDS, NEOTASTERS, levelForVisits } from "@/data/people";
import { LevelBadge } from "./LevelBadge";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PeopleFilters {
  tab:               "friends" | "neotasters";
  cuisines:          string[];
  searchAreaKm:      number | null;
  recency:           string;
  selectedPersonIds: string[];
}

export interface PeopleFilterSheetProps {
  isOpen:         boolean;
  onClose:        () => void;
  onApply:        (filters: PeopleFilters) => void;
  onReset:        () => void;
  initialFilters: PeopleFilters | null;
  userHasFriends: boolean;
  friendCount:    number;
  neotasterCount: number;
  resultCount:    number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CUISINE_OPTIONS: { icon: string; label: string }[] = [
  { icon: "🍕", label: "Pizza"      },
  { icon: "🍔", label: "Burger"     },
  { icon: "🍣", label: "Sushi"      },
  { icon: "🔥", label: "BBQ"        },
  { icon: "🍝", label: "Pasta"      },
  { icon: "🥗", label: "Bowls"      },
  { icon: "🥪", label: "Sandwich"   },
  { icon: "🥂", label: "Drinks"     },
  { icon: "🍦", label: "Ice Cream"  },
  { icon: "🧋", label: "Bubble Tea" },
];

const SPRING_ENTER = "cubic-bezier(0.32, 0.72, 0, 1)";
const SPRING_EXIT  = "cubic-bezier(0.32, 0, 0.67, 0)";

const EMPTY_FILTERS: PeopleFilters = {
  tab:               "friends",
  cuisines:          [],
  searchAreaKm:      null,
  recency:           "Last Week",
  selectedPersonIds: [],
};

// Format friend / neotaster counts ("5 friends", "10k NeoTasters")
function formatTotal(n: number, singular: string, plural: string): string {
  const label = n === 1 ? singular : plural;
  if (n >= 1000) return `${Math.round(n / 100) / 10}k ${label}`;
  return `${n} ${label}`;
}

// ── PeopleFilterSheet ─────────────────────────────────────────────────────────

export function PeopleFilterSheet({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
  userHasFriends,
  friendCount,
  neotasterCount,
  resultCount,
}: PeopleFilterSheetProps) {
  const [tab, setTab]                             = useState<"friends" | "neotasters">(
    userHasFriends ? "friends" : "neotasters"
  );
  const [selectedCuisines, setSelectedCuisines]   = useState<string[]>([]);
  const [searchAreaKm, setSearchAreaKm]           = useState<number | null>(null);
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const [showAllCuisines, setShowAllCuisines]     = useState(false);
  const [searchName, setSearchName]               = useState("");

  // Drag-to-dismiss
  const [dragY, setDragY]      = useState(0);
  const dragStartY              = useRef<number | null>(null);
  const dragStartT              = useRef(0);

  // Restore draft from applied filters whenever sheet opens
  useEffect(() => {
    if (isOpen) {
      const init = initialFilters ?? { ...EMPTY_FILTERS, tab: userHasFriends ? "friends" : "neotasters" };
      setTab(init.tab);
      setSelectedCuisines(init.cuisines);
      setSearchAreaKm(init.searchAreaKm);
      setSelectedPersonIds(init.selectedPersonIds);
      setShowAllCuisines(false);
      setSearchName("");
      setDragY(0);
    }
  }, [isOpen, initialFilters, userHasFriends]);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const people         = tab === "friends" ? FRIENDS : NEOTASTERS;
  const filteredPeople = searchName.trim()
    ? people.filter(p => p.name.toLowerCase().includes(searchName.toLowerCase()))
    : people;

  const visibleCuisines = showAllCuisines ? CUISINE_OPTIONS : CUISINE_OPTIONS.slice(0, 6);
  const hasMoreCuisines = CUISINE_OPTIONS.length > 6 && !showAllCuisines;

  // Segment total (must cap CTA count)
  const segmentTotal = tab === "friends" ? friendCount : neotasterCount;

  // Mock filter reduction: each active filter trims results.
  const activeFilterCount =
    selectedCuisines.length +
    (searchAreaKm !== null ? 1 : 0) +
    (selectedPersonIds.length > 0 ? 1 : 0);
  const reduction   = Math.max(0.25, 1 - activeFilterCount * 0.15);
  const rawCount    = Math.round(resultCount * reduction);
  const dynamicCount = Math.max(1, Math.min(rawCount, segmentTotal));

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const toggleCuisine = (c: string) =>
    setSelectedCuisines(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );

  const togglePerson = (id: string) =>
    setSelectedPersonIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleApply = () => {
    onApply({ tab, cuisines: selectedCuisines, searchAreaKm, recency: "Last Week", selectedPersonIds });
    onClose();
  };

  const handleReset = () => {
    setSelectedCuisines([]);
    setSearchAreaKm(null);
    setSelectedPersonIds([]);
    setShowAllCuisines(false);
    setSearchName("");
    setTab(userHasFriends ? "friends" : "neotasters");
    onReset();
    onClose();
  };

  // ── Drag-to-dismiss ──────────────────────────────────────────────────────────

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    dragStartT.current = Date.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartY.current === null) return;
    const dy = e.clientY - dragStartY.current;
    if (dy > 0) setDragY(dy);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartY.current === null) return;
    const dy       = e.clientY - dragStartY.current;
    const dt       = Math.max(Date.now() - dragStartT.current, 1);
    const velocity = (dy / dt) * 1000;
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.3 : 250;
    if (dy > threshold || velocity > 500) onClose();
    setDragY(0);
    dragStartY.current = null;
  };

  // ── Styles ───────────────────────────────────────────────────────────────────

  const sheetTransform  = dragY > 0
    ? `translateY(${dragY}px)`
    : isOpen ? "translateY(0)" : "translateY(105%)";
  const sheetTransition = dragY > 0
    ? "none"
    : `transform 0.38s ${isOpen ? SPRING_ENTER : SPRING_EXIT}`;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop — does NOT close on tap */}
      <div
        style={{
          position:      "absolute",
          inset:         0,
          zIndex:        60,
          background:    "rgba(0,0,0,0.4)",
          opacity:       isOpen ? 1 : 0,
          transition:    "opacity 0.38s ease",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position:      "absolute",
          left:          0,
          right:         0,
          bottom:        0,
          zIndex:        61,
          background:    "#FEFEFE",
          borderRadius:  "20px 20px 0 0",
          display:       "flex",
          flexDirection: "column",
          maxHeight:     "90vh",
          transform:     sheetTransform,
          transition:    sheetTransition,
          willChange:    "transform",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* ── Drag handle + H2 title ─────────────────────────────────────── */}
        <div
          style={{
            flexShrink:    0,
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            gap:           12,
            paddingTop:    12,
            paddingBottom: 16,
            paddingLeft:   16,
            paddingRight:  16,
            cursor:        "grab",
            touchAction:   "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div style={{ width: 44, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.1)" }} />
          {/* Fix 1 — Heading/H2 */}
          <p style={{
            width:         "100%",
            fontFamily:    "var(--font-poppins)",
            fontSize:      24,
            fontWeight:    700,
            lineHeight:    "32px",
            letterSpacing: "-0.25px",
            color:         "#0A0A0A",
            margin:        0,
          }}>
            People
          </p>
        </div>

        {/* ── Fix 2 — Segmented control ──────────────────────────────────── */}
        <div style={{ flexShrink: 0, paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}>
          <SegmentedControl
            tab={tab}
            onChange={setTab}
            friendCount={friendCount}
            neotasterCount={neotasterCount}
          />
        </div>

        {/* ── Scrollable content ────────────────────────────────────────── */}
        <div
          style={{
            flex:         1,
            minHeight:    0,
            overflowY:    "auto",
            paddingLeft:  16,
            paddingRight: 16,
            display:      "flex",
            flexDirection:"column",
            gap:          32,  // Fix 8 — 32px between subsections
          }}
        >
          {/* ── Fix 4 — Cuisine ───────────────────────────────────────── */}
          <Section title="Cuisine">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {visibleCuisines.map(c => (
                <FilterChip
                  key={c.label}
                  label={c.label}
                  leftIcon={c.icon}
                  active={selectedCuisines.includes(c.label)}
                  onClick={() => toggleCuisine(c.label)}
                />
              ))}
            </div>
            {hasMoreCuisines && (
              <button
                onClick={() => setShowAllCuisines(true)}
                style={{
                  background:     "transparent",
                  border:         "none",
                  padding:        "8px 0 0 0",
                  cursor:         "pointer",
                  fontFamily:     "var(--font-poppins)",
                  fontSize:       13,
                  fontWeight:     600,
                  color:          "#0A0A0A",
                  textDecoration: "underline",
                  alignSelf:      "flex-start",
                }}
              >
                Show more
              </button>
            )}
          </Section>

          {/* ── Search area slider ────────────────────────────────────── */}
          <Section
            title="Search area"
            right={
              <span style={{
                fontFamily: "var(--font-poppins)",
                fontSize:   13,
                fontWeight: 600,
                color:      "rgba(0,0,0,0.7)",
              }}>
                {searchAreaKm === null ? "No limit" : `${searchAreaKm} km`}
              </span>
            }
          >
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={searchAreaKm === null ? 0 : searchAreaKm}
              onChange={e => {
                const v = parseInt(e.target.value, 10);
                setSearchAreaKm(v === 0 ? null : v);
              }}
              style={{ width: "100%", accentColor: "#11301D" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 11, color: "#B3B3B3" }}>No limit</span>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 11, color: "#B3B3B3" }}>20 km</span>
            </div>
          </Section>

          {/* ── Fix 5/6 — Friends or NeoTasters subsection ──────────── */}
          <Section title={tab === "friends" ? "Friends" : "NeoTasters"}>
            {/* Non-functional dropdown chip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <FilterChip
                label="Visited: Last Week"
                rightIcon="chevron"
                active={false}
                onClick={() => { /* non-functional */ }}
              />
            </div>

            {/* NeoTasters: search field */}
            {tab === "neotasters" && (
              <div style={{ marginTop: 12 }}>
                <SearchBar
                  value={searchName}
                  onChange={setSearchName}
                  placeholder="Search names"
                />
              </div>
            )}

            {/* People list */}
            <div style={{ marginTop: 12 }}>
              {filteredPeople.map(person => (
                <PersonRow
                  key={person.id}
                  person={person}
                  isSelected={selectedPersonIds.includes(person.id)}
                  onToggle={() => togglePerson(person.id)}
                />
              ))}
            </div>
          </Section>

          {/* Bottom spacer */}
          <div style={{ height: 32 }} />
        </div>

        {/* ── Fix 9 — Sticky CTAs ───────────────────────────────────────── */}
        <div style={{
          flexShrink:    0,
          padding:       "12px 16px",
          paddingBottom: "max(24px, env(safe-area-inset-bottom))",
          borderTop:     "1px solid rgba(0,0,0,0.08)",
          background:    "#FEFEFE",
          display:       "flex",
          flexDirection: "row",
          gap:           8,
          alignItems:    "stretch",
        }}>
          <button
            onClick={handleReset}
            style={{
              flex:         "0 0 auto",
              minWidth:     120,
              height:       48,
              borderRadius: 12,
              border:       "1px solid rgba(0,0,0,0.1)",
              background:   "#FEFEFE",
              cursor:       "pointer",
              fontFamily:   "var(--font-poppins)",
              fontSize:     14,
              fontWeight:   600,
              color:        "#0A0A0A",
            }}
          >
            Reset filters
          </button>
          <button
            onClick={handleApply}
            style={{
              flex:         1,
              height:       48,
              borderRadius: 12,
              border:       "none",
              background:   "#53F293",
              cursor:       "pointer",
              fontFamily:   "var(--font-poppins)",
              fontSize:     16,
              fontWeight:   700,
              color:        "#0A0A0A",
            }}
          >
            Show {dynamicCount.toLocaleString()} results
          </button>
        </div>
      </div>
    </>
  );

  // ── Helper for the formatTotal function (closure access) ─────────────────
  function SegmentedControl({
    tab, onChange, friendCount, neotasterCount,
  }: {
    tab:            "friends" | "neotasters";
    onChange:       (t: "friends" | "neotasters") => void;
    friendCount:    number;
    neotasterCount: number;
  }) {
    return (
      <div style={{
        display:        "flex",
        alignItems:     "stretch",
        border:         "1px solid rgba(0,0,0,0.1)",
        borderRadius:   12,
        padding:        4,
        width:          "100%",
        position:       "relative",
      }}>
        <Segment
          isActive={tab === "friends"}
          label="Friends"
          description={formatTotal(friendCount, "friend", "friends")}
          onClick={() => onChange("friends")}
        />
        {/* 1px vertical divider */}
        <div style={{ width: 1, background: "rgba(0,0,0,0.1)", alignSelf: "stretch", marginTop: 4, marginBottom: 4 }} />
        <Segment
          isActive={tab === "neotasters"}
          label="NeoTasters"
          description={formatTotal(neotasterCount, "NeoTaster", "NeoTasters")}
          onClick={() => onChange("neotasters")}
        />
      </div>
    );
  }
}

// ── Segment ───────────────────────────────────────────────────────────────────

function Segment({
  isActive, label, description, onClick,
}: {
  isActive:    boolean;
  label:       string;
  description: string;
  onClick:     () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex:           1,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            2,
        paddingTop:     12,
        paddingBottom:  12,
        paddingLeft:    8,
        paddingRight:   8,
        borderRadius:   12,
        border:         isActive ? "2px solid #11301D" : "none",
        background:     isActive ? "#F5F5F5" : "#FEFEFE",
        cursor:         "pointer",
        transition:     "background 0.15s ease, border-color 0.15s ease",
      }}
    >
      <span style={{
        fontFamily: "var(--font-poppins)",
        fontSize:   14,
        fontWeight: 600,
        color:      "#0A0A0A",
        lineHeight: "20px",
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "var(--font-poppins)",
        fontSize:   12,
        fontWeight: 500,
        color:      "rgba(0,0,0,0.7)",
        lineHeight: "16px",
      }}>
        {description}
      </span>
    </button>
  );
}

// ── Section wrapper (H5 title) ────────────────────────────────────────────────

function Section({
  title, right, children,
}: {
  title:    string;
  right?:   React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        marginBottom:   12,
      }}>
        {/* Heading/H5 */}
        <p style={{
          fontFamily: "var(--font-poppins)",
          fontSize:   16,
          fontWeight: 600,
          lineHeight: "22px",
          color:      "#0A0A0A",
          margin:     0,
        }}>
          {title}
        </p>
        {right}
      </div>
      {children}
    </div>
  );
}

// ── FilterChip (Figma node 385-43069) ─────────────────────────────────────────

function FilterChip({
  label, leftIcon, rightIcon, active, onClick,
}: {
  label:      string;
  leftIcon?:  string;
  rightIcon?: "chevron";
  active:     boolean;
  onClick:    () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          6,
        height:       32,
        paddingLeft:  12,
        paddingRight: 12,
        paddingTop:   8,
        paddingBottom:8,
        borderRadius: 32,
        border:       active ? "2px solid #11301D" : "1px solid rgba(0,0,0,0.1)",
        background:   "#FEFEFE",
        cursor:       "pointer",
        whiteSpace:   "nowrap",
        transition:   "border-color 0.15s ease",
      }}
    >
      {leftIcon && <span style={{ fontSize: 12, lineHeight: 1 }}>{leftIcon}</span>}
      <span style={{
        fontFamily: "var(--font-poppins)",
        fontSize:   14,
        fontWeight: 600,
        color:      "#0A0A0A",
        lineHeight: "16px",
      }}>
        {label}
      </span>
      {rightIcon === "chevron" && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

// ── SearchBar (Figma node 385-43129, resting/default) ─────────────────────────

function SearchBar({
  value, onChange, placeholder,
}: {
  value:       string;
  onChange:    (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{
      display:       "flex",
      alignItems:    "center",
      gap:           8,
      background:    "#F5F5F5",
      borderRadius:  32,
      paddingLeft:   16,
      paddingRight:  16,
      paddingTop:    12,
      paddingBottom: 12,
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="5" stroke="#737373" strokeWidth="1.5"/>
        <path d="M10.5 10.5L14 14" stroke="#737373" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          flex:       1,
          border:     "none",
          background: "transparent",
          fontFamily: "var(--font-poppins)",
          fontSize:   14,
          fontWeight: 500,
          color:      "#0A0A0A",
          outline:    "none",
        }}
      />
    </div>
  );
}

// ── PersonRow ─────────────────────────────────────────────────────────────────

function PersonRow({
  person, isSelected, onToggle,
}: {
  person:     Person;
  isSelected: boolean;
  onToggle:   () => void;
}) {
  const level = levelForVisits(person.visitCount);
  return (
    <div
      onClick={onToggle}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           12,
        paddingTop:    10,
        paddingBottom: 10,
        borderBottom:  "1px solid rgba(0,0,0,0.06)",
        cursor:        "pointer",
      }}
    >
      {/* Avatar — no verified checkmark anymore */}
      <div style={{
        width:        44,
        height:       44,
        borderRadius: "50%",
        overflow:     "hidden",
        border:       `2px solid ${isSelected ? "#11301D" : "transparent"}`,
        flexShrink:   0,
        transition:   "border-color 0.15s ease",
      }}>
        <img
          src={person.avatarUrl}
          alt={person.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Name (with inline level badge) + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <p style={{
            fontFamily:   "var(--font-poppins)",
            fontSize:     14,
            fontWeight:   700,
            color:        "#0A0A0A",
            margin:       0,
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}>
            {person.name}
          </p>
          <LevelBadge level={level} />
        </div>
        <p style={{
          fontFamily:   "var(--font-poppins)",
          fontSize:     12,
          fontWeight:   500,
          color:        "#737373",
          margin:       0,
          overflow:     "hidden",
          textOverflow: "ellipsis",
          whiteSpace:   "nowrap",
        }}>
          {person.lastVisitLabel} · {person.cuisines.join(", ")}
        </p>
      </div>

      {/* Visit count — plain text, no emoji */}
      <span style={{
        flexShrink: 0,
        fontFamily: "var(--font-poppins)",
        fontSize:   12,
        fontWeight: 600,
        color:      "#0A0A0A",
      }}>
        {person.visitCount} visits
      </span>

      {/* Checkbox */}
      <div style={{
        flexShrink:     0,
        width:          20,
        height:         20,
        borderRadius:   6,
        border:         isSelected ? "none" : "2px solid #E5E5E5",
        background:     isSelected ? "#11301D" : "transparent",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        transition:     "all 0.15s ease",
      }}>
        {isSelected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#FEFEFE"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
