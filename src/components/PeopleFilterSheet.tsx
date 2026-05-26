"use client";

import { useState, useRef, useEffect } from "react";
import { type Person, FRIENDS, NEOTASTERS } from "@/data/people";

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
  userHasFriends: boolean;
  friendCount:    number;
  neotasterCount: number;
  resultCount:    number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CUISINE_OPTIONS = [
  "Italian", "Japanese", "Thai", "Mexican", "French",
  "Korean", "Chinese", "Indian", "Mediterranean", "American",
];

const SPRING_ENTER = "cubic-bezier(0.32, 0.72, 0, 1)";
const SPRING_EXIT  = "cubic-bezier(0.32, 0, 0.67, 0)";

// ── PeopleFilterSheet ─────────────────────────────────────────────────────────

export function PeopleFilterSheet({
  isOpen,
  onClose,
  onApply,
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
  const [dragY, setDragY]     = useState(0);
  const dragStartY             = useRef<number | null>(null);
  const dragStartT             = useRef(0);

  // Reset state whenever sheet is opened
  useEffect(() => {
    if (isOpen) {
      setTab(userHasFriends ? "friends" : "neotasters");
      setSelectedCuisines([]);
      setSearchAreaKm(null);
      setSelectedPersonIds([]);
      setShowAllCuisines(false);
      setSearchName("");
      setDragY(0);
    }
  }, [isOpen, userHasFriends]);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const people         = tab === "friends" ? FRIENDS : NEOTASTERS;
  const filteredPeople = searchName.trim()
    ? people.filter(p => p.name.toLowerCase().includes(searchName.toLowerCase()))
    : people;

  const visibleCuisines = showAllCuisines ? CUISINE_OPTIONS : CUISINE_OPTIONS.slice(0, 6);
  const hasMoreCuisines = CUISINE_OPTIONS.length > 6 && !showAllCuisines;

  // Dynamic result count: proportional to how many people are selected
  const total      = tab === "friends" ? Math.max(friendCount, 1) : Math.max(neotasterCount, 1);
  const dynamicCount = selectedPersonIds.length > 0
    ? Math.max(1, Math.round(resultCount * selectedPersonIds.length / total))
    : resultCount;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const toggleCuisine = (c: string) =>
    setSelectedCuisines(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );

  const togglePerson = (id: string) =>
    setSelectedPersonIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleReset = () => {
    setSelectedCuisines([]);
    setSearchAreaKm(null);
    setSelectedPersonIds([]);
    setShowAllCuisines(false);
    setSearchName("");
  };

  const handleApply = () => {
    onApply({ tab, cuisines: selectedCuisines, searchAreaKm, recency: "", selectedPersonIds });
    onClose();
  };

  const handleResetAndClose = () => {
    handleReset();
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
    const velocity = (dy / dt) * 1000; // px/s
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.3 : 250;
    if (dy > threshold || velocity > 500) {
      onClose();
    }
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
      {/* ── Backdrop — intentionally does NOT close on tap ────────────────── */}
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

      {/* ── Sheet ─────────────────────────────────────────────────────────── */}
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
          maxHeight:     "85vh",
          transform:     sheetTransform,
          transition:    sheetTransition,
          willChange:    "transform",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* ── Drag handle + title ───────────────────────────────────────── */}
        <div
          style={{
            flexShrink:     0,
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            12,
            paddingTop:     12,
            paddingBottom:  16,
            paddingLeft:    16,
            paddingRight:   16,
            cursor:         "grab",
            touchAction:    "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div style={{
            width:        44,
            height:       4,
            borderRadius: 2,
            background:   "rgba(0,0,0,0.1)",
          }} />
          <p style={{
            width:      "100%",
            fontFamily: "var(--font-poppins)",
            fontSize:   17,
            fontWeight: 700,
            lineHeight: "22px",
            color:      "#0A0A0A",
            margin:     0,
          }}>
            People
          </p>
        </div>

        {/* ── Tab toggle: Friends / NeoTasters ─────────────────────────── */}
        <div style={{ flexShrink: 0, paddingLeft: 16, paddingRight: 16, paddingBottom: 12 }}>
          <div style={{
            display:      "flex",
            background:   "#F5F5F5",
            borderRadius: 12,
            padding:      3,
          }}>
            {(["friends", "neotasters"] as const).map(t => {
              const isActive = tab === t;
              const label    = t === "friends" ? "Friends" : "NeoTasters";
              const count    = t === "friends" ? friendCount : neotasterCount;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex:         1,
                    height:       36,
                    borderRadius: 10,
                    border:       "none",
                    background:   isActive ? "#FEFEFE" : "transparent",
                    boxShadow:    isActive ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                    cursor:       "pointer",
                    fontFamily:   "var(--font-poppins)",
                    fontSize:     14,
                    fontWeight:   isActive ? 700 : 500,
                    color:        isActive ? "#0A0A0A" : "#737373",
                    transition:   "all 0.2s ease",
                  }}
                >
                  {label} · {count.toLocaleString()}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Scrollable content ────────────────────────────────────────── */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingLeft: 16, paddingRight: 16 }}>

          {/* NeoTasters: search by name field */}
          {tab === "neotasters" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display:       "flex",
                alignItems:    "center",
                gap:           8,
                background:    "#F5F5F5",
                borderRadius:  12,
                padding:       "10px 14px",
              }}>
                <span style={{ fontSize: 14 }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search names"
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
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
            </div>
          )}

          {/* Cuisine Style chips */}
          <div style={{ marginBottom: 16 }}>
            <p style={{
              fontFamily: "var(--font-poppins)",
              fontSize:   14,
              fontWeight: 700,
              color:      "#0A0A0A",
              margin:     "0 0 8px 0",
            }}>
              Cuisine Style
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {visibleCuisines.map(c => {
                const active = selectedCuisines.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    style={{
                      height:       32,
                      borderRadius: 16,
                      border:       `1.5px solid ${active ? "#53F293" : "#E5E5E5"}`,
                      background:   active ? "#EEFEF4" : "#FEFEFE",
                      paddingLeft:  12,
                      paddingRight: 12,
                      cursor:       "pointer",
                      fontFamily:   "var(--font-poppins)",
                      fontSize:     13,
                      fontWeight:   active ? 600 : 500,
                      color:        active ? "#0A0A0A" : "#737373",
                      whiteSpace:   "nowrap",
                      transition:   "all 0.15s ease",
                    }}
                  >
                    {c}
                  </button>
                );
              })}
              {hasMoreCuisines && (
                <button
                  onClick={() => setShowAllCuisines(true)}
                  style={{
                    height:       32,
                    borderRadius: 16,
                    border:       "1.5px solid #E5E5E5",
                    background:   "#F5F5F5",
                    paddingLeft:  12,
                    paddingRight: 12,
                    cursor:       "pointer",
                    fontFamily:   "var(--font-poppins)",
                    fontSize:     13,
                    fontWeight:   500,
                    color:        "#737373",
                    whiteSpace:   "nowrap",
                  }}
                >
                  Show more
                </button>
              )}
            </div>
          </div>

          {/* Search area slider */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              marginBottom:   8,
            }}>
              <p style={{
                fontFamily: "var(--font-poppins)",
                fontSize:   14,
                fontWeight: 700,
                color:      "#0A0A0A",
                margin:     0,
              }}>
                Search area
              </p>
              <span style={{
                fontFamily: "var(--font-poppins)",
                fontSize:   13,
                fontWeight: 600,
                color:      "#737373",
              }}>
                {searchAreaKm === null ? "No limit" : `${searchAreaKm} km`}
              </span>
            </div>
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
              style={{ width: "100%", accentColor: "#53F293" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 11, color: "#B3B3B3" }}>No limit</span>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: 11, color: "#B3B3B3" }}>20 km</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(0,0,0,0.08)", marginBottom: 16 }} />

          {/* People list */}
          <div>
            {filteredPeople.map(person => (
              <PersonRow
                key={person.id}
                person={person}
                isSelected={selectedPersonIds.includes(person.id)}
                onToggle={() => togglePerson(person.id)}
              />
            ))}
          </div>

          {/* Bottom spacer so last row clears the pinned CTA */}
          <div style={{ height: 100 }} />
        </div>

        {/* ── Pinned CTAs ───────────────────────────────────────────────── */}
        <div style={{
          flexShrink:    0,
          padding:       "12px 16px",
          paddingBottom: "max(24px, env(safe-area-inset-bottom))",
          borderTop:     "1px solid rgba(0,0,0,0.08)",
          background:    "#FEFEFE",
          display:       "flex",
          flexDirection: "column",
          gap:           8,
          alignItems:    "center",
        }}>
          <button
            onClick={handleApply}
            style={{
              width:        "100%",
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
          <button
            onClick={handleResetAndClose}
            style={{
              background: "transparent",
              border:     "none",
              cursor:     "pointer",
              fontFamily: "var(--font-poppins)",
              fontSize:   14,
              fontWeight: 600,
              color:      "#737373",
              padding:    "4px 8px",
            }}
          >
            Reset filters
          </button>
        </div>
      </div>
    </>
  );
}

