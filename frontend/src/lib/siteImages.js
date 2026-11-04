// Photos live in frontend/public/images/. To change a picture, replace the file
// (keep the same name) or edit the paths below.
//
// position = which part of the photo stays visible: "left% top%"
export const siteImages = {
  // Home page slideshow. Add or remove slides freely (2 to 6 works best).
  hero: [
    { src: "/images/slide-1.jpg", position: "50% 75%" },
    { src: "/images/slide-2.jpg", position: "50% 80%" },
    { src: "/images/slide-3.jpg", position: "60% 52%" },
    { src: "/images/slide-4.jpg", position: "50% 58%" },
  ],

  // The four tiles under the hero
  tiles: {
    clothes: { src: "/images/slide-3.jpg", position: "50% 72%" },
    food: { src: "/images/slide-1.jpg", position: "50% 85%" },
    games: { src: "/images/slide-4.jpg", position: "50% 55%" },
    events: { src: "/images/slide-2.jpg", position: "50% 85%" },
  },

  // Background bands further down the home page, and the footer
  featured: ["/images/slide-1.jpg"],
  community: ["/images/slide-4.jpg"],
  promises: ["/images/slide-3.jpg"],
  footer: ["/images/slide-2.jpg"],

  // Banners on other pages
  about: ["/images/slide-1.jpg"],
  shop: ["/images/slide-2.jpg"],
  events: ["/images/slide-4.jpg"],
  games: ["/images/slide-3.jpg"],
};
