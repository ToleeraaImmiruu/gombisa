// Prices are stored in santim (1 birr = 100 santim).
export const formatPrice = (santim) =>
  new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format((santim || 0) / 100);

export const formatDate = (iso) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

export const formatDay = (iso) => new Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(new Date(iso));
export const formatMonth = (iso) => new Intl.DateTimeFormat("en-GB", { month: "short" }).format(new Date(iso));