// ── PersonRow ─────────────────────────────────────────────────────────────────

function PersonRow({
  person,
  isSelected,
  onToggle,
}: {
  person:     Person;
  isSelected: boolean;
  onToggle:   () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           10,
        paddingTop:    10,
        paddingBottom: 10,
        borderBottom:  "1px solid rgba(0,0,0,0.06)",
        cursor:        "pointer",
      }}
    >
      {/* Avatar with optional selected ring */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width:        44,
          height:       44,
          borderRadius: "50%",
          overflow:     "hidden",
          border:       `2px solid ${isSelected ? "#53F293" : "transparent"}`,
          transition:   "border-color 0.15s ease",
        }}>
          <img
            src={person.avatarUrl}
            alt={person.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        {/* Verified badge */}
        {person.isVerified && (
          <div style={{
            position:       "absolute",
            bottom:         0,
            right:          0,
            width:          16,
            height:         16,
            borderRadius:   "50%",
            background:     "#53F293",
            border:         "1.5px solid #FEFEFE",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}>
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path
                d="M1 3L3 5L7 1"
                stroke="#0A0A0A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Name + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily:   "var(--font-poppins)",
          fontSize:     14,
          fontWeight:   700,
          color:        "#0A0A0A",
          margin:       "0 0 2px 0",
          overflow:     "hidden",
          textOverflow: "ellipsis",
          whiteSpace:   "nowrap",
        }}>
          {person.name}
        </p>
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

      {/* Visit count badge */}
      <div style={{
        flexShrink:    0,
        background:    "#F5F5F5",
        borderRadius:  8,
        paddingLeft:   8,
        paddingRight:  8,
        paddingTop:    4,
        paddingBottom: 4,
        display:       "flex",
        alignItems:    "center",
        gap:           3,
      }}>
        <span style={{ fontSize: 11 }}>🍽️</span>
        <span style={{
          fontFamily: "var(--font-poppins)",
          fontSize:   12,
          fontWeight: 600,
          color:      "#0A0A0A",
        }}>
          {person.visitCount}
        </span>
      </div>

      {/* Checkbox */}
      <div style={{
        flexShrink:     0,
        width:          20,
        height:         20,
        borderRadius:   6,
        border:         isSelected ? "none" : "2px solid #E5E5E5",
        background:     isSelected ? "#53F293" : "transparent",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        transition:     "all 0.15s ease",
      }}>
        {isSelected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#0A0A0A"
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
