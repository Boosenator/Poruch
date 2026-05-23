export const CATEGORIES = [
  { id: "all", label: "Усі", icon: "MapPin", color: "#C1440E" },
  { id: "medicine", label: "Медицина", icon: "HeartPulse", color: "#E53E3E" },
  { id: "legal", label: "Право", icon: "Scale", color: "#744210" },
  { id: "language", label: "Мова", icon: "GraduationCap", color: "#2B6CB0" },
  { id: "work", label: "Робота", icon: "BriefcaseBusiness", color: "#276749" },
  { id: "housing", label: "Житло", icon: "House", color: "#553C9A" },
  { id: "shops", label: "Магазини", icon: "ShoppingBag", color: "#C05621" },
  { id: "cafe", label: "Кафе", icon: "Coffee", color: "#7B341E" },
  { id: "community", label: "Спільнота", icon: "UsersRound", color: "#285E61" },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryId = Category["id"];
