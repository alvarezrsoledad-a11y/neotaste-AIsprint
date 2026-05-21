// ── Types ─────────────────────────────────────────────────────────────────────
export type TooltipType   = "friends" | "redemption" | "rating" | "ranking" | "new" | "community";
export type TrustTagType  = "friends" | "community" | "redemption";

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
}

export interface MapPin {
  id:                 number;
  lat:                number;
  lng:                number;
  type:               TooltipType;
  value?:             string;
  tooltipAvatarSrc?:  string;
  restaurant:         PinRestaurant;
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
    restaurant: {
      name:        "Dude's Coffee & Cake",
      category:    "Breakfast, Coffee",
      rating:      "4.8",
      reviewCount: "143",
      distance:    "0.4 km",
      imageSrc:    "/images/cafe-image-1.jpg",
      deals:       ["2for1 Beverage", "2for1 Espresso"],
      trustTag:    { type: "friends", label: "💕 14 Friends visited" },
      review:      '"Best brunch in Mitte — the matcha latte is unmissable!"',
      friendsCount: "14",
      avatarSrcs:  [
        "/images/avatar-image-1.jpg",
        "/images/avatar-image-2.jpg",
        "/images/avatar-image-3.jpg",
        "/images/avatar-image-4.jpg",
      ],
    },
  },

  {
    id: 2,
    lat: 52.5380, lng: 13.4180,
    type: "friends",
    value: "+6",
    tooltipAvatarSrc: "/images/avatar-image-5.jpg",
    restaurant: {
      name:        "The Barn",
      category:    "Specialty Coffee",
      rating:      "4.7",
      reviewCount: "218",
      distance:    "1.8 km",
      imageSrc:    "/images/cafe-image-3.jpg",
      deals:       ["FREE Coffee", "Loyalty Stamp"],
      trustTag:    { type: "friends", label: "💕 6 Friends visited" },
      review:      '"Roastery-direct coffee + incredible vibes. Try the pour-over!"',
      friendsCount: "6",
      avatarSrcs:  [
        "/images/avatar-image-5.jpg",
        "/images/avatar-image-6.jpg",
        "/images/avatar-image-7.jpg",
      ],
    },
  },

  {
    id: 3,
    lat: 52.4990, lng: 13.4155,
    type: "friends",
    value: "+9",
    tooltipAvatarSrc: "/images/avatar-image-8.jpg",
    restaurant: {
      name:        "Mustafa's Gemüse Kebab",
      category:    "Kebab, Street Food",
      rating:      "4.9",
      reviewCount: "2.1k",
      distance:    "2.1 km",
      imageSrc:    "/images/food-image-1.jpg",
      deals:       ["10% off", "FREE Drink"],
      trustTag:    { type: "friends", label: "💕 9 Friends visited" },
      review:      '"Worth every minute of the queue. Berlin\'s best kebab, no debate."',
      friendsCount: "9",
      avatarSrcs:  [
        "/images/avatar-image-8.jpg",
        "/images/avatar-image-9.jpg",
        "/images/avatar-image-10.jpg",
      ],
    },
  },

  {
    id: 27,
    lat: 52.5015, lng: 13.4480,
    type: "friends",
    value: "+5",
    tooltipAvatarSrc: "/images/avatar-image-11.jpg",
    restaurant: {
      name:        "Hamy Café",
      category:    "Vietnamese, Noodles",
      rating:      "4.6",
      reviewCount: "1.2k",
      distance:    "3.3 km",
      imageSrc:    "/images/food-image-14.jpg",
      deals:       ["Pho 2for1", "FREE Spring Roll"],
      trustTag:    { type: "friends", label: "💕 5 Friends visited" },
      review:      '"Tiny place, huge flavours. The pho broth here is incredibly deep."',
      friendsCount: "5",
      avatarSrcs:  [
        "/images/avatar-image-11.jpg",
        "/images/avatar-image-12.jpg",
        "/images/avatar-image-13.jpg",
      ],
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
    restaurant: {
      name:        "Rutz Restaurant",
      category:    "Modern European",
      rating:      "4.9",
      reviewCount: "312",
      distance:    "1.4 km",
      imageSrc:    "/images/restaurant-image-3.jpg",
      deals:       ["Sommelier Pairing 20% off"],
      trustTag:    { type: "community", label: "👥 8 people tried this week" },
    },
  },

  {
    id: 12,
    lat: 52.5310, lng: 13.3890,
    type: "ranking",
    value: "#2",
    restaurant: {
      name:        "Katz Orange",
      category:    "Modern German",
      rating:      "4.8",
      reviewCount: "528",
      distance:    "1.9 km",
      imageSrc:    "/images/restaurant-image-4.jpg",
      deals:       ["Lunch Set 25% off", "FREE Aperitif"],
      trustTag:    { type: "community", label: "👥 12 people tried this week" },
    },
  },

  {
    id: 13,
    lat: 52.5070, lng: 13.3505,
    type: "ranking",
    value: "#3",
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
];
