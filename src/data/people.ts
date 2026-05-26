export interface Person {
  id:             string;
  name:           string;
  avatarUrl:      string;
  isVerified:     boolean;
  lastVisitLabel: string;
  cuisines:       string[];
  visitCount:     number;
}

export const FRIENDS: Person[] = [
  {
    id:             "f1",
    name:           "Mason Phillips",
    avatarUrl:      "/images/avatar-image-1.jpg",
    isVerified:     true,
    lastVisitLabel: "2 days ago",
    cuisines:       ["Italian", "Sushi"],
    visitCount:     47,
  },
  {
    id:             "f2",
    name:           "Sophia Rivera",
    avatarUrl:      "/images/avatar-image-2.jpg",
    isVerified:     false,
    lastVisitLabel: "1 week ago",
    cuisines:       ["Thai", "Tacos"],
    visitCount:     23,
  },
  {
    id:             "f3",
    name:           "James Carter",
    avatarUrl:      "/images/avatar-image-3.jpg",
    isVerified:     true,
    lastVisitLabel: "3 days ago",
    cuisines:       ["Burgers", "Pizza"],
    visitCount:     61,
  },
  {
    id:             "f4",
    name:           "Olivia Chen",
    avatarUrl:      "/images/avatar-image-4.jpg",
    isVerified:     false,
    lastVisitLabel: "5 days ago",
    cuisines:       ["Ramen", "Dim Sum"],
    visitCount:     18,
  },
  {
    id:             "f5",
    name:           "Liam Torres",
    avatarUrl:      "/images/avatar-image-5.jpg",
    isVerified:     true,
    lastVisitLabel: "Yesterday",
    cuisines:       ["Sushi", "Korean"],
    visitCount:     34,
  },
];

export const NEOTASTERS: Person[] = [
  {
    id:             "n1",
    name:           "Emma Watson",
    avatarUrl:      "/images/avatar-image-6.jpg",
    isVerified:     true,
    lastVisitLabel: "Today",
    cuisines:       ["French", "Wine Bars"],
    visitCount:     152,
  },
  {
    id:             "n2",
    name:           "Noah Bennett",
    avatarUrl:      "/images/avatar-image-7.jpg",
    isVerified:     true,
    lastVisitLabel: "3 days ago",
    cuisines:       ["Burgers", "Craft Beer"],
    visitCount:     89,
  },
  {
    id:             "n3",
    name:           "Ava Johnson",
    avatarUrl:      "/images/avatar-image-8.jpg",
    isVerified:     false,
    lastVisitLabel: "1 week ago",
    cuisines:       ["Vegan", "Healthy"],
    visitCount:     44,
  },
  {
    id:             "n4",
    name:           "Ethan Park",
    avatarUrl:      "/images/avatar-image-9.jpg",
    isVerified:     true,
    lastVisitLabel: "2 days ago",
    cuisines:       ["Korean BBQ", "Sushi"],
    visitCount:     201,
  },
  {
    id:             "n5",
    name:           "Isabella Moore",
    avatarUrl:      "/images/avatar-image-10.jpg",
    isVerified:     true,
    lastVisitLabel: "4 days ago",
    cuisines:       ["Italian", "Tapas"],
    visitCount:     76,
  },
  {
    id:             "n6",
    name:           "William Clark",
    avatarUrl:      "/images/avatar-image-11.jpg",
    isVerified:     false,
    lastVisitLabel: "Yesterday",
    cuisines:       ["Pizza", "Pasta"],
    visitCount:     33,
  },
  {
    id:             "n7",
    name:           "Mia Thompson",
    avatarUrl:      "/images/avatar-image-12.jpg",
    isVerified:     true,
    lastVisitLabel: "Today",
    cuisines:       ["Thai", "Fusion"],
    visitCount:     118,
  },
  {
    id:             "n8",
    name:           "Benjamin Wright",
    avatarUrl:      "/images/avatar-image-13.jpg",
    isVerified:     false,
    lastVisitLabel: "6 days ago",
    cuisines:       ["Mexican", "Tacos"],
    visitCount:     29,
  },
];
