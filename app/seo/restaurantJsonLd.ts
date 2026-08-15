export const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",

  name: "Ollopa",
  url: "https://ollopa.ee",

  description:
    "Ollopa pakub värsket käsitööpastat Narva-Jõesuus, ühendades restorani kvaliteedi tänavatoidu vaba ja kiire formaadiga.",

  address: {
    "@type": "PostalAddress",
    streetAddress: "Aia 10",
    addressLocality: "Narva-Jõesuu",
    addressRegion: "Ida-Virumaa",
    addressCountry: "EE",
  },

  servesCuisine: ["Pasta", "Italian", "Street Food"],

  priceRange: "€€",
} as const;
