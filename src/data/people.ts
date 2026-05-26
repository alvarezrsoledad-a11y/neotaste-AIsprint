import { MAP_PINS } from "./pins";

// ── Level system ─────────────────────────────────────────────────────────────
// Visit count → level:
//   2 visits         → 1. Taster
//   5–14 visits      → 2. Foodie
//   15–29 visits     → 3. Culinary Star
//   30–54 visits     → 4. Gourmet
//   55+ visits       → 5. Food Legend

export type LevelTier = 1 | 2 | 3 | 4 | 5;

export const LEVEL_NAMES: Record<LevelTier, string> = {
  1: "Taster",
  2: "Foodie",
  3: "Culinary Star",
  4: "Gourmet",
  5: "Food Legend",
};

export function levelForVisits(visits: number): LevelTier {
  if (visits >= 55) return 5;
  if (visits >= 30) return 4;
  if (visits >= 15) return 3;
  if (visits >= 5)  return 2;
  return 1;
}

export interface Person {
  id:                   string;
  name:                 string;
  avatarUrl:            string;
  isVerified:           boolean;
  lastVisitLabel:       string;
  cuisines:             string[];
  visitCount:           number;
  /** Distinct restaurant (MAP_PINS) ids this user has visited. Generated
   *  deterministically from `id` and clamped to the available pin pool. */
  visitedRestaurantIds: number[];
}

// ── Seeded shuffle so each user gets a stable, distinct visited list ──────────

function hashStringId(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const ALL_PIN_IDS: number[] = MAP_PINS.map(p => p.id);

function visitedFor(id: string, visitCount: number): number[] {
  // Take the first min(visitCount, pool) ids from a stable shuffled order.
  const shuffled = seededShuffle(ALL_PIN_IDS, hashStringId(id));
  return shuffled.slice(0, Math.min(visitCount, ALL_PIN_IDS.length));
}

function withVisited<T extends { id: string; visitCount: number }>(p: T): T & { visitedRestaurantIds: number[] } {
  return { ...p, visitedRestaurantIds: visitedFor(p.id, p.visitCount) };
}

// Mock data — visit counts chosen to span all 5 levels.
export const FRIENDS: Person[] = [
  { id: "f1", name: "Mason Phillips", avatarUrl: "/images/avatar-image-1.jpg", isVerified: true,  lastVisitLabel: "2 days ago",  cuisines: ["Pizza", "Sushi"],     visitCount: 47 }, // Gourmet
  { id: "f2", name: "Sophia Rivera",  avatarUrl: "/images/avatar-image-2.jpg", isVerified: false, lastVisitLabel: "1 week ago",  cuisines: ["BBQ", "Burger"],      visitCount: 8  }, // Foodie
  { id: "f3", name: "James Carter",   avatarUrl: "/images/avatar-image-3.jpg", isVerified: true,  lastVisitLabel: "3 days ago",  cuisines: ["Burger", "Pizza"],    visitCount: 61 }, // Food Legend
  { id: "f4", name: "Olivia Chen",    avatarUrl: "/images/avatar-image-4.jpg", isVerified: false, lastVisitLabel: "5 days ago",  cuisines: ["Bowls", "Sandwich"],  visitCount: 2  }, // Taster
  { id: "f5", name: "Liam Torres",    avatarUrl: "/images/avatar-image-5.jpg", isVerified: true,  lastVisitLabel: "Yesterday",   cuisines: ["Sushi", "Pasta"],     visitCount: 23 }, // Culinary Star
].map(withVisited);

export const NEOTASTERS: Person[] = [
  { id: "n1", name: "Emma Watson",     avatarUrl: "/images/avatar-image-6.jpg",  isVerified: true,  lastVisitLabel: "Today",       cuisines: ["Drinks", "Pasta"],    visitCount: 152 }, // Food Legend
  { id: "n2", name: "Noah Bennett",    avatarUrl: "/images/avatar-image-7.jpg",  isVerified: true,  lastVisitLabel: "3 days ago",  cuisines: ["Burger", "Drinks"],   visitCount: 12  }, // Foodie
  { id: "n3", name: "Ava Johnson",     avatarUrl: "/images/avatar-image-8.jpg",  isVerified: false, lastVisitLabel: "1 week ago",  cuisines: ["Bowls", "Sandwich"],  visitCount: 44  }, // Gourmet
  { id: "n4", name: "Ethan Park",      avatarUrl: "/images/avatar-image-9.jpg",  isVerified: true,  lastVisitLabel: "2 days ago",  cuisines: ["BBQ", "Sushi"],       visitCount: 87  }, // Food Legend
  { id: "n5", name: "Isabella Moore",  avatarUrl: "/images/avatar-image-10.jpg", isVerified: true,  lastVisitLabel: "4 days ago",  cuisines: ["Pasta", "Pizza"],     visitCount: 27  }, // Culinary Star
  { id: "n6", name: "William Clark",   avatarUrl: "/images/avatar-image-11.jpg", isVerified: false, lastVisitLabel: "Yesterday",   cuisines: ["Ice Cream", "Pizza"], visitCount: 5   }, // Foodie
  { id: "n7", name: "Mia Thompson",    avatarUrl: "/images/avatar-image-12.jpg", isVerified: true,  lastVisitLabel: "Today",       cuisines: ["Bubble Tea", "Sushi"],visitCount: 33  }, // Gourmet
  { id: "n8", name: "Benjamin Wright", avatarUrl: "/images/avatar-image-13.jpg", isVerified: false, lastVisitLabel: "6 days ago",  cuisines: ["BBQ", "Burger"],      visitCount: 18  }, // Culinary Star
].map(withVisited);
