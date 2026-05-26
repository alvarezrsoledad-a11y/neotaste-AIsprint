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

export const MAP_PINS: MapPin[] = [

  // ── FRIENDS (avatar + review snippet) ────────────────────────────────────
  {
    id: 1,
    lat: 52.5232, lng: 13.3985,
    type: "friends",
    value: "+14",
    tooltipAvatarSrc: "/images/avatar-image-1.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-1.jpg", "/images/avatar-image-2.jpg", "/images/avatar-image-3.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-1.jpg", count: 14 }],
    restaurant: {
      name:        "Dude's Coffee & Cake",
      category:    "Breakfast, Coffee",
      rating:      "4.8",
      reviewCount: "143",
      distance:    "0.4 km",
      imageSrc:    "/images/cafe-image-1.jpg",
      deals:       ["2for1 Beverage", "2for1 Espresso"],
      trustTag:    { type: "friends", label: "♥ 14 friends visited" },
      review:      '"Best brunch in Mitte — the matcha latte is unmissable!"',
      friendsCount: "14",
      avatarSrcs:  [
        "/images/avatar-image-1.jpg",
        "/images/avatar-image-2.jpg",
        "/images/avatar-image-3.jpg",
        "/images/avatar-image-4.jpg",
      ],
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
    tooltipAvatarSrc: "/images/avatar-image-5.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-5.jpg", "/images/avatar-image-6.jpg", "/images/avatar-image-7.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-5.jpg", count: 6 }],
    restaurant: {
      name:        "The Barn",
      category:    "Specialty Coffee",
      rating:      "4.7",
      reviewCount: "218",
      distance:    "1.8 km",
      imageSrc:    "/images/cafe-image-3.jpg",
      deals:       ["FREE Coffee", "Loyalty Stamp"],
      trustTag:    { type: "friends", label: "♥ 6 friends visited" },
      review:      '"Roastery-direct coffee + incredible vibes. Try the pour-over!"',
      friendsCount: "6",
      avatarSrcs:  [
        "/images/avatar-image-5.jpg",
        "/images/avatar-image-6.jpg",
        "/images/avatar-image-7.jpg",
      ],
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
    tooltipAvatarSrc: "/images/avatar-image-8.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-8.jpg", "/images/avatar-image-9.jpg", "/images/avatar-image-10.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-8.jpg", count: 9 }],
    restaurant: {
      name:        "Mustafa's Gemüse Kebab",
      category:    "Kebab, Street Food",
      rating:      "4.9",
      reviewCount: "2.1k",
      distance:    "2.1 km",
      imageSrc:    "/images/food-image-1.jpg",
      deals:       ["10% off", "FREE Drink"],
      trustTag:    { type: "friends", label: "♥ 9 friends visited" },
      review:      '"Worth every minute of the queue. Berlin\'s best kebab, no debate."',
      friendsCount: "9",
      avatarSrcs:  [
        "/images/avatar-image-8.jpg",
        "/images/avatar-image-9.jpg",
        "/images/avatar-image-10.jpg",
      ],
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
    tooltipAvatarSrc: "/images/avatar-image-11.jpg",
    tooltipAvatarSrcs: ["/images/avatar-image-11.jpg", "/images/avatar-image-12.jpg", "/images/avatar-image-13.jpg"],
    friendVisits: [{ avatarUrl: "/images/avatar-image-11.jpg", count: 5 }],
    restaurant: {
      name:        "Hamy Café",
      category:    "Vietnamese, Noodles",
      rating:      "4.6",
      reviewCount: "1.2k",
      distance:    "3.3 km",
      imageSrc:    "/images/food-image-14.jpg",
      deals:       ["Pho 2for1", "FREE Spring Roll"],
      trustTag:    { type: "friends", label: "♥ 5 friends visited" },
      review:      '"Tiny place, huge flavours. The pho broth here is incredibly deep."',
      friendsCount: "5",
      avatarSrcs:  [
        "/images/avatar-image-11.jpg",
        "/images/avatar-image-12.jpg",
        "/images/avatar-image-13.jpg",
      ],
      socialProof: {
        variant: "friends",
        quote:   '"Tiny place, huge flavours. The pho broth here is incredibly deep."',
        names:   "Julia S. and +4 visited",
        avatars: ["/images/avatar-image-11.jpg", "/images/avatar-image-12.jpg", "/images/avatar-image-13.jpg"],
      },
    },
  },

  // ── REDEMPTION (🔥) ───────────────────────────────────────────────────────
  {
    id: 4,
    lat: 52.5055, lng: 13.3330,
    type: "redemption",
    value: "3k+",
    restaurant: {
      name:        "Ramen by Takeshi",
      category:    "Japanese, Ramen",
      rating:      "4.6",
      reviewCount: "892",
      distance:    "3.2 km",
      imageSrc:    "/images/food-image-2.jpg",
      deals:       ["2for1 Ramen", "FREE Gyoza"],
      trustTag:    { type: "redemption", label: "🔥 3k+ used this deal" },
    },
  },

  {
    id: 5,
    lat: 52.4975, lng: 13.4025,
    type: "redemption",
    value: "5k+",
    restaurant: {
      name:        "Burgermeister",
      category:    "Burgers, Fast Food",
      rating:      "4.5",
      reviewCount: "1.4k",
      distance:    "2.4 km",
      imageSrc:    "/images/food-image-3.jpg",
      deals:       ["2for1 Burger", "FREE Fries"],
      trustTag:    { type: "redemption", label: "🔥 5k+ used this deal" },
    },
  },

  {
    id: 6,
    lat: 52.4790, lng: 13.4285,
    type: "redemption",
    value: "1.5k+",
    restaurant: {
      name:        "Curry 36",
      category:    "Currywurst, Street Food",
      rating:      "4.4",
      reviewCount: "3.2k",
      distance:    "4.1 km",
      imageSrc:    "/images/food-image-4.jpg",
      deals:       ["50% off Currywurst", "FREE Drink"],
      trustTag:    { type: "redemption", label: "🔥 1.5k+ used this deal" },
    },
  },

  {
    id: 24,
    lat: 52.5120, lng: 13.4620,
    type: "redemption",
    value: "2k+",
    restaurant: {
      name:        "Schneeweiß",
      category:    "European, Brunch",
      rating:      "4.5",
      reviewCount: "741",
      distance:    "4.7 km",
      imageSrc:    "/images/cafe-image-7.jpg",
      deals:       ["Brunch 2for1", "FREE Mimosa"],
      trustTag:    { type: "redemption", label: "🔥 2k+ used this deal" },
    },
  },

  // ── RATING (⭐) ────────────────────────────────────────────────────────────
  {
    id: 7,
    lat: 52.5250, lng: 13.4075,
    type: "rating",
    value: "4.9",
    restaurant: {
      name:        "Tim Raue",
      category:    "Fine Dining, Asian",
      rating:      "4.9",
      reviewCount: "654",
      distance:    "0.8 km",
      imageSrc:    "/images/restaurant-image-1.jpg",
      deals:       ["Chef's Menu 20% off", "FREE Amuse-bouche"],
      trustTag:    { type: "community", label: "👥 Top rated in Berlin" },
    },
  },

  {
    id: 8,
    lat: 52.5185, lng: 13.4025,
    type: "rating",
    value: "4.8",
    restaurant: {
      name:        "Cocolo Ramen",
      category:    "Japanese, Ramen",
      rating:      "4.8",
      reviewCount: "1.1k",
      distance:    "0.6 km",
      imageSrc:    "/images/food-image-5.jpg",
      deals:       ["2for1 Ramen Mon–Thu", "FREE Karaage"],
      trustTag:    { type: "community", label: "👥 Trending this week" },
    },
  },

  {
    id: 9,
    lat: 52.5145, lng: 13.4495,
    type: "rating",
    value: "4.7",
    restaurant: {
      name:        "Silo Coffee",
      category:    "Coffee, Brunch",
      rating:      "4.7",
      reviewCount: "876",
      distance:    "3.9 km",
      imageSrc:    "/images/cafe-image-4.jpg",
      deals:       ["Loyalty Card", "2for1 Brunch"],
      trustTag:    { type: "community", label: "👥 Popular this month" },
    },
  },

  {
    id: 10,
    lat: 52.4940, lng: 13.3605,
    type: "rating",
    value: "4.8",
    restaurant: {
      name:        "Cookies Cream",
      category:    "Vegetarian, Fine Dining",
      rating:      "4.8",
      reviewCount: "441",
      distance:    "3.1 km",
      imageSrc:    "/images/restaurant-image-2.jpg",
      deals:       ["Tasting Menu 15% off"],
      trustTag:    { type: "community", label: "👥 Trending this week" },
    },
  },

  {
    id: 25,
    lat: 52.5475, lng: 13.3920,
    type: "rating",
    value: "4.6",
    restaurant: {
      name:        "Prater Garten",
      category:    "Beer Garden, German",
      rating:      "4.6",
      reviewCount: "3.4k",
      distance:    "2.6 km",
      imageSrc:    "/images/food-image-12.jpg",
      deals:       ["Happy Hour 5–7pm", "FREE Pretzel"],
      trustTag:    { type: "community", label: "👥 Trending this week" },
    },
  },

  {
    id: 30,
    lat: 52.5065, lng: 13.3935,
    type: "rating",
    value: "4.9",
    restaurant: {
      name:        "Facil",
      category:    "Mediterranean, Fine Dining",
      rating:      "4.9",
      reviewCount: "421",
      distance:    "1.2 km",
      imageSrc:    "/images/hero-image-2.jpg",
      deals:       ["Lunch Tasting 25% off"],
      trustTag:    { type: "community", label: "👥 Top rated in Berlin" },
    },
  },

  // ── RANKING (#N) ──────────────────────────────────────────────────────────
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
    },
  },

  // ── NEW ───────────────────────────────────────────────────────────────────
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
    },
  },

  // ── COMMUNITY (👥) ────────────────────────────────────────────────────────
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
    },
  },

  // ── PLAIN (green dot only — no social cue yet) ────────────────────────────
  { id: 30, lat: 52.5195, lng: 13.3865, type: "plain", restaurant: { name: "Café Mutti", category: "Café, Brunch", rating: "4.3", reviewCount: "89", distance: "1.8 km", imageSrc: "/images/cafe-image-1.jpg", deals: ["Free coffee with brunch"] } },
  { id: 31, lat: 52.5260, lng: 13.4210, type: "plain", restaurant: { name: "Silo Coffee", category: "Coffee", rating: "4.5", reviewCount: "212", distance: "2.1 km", imageSrc: "/images/cafe-image-2.jpg", deals: ["2for1 Flat White"] } },
  { id: 32, lat: 52.5080, lng: 13.3720, type: "plain", restaurant: { name: "Spreegold", category: "Bar, German", rating: "4.2", reviewCount: "143", distance: "2.4 km", imageSrc: "/images/restaurant-image-1.jpg", deals: ["Happy Hour 2for1"] } },
  { id: 33, lat: 52.5340, lng: 13.3640, type: "plain", restaurant: { name: "La Maison", category: "French", rating: "4.6", reviewCount: "178", distance: "2.9 km", imageSrc: "/images/restaurant-image-2.jpg", deals: ["Lunch Menu €15"] } },
  { id: 34, lat: 52.4920, lng: 13.4390, type: "plain", restaurant: { name: "Yamazaki", category: "Japanese Bakery", rating: "4.7", reviewCount: "304", distance: "3.2 km", imageSrc: "/images/food-image-1.jpg", deals: ["10% off any pastry"] } },
  { id: 35, lat: 52.5160, lng: 13.3560, type: "plain", restaurant: { name: "Prater Garten", category: "Beer Garden", rating: "4.4", reviewCount: "521", distance: "1.5 km", imageSrc: "/images/restaurant-image-3.jpg", deals: ["Free pretzel with beer"] } },
  { id: 36, lat: 52.5395, lng: 13.4470, type: "plain", restaurant: { name: "Annelies", category: "Café, Vegan", rating: "4.5", reviewCount: "167", distance: "3.5 km", imageSrc: "/images/cafe-image-3.jpg", deals: ["Vegan Brunch Deal"] } },
  { id: 37, lat: 52.4870, lng: 13.3670, type: "plain", restaurant: { name: "Golgatha", category: "Beer Garden", rating: "4.1", reviewCount: "389", distance: "3.8 km", imageSrc: "/images/restaurant-image-4.jpg", deals: ["2for1 draft beer"] } },
  { id: 38, lat: 52.5230, lng: 13.4680, type: "plain", restaurant: { name: "Knofi", category: "Middle Eastern", rating: "4.6", reviewCount: "256", distance: "2.6 km", imageSrc: "/images/food-image-2.jpg", deals: ["Falafel plate €8"] } },
  { id: 39, lat: 52.5100, lng: 13.3800, type: "plain", restaurant: { name: "Volt Restaurant", category: "Modern European", rating: "4.8", reviewCount: "198", distance: "2.2 km", imageSrc: "/images/restaurant-image-5.jpg", deals: ["Tasting menu 15% off"] } },
  { id: 40, lat: 52.5360, lng: 13.3980, type: "plain", restaurant: { name: "Toca Rouge", category: "Bar, Tapas", rating: "4.3", reviewCount: "134", distance: "1.9 km", imageSrc: "/images/cafe-image-4.jpg", deals: ["Tapas 3for2"] } },
  { id: 41, lat: 52.4960, lng: 13.4510, type: "plain", restaurant: { name: "Hops & Barley", category: "Craft Beer, Pub", rating: "4.5", reviewCount: "287", distance: "2.7 km", imageSrc: "/images/restaurant-image-6.jpg", deals: ["Free tasting flight"] } },
  { id: 42, lat: 52.5430, lng: 13.3830, type: "plain", restaurant: { name: "Westberlin", category: "Café, Books", rating: "4.4", reviewCount: "203", distance: "3.1 km", imageSrc: "/images/cafe-image-5.jpg", deals: ["Coffee + cake €7"] } },
  { id: 43, lat: 52.5025, lng: 13.4140, type: "plain", restaurant: { name: "Facil", category: "Fine Dining", rating: "4.9", reviewCount: "312", distance: "1.3 km", imageSrc: "/images/restaurant-image-7.jpg", deals: ["Lunch 25% off"] } },
  { id: 44, lat: 52.5285, lng: 13.3740, type: "plain", restaurant: { name: "Bar Bobu", category: "Wine Bar", rating: "4.6", reviewCount: "145", distance: "2.0 km", imageSrc: "/images/cafe-image-6.jpg", deals: ["Natural wine 2for1"] } },
];
