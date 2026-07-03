// ── Types ─────────────────────────────────────────────────────────────────────
export type TooltipType   = "friends" | "redemption" | "rating" | "ranking" | "new" | "community" | "plain";
export type TrustTagType  = "friends" | "community" | "redemption";

export interface SocialProof {
  variant: "friends" | "neotasters";
  quote:   string;
  names:   string;   // e.g. "Mason Phillips and +13 visited"
  avatars: string[]; // avatar URLs, stacked
}

export interface PinRestaurant {
  name:          string;
  category:      string;
  rating:        string;
  reviewCount:   string;
  distance:      string;
  imageSrc:      string;
  deals:         string[];
  isNew?:        boolean;
  trustTag?:     { type: TrustTagType; label: string };
  review?:       string;
  friendsCount?: string;
  avatarSrcs?:   string[];
  socialProof?:  SocialProof;
}

export interface FriendVisit {
  avatarUrl: string;
  count:     number;
}

export interface MapPin {
  id:                  number;
  lat:                 number;
  lng:                 number;
  type:                TooltipType;
  value?:              string;       // rank label for "ranking", count for others
  communityCount?:     string;       // for "ranking" pins: community count to show alongside rank
  tooltipAvatarSrc?:   string;
  tooltipAvatarSrcs?:  string[];
  friendVisits?:       FriendVisit[]; // populated for "friends" pins
  neotasterVisits?:    FriendVisit[]; // populated for "neotaster" pins (future)
  restaurant:          PinRestaurant;
}

// ── Berlin data ───────────────────────────────────────────────────────────────
// Centre ~ 52.520, 13.405  (Hackescher Markt / Mitte)
//
// Default map shows: FRIENDS (15) + RANKING/NEW (8) + PLAIN/tiny (37) = 60 pins
// NeoTasters filter also reveals: COMMUNITY (11) pins
// Pin priority: friends > default (ranking/new) > tiny

