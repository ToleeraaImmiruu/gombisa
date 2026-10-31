import { useSelector } from "react-redux";

const en = {
  nav_shop: "Shop",
  nav_events: "Events",
  nav_games: "Games",
  nav_about: "About",
  nav_cart: "Cart",
  nav_login: "Log in",
  nav_logout: "Log out",
  nav_orders: "My orders",
  section_clothes: "Clothes",
  section_food: "Food",
  section_games: "Games",
  section_events: "Events",
};

// Afaan Oromoo. Keep this list small and REVIEWED by a native speaker.
// Any missing key falls back to English automatically.
const om = {
  nav_shop: "Gabaa",
  nav_events: "Ayyaanota",
  nav_games: "Taphoota",
  section_clothes: "Uffata",
  section_food: "Nyaata",
  section_games: "Taphoota",
  section_events: "Ayyaanota",
};

export function useT() {
  const lang = useSelector((s) => s.language.lang);
  return (key) => (lang === "om" ? om[key] : undefined) ?? en[key] ?? key;
}

// Picks name_om / description_om when Oromo is selected and the field exists.
export function useLocalized() {
  const lang = useSelector((s) => s.language.lang);
  return (obj, field) => (lang === "om" && obj?.[`${field}_om`]) || obj?.[field] || "";
}
