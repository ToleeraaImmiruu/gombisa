export const slugify = (s = "") =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60) || "item";

// What each kind of content asks for. The same screen builds its form from this list.
export const CONTENT = {
  products: {
    table: "products", label: "Foods & clothes", single: "item", titleKey: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "name_om", label: "Name in Afaan Oromoo (optional)", type: "text" },
      { key: "category_id", label: "Category (this decides where it appears: Clothes, Food or Games)", type: "category", required: true },
      { key: "price_cents", label: "Price (birr)", type: "price", required: true },
      { key: "stock", label: "How many are available", type: "number", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "description_om", label: "Description in Afaan Oromoo (optional)", type: "textarea" },
      { key: "cultural_note", label: "The story: what it is and when it is worn, eaten or used", type: "textarea" },
      { key: "origin_region", label: "Region it comes from", type: "text" },
      { key: "maker_name", label: "Made by (the maker's name)", type: "text" },
      { key: "image_url", label: "Photo", type: "image" },
    ],
  },
  game_guides: {
    table: "game_guides", label: "Games", single: "game", titleKey: "name",
    fields: [
      { key: "name", label: "Name of the game", type: "text", required: true },
      { key: "name_om", label: "Name in Afaan Oromoo (optional)", type: "text" },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "how_to_play", label: "How to play", type: "textarea" },
      { key: "history", label: "Where it comes from", type: "textarea" },
      { key: "video_url", label: "Video link (optional)", type: "text" },
      { key: "image_url", label: "Photo", type: "image" },
    ],
  },
  events: {
    table: "events", label: "Events", single: "event", titleKey: "title",
    fields: [
      { key: "title", label: "Name of the event", type: "text", required: true },
      { key: "title_om", label: "Name in Afaan Oromoo (optional)", type: "text" },
      { key: "starts_at", label: "Starts", type: "datetime", required: true },
      { key: "ends_at", label: "Ends (optional)", type: "datetime" },
      { key: "location", label: "Place", type: "text" },
      { key: "city", label: "City", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "description_om", label: "Description in Afaan Oromoo (optional)", type: "textarea" },
      { key: "image_url", label: "Photo", type: "image" },
    ],
  },
};