export const MAP_PINS: MapPin[] = [

  // ── FRIENDS — 15 pins, pink avatar pin ───────────────────────────────────
  // Rule: at least one friend visited → type="friends", socialProof.variant="friends"

  {
    id: 1,
    lat: 52.5232, lng: 13.3985,
    type: "friends",
    value: "+14",
    tooltipAvatarSrc:  "/images/avatar-image-1.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-1.jpg", "/images/avatar-image-2.jpg", "/images/avatar-image-3.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-1.jpg", count: 14 }],
    restaurant: {
      name:         "Dude's Coffee & Cake",
      category:     "Breakfast, Coffee",
      rating:       "4.8",
      reviewCount:  "143",
      distance:     "0.4 km",
      imageSrc:     "/images/cafe-image-1.jpg",
      deals:        ["2for1 Beverage", "2for1 Espresso"],
      trustTag:     { type: "friends", label: "♥ 14 friends visited" },
      review:       '"Best brunch in Mitte — the matcha latte is unmissable!"',
      friendsCount: "14",
      avatarSrcs:   ["/images/avatar-image-1.jpg", "/images/avatar-image-2.jpg", "/images/avatar-image-3.jpg", "/images/avatar-image-4.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Best brunch in Mitte — the matcha latte is unmissable!"',
        names:   "Leonie S. and +13 visited",
        avatars: ["/images/avatar-image-1.jpg", "/images/avatar-image-2.jpg", "/images/avatar-image-3.jpg"],
      },
    },
  },

  {
    id: 2,
    lat: 52.5380, lng: 13.4180,
    type: "friends",
    value: "+6",
    tooltipAvatarSrc:  "/images/avatar-image-5.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-5.jpg", "/images/avatar-image-6.jpg", "/images/avatar-image-7.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-5.jpg", count: 6 }],
    restaurant: {
      name:         "The Barn",
      category:     "Specialty Coffee",
      rating:       "4.7",
      reviewCount:  "218",
      distance:     "1.8 km",
      imageSrc:     "/images/cafe-image-3.jpg",
      deals:        ["FREE Coffee", "Loyalty Stamp"],
      trustTag:     { type: "friends", label: "♥ 6 friends visited" },
      review:       '"Roastery-direct coffee + incredible vibes. Try the pour-over!"',
      friendsCount: "6",
      avatarSrcs:   ["/images/avatar-image-5.jpg", "/images/avatar-image-6.jpg", "/images/avatar-image-7.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Roastery-direct coffee + incredible vibes. Try the pour-over!"',
        names:   "Sophie M. and +5 visited",
        avatars: ["/images/avatar-image-5.jpg", "/images/avatar-image-6.jpg", "/images/avatar-image-7.jpg"],
      },
    },
  },

  {
    id: 3,
    lat: 52.4990, lng: 13.4155,
    type: "friends",
    value: "+9",
    tooltipAvatarSrc:  "/images/avatar-image-8.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-8.jpg", "/images/avatar-image-9.jpg", "/images/avatar-image-10.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-8.jpg", count: 9 }],
    restaurant: {
      name:         "Mustafa's Gemüse Kebab",
      category:     "Kebab, Street Food",
      rating:       "4.9",
      reviewCount:  "2.1k",
      distance:     "2.1 km",
      imageSrc:     "/images/food-image-1.jpg",
      deals:        ["10% off", "FREE Drink"],
      trustTag:     { type: "friends", label: "♥ 9 friends visited" },
      review:       '"Worth every minute of the queue. Berlin\'s best kebab, no debate."',
      friendsCount: "9",
      avatarSrcs:   ["/images/avatar-image-8.jpg", "/images/avatar-image-9.jpg", "/images/avatar-image-10.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Worth every minute of the queue. Berlin\'s best kebab, no debate."',
        names:   "Maria H. and +8 visited",
        avatars: ["/images/avatar-image-8.jpg", "/images/avatar-image-9.jpg", "/images/avatar-image-10.jpg"],
      },
    },
  },

  {
    id: 27,
    lat: 52.5015, lng: 13.4480,
    type: "friends",
    value: "+5",
    tooltipAvatarSrc:  "/images/avatar-image-11.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-11.jpg", "/images/avatar-image-12.jpg", "/images/avatar-image-13.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-11.jpg", count: 5 }],
    restaurant: {
      name:         "Hamy Café",
      category:     "Vietnamese, Noodles",
      rating:       "4.6",
      reviewCount:  "1.2k",
      distance:     "3.3 km",
      imageSrc:     "/images/food-image-14.jpg",
      deals:        ["Pho 2for1", "FREE Spring Roll"],
      trustTag:     { type: "friends", label: "♥ 5 friends visited" },
      review:       '"Tiny place, huge flavours. The pho broth here is incredibly deep."',
      friendsCount: "5",
      avatarSrcs:   ["/images/avatar-image-11.jpg", "/images/avatar-image-12.jpg", "/images/avatar-image-13.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Tiny place, huge flavours. The pho broth here is incredibly deep."',
        names:   "Julia S. and +4 visited",
        avatars: ["/images/avatar-image-11.jpg", "/images/avatar-image-12.jpg", "/images/avatar-image-13.jpg"],
      },
    },
  },

  // ── 11 new friends pins spread across Berlin ────────────────────────────

  {
    id: 101,
    lat: 52.5435, lng: 13.4252,
    type: "friends",
    value: "+7",
    tooltipAvatarSrc:  "/images/avatar-image-2.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-2.jpg", "/images/avatar-image-4.jpg", "/images/avatar-image-6.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-2.jpg", count: 7 }],
    restaurant: {
      name:         "Prater Biergarten",
      category:     "Beer Garden, German",
      rating:       "4.6",
      reviewCount:  "3.4k",
      distance:     "2.5 km",
      imageSrc:     "/images/food-image-12.jpg",
      deals:        ["Happy Hour 5–7pm", "FREE Pretzel"],
      trustTag:     { type: "friends", label: "♥ 7 friends visited" },
      friendsCount: "7",
      avatarSrcs:   ["/images/avatar-image-2.jpg", "/images/avatar-image-4.jpg", "/images/avatar-image-6.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Berlin\'s oldest beer garden — summer evenings here are pure magic."',
        names:   "Noah K. and +6 visited",
        avatars: ["/images/avatar-image-2.jpg", "/images/avatar-image-4.jpg", "/images/avatar-image-6.jpg"],
      },
    },
  },

  {
    id: 102,
    lat: 52.4968, lng: 13.4248,
    type: "friends",
    value: "+3",
    tooltipAvatarSrc:  "/images/avatar-image-6.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-6.jpg", "/images/avatar-image-8.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-6.jpg", count: 3 }],
    restaurant: {
      name:         "Markthalle Neun",
      category:     "Street Food, Market",
      rating:       "4.5",
      reviewCount:  "892",
      distance:     "2.2 km",
      imageSrc:     "/images/food-image-9.jpg",
      deals:        ["Street Food Thu 20% off"],
      trustTag:     { type: "friends", label: "♥ 3 friends visited" },
      friendsCount: "3",
      avatarSrcs:   ["/images/avatar-image-6.jpg", "/images/avatar-image-8.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Street Food Thursday is unmissable — so many cuisines under one roof!"',
        names:   "Clara M. and +2 visited",
        avatars: ["/images/avatar-image-6.jpg", "/images/avatar-image-8.jpg"],
      },
    },
  },

  {
    id: 103,
    lat: 52.4872, lng: 13.4318,
    type: "friends",
    value: "+11",
    tooltipAvatarSrc:  "/images/avatar-image-9.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-9.jpg", "/images/avatar-image-11.jpg", "/images/avatar-image-13.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-9.jpg", count: 11 }],
    restaurant: {
      name:         "Standard Pizza",
      category:     "Pizza, Italian",
      rating:       "4.7",
      reviewCount:  "1.4k",
      distance:     "4.0 km",
      imageSrc:     "/images/food-image-6.jpg",
      deals:        ["Pizza 2for1 Mon–Wed", "FREE Aperol Spritz"],
      trustTag:     { type: "friends", label: "♥ 11 friends visited" },
      friendsCount: "11",
      avatarSrcs:   ["/images/avatar-image-9.jpg", "/images/avatar-image-11.jpg", "/images/avatar-image-13.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Best Neapolitan pizza in Berlin — the margherita is perfect simplicity."',
        names:   "Felix B. and +10 visited",
        avatars: ["/images/avatar-image-9.jpg", "/images/avatar-image-11.jpg", "/images/avatar-image-13.jpg"],
      },
    },
  },

  {
    id: 104,
    lat: 52.5298, lng: 13.3902,
    type: "friends",
    value: "+4",
    tooltipAvatarSrc:  "/images/avatar-image-12.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-12.jpg", "/images/avatar-image-14.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-12.jpg", count: 4 }],
    restaurant: {
      name:         "Lokal",
      category:     "Modern Nordic, Seasonal",
      rating:       "4.8",
      reviewCount:  "421",
      distance:     "1.8 km",
      imageSrc:     "/images/restaurant-image-3.jpg",
      deals:        ["Tasting Menu 20% off"],
      trustTag:     { type: "friends", label: "♥ 4 friends visited" },
      friendsCount: "4",
      avatarSrcs:   ["/images/avatar-image-12.jpg", "/images/avatar-image-14.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Minimalist modern Nordic — the seasonal tasting menu is always a revelation."',
        names:   "Mia W. and +3 visited",
        avatars: ["/images/avatar-image-12.jpg", "/images/avatar-image-14.jpg"],
      },
    },
  },

  {
    id: 105,
    lat: 52.5052, lng: 13.3198,
    type: "friends",
    value: "+2",
    tooltipAvatarSrc:  "/images/avatar-image-15.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-15.jpg", "/images/avatar-image-1.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-15.jpg", count: 2 }],
    restaurant: {
      name:         "Café Good Morning",
      category:     "Café, Breakfast",
      rating:       "4.4",
      reviewCount:  "167",
      distance:     "5.2 km",
      imageSrc:     "/images/cafe-image-2.jpg",
      deals:        ["Brunch Deal €12"],
      trustTag:     { type: "friends", label: "♥ 2 friends visited" },
      friendsCount: "2",
      avatarSrcs:   ["/images/avatar-image-15.jpg", "/images/avatar-image-1.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Charming neighbourhood café with the best filter coffee in Charlottenburg."',
        names:   "Tom R. and +1 visited",
        avatars: ["/images/avatar-image-15.jpg", "/images/avatar-image-1.jpg"],
      },
    },
  },

  {
    id: 106,
    lat: 52.5492, lng: 13.3752,
    type: "friends",
    value: "+8",
    tooltipAvatarSrc:  "/images/avatar-image-3.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-3.jpg", "/images/avatar-image-5.jpg", "/images/avatar-image-7.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-3.jpg", count: 8 }],
    restaurant: {
      name:         "Café Cralle",
      category:     "Café, Vintage",
      rating:       "4.5",
      reviewCount:  "312",
      distance:     "3.1 km",
      imageSrc:     "/images/cafe-image-5.jpg",
      deals:        ["Coffee + Cake €7", "FREE Cookie"],
      trustTag:     { type: "friends", label: "♥ 8 friends visited" },
      friendsCount: "8",
      avatarSrcs:   ["/images/avatar-image-3.jpg", "/images/avatar-image-5.jpg", "/images/avatar-image-7.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Wedding\'s hidden gem — cosy vintage vibes and homemade cakes all day."',
        names:   "Lena V. and +7 visited",
        avatars: ["/images/avatar-image-3.jpg", "/images/avatar-image-5.jpg", "/images/avatar-image-7.jpg"],
      },
    },
  },

  {
    id: 107,
    lat: 52.5412, lng: 13.4292,
    type: "friends",
    value: "+5",
    tooltipAvatarSrc:  "/images/avatar-image-7.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-7.jpg", "/images/avatar-image-9.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-7.jpg", count: 5 }],
    restaurant: {
      name:         "Goldhahn & Sampson",
      category:     "Deli, Wine",
      rating:       "4.7",
      reviewCount:  "534",
      distance:     "2.9 km",
      imageSrc:     "/images/cafe-image-6.jpg",
      deals:        ["Natural Wine 2for1", "FREE Cheese Board"],
      trustTag:     { type: "friends", label: "♥ 5 friends visited" },
      friendsCount: "5",
      avatarSrcs:   ["/images/avatar-image-7.jpg", "/images/avatar-image-9.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"The ultimate deli — incredible sandwiches, local cheeses, natural wines."',
        names:   "Ida S. and +4 visited",
        avatars: ["/images/avatar-image-7.jpg", "/images/avatar-image-9.jpg"],
      },
    },
  },

  {
    id: 108,
    lat: 52.5212, lng: 13.4052,
    type: "friends",
    value: "+3",
    tooltipAvatarSrc:  "/images/avatar-image-10.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-10.jpg", "/images/avatar-image-12.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-10.jpg", count: 3 }],
    restaurant: {
      name:         "Il Sorpasso",
      category:     "Italian, Trattoria",
      rating:       "4.6",
      reviewCount:  "287",
      distance:     "1.0 km",
      imageSrc:     "/images/restaurant-image-5.jpg",
      deals:        ["Pasta 2for1 Tue–Thu", "FREE Aperitivo"],
      trustTag:     { type: "friends", label: "♥ 3 friends visited" },
      friendsCount: "3",
      avatarSrcs:   ["/images/avatar-image-10.jpg", "/images/avatar-image-12.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Authentic Roman trattoria — the cacio e pepe tastes like a Roman holiday."',
        names:   "Anna L. and +2 visited",
        avatars: ["/images/avatar-image-10.jpg", "/images/avatar-image-12.jpg"],
      },
    },
  },

  {
    id: 109,
    lat: 52.4948, lng: 13.3558,
    type: "friends",
    value: "+6",
    tooltipAvatarSrc:  "/images/avatar-image-4.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-4.jpg", "/images/avatar-image-6.jpg", "/images/avatar-image-8.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-4.jpg", count: 6 }],
    restaurant: {
      name:         "Café Mugrabi",
      category:     "Middle Eastern, Coffee",
      rating:       "4.6",
      reviewCount:  "198",
      distance:     "3.5 km",
      imageSrc:     "/images/cafe-image-7.jpg",
      deals:        ["Brunch Plate €14", "FREE Baklava"],
      trustTag:     { type: "friends", label: "♥ 6 friends visited" },
      friendsCount: "6",
      avatarSrcs:   ["/images/avatar-image-4.jpg", "/images/avatar-image-6.jpg", "/images/avatar-image-8.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Middle Eastern vibes, excellent coffee, and the best baklava in the city."',
        names:   "Sara J. and +5 visited",
        avatars: ["/images/avatar-image-4.jpg", "/images/avatar-image-6.jpg", "/images/avatar-image-8.jpg"],
      },
    },
  },

  {
    id: 110,
    lat: 52.4982, lng: 13.3842,
    type: "friends",
    value: "+4",
    tooltipAvatarSrc:  "/images/avatar-image-13.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-13.jpg", "/images/avatar-image-15.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-13.jpg", count: 4 }],
    restaurant: {
      name:         "Fischerhütte",
      category:     "Seafood, German",
      rating:       "4.5",
      reviewCount:  "321",
      distance:     "2.8 km",
      imageSrc:     "/images/food-image-7.jpg",
      deals:        ["Fish Platter 20% off"],
      trustTag:     { type: "friends", label: "♥ 4 friends visited" },
      friendsCount: "4",
      avatarSrcs:   ["/images/avatar-image-13.jpg", "/images/avatar-image-15.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Hidden lakeside spot — the fish dishes and the sunset view are both perfect."',
        names:   "Erik P. and +3 visited",
        avatars: ["/images/avatar-image-13.jpg", "/images/avatar-image-15.jpg"],
      },
    },
  },

  {
    id: 111,
    lat: 52.5128, lng: 13.4592,
    type: "friends",
    value: "+7",
    tooltipAvatarSrc:  "/images/avatar-image-11.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-11.jpg", "/images/avatar-image-13.jpg", "/images/avatar-image-15.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-11.jpg", count: 7 }],
    restaurant: {
      name:         "Brammibals Donuts",
      category:     "Bakery, Vegan",
      rating:       "4.7",
      reviewCount:  "876",
      distance:     "3.7 km",
      imageSrc:     "/images/cafe-image-4.jpg",
      deals:        ["Donut 3for2", "FREE Coffee"],
      trustTag:     { type: "friends", label: "♥ 7 friends visited" },
      friendsCount: "7",
      avatarSrcs:   ["/images/avatar-image-11.jpg", "/images/avatar-image-13.jpg", "/images/avatar-image-15.jpg"],
      socialProof: {
        variant: "friends",
        quote:   '"Vegan donuts that convert non-vegans — the lemon poppy is extraordinary."',
        names:   "Zoe H. and +6 visited",
        avatars: ["/images/avatar-image-11.jpg", "/images/avatar-image-13.jpg", "/images/avatar-image-15.jpg"],
      },
    },
  },

  // ── RANKING — Default pins with #1–#4 tag ────────────────────────────────
  // No friend visits → green "N" default pin on the map

  {
    id: 11,
    lat: 52.5175, lng: 13.3775,
    type: "ranking",
    value: "#1",
    communityCount: "8",
    restaurant: {
      name:        "Rutz Restaurant",
      category:    "Modern European",
      rating:      "4.9",
      reviewCount: "312",
      distance:    "1.4 km",
      imageSrc:    "/images/restaurant-image-3.jpg",
      deals:       ["Sommelier Pairing 20% off"],
      trustTag:    { type: "community", label: "👥 8 people tried this week" },
      socialProof: {
        variant: "neotasters",
        quote:   '"Exceptional wine pairings — every course was a revelation."',
        names:   "Mason Phillips and +7 visited",
        avatars: ["/images/avatar-image-1.jpg", "/images/avatar-image-2.jpg"],
      },
    },
  },

  {
    id: 12,
    lat: 52.5310, lng: 13.3890,
    type: "ranking",
    value: "#2",
    communityCount: "12",
    restaurant: {
      name:        "Katz Orange",
      category:    "Modern German",
      rating:      "4.8",
      reviewCount: "528",
      distance:    "1.9 km",
      imageSrc:    "/images/restaurant-image-4.jpg",
      deals:       ["Lunch Set 25% off", "FREE Aperitif"],
      trustTag:    { type: "community", label: "👥 12 people tried this week" },
      socialProof: {
        variant: "neotasters",
        quote:   '"The slow-roasted meats here are worth every cent."',
        names:   "Isla Anderson and +11 visited",
        avatars: ["/images/avatar-image-5.jpg", "/images/avatar-image-6.jpg"],
      },
    },
  },

  {
    id: 13,
    lat: 52.5070, lng: 13.3505,
    type: "ranking",
    value: "#3",
    communityCount: "6",
    restaurant: {
      name:        "Borchardt",
      category:    "Brasserie, French",
      rating:      "4.7",
      reviewCount: "1.8k",
      distance:    "3.5 km",
      imageSrc:    "/images/restaurant-image-5.jpg",
      deals:       ["Schnitzel Special 20% off"],
      trustTag:    { type: "community", label: "👥 6 people tried this week" },
      socialProof: {
        variant: "neotasters",
        quote:   '"Classic French brasserie with a legendary schnitzel."',
        names:   "Pia W. and +5 visited",
        avatars: ["/images/avatar-image-14.jpg", "/images/avatar-image-15.jpg"],
      },
    },
  },

  {
    id: 28,
    lat: 52.5090, lng: 13.3880,
    type: "ranking",
    value: "#4",
    communityCount: "9",
    restaurant: {
      name:        "Bandol sur Mer",
      category:    "French, Seasonal",
      rating:      "4.8",
      reviewCount: "289",
      distance:    "1.6 km",
      imageSrc:    "/images/cafe-image-8.jpg",
      deals:       ["Wine Pairing 15% off", "FREE Amuse-bouche"],
      trustTag:    { type: "community", label: "👥 9 people tried this week" },
      socialProof: {
        variant: "neotasters",
        quote:   '"Intimate and seasonal — the natural wine list is exceptional."',
        names:   "Otto F. and +8 visited",
        avatars: ["/images/avatar-image-1.jpg", "/images/avatar-image-3.jpg"],
      },
    },
  },

  // ── NEW — Default pins with NEW tag ─────────────────────────────────────

  {
    id: 14,
    lat: 52.5158, lng: 13.4575,
    type: "new",
    value: "12",
    restaurant: {
      name:        "Round & Edgy",
      category:    "Fusion, Modern",
      rating:      "4.6",
      reviewCount: "87",
      distance:    "4.5 km",
      imageSrc:    "/images/food-image-6.jpg",
      isNew:       true,
      deals:       ["Opening Special 30% off", "FREE Cocktail"],
      trustTag:    { type: "community", label: "✨ Just opened" },
      socialProof: {
        variant: "neotasters",
        quote:   '"Exciting new fusion spot — the cocktail menu alone is worth it."',
        names:   "Zoe M. and +11 visited",
        avatars: ["/images/avatar-image-2.jpg", "/images/avatar-image-4.jpg"],
      },
    },
  },

  {
    id: 15,
    lat: 52.4885, lng: 13.3985,
    type: "new",
    value: "8",
    restaurant: {
      name:        "Nobelhart & Schmutzig",
      category:    "Brutally Local",
      rating:      "4.8",
      reviewCount: "203",
      distance:    "3.6 km",
      imageSrc:    "/images/restaurant-image-6.jpg",
      isNew:       true,
      deals:       ["Opening Week Special", "Meet the Chef"],
      trustTag:    { type: "community", label: "✨ Just opened" },
      socialProof: {
        variant: "neotasters",
        quote:   '"Brutally local and brutally delicious — book fast."',
        names:   "Kim H. and +7 visited",
        avatars: ["/images/avatar-image-6.jpg", "/images/avatar-image-8.jpg"],
      },
    },
  },

  {
    id: 16,
    lat: 52.4985, lng: 13.3850,
    type: "new",
    value: "21",
    restaurant: {
      name:        "BRLO Brwhouse",
      category:    "Craft Beer, Gastropub",
      rating:      "4.5",
      reviewCount: "156",
      distance:    "2.7 km",
      imageSrc:    "/images/food-image-7.jpg",
      isNew:       true,
      deals:       ["FREE Tasting Flight", "2for1 Burgers"],
      trustTag:    { type: "community", label: "✨ Just opened" },
      socialProof: {
        variant: "neotasters",
        quote:   '"Craft beer + smash burgers — the tasting flight is a must."',
        names:   "Jan P. and +20 visited",
        avatars: ["/images/avatar-image-9.jpg", "/images/avatar-image-11.jpg"],
      },
    },
  },

  {
    id: 26,
    lat: 52.4860, lng: 13.3750,
    type: "new",
    value: "5",
    restaurant: {
      name:        "Kanaan",
      category:    "Israeli, Vegetarian",
      rating:      "4.7",
      reviewCount: "112",
      distance:    "3.8 km",
      imageSrc:    "/images/food-image-13.jpg",
      isNew:       true,
      deals:       ["Opening Offer 20% off", "FREE Hummus"],
      trustTag:    { type: "community", label: "✨ Just opened" },
      socialProof: {
        variant: "neotasters",
        quote:   '"Generous portions, vibrant flavours — Berlin\'s best hummus."',
        names:   "Noa R. and +4 visited",
        avatars: ["/images/avatar-image-13.jpg", "/images/avatar-image-15.jpg"],
      },
    },
  },

  // ── COMMUNITY — NeoTasters filter only (11 pins, never on default map) ───

  {
    id: 4,
    lat: 52.5055, lng: 13.3330,
    type: "community",
    value: "42",
    restaurant: {
      name:        "Ramen by Takeshi",
      category:    "Japanese, Ramen",
      rating:      "4.6",
      reviewCount: "892",
      distance:    "3.2 km",
      imageSrc:    "/images/food-image-2.jpg",
      deals:       ["2for1 Ramen", "FREE Gyoza"],
      trustTag:    { type: "community", label: "👥 42 people this week" },
      socialProof: { variant: "neotasters", quote: '"The tonkotsu here is the real deal — rich and silky."', names: "Nina B. and +42 visited", avatars: ["/images/avatar-image-3.jpg", "/images/avatar-image-4.jpg"] },
    },
  },

  {
    id: 5,
    lat: 52.4975, lng: 13.4025,
    type: "community",
    value: "74",
    restaurant: {
      name:        "Burgermeister",
      category:    "Burgers, Fast Food",
      rating:      "4.5",
      reviewCount: "1.4k",
      distance:    "2.4 km",
      imageSrc:    "/images/food-image-3.jpg",
      deals:       ["2for1 Burger", "FREE Fries"],
      trustTag:    { type: "community", label: "👥 74 people this week" },
      socialProof: { variant: "neotasters", quote: '"Best smash burger in Berlin, full stop."', names: "Tom K. and +74 visited", avatars: ["/images/avatar-image-7.jpg", "/images/avatar-image-8.jpg"] },
    },
  },

  {
    id: 6,
    lat: 52.4790, lng: 13.4285,
    type: "community",
    value: "28",
    restaurant: {
      name:        "Curry 36",
      category:    "Currywurst, Street Food",
      rating:      "4.4",
      reviewCount: "3.2k",
      distance:    "4.1 km",
      imageSrc:    "/images/food-image-4.jpg",
      deals:       ["50% off Currywurst", "FREE Drink"],
      trustTag:    { type: "community", label: "👥 28 people this week" },
      socialProof: { variant: "neotasters", quote: '"A Berlin institution — crispy, saucy, perfect."', names: "Lena M. and +28 visited", avatars: ["/images/avatar-image-9.jpg", "/images/avatar-image-10.jpg"] },
    },
  },

  {
    id: 17,
    lat: 52.5275, lng: 13.4035,
    type: "community",
    value: "31",
    restaurant: {
      name:        "Monsieur Vuong",
      category:    "Vietnamese, Asian",
      rating:      "4.6",
      reviewCount: "2.3k",
      distance:    "1.1 km",
      imageSrc:    "/images/food-image-8.jpg",
      deals:       ["Lunch Special €8.90", "FREE Spring Roll"],
      trustTag:    { type: "community", label: "👥 31 people this week" },
      socialProof: { variant: "neotasters", quote: '"Tiny space, enormous flavour — the pho gà is a knockout."', names: "Laura K. and +30 visited", avatars: ["/images/avatar-image-1.jpg", "/images/avatar-image-5.jpg"] },
    },
  },

  {
    id: 18,
    lat: 52.5040, lng: 13.4225,
    type: "community",
    value: "24",
    restaurant: {
      name:        "Kimchi Princess",
      category:    "Korean, BBQ",
      rating:      "4.6",
      reviewCount: "1.7k",
      distance:    "2.8 km",
      imageSrc:    "/images/food-image-9.jpg",
      deals:       ["BBQ Set 20% off", "FREE Banchan"],
      trustTag:    { type: "community", label: "👥 24 people this week" },
      socialProof: { variant: "neotasters", quote: '"Korean BBQ done right — the galbi is smoky perfection."', names: "Max D. and +23 visited", avatars: ["/images/avatar-image-2.jpg", "/images/avatar-image-6.jpg"] },
    },
  },

  {
    id: 19,
    lat: 52.5420, lng: 13.3755,
    type: "community",
    value: "18",
    restaurant: {
      name:        "Omoni",
      category:    "Korean, Homestyle",
      rating:      "4.7",
      reviewCount: "934",
      distance:    "2.9 km",
      imageSrc:    "/images/food-image-10.jpg",
      deals:       ["2for1 Bibimbap", "FREE Soup"],
      trustTag:    { type: "community", label: "👥 18 people this week" },
      socialProof: { variant: "neotasters", quote: '"Homestyle Korean comfort food — the doenjang jjigae warms the soul."', names: "Yuki N. and +17 visited", avatars: ["/images/avatar-image-4.jpg", "/images/avatar-image-7.jpg"] },
    },
  },

  {
    id: 20,
    lat: 52.5110, lng: 13.3660,
    type: "community",
    value: "42",
    restaurant: {
      name:        "Soho House Berlin",
      category:    "Modern European, Rooftop",
      rating:      "4.5",
      reviewCount: "2.8k",
      distance:    "2.2 km",
      imageSrc:    "/images/cafe-image-5.jpg",
      deals:       ["Rooftop Happy Hour", "15% off Dinner"],
      trustTag:    { type: "community", label: "👥 42 people this week" },
      socialProof: { variant: "neotasters", quote: '"Rooftop sunset drinks with a view that makes Berlin glow."', names: "Sophie B. and +41 visited", avatars: ["/images/avatar-image-3.jpg", "/images/avatar-image-8.jpg"] },
    },
  },

  {
    id: 21,
    lat: 52.5200, lng: 13.3940,
    type: "community",
    value: "15",
    restaurant: {
      name:        "Golvet",
      category:    "Modern German, Skyline Views",
      rating:      "4.7",
      reviewCount: "445",
      distance:    "0.9 km",
      imageSrc:    "/images/restaurant-image-7.jpg",
      deals:       ["Sunset Dinner 20% off"],
      trustTag:    { type: "community", label: "👥 15 people this week" },
      socialProof: { variant: "neotasters", quote: '"Skyline views, modern German cuisine — an unforgettable evening."', names: "Paul G. and +14 visited", avatars: ["/images/avatar-image-10.jpg", "/images/avatar-image-12.jpg"] },
    },
  },

  {
    id: 22,
    lat: 52.5450, lng: 13.4110,
    type: "community",
    value: "27",
    restaurant: {
      name:        "Anna Blume",
      category:    "Café, Brunch",
      rating:      "4.5",
      reviewCount: "1.1k",
      distance:    "2.4 km",
      imageSrc:    "/images/cafe-image-6.jpg",
      deals:       ["Cake 2for1 Sat–Sun", "FREE Coffee"],
      trustTag:    { type: "community", label: "👥 27 people this week" },
      socialProof: { variant: "neotasters", quote: '"Charming Prenzlberg café — the flower cakes are almost too pretty to eat."', names: "Clara H. and +26 visited", avatars: ["/images/avatar-image-5.jpg", "/images/avatar-image-9.jpg"] },
    },
  },

  {
    id: 23,
    lat: 52.5345, lng: 13.4290,
    type: "community",
    value: "19",
    restaurant: {
      name:        "W — Der Imbiss",
      category:    "German, Comfort Food",
      rating:      "4.4",
      reviewCount: "678",
      distance:    "2.1 km",
      imageSrc:    "/images/food-image-11.jpg",
      deals:       ["Schnitzel Deal 25% off", "FREE Beer"],
      trustTag:    { type: "community", label: "👥 19 people this week" },
      socialProof: { variant: "neotasters", quote: '"Unpretentious, delicious Berliner comfort food at its finest."', names: "Ben A. and +18 visited", avatars: ["/images/avatar-image-11.jpg", "/images/avatar-image-14.jpg"] },
    },
  },

  {
    id: 29,
    lat: 52.5300, lng: 13.4550,
    type: "community",
    value: "33",
    restaurant: {
      name:        "Eins44",
      category:    "Modern European",
      rating:      "4.6",
      reviewCount: "367",
      distance:    "3.0 km",
      imageSrc:    "/images/hero-image-1.jpg",
      deals:       ["4-Course Menu 20% off"],
      trustTag:    { type: "community", label: "👥 33 people this week" },
      socialProof: { variant: "neotasters", quote: '"Creative European cooking in a stunning converted factory."', names: "Rosa E. and +32 visited", avatars: ["/images/avatar-image-7.jpg", "/images/avatar-image-15.jpg"] },
    },
  },

  // ── TINY / PLAIN — 37 ambient background pins ───────────────────────────
  // No friend visits, no special tag → small green dot only

  // Repurposed from higher-weight types (kept restaurant details intact)
  { id: 7,  lat: 52.5250, lng: 13.4075, type: "plain", restaurant: { name: "Tim Raue",         category: "Fine Dining, Asian",         rating: "4.9", reviewCount: "654",  distance: "0.8 km", imageSrc: "/images/restaurant-image-1.jpg", deals: ["Chef's Menu 20% off"],      socialProof: { variant: "neotasters", quote: '"Two-Michelin-star magic — every bite tells a story."',                          names: "Felix R. and +18 visited",  avatars: ["/images/avatar-image-2.jpg",  "/images/avatar-image-3.jpg"]  } } },
  { id: 8,  lat: 52.5185, lng: 13.4025, type: "plain", restaurant: { name: "Cocolo Ramen",     category: "Japanese, Ramen",            rating: "4.8", reviewCount: "1.1k", distance: "0.6 km", imageSrc: "/images/food-image-5.jpg",        deals: ["2for1 Ramen Mon–Thu"],       socialProof: { variant: "neotasters", quote: '"Perfectly balanced broth, bouncy noodles — worth the queue."',             names: "Hana T. and +22 visited",   avatars: ["/images/avatar-image-4.jpg",  "/images/avatar-image-5.jpg"]  } } },
  { id: 9,  lat: 52.5145, lng: 13.4495, type: "plain", restaurant: { name: "Silo Coffee",      category: "Coffee, Brunch",             rating: "4.7", reviewCount: "876",  distance: "3.9 km", imageSrc: "/images/cafe-image-4.jpg",        deals: ["Loyalty Card"],              socialProof: { variant: "neotasters", quote: '"The avocado toast is basic — the coffee is not."',                        names: "Mia S. and +14 visited",    avatars: ["/images/avatar-image-6.jpg",  "/images/avatar-image-7.jpg"]  } } },
  { id: 10, lat: 52.4940, lng: 13.3605, type: "plain", restaurant: { name: "Cookies Cream",    category: "Vegetarian, Fine Dining",    rating: "4.8", reviewCount: "441",  distance: "3.1 km", imageSrc: "/images/restaurant-image-2.jpg", deals: ["Tasting Menu 15% off"],      socialProof: { variant: "neotasters", quote: '"Zero meat, zero compromise — fine dining at its best."',                   names: "Karl B. and +9 visited",    avatars: ["/images/avatar-image-8.jpg",  "/images/avatar-image-9.jpg"]  } } },
  { id: 24, lat: 52.5120, lng: 13.4620, type: "plain", restaurant: { name: "Schneeweiß",       category: "European, Brunch",           rating: "4.5", reviewCount: "741",  distance: "4.7 km", imageSrc: "/images/cafe-image-7.jpg",        deals: ["Brunch 2for1"],              socialProof: { variant: "neotasters", quote: '"Sunday brunch goals — the eggs benedict are flawless."',                  names: "Anna S. and +31 visited",   avatars: ["/images/avatar-image-13.jpg", "/images/avatar-image-14.jpg"] } } },
  { id: 25, lat: 52.5475, lng: 13.3920, type: "plain", restaurant: { name: "Prater Garten",    category: "Beer Garden, German",        rating: "4.6", reviewCount: "3.4k", distance: "2.6 km", imageSrc: "/images/food-image-12.jpg",       deals: ["Happy Hour 5–7pm"],          socialProof: { variant: "neotasters", quote: '"Berlin\'s oldest beer garden — magic on a sunny afternoon."',               names: "Erik V. and +37 visited",   avatars: ["/images/avatar-image-10.jpg", "/images/avatar-image-11.jpg"] } } },
  { id: 30, lat: 52.5065, lng: 13.3935, type: "plain", restaurant: { name: "Facil",            category: "Mediterranean, Fine Dining", rating: "4.9", reviewCount: "421",  distance: "1.2 km", imageSrc: "/images/hero-image-2.jpg",        deals: ["Lunch Tasting 25% off"],     socialProof: { variant: "neotasters", quote: '"Hidden garden gem — the lunchtime tasting menu is a steal."',              names: "Sara L. and +12 visited",   avatars: ["/images/avatar-image-12.jpg", "/images/avatar-image-13.jpg"] } } },

  // Previous plain section (duplicate names resolved)
  { id: 31, lat: 52.5260, lng: 13.4210, type: "plain", restaurant: { name: "Schwarze Pumpe",         category: "Café, Bar",             rating: "4.3", reviewCount: "178", distance: "2.1 km", imageSrc: "/images/cafe-image-2.jpg",        deals: ["2for1 Craft Beer"],           socialProof: { variant: "neotasters", quote: '"Cool Prenzlberg hangout — great craft beers and good vibes."',            names: "Max K. and +8 visited",    avatars: ["/images/avatar-image-3.jpg",  "/images/avatar-image-4.jpg"]  } } },
  { id: 32, lat: 52.5080, lng: 13.3720, type: "plain", restaurant: { name: "Spreegold",              category: "Bar, German",           rating: "4.2", reviewCount: "143", distance: "2.4 km", imageSrc: "/images/restaurant-image-1.jpg", deals: ["Happy Hour 2for1"],            socialProof: { variant: "neotasters", quote: '"Good beer selection, nice canal-side terrace in summer."',              names: "Tom B. and +6 visited",    avatars: ["/images/avatar-image-5.jpg",  "/images/avatar-image-6.jpg"]  } } },
  { id: 33, lat: 52.5340, lng: 13.3640, type: "plain", restaurant: { name: "La Maison",              category: "French",                rating: "4.6", reviewCount: "178", distance: "2.9 km", imageSrc: "/images/restaurant-image-2.jpg", deals: ["Lunch Menu €15"],             socialProof: { variant: "neotasters", quote: '"Authentic Parisian bistro feel — the croque monsieur is superb."',     names: "Eva M. and +9 visited",    avatars: ["/images/avatar-image-7.jpg",  "/images/avatar-image-8.jpg"]  } } },
  { id: 34, lat: 52.4920, lng: 13.4390, type: "plain", restaurant: { name: "Yamazaki",               category: "Japanese Bakery",       rating: "4.7", reviewCount: "304", distance: "3.2 km", imageSrc: "/images/food-image-1.jpg",        deals: ["10% off any pastry"],         socialProof: { variant: "neotasters", quote: '"Japanese baking precision — the melon pan is extraordinary."',         names: "Yuki A. and +14 visited",  avatars: ["/images/avatar-image-9.jpg",  "/images/avatar-image-10.jpg"] } } },
  { id: 35, lat: 52.5160, lng: 13.3560, type: "plain", restaurant: { name: "Augustiner am Gendarmenmarkt", category: "Beer Hall, German", rating: "4.4", reviewCount: "2.1k", distance: "1.5 km", imageSrc: "/images/restaurant-image-3.jpg", deals: ["Stein 2for1 after 9pm"], socialProof: { variant: "neotasters", quote: '"Classic Munich beer hall atmosphere right in central Berlin."',          names: "Erik S. and +21 visited",  avatars: ["/images/avatar-image-11.jpg", "/images/avatar-image-12.jpg"] } } },
  { id: 36, lat: 52.5395, lng: 13.4470, type: "plain", restaurant: { name: "Annelies",               category: "Café, Vegan",           rating: "4.5", reviewCount: "167", distance: "3.5 km", imageSrc: "/images/cafe-image-3.jpg",        deals: ["Vegan Brunch Deal"],          socialProof: { variant: "neotasters", quote: '"Plant-based brunch done beautifully — every dish is a delight."',      names: "Clara N. and +7 visited",  avatars: ["/images/avatar-image-13.jpg", "/images/avatar-image-14.jpg"] } } },
  { id: 37, lat: 52.4870, lng: 13.3670, type: "plain", restaurant: { name: "Golgatha",               category: "Beer Garden",           rating: "4.1", reviewCount: "389", distance: "3.8 km", imageSrc: "/images/restaurant-image-4.jpg", deals: ["2for1 draft beer"],            socialProof: { variant: "neotasters", quote: '"Kreuzberg park vibes with cold beer — perfect summer evening."',       names: "Lars W. and +11 visited",  avatars: ["/images/avatar-image-15.jpg", "/images/avatar-image-1.jpg"]  } } },
  { id: 38, lat: 52.5230, lng: 13.4680, type: "plain", restaurant: { name: "Knofi",                  category: "Middle Eastern",        rating: "4.6", reviewCount: "256", distance: "2.6 km", imageSrc: "/images/food-image-2.jpg",        deals: ["Falafel plate €8"],           socialProof: { variant: "neotasters", quote: '"Legendary falafel — crispy outside, fluffy inside, every time."',     names: "Sara O. and +16 visited",  avatars: ["/images/avatar-image-2.jpg",  "/images/avatar-image-5.jpg"]  } } },
  { id: 39, lat: 52.5100, lng: 13.3800, type: "plain", restaurant: { name: "Volt Restaurant",        category: "Modern European",       rating: "4.8", reviewCount: "198", distance: "2.2 km", imageSrc: "/images/restaurant-image-5.jpg", deals: ["Tasting menu 15% off"],       socialProof: { variant: "neotasters", quote: '"Substation-turned-restaurant — the tasting menu is a true journey."',  names: "Finn H. and +10 visited",  avatars: ["/images/avatar-image-3.jpg",  "/images/avatar-image-7.jpg"]  } } },
  { id: 40, lat: 52.5360, lng: 13.3980, type: "plain", restaurant: { name: "Toca Rouge",             category: "Bar, Tapas",            rating: "4.3", reviewCount: "134", distance: "1.9 km", imageSrc: "/images/cafe-image-4.jpg",        deals: ["Tapas 3for2"],                socialProof: { variant: "neotasters", quote: '"Lively tapas bar — the patatas bravas keep me coming back."',          names: "Mila G. and +8 visited",   avatars: ["/images/avatar-image-4.jpg",  "/images/avatar-image-6.jpg"]  } } },
  { id: 41, lat: 52.4960, lng: 13.4510, type: "plain", restaurant: { name: "Hops & Barley",          category: "Craft Beer, Pub",       rating: "4.5", reviewCount: "287", distance: "2.7 km", imageSrc: "/images/restaurant-image-6.jpg", deals: ["Free tasting flight"],        socialProof: { variant: "neotasters", quote: '"Berliner craft beer at its finest — the dark lager is outstanding."',  names: "Noah P. and +13 visited",  avatars: ["/images/avatar-image-8.jpg",  "/images/avatar-image-9.jpg"]  } } },
  { id: 42, lat: 52.5430, lng: 13.3830, type: "plain", restaurant: { name: "Westberlin",             category: "Café, Books",           rating: "4.4", reviewCount: "203", distance: "3.1 km", imageSrc: "/images/cafe-image-5.jpg",        deals: ["Coffee + cake €7"],           socialProof: { variant: "neotasters", quote: '"Laptop-friendly café with great coffee and an even better cake."',    names: "Jade L. and +9 visited",   avatars: ["/images/avatar-image-10.jpg", "/images/avatar-image-11.jpg"] } } },
  { id: 43, lat: 52.5025, lng: 13.4140, type: "plain", restaurant: { name: "Charlottenburg Kantine", category: "German, Casual",        rating: "4.2", reviewCount: "98",  distance: "1.3 km", imageSrc: "/images/restaurant-image-7.jpg", deals: ["Lunch €9.50"],                socialProof: { variant: "neotasters", quote: '"Solid home-cooking at honest prices — a reliable weekday lunch."',     names: "Ida F. and +15 visited",   avatars: ["/images/avatar-image-12.jpg", "/images/avatar-image-13.jpg"] } } },
  { id: 44, lat: 52.5285, lng: 13.3740, type: "plain", restaurant: { name: "Bar Bobu",               category: "Wine Bar",              rating: "4.6", reviewCount: "145", distance: "2.0 km", imageSrc: "/images/cafe-image-6.jpg",        deals: ["Natural wine 2for1"],         socialProof: { variant: "neotasters", quote: '"Natural wines, low-key atmosphere — the perfect wind-down spot."',    names: "Remi C. and +7 visited",   avatars: ["/images/avatar-image-14.jpg", "/images/avatar-image-15.jpg"] } } },

  // 16 additional tiny pins — filling all Berlin neighbourhoods
  { id: 112, lat: 52.5042, lng: 13.3038, type: "plain", restaurant: { name: "Rauschgold",            category: "Bar, Wine",             rating: "4.4", reviewCount: "167", distance: "5.8 km", imageSrc: "/images/cafe-image-8.jpg",        deals: ["Wine by the glass €6"],       socialProof: { variant: "neotasters", quote: '"Intimate wine bar — the selection of natural reds is superb."',         names: "Pierre D. and +6 visited",  avatars: ["/images/avatar-image-1.jpg",  "/images/avatar-image-3.jpg"]  } } },
  { id: 113, lat: 52.5282, lng: 13.3822, type: "plain", restaurant: { name: "Espresso House",        category: "Coffee, Café",          rating: "4.3", reviewCount: "189", distance: "2.2 km", imageSrc: "/images/cafe-image-1.jpg",        deals: ["Loyalty Card × 10"],         socialProof: { variant: "neotasters", quote: '"Reliable specialty coffee stop — great for a quick afternoon break."',  names: "Leah N. and +5 visited",    avatars: ["/images/avatar-image-2.jpg",  "/images/avatar-image-4.jpg"]  } } },
  { id: 114, lat: 52.5032, lng: 13.4532, type: "plain", restaurant: { name: "Cantina",               category: "Mexican, Bar",          rating: "4.2", reviewCount: "312", distance: "3.8 km", imageSrc: "/images/food-image-4.jpg",        deals: ["Taco Tuesday 3for2"],         socialProof: { variant: "neotasters", quote: '"The margaritas are dangerously good and the tacos keep up."',            names: "Pablo R. and +9 visited",   avatars: ["/images/avatar-image-5.jpg",  "/images/avatar-image-7.jpg"]  } } },
  { id: 115, lat: 52.5162, lng: 13.4002, type: "plain", restaurant: { name: "Schwarzwaldstuben",     category: "German, Traditional",   rating: "4.5", reviewCount: "245", distance: "1.6 km", imageSrc: "/images/restaurant-image-2.jpg", deals: ["Schnitzel Deal 20% off"],     socialProof: { variant: "neotasters", quote: '"Hearty Black Forest classics — the Maultaschen are extraordinary."',     names: "Hans F. and +11 visited",   avatars: ["/images/avatar-image-6.jpg",  "/images/avatar-image-8.jpg"]  } } },
  { id: 116, lat: 52.5522, lng: 13.3802, type: "plain", restaurant: { name: "Kieler Eck",            category: "Bar, Pub",              rating: "4.1", reviewCount: "203", distance: "3.4 km", imageSrc: "/images/restaurant-image-3.jpg", deals: ["Beer + Bratwurst €9"],        socialProof: { variant: "neotasters", quote: '"Unpretentious Wedding local — cold beers and warm welcome."',             names: "Rico S. and +7 visited",    avatars: ["/images/avatar-image-9.jpg",  "/images/avatar-image-11.jpg"] } } },
  { id: 117, lat: 52.5402, lng: 13.4152, type: "plain", restaurant: { name: "Oderberger",            category: "Café, Pool",            rating: "4.6", reviewCount: "421", distance: "2.9 km", imageSrc: "/images/cafe-image-3.jpg",        deals: ["Day Pass + Coffee €18"],      socialProof: { variant: "neotasters", quote: '"Historic bathhouse café — swim, then enjoy excellent brunch."',           names: "Miro H. and +13 visited",   avatars: ["/images/avatar-image-10.jpg", "/images/avatar-image-12.jpg"] } } },
  { id: 118, lat: 52.5362, lng: 13.4082, type: "plain", restaurant: { name: "Brot & Butter",         category: "Bakery, Café",          rating: "4.5", reviewCount: "178", distance: "2.5 km", imageSrc: "/images/cafe-image-2.jpg",        deals: ["Breakfast Deal €8"],          socialProof: { variant: "neotasters", quote: '"Beautiful sourdough and the best cinnamon rolls in Prenzlauer Berg."',   names: "Ute M. and +8 visited",     avatars: ["/images/avatar-image-1.jpg",  "/images/avatar-image-5.jpg"]  } } },
  { id: 119, lat: 52.5092, lng: 13.4622, type: "plain", restaurant: { name: "Deli Star",             category: "Deli, Café",            rating: "4.4", reviewCount: "134", distance: "3.8 km", imageSrc: "/images/food-image-8.jpg",        deals: ["Sandwich Combo €9"],          socialProof: { variant: "neotasters", quote: '"Creative deli sandwiches — the brie and fig combo is a winner."',        names: "Ben C. and +6 visited",     avatars: ["/images/avatar-image-3.jpg",  "/images/avatar-image-6.jpg"]  } } },
  { id: 120, lat: 52.5228, lng: 13.3852, type: "plain", restaurant: { name: "Nosh",                  category: "Nordic, Café",          rating: "4.5", reviewCount: "198", distance: "2.1 km", imageSrc: "/images/cafe-image-6.jpg",        deals: ["Open Sandwich €10"],          socialProof: { variant: "neotasters", quote: '"Scandi-cool café — the smoked salmon smørrebrød is divine."',             names: "Lotte K. and +10 visited",  avatars: ["/images/avatar-image-4.jpg",  "/images/avatar-image-7.jpg"]  } } },
  { id: 121, lat: 52.5142, lng: 13.4102, type: "plain", restaurant: { name: "Yam Yam",               category: "Asian, Ramen",          rating: "4.4", reviewCount: "567", distance: "1.7 km", imageSrc: "/images/food-image-5.jpg",        deals: ["Ramen Bowl €11"],             socialProof: { variant: "neotasters", quote: '"Quick, satisfying Japanese bowls — great for a weekday lunch."',         names: "Hiro T. and +18 visited",   avatars: ["/images/avatar-image-8.jpg",  "/images/avatar-image-10.jpg"] } } },
  { id: 122, lat: 52.4942, lng: 13.3802, type: "plain", restaurant: { name: "Häppchen",              category: "Wine Bar, Tapas",       rating: "4.4", reviewCount: "145", distance: "3.0 km", imageSrc: "/images/cafe-image-7.jpg",        deals: ["Wine + Tapas €15"],           socialProof: { variant: "neotasters", quote: '"Cosy wine bar with excellent small plates — come early for a seat."',    names: "Nora L. and +8 visited",    avatars: ["/images/avatar-image-9.jpg",  "/images/avatar-image-11.jpg"] } } },
  { id: 123, lat: 52.4998, lng: 13.4102, type: "plain", restaurant: { name: "Zur Kleinen Markthalle", category: "German, Traditional",  rating: "4.3", reviewCount: "289", distance: "2.4 km", imageSrc: "/images/food-image-3.jpg",        deals: ["Lunch Set €12"],              socialProof: { variant: "neotasters", quote: '"Old-school Berlin diner vibes — the goulash is proper comfort food."',   names: "Klaus W. and +12 visited",  avatars: ["/images/avatar-image-2.jpg",  "/images/avatar-image-14.jpg"] } } },
  { id: 124, lat: 52.4792, lng: 13.4152, type: "plain", restaurant: { name: "Baraka",                category: "Middle Eastern",        rating: "4.6", reviewCount: "321", distance: "4.5 km", imageSrc: "/images/food-image-13.jpg",       deals: ["Mezze Platter 20% off"],      socialProof: { variant: "neotasters", quote: '"Neukölln gem — the mezze spread is generous and the falafel fresh."',    names: "Amir K. and +15 visited",   avatars: ["/images/avatar-image-3.jpg",  "/images/avatar-image-5.jpg"]  } } },
  { id: 125, lat: 52.5482, lng: 13.4222, type: "plain", restaurant: { name: "Due Forni",             category: "Pizza, Italian",        rating: "4.5", reviewCount: "678", distance: "3.2 km", imageSrc: "/images/food-image-6.jpg",        deals: ["Pizza 2for1 Sun"],            socialProof: { variant: "neotasters", quote: '"Wood-fired thin crust done right — the diavola has a perfect kick."',   names: "Marco V. and +20 visited",  avatars: ["/images/avatar-image-6.jpg",  "/images/avatar-image-9.jpg"]  } } },
  { id: 126, lat: 52.4952, lng: 13.3482, type: "plain", restaurant: { name: "La Cocotte",            category: "French, Bistro",        rating: "4.5", reviewCount: "212", distance: "3.8 km", imageSrc: "/images/restaurant-image-4.jpg", deals: ["Prix Fixe Lunch €19"],        socialProof: { variant: "neotasters", quote: '"Authentic French bistro in the heart of Schöneberg — très bien!"',      names: "Cécile B. and +9 visited",  avatars: ["/images/avatar-image-7.jpg",  "/images/avatar-image-13.jpg"] } } },
  { id: 127, lat: 52.5062, lng: 13.3352, type: "plain", restaurant: { name: "Namaskar",              category: "Indian, Curry",         rating: "4.4", reviewCount: "345", distance: "4.2 km", imageSrc: "/images/food-image-10.jpg",       deals: ["Curry + Naan €13"],           socialProof: { variant: "neotasters", quote: '"Fragrant and well-spiced — the lamb rogan josh is outstanding."',        names: "Priya S. and +11 visited",  avatars: ["/images/avatar-image-4.jpg",  "/images/avatar-image-8.jpg"]  } } },

  // ── Extra Friends pins (×8) ──────────────────────────────────────────────

  { id:128, lat:52.5312, lng:13.3428, type:"friends", value:"+5", tooltipAvatarSrc:"/images/avatar-image-3.jpg", tooltipAvatarSrcs:["/images/avatar-image-3.jpg","/images/avatar-image-5.jpg"], friendVisits:[{avatarUrl:"/images/avatar-image-3.jpg",count:5}], restaurant:{ name:"Café Botanica", category:"Café, Plants", rating:"4.6", reviewCount:"201", distance:"2.3 km", imageSrc:"/images/cafe-image-3.jpg", deals:["Breakfast Deal €9","FREE Coffee refill"], trustTag:{type:"friends",label:"♥ 5 friends visited"}, friendsCount:"5", avatarSrcs:["/images/avatar-image-3.jpg","/images/avatar-image-5.jpg"], socialProof:{variant:"friends",quote:'"Lush botanical café — great filter coffee and homemade cakes on every table."',names:"Hanna B. and +4 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-5.jpg"]}} },
  { id:129, lat:52.4855, lng:13.4478, type:"friends", value:"+8", tooltipAvatarSrc:"/images/avatar-image-7.jpg", tooltipAvatarSrcs:["/images/avatar-image-7.jpg","/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"], friendVisits:[{avatarUrl:"/images/avatar-image-7.jpg",count:8}], restaurant:{ name:"Deli Noa", category:"Israeli, Deli", rating:"4.7", reviewCount:"312", distance:"4.3 km", imageSrc:"/images/food-image-13.jpg", deals:["Sabich 2for1","FREE Hummus"], trustTag:{type:"friends",label:"♥ 8 friends visited"}, friendsCount:"8", avatarSrcs:["/images/avatar-image-7.jpg","/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"], socialProof:{variant:"friends",quote:'"The sabich is a work of art — layers of aubergine, egg, and spiced mango."',names:"Lena K. and +7 visited",avatars:["/images/avatar-image-7.jpg","/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"]}} },
  { id:130, lat:52.5568, lng:13.4002, type:"friends", value:"+3", tooltipAvatarSrc:"/images/avatar-image-11.jpg", tooltipAvatarSrcs:["/images/avatar-image-11.jpg","/images/avatar-image-13.jpg"], friendVisits:[{avatarUrl:"/images/avatar-image-11.jpg",count:3}], restaurant:{ name:"Bäckerei Nord", category:"Bakery, Café", rating:"4.4", reviewCount:"178", distance:"4.2 km", imageSrc:"/images/cafe-image-2.jpg", deals:["Bread + Coffee €5"], trustTag:{type:"friends",label:"♥ 3 friends visited"}, friendsCount:"3", avatarSrcs:["/images/avatar-image-11.jpg","/images/avatar-image-13.jpg"], socialProof:{variant:"friends",quote:'"Perfect sourdough and the friendliest staff in Pankow."',names:"Otto B. and +2 visited",avatars:["/images/avatar-image-11.jpg","/images/avatar-image-13.jpg"]}} },
  { id:131, lat:52.5025, lng:13.4682, type:"friends", value:"+6", tooltipAvatarSrc:"/images/avatar-image-14.jpg", tooltipAvatarSrcs:["/images/avatar-image-14.jpg","/images/avatar-image-2.jpg"], friendVisits:[{avatarUrl:"/images/avatar-image-14.jpg",count:6}], restaurant:{ name:"Ostküche", category:"Modern German, Casual", rating:"4.5", reviewCount:"145", distance:"4.0 km", imageSrc:"/images/restaurant-image-6.jpg", deals:["Lunch Plate €11","FREE Soup"], trustTag:{type:"friends",label:"♥ 6 friends visited"}, friendsCount:"6", avatarSrcs:["/images/avatar-image-14.jpg","/images/avatar-image-2.jpg"], socialProof:{variant:"friends",quote:'"East Berlin soul on a plate — seasonal dishes at very reasonable prices."',names:"Kirra S. and +5 visited",avatars:["/images/avatar-image-14.jpg","/images/avatar-image-2.jpg"]}} },
  { id:132, lat:52.5552, lng:13.4612, type:"friends", value:"+4", tooltipAvatarSrc:"/images/avatar-image-6.jpg", tooltipAvatarSrcs:["/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"], friendVisits:[{avatarUrl:"/images/avatar-image-6.jpg",count:4}], restaurant:{ name:"Weißensee Café", category:"Café, Lakeside", rating:"4.6", reviewCount:"234", distance:"4.8 km", imageSrc:"/images/cafe-image-6.jpg", deals:["Coffee + Kuchen €7.50"], trustTag:{type:"friends",label:"♥ 4 friends visited"}, friendsCount:"4", avatarSrcs:["/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"], socialProof:{variant:"friends",quote:'"Lakeside café bliss — perfect on a summer afternoon with a slice of cake."',names:"Nele W. and +3 visited",avatars:["/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"]}} },
  { id:133, lat:52.4608, lng:13.3328, type:"friends", value:"+2", tooltipAvatarSrc:"/images/avatar-image-15.jpg", tooltipAvatarSrcs:["/images/avatar-image-15.jpg","/images/avatar-image-1.jpg"], friendVisits:[{avatarUrl:"/images/avatar-image-15.jpg",count:2}], restaurant:{ name:"Steglitz Stube", category:"German, Comfort Food", rating:"4.3", reviewCount:"98", distance:"6.5 km", imageSrc:"/images/food-image-7.jpg", deals:["Lunch Set €10"], trustTag:{type:"friends",label:"♥ 2 friends visited"}, friendsCount:"2", avatarSrcs:["/images/avatar-image-15.jpg","/images/avatar-image-1.jpg"], socialProof:{variant:"friends",quote:'"Classic Berliner home cooking — the Eisbein is fall-off-the-bone perfect."',names:"Gerd F. and +1 visited",avatars:["/images/avatar-image-15.jpg","/images/avatar-image-1.jpg"]}} },
  { id:134, lat:52.4952, lng:13.3102, type:"friends", value:"+9", tooltipAvatarSrc:"/images/avatar-image-4.jpg", tooltipAvatarSrcs:["/images/avatar-image-4.jpg","/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"], friendVisits:[{avatarUrl:"/images/avatar-image-4.jpg",count:9}], restaurant:{ name:"Sachiko Sushi", category:"Japanese, Sushi", rating:"4.7", reviewCount:"567", distance:"5.4 km", imageSrc:"/images/food-image-5.jpg", deals:["Omakase Set 15% off","FREE Miso Soup"], trustTag:{type:"friends",label:"♥ 9 friends visited"}, friendsCount:"9", avatarSrcs:["/images/avatar-image-4.jpg","/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"], socialProof:{variant:"friends",quote:'"The freshest sushi west of the city — the omakase is worth every euro."',names:"Yuki M. and +8 visited",avatars:["/images/avatar-image-4.jpg","/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"]}} },
  { id:135, lat:52.5482, lng:13.3552, type:"friends", value:"+4", tooltipAvatarSrc:"/images/avatar-image-2.jpg", tooltipAvatarSrcs:["/images/avatar-image-2.jpg","/images/avatar-image-4.jpg"], friendVisits:[{avatarUrl:"/images/avatar-image-2.jpg",count:4}], restaurant:{ name:"Wedding Küche", category:"International, Fusion", rating:"4.4", reviewCount:"178", distance:"3.2 km", imageSrc:"/images/food-image-9.jpg", deals:["2for1 Mains Mon–Wed"], trustTag:{type:"friends",label:"♥ 4 friends visited"}, friendsCount:"4", avatarSrcs:["/images/avatar-image-2.jpg","/images/avatar-image-4.jpg"], socialProof:{variant:"friends",quote:'"Wedding\'s melting pot in a bowl — bold flavours from every continent."',names:"Amara D. and +3 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-4.jpg"]}} },

  // ── Extra Community pins (×12) ────────────────────────────────────────────

  { id:136, lat:52.5182, lng:13.4452, type:"community", value:"47", restaurant:{ name:"Akemi Izakaya", category:"Japanese, Izakaya", rating:"4.7", reviewCount:"678", distance:"3.2 km", imageSrc:"/images/food-image-2.jpg", deals:["Izakaya Set 15% off","FREE Edamame"], trustTag:{type:"community",label:"👥 47 people this week"}, socialProof:{variant:"neotasters",quote:'"Lively izakaya energy — the yakitori skewers are impossibly good."',names:"Hana R. and +46 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-4.jpg"]}} },
  { id:137, lat:52.5398, lng:13.4322, type:"community", value:"22", restaurant:{ name:"Fleischerei", category:"Modern German, Bar", rating:"4.5", reviewCount:"345", distance:"2.8 km", imageSrc:"/images/food-image-11.jpg", deals:["Burger + Beer €15","Happy Hour 5–7pm"], trustTag:{type:"community",label:"👥 22 people this week"}, socialProof:{variant:"neotasters",quote:'"Converted butcher shop turned hip bar — the smash burger is the real deal."',names:"Finn M. and +21 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-6.jpg"]}} },
  { id:138, lat:52.5022, lng:13.3752, type:"community", value:"38", restaurant:{ name:"Lon Men's Noodle House", category:"Taiwanese, Noodles", rating:"4.6", reviewCount:"892", distance:"2.2 km", imageSrc:"/images/food-image-8.jpg", deals:["Noodle Bowl €10","FREE Gyoza with bowl"], trustTag:{type:"community",label:"👥 38 people this week"}, socialProof:{variant:"neotasters",quote:'"Queue for it — Taiwanese beef noodles that make you forget everything else."',names:"Lin C. and +37 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-7.jpg"]}} },
  { id:139, lat:52.5268, lng:13.3568, type:"community", value:"16", restaurant:{ name:"Tiergarten Quelle", category:"Beer Garden, German", rating:"4.3", reviewCount:"1.2k", distance:"1.9 km", imageSrc:"/images/food-image-12.jpg", deals:["2for1 Beer 4–6pm"], trustTag:{type:"community",label:"👥 16 people this week"}, socialProof:{variant:"neotasters",quote:'"Old-school Berlin beer garden — cold Pilsner and absolutely no pretension."',names:"Werner K. and +15 visited",avatars:["/images/avatar-image-5.jpg","/images/avatar-image-8.jpg"]}} },
  { id:140, lat:52.5468, lng:13.3948, type:"community", value:"29", restaurant:{ name:"Sasaya", category:"Japanese, Organic", rating:"4.7", reviewCount:"412", distance:"3.2 km", imageSrc:"/images/food-image-1.jpg", deals:["Bento Box 10% off","FREE Green Tea"], trustTag:{type:"community",label:"👥 29 people this week"}, socialProof:{variant:"neotasters",quote:'"Organic Japanese soul food — the bento box is pure balance and beauty."',names:"Keiko T. and +28 visited",avatars:["/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"]}} },
  { id:141, lat:52.4882, lng:13.3652, type:"community", value:"53", restaurant:{ name:"Fes-Bar", category:"Turkish, Meyhane", rating:"4.5", reviewCount:"523", distance:"3.7 km", imageSrc:"/images/food-image-14.jpg", deals:["Mezze Feast €18","FREE Raki shot"], trustTag:{type:"community",label:"👥 53 people this week"}, socialProof:{variant:"neotasters",quote:'"Schöneberg\'s favourite Turkish spot — mezze for days and music until late."',names:"Ayşe D. and +52 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-12.jpg"]}} },
  { id:142, lat:52.5148, lng:13.4898, type:"community", value:"21", restaurant:{ name:"Zenkichi", category:"Japanese, Omakase", rating:"4.8", reviewCount:"298", distance:"5.1 km", imageSrc:"/images/food-image-5.jpg", deals:["Omakase 20% off"], trustTag:{type:"community",label:"👥 21 people this week"}, socialProof:{variant:"neotasters",quote:'"Intimate booth dining — the omakase experience is unlike anything else in Berlin."',names:"Ryō N. and +20 visited",avatars:["/images/avatar-image-13.jpg","/images/avatar-image-15.jpg"]}} },
  { id:143, lat:52.5612, lng:13.3912, type:"community", value:"14", restaurant:{ name:"Nordküche", category:"Nordic, Seasonal", rating:"4.5", reviewCount:"167", distance:"4.8 km", imageSrc:"/images/restaurant-image-7.jpg", deals:["Nordic Lunch €14"], trustTag:{type:"community",label:"👥 14 people this week"}, socialProof:{variant:"neotasters",quote:'"Sparse, beautiful Nordic cooking — fennel, dill, and smoked fish done perfectly."',names:"Maja S. and +13 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-6.jpg"]}} },
  { id:144, lat:52.4742, lng:13.4552, type:"community", value:"41", restaurant:{ name:"Datscha", category:"Russian, Eastern European", rating:"4.4", reviewCount:"378", distance:"5.5 km", imageSrc:"/images/food-image-3.jpg", deals:["Borscht + Bread €8","FREE Vodka shot"], trustTag:{type:"community",label:"👥 41 people this week"}, socialProof:{variant:"neotasters",quote:'"Soviet dacha atmosphere and genuinely great borscht — a total cult favourite."',names:"Olga P. and +40 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-4.jpg"]}} },
  { id:145, lat:52.5068, lng:13.3262, type:"community", value:"18", restaurant:{ name:"Lode & Stijn", category:"Modern European, Small Plates", rating:"4.8", reviewCount:"234", distance:"5.5 km", imageSrc:"/images/restaurant-image-1.jpg", deals:["Small Plates Set 20% off"], trustTag:{type:"community",label:"👥 18 people this week"}, socialProof:{variant:"neotasters",quote:'"Intimate and creative — every small plate is a considered, delicious idea."',names:"Stijn V. and +17 visited",avatars:["/images/avatar-image-7.jpg","/images/avatar-image-9.jpg"]}} },
  { id:146, lat:52.5298, lng:13.4702, type:"community", value:"35", restaurant:{ name:"Sage Restaurant", category:"Modern Mediterranean", rating:"4.6", reviewCount:"412", distance:"4.2 km", imageSrc:"/images/hero-image-1.jpg", deals:["Dinner Set 15% off"], trustTag:{type:"community",label:"👥 35 people this week"}, socialProof:{variant:"neotasters",quote:'"Mediterranean boldness with Berlin cool — the flatbread appetisers are incredible."',names:"Lara M. and +34 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-5.jpg"]}} },
  { id:147, lat:52.4922, lng:13.4652, type:"community", value:"26", restaurant:{ name:"Sonntag", category:"Café, Brunch", rating:"4.5", reviewCount:"289", distance:"4.3 km", imageSrc:"/images/cafe-image-4.jpg", deals:["Brunch Set €15","FREE OJ"], trustTag:{type:"community",label:"👥 26 people this week"}, socialProof:{variant:"neotasters",quote:'"The Sunday brunch you\'ve been looking for — calm, beautiful, and delicious."',names:"Johanna R. and +25 visited",avatars:["/images/avatar-image-8.jpg","/images/avatar-image-10.jpg"]}} },

  // ── Extra Plain / Tiny pins (×78) ────────────────────────────────────────

  // Mitte / centre cluster
  { id:148, lat:52.5188, lng:13.3938, type:"plain", restaurant:{ name:"Café Einstein Stammhaus", category:"Viennese, Coffee", rating:"4.5", reviewCount:"1.2k", distance:"0.9 km", imageSrc:"/images/cafe-image-1.jpg", deals:["Espresso + Kuchen €8"], socialProof:{variant:"neotasters",quote:'"Vienna in Berlin — the apple strudel and the ambience are unbeatable."',names:"Felix A. and +22 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-2.jpg"]}} },
  { id:149, lat:52.5168, lng:13.4088, type:"plain", restaurant:{ name:"Tadshikische Teestube", category:"Central Asian, Tea", rating:"4.6", reviewCount:"345", distance:"1.1 km", imageSrc:"/images/food-image-14.jpg", deals:["Tea Ceremony €12"], socialProof:{variant:"neotasters",quote:'"Hidden treasure — floor seating, exotic teas, and total serenity."',names:"Dilnoza T. and +8 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-5.jpg"]}} },
  { id:150, lat:52.5248, lng:13.4008, type:"plain", restaurant:{ name:"Chipps", category:"Vegetarian, Brunch", rating:"4.5", reviewCount:"567", distance:"0.7 km", imageSrc:"/images/cafe-image-2.jpg", deals:["Brunch Deal €13"], socialProof:{variant:"neotasters",quote:'"Creative vegetarian brunch that even meat-eaters adore."',names:"Clara B. and +15 visited",avatars:["/images/avatar-image-6.jpg","/images/avatar-image-7.jpg"]}} },
  { id:151, lat:52.5218, lng:13.3918, type:"plain", restaurant:{ name:"Grill Royal", category:"Steakhouse, Fine Dining", rating:"4.8", reviewCount:"821", distance:"0.5 km", imageSrc:"/images/restaurant-image-1.jpg", deals:["Ribeye 15% off Sun"], socialProof:{variant:"neotasters",quote:'"The best steak in Berlin — the Spree view makes it even more unforgettable."',names:"Martin K. and +19 visited",avatars:["/images/avatar-image-8.jpg","/images/avatar-image-9.jpg"]}} },
  { id:152, lat:52.5238, lng:13.4138, type:"plain", restaurant:{ name:"Transit", category:"Asian Fusion, Café", rating:"4.4", reviewCount:"678", distance:"1.6 km", imageSrc:"/images/food-image-8.jpg", deals:["Lunch Bento €9"], socialProof:{variant:"neotasters",quote:'"Pan-Asian comfort bowls done with real care — the green curry is excellent."',names:"Lucy T. and +14 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-11.jpg"]}} },

  // Prenzlauer Berg
  { id:153, lat:52.5348, lng:13.4248, type:"plain", restaurant:{ name:"Konnopke's Imbiss", category:"Currywurst, Street Food", rating:"4.6", reviewCount:"2.8k", distance:"2.7 km", imageSrc:"/images/food-image-4.jpg", deals:["Currywurst Deal €5"], socialProof:{variant:"neotasters",quote:'"Under the railway bridge — the original Berlin currywurst experience."',names:"Klaus R. and +44 visited",avatars:["/images/avatar-image-12.jpg","/images/avatar-image-13.jpg"]}} },
  { id:154, lat:52.5368, lng:13.4128, type:"plain", restaurant:{ name:"Pastis", category:"French, Bistro", rating:"4.5", reviewCount:"312", distance:"2.9 km", imageSrc:"/images/restaurant-image-2.jpg", deals:["Lunch Menu €16"], socialProof:{variant:"neotasters",quote:'"Genuine Parisian bistro spirit — croque monsieur and decent house wine."',names:"Claude P. and +11 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-3.jpg"]}} },
  { id:155, lat:52.5318, lng:13.4178, type:"plain", restaurant:{ name:"Suvlaki Bar", category:"Greek, Souvlaki", rating:"4.4", reviewCount:"234", distance:"2.3 km", imageSrc:"/images/food-image-6.jpg", deals:["Souvlaki Wrap €8"], socialProof:{variant:"neotasters",quote:'"The tzatziki is criminally good — best Greek street food in the city."',names:"Nikos D. and +9 visited",avatars:["/images/avatar-image-4.jpg","/images/avatar-image-5.jpg"]}} },
  { id:156, lat:52.5388, lng:13.4308, type:"plain", restaurant:{ name:"Le Bon", category:"Wine Bar, French", rating:"4.6", reviewCount:"178", distance:"3.2 km", imageSrc:"/images/cafe-image-7.jpg", deals:["Natural Wine 2for1"], socialProof:{variant:"neotasters",quote:'"Relaxed natural wine bar — the cheese plate is a masterclass in selection."',names:"Isabelle F. and +7 visited",avatars:["/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"]}} },
  { id:157, lat:52.5408, lng:13.4068, type:"plain", restaurant:{ name:"Café Morgenrot", category:"Vegan, Community Café", rating:"4.3", reviewCount:"145", distance:"3.1 km", imageSrc:"/images/cafe-image-3.jpg", deals:["Brunch Buffet €12"], socialProof:{variant:"neotasters",quote:'"Collectively run with heart — great vegan brunch and good politics on the wall."',names:"Robin S. and +6 visited",avatars:["/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"]}} },

  // Friedrichshain
  { id:158, lat:52.5118, lng:13.4568, type:"plain", restaurant:{ name:"Hühnerhaus 36", category:"Rotisserie, German", rating:"4.3", reviewCount:"567", distance:"3.3 km", imageSrc:"/images/food-image-7.jpg", deals:["Half Chicken Deal €8"], socialProof:{variant:"neotasters",quote:'"Crispy, golden rotisserie chicken at 3am — a true Berlin institution."',names:"Kira W. and +33 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-14.jpg"]}} },
  { id:159, lat:52.5148, lng:13.4698, type:"plain", restaurant:{ name:"Süpermercado", category:"Latin, Bar", rating:"4.4", reviewCount:"289", distance:"4.5 km", imageSrc:"/images/food-image-3.jpg", deals:["Taco Tues 3for2","FREE Margarita"], socialProof:{variant:"neotasters",quote:'"Lively Latin-inspired bar with genuinely good tacos and strong cocktails."',names:"Maria G. and +12 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-7.jpg"]}} },
  { id:160, lat:52.5088, lng:13.4708, type:"plain", restaurant:{ name:"Il Kino", category:"Italian, Wine Bar", rating:"4.5", reviewCount:"198", distance:"4.5 km", imageSrc:"/images/restaurant-image-5.jpg", deals:["Aperitivo Hour 6–8pm"], socialProof:{variant:"neotasters",quote:'"Cinema-themed Italian bar — the spritzes are excellent and the antipasti even better."',names:"Giulia C. and +8 visited",avatars:["/images/avatar-image-4.jpg","/images/avatar-image-6.jpg"]}} },
  { id:161, lat:52.5068, lng:13.4568, type:"plain", restaurant:{ name:"Möbel Olfe", category:"Bar, Cocktails", rating:"4.3", reviewCount:"412", distance:"3.5 km", imageSrc:"/images/cafe-image-8.jpg", deals:["Cocktails 2for1 Thu"], socialProof:{variant:"neotasters",quote:'"Alternative bar with great energy and very strong drinks — a Kreuzberg icon."',names:"Sam H. and +28 visited",avatars:["/images/avatar-image-5.jpg","/images/avatar-image-8.jpg"]}} },
  { id:162, lat:52.5178, lng:13.4808, type:"plain", restaurant:{ name:"Strandbar Mitte", category:"Beach Bar, Outdoor", rating:"4.2", reviewCount:"1.1k", distance:"5.2 km", imageSrc:"/images/food-image-12.jpg", deals:["Cocktail + Snack €14"], socialProof:{variant:"neotasters",quote:'"Sand underfoot and the Spree glittering — summer evenings don\'t get better."',names:"Jana N. and +47 visited",avatars:["/images/avatar-image-9.jpg","/images/avatar-image-10.jpg"]}} },

  // Kreuzberg
  { id:163, lat:52.4968, lng:13.4068, type:"plain", restaurant:{ name:"Cocolo Ramen XBerg", category:"Japanese, Ramen", rating:"4.7", reviewCount:"789", distance:"2.8 km", imageSrc:"/images/food-image-5.jpg", deals:["Ramen 2for1 Tue"], socialProof:{variant:"neotasters",quote:'"Silky tonkotsu and bouncy noodles — always worth the queue."',names:"Yui T. and +18 visited",avatars:["/images/avatar-image-11.jpg","/images/avatar-image-12.jpg"]}} },
  { id:164, lat:52.4938, lng:13.4158, type:"plain", restaurant:{ name:"Chez Maurice", category:"French, Bistro", rating:"4.4", reviewCount:"167", distance:"2.3 km", imageSrc:"/images/restaurant-image-4.jpg", deals:["Lunch Formule €15"], socialProof:{variant:"neotasters",quote:'"No-frills Parisian bistro in Kreuzberg — the onion soup is flawless."',names:"Maxime L. and +6 visited",avatars:["/images/avatar-image-13.jpg","/images/avatar-image-14.jpg"]}} },
  { id:165, lat:52.5018, lng:13.4018, type:"plain", restaurant:{ name:"Mezcalero", category:"Mexican, Mezcal Bar", rating:"4.5", reviewCount:"312", distance:"1.8 km", imageSrc:"/images/food-image-4.jpg", deals:["Mezcal Flight €18","FREE Guac"], socialProof:{variant:"neotasters",quote:'"Proper mezcal selection and tacos that put most places to shame."',names:"Pablo G. and +14 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-5.jpg"]}} },
  { id:166, lat:52.4988, lng:13.4298, type:"plain", restaurant:{ name:"Hasir", category:"Turkish, Kebab", rating:"4.5", reviewCount:"1.8k", distance:"3.0 km", imageSrc:"/images/food-image-1.jpg", deals:["Kebab Deal €9"], socialProof:{variant:"neotasters",quote:'"The original doner kebab in Berlin — crispy bread, perfect meat, legendary sauce."',names:"Mehmet A. and +62 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-3.jpg"]}} },
  { id:167, lat:52.4908, lng:13.4108, type:"plain", restaurant:{ name:"Rüyam Gemüse Kebab", category:"Kebab, Vegetarian", rating:"4.7", reviewCount:"678", distance:"3.2 km", imageSrc:"/images/food-image-13.jpg", deals:["10% off any order"], socialProof:{variant:"neotasters",quote:'"Veggie-friendly kebab spot that gives Mustafa\'s a real run for its money."',names:"Elif K. and +22 visited",avatars:["/images/avatar-image-4.jpg","/images/avatar-image-6.jpg"]}} },

  // Neukölln
  { id:168, lat:52.4818, lng:13.4298, type:"plain", restaurant:{ name:"Lavanderia Vecchia", category:"Italian, Romantic", rating:"4.8", reviewCount:"321", distance:"5.3 km", imageSrc:"/images/restaurant-image-3.jpg", deals:["4-Course Dinner 20% off"], socialProof:{variant:"neotasters",quote:'"In a former laundry — the pasta and the atmosphere are equally magical."',names:"Sofia A. and +9 visited",avatars:["/images/avatar-image-7.jpg","/images/avatar-image-9.jpg"]}} },
  { id:169, lat:52.4758, lng:13.4398, type:"plain", restaurant:{ name:"Sing Blackbird", category:"Vintage Shop, Café", rating:"4.5", reviewCount:"234", distance:"5.8 km", imageSrc:"/images/cafe-image-5.jpg", deals:["Coffee + Vintage €5 off"], socialProof:{variant:"neotasters",quote:'"Half vintage record shop, half excellent café — 100% Neukölln vibes."',names:"Rex B. and +11 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-14.jpg"]}} },
  { id:170, lat:52.4698, lng:13.4448, type:"plain", restaurant:{ name:"Luzia", category:"Bar, Café", rating:"4.3", reviewCount:"412", distance:"6.3 km", imageSrc:"/images/cafe-image-6.jpg", deals:["Happy Hour 5–8pm"], socialProof:{variant:"neotasters",quote:'"The quintessential Neukölln bar — candles, cash only, and good cheap drinks."',names:"Ava S. and +29 visited",avatars:["/images/avatar-image-11.jpg","/images/avatar-image-13.jpg"]}} },
  { id:171, lat:52.4838, lng:13.4508, type:"plain", restaurant:{ name:"Zitrone", category:"Café, Breakfast", rating:"4.4", reviewCount:"178", distance:"5.2 km", imageSrc:"/images/cafe-image-2.jpg", deals:["Breakfast Set €10"], socialProof:{variant:"neotasters",quote:'"Sun-drenched yellow café — beautiful eggs and the lemon tart is unforgettable."',names:"Dani F. and +8 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-4.jpg"]}} },
  { id:172, lat:52.4778, lng:13.4178, type:"plain", restaurant:{ name:"Silo Coffee NK", category:"Specialty Coffee", rating:"4.6", reviewCount:"345", distance:"5.1 km", imageSrc:"/images/cafe-image-4.jpg", deals:["Loyalty Card × 10"], socialProof:{variant:"neotasters",quote:'"Third-wave coffee done seriously — the aeropress here is a revelation."',names:"Johan B. and +16 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-6.jpg"]}} },

  // Schöneberg
  { id:173, lat:52.4938, lng:13.3538, type:"plain", restaurant:{ name:"Stagger Lee", category:"Bar, Whiskey", rating:"4.5", reviewCount:"267", distance:"3.8 km", imageSrc:"/images/cafe-image-8.jpg", deals:["Whiskey Flight €18"], socialProof:{variant:"neotasters",quote:'"Dark, moody whiskey bar with an extraordinary selection and zero attitude."',names:"Miles D. and +12 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-5.jpg"]}} },
  { id:174, lat:52.4878, lng:13.3428, type:"plain", restaurant:{ name:"Café Wintergarten", category:"Café, Book Shop", rating:"4.4", reviewCount:"189", distance:"4.5 km", imageSrc:"/images/cafe-image-1.jpg", deals:["Coffee + Cake €8"], socialProof:{variant:"neotasters",quote:'"Bookshop café with the best reading corner in all of Berlin."',names:"Inge M. and +9 visited",avatars:["/images/avatar-image-7.jpg","/images/avatar-image-8.jpg"]}} },
  { id:175, lat:52.4958, lng:13.3728, type:"plain", restaurant:{ name:"Café Berio", category:"Café, Traditional", rating:"4.3", reviewCount:"312", distance:"3.1 km", imageSrc:"/images/cafe-image-3.jpg", deals:["Breakfast 2for1 Sat"], socialProof:{variant:"neotasters",quote:'"Classic Berlin café since the 80s — proper filter coffee and excellent cake."',names:"Erika W. and +18 visited",avatars:["/images/avatar-image-9.jpg","/images/avatar-image-10.jpg"]}} },
  { id:176, lat:52.5008, lng:13.3458, type:"plain", restaurant:{ name:"Mr. Susan", category:"Modern European, Wine", rating:"4.7", reviewCount:"234", distance:"2.6 km", imageSrc:"/images/restaurant-image-6.jpg", deals:["Dinner Set 15% off","FREE Amuse"], socialProof:{variant:"neotasters",quote:'"Refined but relaxed — the wine pairings elevate an already excellent kitchen."',names:"Ben J. and +8 visited",avatars:["/images/avatar-image-11.jpg","/images/avatar-image-12.jpg"]}} },

  // Charlottenburg / Wilmersdorf
  { id:177, lat:52.5068, lng:13.3128, type:"plain", restaurant:{ name:"Hartmanns Restaurant", category:"Modern German, Fine Dining", rating:"4.7", reviewCount:"198", distance:"5.7 km", imageSrc:"/images/restaurant-image-7.jpg", deals:["Tasting Menu 20% off"], socialProof:{variant:"neotasters",quote:'"A quiet Charlottenburg jewel — the tasting menu is worth every course."',names:"Stefan H. and +7 visited",avatars:["/images/avatar-image-13.jpg","/images/avatar-image-14.jpg"]}} },
  { id:178, lat:52.5108, lng:13.3248, type:"plain", restaurant:{ name:"Good Friends", category:"Cantonese, Dim Sum", rating:"4.6", reviewCount:"789", distance:"4.8 km", imageSrc:"/images/food-image-2.jpg", deals:["Dim Sum 20% off","FREE Tea"], socialProof:{variant:"neotasters",quote:'"The best dim sum in Berlin — go at lunch and order everything on the trolley."',names:"Wei L. and +37 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-3.jpg"]}} },
  { id:179, lat:52.5148, lng:13.3028, type:"plain", restaurant:{ name:"Paris Bar", category:"Brasserie, French", rating:"4.5", reviewCount:"1.1k", distance:"5.8 km", imageSrc:"/images/restaurant-image-2.jpg", deals:["Lunch Formule €18"], socialProof:{variant:"neotasters",quote:'"A Berlin legend — artists and politicians sharing tables since 1952."',names:"Franz S. and +24 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-4.jpg"]}} },
  { id:180, lat:52.5028, lng:13.3368, type:"plain", restaurant:{ name:"Spätshop Deluxe", category:"Bar, Late Night", rating:"4.1", reviewCount:"567", distance:"3.0 km", imageSrc:"/images/cafe-image-8.jpg", deals:["Cold Beer €2"], socialProof:{variant:"neotasters",quote:'"The definitive Berlin late-night stop — cold Club Mate and good chat."',names:"Torben K. and +55 visited",avatars:["/images/avatar-image-5.jpg","/images/avatar-image-6.jpg"]}} },

  // Wedding
  { id:181, lat:52.5458, lng:13.3328, type:"plain", restaurant:{ name:"Lemon Leaf", category:"Thai, Asian", rating:"4.5", reviewCount:"234", distance:"3.4 km", imageSrc:"/images/food-image-8.jpg", deals:["Thai Set €12","FREE Spring Roll"], socialProof:{variant:"neotasters",quote:'"Authentic Thai flavours in a Wedding side street — the pad kra pao is fiery perfection."',names:"Nong P. and +13 visited",avatars:["/images/avatar-image-7.jpg","/images/avatar-image-9.jpg"]}} },
  { id:182, lat:52.5528, lng:13.3448, type:"plain", restaurant:{ name:"Konditorei Simon", category:"Bakery, Café", rating:"4.4", reviewCount:"178", distance:"3.8 km", imageSrc:"/images/cafe-image-2.jpg", deals:["Kuchen 2for1 3–5pm"], socialProof:{variant:"neotasters",quote:'"Old Berlin konditorei charm — the Bienenstich is just like grandma used to make."',names:"Helga F. and +11 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-11.jpg"]}} },
  { id:183, lat:52.5498, lng:13.3658, type:"plain", restaurant:{ name:"Heiße Ecke", category:"Currywurst, German", rating:"4.2", reviewCount:"345", distance:"3.3 km", imageSrc:"/images/food-image-4.jpg", deals:["Currywurst + Pommes €7"], socialProof:{variant:"neotasters",quote:'"Unpretentious, authentic Berlin street food — crispy and perfectly sauced."',names:"Jens W. and +21 visited",avatars:["/images/avatar-image-12.jpg","/images/avatar-image-13.jpg"]}} },
  { id:184, lat:52.5568, lng:13.3528, type:"plain", restaurant:{ name:"Mani Restaurant", category:"Israeli, Modern", rating:"4.7", reviewCount:"312", distance:"4.4 km", imageSrc:"/images/food-image-13.jpg", deals:["Mezze Board 15% off"], socialProof:{variant:"neotasters",quote:'"The best Israeli food in Berlin — vibrant, fresh, and utterly satisfying."',names:"Yoav B. and +14 visited",avatars:["/images/avatar-image-14.jpg","/images/avatar-image-15.jpg"]}} },

  // Moabit
  { id:185, lat:52.5268, lng:13.3448, type:"plain", restaurant:{ name:"Pret A Manger Moabit", category:"Café, Sandwiches", rating:"4.2", reviewCount:"456", distance:"1.8 km", imageSrc:"/images/cafe-image-1.jpg", deals:["Subscription Coffee €30/mo"], socialProof:{variant:"neotasters",quote:'"Reliable, fresh sandwiches and good coffee — a solid weekday lunch."',names:"Anna P. and +33 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-2.jpg"]}} },
  { id:186, lat:52.5298, lng:13.3258, type:"plain", restaurant:{ name:"Restaurant Horvath", category:"Austrian, Fine Dining", rating:"4.9", reviewCount:"287", distance:"4.1 km", imageSrc:"/images/restaurant-image-3.jpg", deals:["7-Course Menu 20% off"], socialProof:{variant:"neotasters",quote:'"Two Michelin stars for a reason — Austrian flavours elevated to pure artistry."',names:"Petra V. and +6 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-5.jpg"]}} },
  { id:187, lat:52.5248, lng:13.3348, type:"plain", restaurant:{ name:"Café Nö!", category:"Café, Brunch", rating:"4.4", reviewCount:"234", distance:"2.2 km", imageSrc:"/images/cafe-image-6.jpg", deals:["Brunch 2for1 Sun"], socialProof:{variant:"neotasters",quote:'"Relaxed Moabit café with a great egg menu and very decent filter coffee."',names:"Ralf H. and +10 visited",avatars:["/images/avatar-image-4.jpg","/images/avatar-image-6.jpg"]}} },
  { id:188, lat:52.5328, lng:13.3148, type:"plain", restaurant:{ name:"Neue Odessa Bar", category:"Bar, Eastern European", rating:"4.3", reviewCount:"189", distance:"4.6 km", imageSrc:"/images/cafe-image-8.jpg", deals:["Cocktails 2for1 Wed"], socialProof:{variant:"neotasters",quote:'"Retro Eastern European bar with excellent cocktails and regular DJs."',names:"Piotr S. and +14 visited",avatars:["/images/avatar-image-7.jpg","/images/avatar-image-8.jpg"]}} },

  // Pankow
  { id:189, lat:52.5618, lng:13.4128, type:"plain", restaurant:{ name:"Zum Heidekrug", category:"German, Beer Garden", rating:"4.3", reviewCount:"456", distance:"4.9 km", imageSrc:"/images/restaurant-image-4.jpg", deals:["Beer + Wurst €8"], socialProof:{variant:"neotasters",quote:'"Traditional Pankow kneipe — cold beers and hearty classics in a proper setting."',names:"Herbert W. and +19 visited",avatars:["/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"]}} },
  { id:190, lat:52.5648, lng:13.4028, type:"plain", restaurant:{ name:"Ristorante Gianni", category:"Italian, Pasta", rating:"4.5", reviewCount:"198", distance:"5.3 km", imageSrc:"/images/food-image-6.jpg", deals:["Pasta 2for1 Mon–Wed","FREE Tiramisu"], socialProof:{variant:"neotasters",quote:'"Neighbourhood Italian gem — proper pasta, long tables, and a good Chianti."',names:"Gianni T. and +12 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-12.jpg"]}} },
  { id:191, lat:52.5578, lng:13.4248, type:"plain", restaurant:{ name:"Café Sibylle", category:"Café, GDR History", rating:"4.4", reviewCount:"312", distance:"4.6 km", imageSrc:"/images/cafe-image-3.jpg", deals:["Coffee + Cake €7"], socialProof:{variant:"neotasters",quote:'"A time capsule of East Berlin — the GDR-themed décor and cakes are both perfect."',names:"Klaus M. and +16 visited",avatars:["/images/avatar-image-13.jpg","/images/avatar-image-14.jpg"]}} },
  { id:192, lat:52.5598, lng:13.4452, type:"plain", restaurant:{ name:"Weißensee Wirt", category:"German, Traditional", rating:"4.2", reviewCount:"145", distance:"5.4 km", imageSrc:"/images/restaurant-image-1.jpg", deals:["Schnitzel Deal €12"], socialProof:{variant:"neotasters",quote:'"Old-school German pub in a quiet neighbourhood — the sauerbraten is excellent."',names:"Inge P. and +9 visited",avatars:["/images/avatar-image-15.jpg","/images/avatar-image-1.jpg"]}} },

  // Lichtenberg / east
  { id:193, lat:52.5178, lng:13.4878, type:"plain", restaurant:{ name:"RAW Tempel Food Court", category:"Street Food, Market", rating:"4.4", reviewCount:"678", distance:"4.8 km", imageSrc:"/images/food-image-3.jpg", deals:["Street Food Combo €15"], socialProof:{variant:"neotasters",quote:'"Old railway depot, now Berlin\'s best street food hub — explore every stall."',names:"Mika B. and +41 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-4.jpg"]}} },
  { id:194, lat:52.5228, lng:13.5028, type:"plain", restaurant:{ name:"Zur Fischerhütte", category:"Seafood, German", rating:"4.5", reviewCount:"234", distance:"5.8 km", imageSrc:"/images/food-image-7.jpg", deals:["Fish Platter 20% off"], socialProof:{variant:"neotasters",quote:'"Fresh fish from the Müggelsee — the fried plaice with dill butter is outstanding."',names:"Udo F. and +14 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-5.jpg"]}} },

  // Tempelhof
  { id:195, lat:52.4658, lng:13.3808, type:"plain", restaurant:{ name:"Herr Fritz", category:"German, Pub", rating:"4.2", reviewCount:"189", distance:"5.8 km", imageSrc:"/images/food-image-11.jpg", deals:["Pils + Snack €7"], socialProof:{variant:"neotasters",quote:'"Cosy Tempelhof local — cheap beer, solid grub, and friendly regulars."',names:"Fritz B. and +17 visited",avatars:["/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"]}} },
  { id:196, lat:52.4618, lng:13.4028, type:"plain", restaurant:{ name:"Südblock", category:"Bar, International", rating:"4.4", reviewCount:"345", distance:"5.4 km", imageSrc:"/images/cafe-image-7.jpg", deals:["2for1 Cocktails Fri"], socialProof:{variant:"neotasters",quote:'"Vibrant multicultural bar on Platz der Luftbrücke — always a good time."',names:"Sofia D. and +26 visited",avatars:["/images/avatar-image-7.jpg","/images/avatar-image-9.jpg"]}} },

  // Steglitz
  { id:197, lat:52.4488, lng:13.3228, type:"plain", restaurant:{ name:"Marco Polo Ristorante", category:"Italian, Pizza", rating:"4.4", reviewCount:"312", distance:"7.2 km", imageSrc:"/images/food-image-6.jpg", deals:["Pizza 2for1 Sun"], socialProof:{variant:"neotasters",quote:'"The Steglitz neighbourhood Italian — consistently good pizza and warm service."',names:"Marco R. and +22 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-11.jpg"]}} },
  { id:198, lat:52.4528, lng:13.3508, type:"plain", restaurant:{ name:"Café Remise", category:"Café, Garden", rating:"4.3", reviewCount:"145", distance:"6.8 km", imageSrc:"/images/cafe-image-4.jpg", deals:["Coffee + Cake €7.50"], socialProof:{variant:"neotasters",quote:'"Garden café in a converted stable — perfect for a calm afternoon."',names:"Ute K. and +8 visited",avatars:["/images/avatar-image-12.jpg","/images/avatar-image-14.jpg"]}} },

  // Scattered across the whole map to fill remaining gaps
  { id:199, lat:52.5138, lng:13.3428, type:"plain", restaurant:{ name:"Neni Berlin", category:"Middle Eastern, Fusion", rating:"4.5", reviewCount:"678", distance:"2.3 km", imageSrc:"/images/food-image-14.jpg", deals:["Mezze Platter 15% off"], socialProof:{variant:"neotasters",quote:'"Bold Middle Eastern flavours in a sleek setting — the hummus and shakshuka are superb."',names:"Kerem Y. and +38 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-3.jpg"]}} },
  { id:200, lat:52.5078, lng:13.4452, type:"plain", restaurant:{ name:"Schmetterlinge", category:"Café, Vegan", rating:"4.5", reviewCount:"167", distance:"3.3 km", imageSrc:"/images/cafe-image-5.jpg", deals:["Vegan Lunch €11"], socialProof:{variant:"neotasters",quote:'"Sunny vegan café — the Buddha bowl and the smoothies are both excellent."',names:"Laura T. and +9 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-4.jpg"]}} },
  { id:201, lat:52.5328, lng:13.4452, type:"plain", restaurant:{ name:"Zarges", category:"Bakery, Café", rating:"4.4", reviewCount:"234", distance:"3.0 km", imageSrc:"/images/cafe-image-2.jpg", deals:["Pastry + Coffee €5.50"], socialProof:{variant:"neotasters",quote:'"Outstanding handmade pastries — the pistachio croissant sells out by 9am."',names:"Heike S. and +14 visited",avatars:["/images/avatar-image-5.jpg","/images/avatar-image-7.jpg"]}} },
  { id:202, lat:52.5028, lng:13.3608, type:"plain", restaurant:{ name:"Umami", category:"Pan-Asian, Ramen", rating:"4.5", reviewCount:"456", distance:"2.0 km", imageSrc:"/images/food-image-5.jpg", deals:["Ramen Bowl €12","FREE Karaage"], socialProof:{variant:"neotasters",quote:'"Every broth hits differently — the spicy miso is dangerously addictive."',names:"Rika N. and +21 visited",avatars:["/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"]}} },
  { id:203, lat:52.5198, lng:13.4328, type:"plain", restaurant:{ name:"Restaurant Eins", category:"Modern European", rating:"4.6", reviewCount:"198", distance:"2.4 km", imageSrc:"/images/restaurant-image-2.jpg", deals:["4-Course Dinner 20% off"], socialProof:{variant:"neotasters",quote:'"Sleek dining room, thoughtful ingredients — a reliable special occasion choice."',names:"Lea V. and +10 visited",avatars:["/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"]}} },
  { id:204, lat:52.4848, lng:13.3958, type:"plain", restaurant:{ name:"Café Nösel", category:"Café, Cosy", rating:"4.3", reviewCount:"123", distance:"3.9 km", imageSrc:"/images/cafe-image-6.jpg", deals:["Coffee + Muffin €5"], socialProof:{variant:"neotasters",quote:'"The cosiest corner in Tempelhof — mismatched furniture and proper hot chocolate."',names:"Bea F. and +7 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-13.jpg"]}} },
  { id:205, lat:52.5378, lng:13.3868, type:"plain", restaurant:{ name:"Dr. Herzgrün", category:"Juicery, Vegan", rating:"4.3", reviewCount:"189", distance:"2.6 km", imageSrc:"/images/cafe-image-3.jpg", deals:["Juice + Bowl €14"], socialProof:{variant:"neotasters",quote:'"Health-forward café with actually good-tasting green juices and great bowls."',names:"Vera L. and +12 visited",avatars:["/images/avatar-image-12.jpg","/images/avatar-image-15.jpg"]}} },
  { id:206, lat:52.5108, lng:13.3958, type:"plain", restaurant:{ name:"Burgeramt", category:"Burgers, American", rating:"4.4", reviewCount:"567", distance:"1.3 km", imageSrc:"/images/food-image-3.jpg", deals:["Burger + Beer €14"], socialProof:{variant:"neotasters",quote:'"Government-themed burger joint — the Senat burger with truffle mayo is excellent."',names:"Rudi K. and +27 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-4.jpg"]}} },
  { id:207, lat:52.4798, lng:13.4658, type:"plain", restaurant:{ name:"Café Karandasch", category:"Café, Art", rating:"4.5", reviewCount:"178", distance:"5.6 km", imageSrc:"/images/cafe-image-7.jpg", deals:["Coffee + Art Entry €9"], socialProof:{variant:"neotasters",quote:'"Art-café hybrid in a Neukölln gallery — great coffee and rotating exhibitions."',names:"Marta W. and +8 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-5.jpg"]}} },
  { id:208, lat:52.5258, lng:13.4468, type:"plain", restaurant:{ name:"Sushi Ishin", category:"Japanese, Sushi", rating:"4.7", reviewCount:"423", distance:"3.2 km", imageSrc:"/images/food-image-5.jpg", deals:["Sushi Set 15% off"], socialProof:{variant:"neotasters",quote:'"Exceptionally fresh nigiri in a calm setting — book ahead, it\'s always full."',names:"Akira M. and +18 visited",avatars:["/images/avatar-image-3.jpg","/images/avatar-image-6.jpg"]}} },
  { id:209, lat:52.5448, lng:13.4468, type:"plain", restaurant:{ name:"Neuland", category:"Organic, Farm-to-Table", rating:"4.5", reviewCount:"234", distance:"3.6 km", imageSrc:"/images/restaurant-image-5.jpg", deals:["Farm Lunch €15"], socialProof:{variant:"neotasters",quote:'"Farm-to-table done properly — Berlin\'s best organic ingredients, beautifully prepared."',names:"Jana B. and +10 visited",avatars:["/images/avatar-image-7.jpg","/images/avatar-image-9.jpg"]}} },
  { id:210, lat:52.5028, lng:13.3248, type:"plain", restaurant:{ name:"Kreuzberger Himmel", category:"German, Traditional", rating:"4.3", reviewCount:"312", distance:"4.4 km", imageSrc:"/images/restaurant-image-4.jpg", deals:["Hausmannskost Set €12"], socialProof:{variant:"neotasters",quote:'"Berlin comfort food in a warm kneipe atmosphere — the goulash is outstanding."',names:"Horst G. and +18 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-12.jpg"]}} },
  { id:211, lat:52.5428, lng:13.3568, type:"plain", restaurant:{ name:"Ars Vivendi", category:"Café, Pastries", rating:"4.5", reviewCount:"234", distance:"3.0 km", imageSrc:"/images/cafe-image-1.jpg", deals:["Coffee + Croissant €6"], socialProof:{variant:"neotasters",quote:'"Vienna-inspired café with immaculate pastries — the Sachertorte is non-negotiable."',names:"Eva S. and +11 visited",avatars:["/images/avatar-image-11.jpg","/images/avatar-image-13.jpg"]}} },
  { id:212, lat:52.4918, lng:13.3928, type:"plain", restaurant:{ name:"Zur alten Pumpe", category:"Beer Garden, German", rating:"4.2", reviewCount:"456", distance:"3.4 km", imageSrc:"/images/food-image-12.jpg", deals:["Beer + Bratwurst €9"], socialProof:{variant:"neotasters",quote:'"Schöneberg\'s beloved old beer garden — relaxed, affordable, and always welcoming."',names:"Bernd K. and +25 visited",avatars:["/images/avatar-image-14.jpg","/images/avatar-image-15.jpg"]}} },
  { id:213, lat:52.5078, lng:13.4128, type:"plain", restaurant:{ name:"Duna Restaurant", category:"Hungarian, Eastern European", rating:"4.5", reviewCount:"178", distance:"1.5 km", imageSrc:"/images/food-image-11.jpg", deals:["Goulash Set €13","FREE Pálinka"], socialProof:{variant:"neotasters",quote:'"Proper Hungarian warmth — the gulyás is hearty and the paprikash wonderful."',names:"Ágnes T. and +9 visited",avatars:["/images/avatar-image-1.jpg","/images/avatar-image-3.jpg"]}} },
  { id:214, lat:52.5358, lng:13.4368, type:"plain", restaurant:{ name:"Dudu", category:"Café, Brunch", rating:"4.4", reviewCount:"289", distance:"2.8 km", imageSrc:"/images/cafe-image-4.jpg", deals:["Brunch Plate €12"], socialProof:{variant:"neotasters",quote:'"Prenzlauer Berg staple — the shakshuka and sourdough toast are both excellent."',names:"Talia S. and +14 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-5.jpg"]}} },
  { id:215, lat:52.4998, lng:13.4548, type:"plain", restaurant:{ name:"Mitte Meer", category:"Mediterranean, Seafood", rating:"4.6", reviewCount:"234", distance:"3.5 km", imageSrc:"/images/food-image-7.jpg", deals:["Seafood Platter 15% off"], socialProof:{variant:"neotasters",quote:'"Fresh Mediterranean seafood far from the sea — the grilled sea bass is superb."',names:"Kostas A. and +11 visited",avatars:["/images/avatar-image-4.jpg","/images/avatar-image-7.jpg"]}} },
  { id:216, lat:52.5278, lng:13.3668, type:"plain", restaurant:{ name:"Curry Park", category:"Indian, Curry", rating:"4.4", reviewCount:"345", distance:"1.7 km", imageSrc:"/images/food-image-10.jpg", deals:["Curry + Rice €11","FREE Naan"], socialProof:{variant:"neotasters",quote:'"Real depth of spice — the lamb vindaloo has proper heat and incredible flavour."',names:"Ananya P. and +16 visited",avatars:["/images/avatar-image-6.jpg","/images/avatar-image-8.jpg"]}} },
  { id:217, lat:52.5168, lng:13.3768, type:"plain", restaurant:{ name:"Shōgun", category:"Japanese, Teppanyaki", rating:"4.6", reviewCount:"312", distance:"1.5 km", imageSrc:"/images/food-image-1.jpg", deals:["Teppan Show 20% off"], socialProof:{variant:"neotasters",quote:'"Dinner and a show — the teppanyaki performance is as impressive as the food."',names:"Naomi K. and +13 visited",avatars:["/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"]}} },
  { id:218, lat:52.5088, lng:13.4298, type:"plain", restaurant:{ name:"Kantin", category:"Modern Canteen, Casual", rating:"4.4", reviewCount:"189", distance:"2.5 km", imageSrc:"/images/restaurant-image-6.jpg", deals:["Daily Special €9.50"], socialProof:{variant:"neotasters",quote:'"Elevated canteen cooking — the daily special board always has a winner."',names:"Sven D. and +22 visited",avatars:["/images/avatar-image-10.jpg","/images/avatar-image-12.jpg"]}} },
  { id:219, lat:52.5328, lng:13.3768, type:"plain", restaurant:{ name:"Engelbecken", category:"German, Traditional", rating:"4.5", reviewCount:"423", distance:"2.0 km", imageSrc:"/images/restaurant-image-3.jpg", deals:["Pfeffersteak 15% off"], socialProof:{variant:"neotasters",quote:'"Traditional Berlin cooking done with real care — the pork knuckle is legendary."',names:"Anja M. and +19 visited",avatars:["/images/avatar-image-13.jpg","/images/avatar-image-14.jpg"]}} },
  { id:220, lat:52.4868, lng:13.3828, type:"plain", restaurant:{ name:"Restaurant Sesam", category:"Ethiopian, African", rating:"4.6", reviewCount:"267", distance:"4.2 km", imageSrc:"/images/food-image-9.jpg", deals:["Injera Feast 2for1"], socialProof:{variant:"neotasters",quote:'"Shared injera platters with incredible wots — Ethiopian communal dining at its best."',names:"Tigist B. and +12 visited",avatars:["/images/avatar-image-15.jpg","/images/avatar-image-1.jpg"]}} },
  { id:221, lat:52.5458, lng:13.4048, type:"plain", restaurant:{ name:"Rauschgold Bar", category:"Cocktail Bar", rating:"4.5", reviewCount:"345", distance:"3.3 km", imageSrc:"/images/cafe-image-8.jpg", deals:["House Cocktails €12"], socialProof:{variant:"neotasters",quote:'"Beautifully crafted cocktails in a golden Art Deco room — very Berlin chic."',names:"Elise R. and +17 visited",avatars:["/images/avatar-image-2.jpg","/images/avatar-image-3.jpg"]}} },
  { id:222, lat:52.4748, lng:13.3578, type:"plain", restaurant:{ name:"Marheineke Markthalle", category:"Food Market, International", rating:"4.5", reviewCount:"789", distance:"4.8 km", imageSrc:"/images/food-image-14.jpg", deals:["Market Combo €18"], socialProof:{variant:"neotasters",quote:'"Tempelhof\'s favourite market hall — fresh produce, charcuterie, and excellent coffee."',names:"Nina W. and +34 visited",avatars:["/images/avatar-image-4.jpg","/images/avatar-image-6.jpg"]}} },
  { id:223, lat:52.5218, lng:13.4622, type:"plain", restaurant:{ name:"Rotbart", category:"Café, Cocktail Bar", rating:"4.4", reviewCount:"198", distance:"3.9 km", imageSrc:"/images/cafe-image-6.jpg", deals:["Coffee 'til 6, Cocktails after"], socialProof:{variant:"neotasters",quote:'"All-day café that transforms into a great cocktail bar at sunset."',names:"Chris V. and +12 visited",avatars:["/images/avatar-image-5.jpg","/images/avatar-image-7.jpg"]}} },
  { id:224, lat:52.5032, lng:13.3908, type:"plain", restaurant:{ name:"Schwarze Traube", category:"Wine Bar", rating:"4.6", reviewCount:"156", distance:"1.1 km", imageSrc:"/images/cafe-image-7.jpg", deals:["Wine + Cheese €16"], socialProof:{variant:"neotasters",quote:'"A single-table wine bar concept — intimate, delicious, and completely unique."',names:"Wolf T. and +5 visited",avatars:["/images/avatar-image-8.jpg","/images/avatar-image-10.jpg"]}} },
  { id:225, lat:52.5158, lng:13.3858, type:"plain", restaurant:{ name:"Fassbender & Rausch", category:"Chocolatier, Café", rating:"4.7", reviewCount:"1.4k", distance:"0.8 km", imageSrc:"/images/cafe-image-1.jpg", deals:["Chocolate Tasting 20% off"], socialProof:{variant:"neotasters",quote:'"The grandest chocolate shop in Berlin — the hot chocolate is life-changing."',names:"Maya L. and +48 visited",avatars:["/images/avatar-image-9.jpg","/images/avatar-image-11.jpg"]}} },
];
