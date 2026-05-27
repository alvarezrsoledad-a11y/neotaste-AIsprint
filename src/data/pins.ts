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
];
