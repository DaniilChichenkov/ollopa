import type { Route } from "./+types/home";
import { restaurantJsonLd } from "~/seo/restaurantJsonLd";

// Language translations
import est from "~/language/est.json";
import eng from "~/language/eng.json";
import rus from "~/language/rus.json";

// Types
export type NavigationTranslations = typeof est.navigation;
export type HeroTranslations = typeof est.hero;
export type FeaturesTranslations = typeof est.benefits;
export type MenuTranslations = typeof est.menu;
export type AboutTranslations = typeof est.story;
export type GalleryTranslations = typeof est.gallery;
export type LogosTranslations = typeof est.instagram;
export type FindUsTranslations = typeof est.findUs;
export type FooterTranslations = typeof est.footer;

const translationsMap = {
  et: est,
  en: eng,
  ru: rus,
} as const;

export function meta({ params }: Route.MetaArgs) {
  const lang = params.lang as "et" | "en" | "ru";

  const seo = {
    et: {
      title: "Ollopa Pasta | Värske käsitööpasta Narva-Jõesuus",
      description:
        "Ollopa pakub värsket käsitööpastat Narva-Jõesuus. Restorani kvaliteet tänavatoidu vabas vormis, värske pasta ja kvaliteetsed koostisosad.",
      locale: "et_EE",
    },

    en: {
      title: "Ollopa Pasta | Fresh Handmade Pasta in Narva-Jõesuu",
      description:
        "Fresh handmade pasta in Narva-Jõesuu. Ollopa combines restaurant-quality food with the freedom of street food.",
      locale: "en_EE",
    },

    ru: {
      title: "Ollopa Pasta | Свежая паста в Нарва-Йыэсуу",
      description:
        "Свежая паста ручной работы в Нарва-Йыэсуу. Ollopa сочетает ресторанное качество с удобным форматом уличной еды.",
      locale: "ru_EE",
    },
  } as const;

  const currentLang =
    lang === "en" || lang === "ru" || lang === "et" ? lang : "et";

  const currentSeo = seo[currentLang];

  const baseUrl = "http://localhost:5173";
  const currentUrl = `${baseUrl}/${currentLang}`;

  return [
    {
      title: currentSeo.title,
    },
    {
      name: "description",
      content: currentSeo.description,
    },
    {
      name: "robots",
      content: "index, follow",
    },

    {
      tagName: "link",
      rel: "canonical",
      href: currentUrl,
    },

    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "et",
      href: `${baseUrl}/et`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: `${baseUrl}/en`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "ru",
      href: `${baseUrl}/ru`,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: `${baseUrl}/et`,
    },

    {
      property: "og:title",
      content: currentSeo.title,
    },
    {
      property: "og:description",
      content: currentSeo.description,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: currentUrl,
    },
    {
      property: "og:site_name",
      content: "Ollopa Pasta",
    },
    {
      property: "og:locale",
      content: currentSeo.locale,
    },

    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: currentSeo.title,
    },
    {
      name: "twitter:description",
      content: currentSeo.description,
    },
  ];
}

import {
  Header,
  Hero,
  Features,
  Menu,
  About,
  Logos,
  FindUs,
  Footer,
  Gallery,
} from "~/compontents";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  await import("~/db/migrate.server");

  // Get content for specific language
  const lang = params.lang as keyof typeof translationsMap;
  const translations = translationsMap[lang] ?? translationsMap.et;

  // Get content from DB
  const { getAllMenusWithItems } = await import("~/db/menu.server");
  const { getAllGalleriesWithItems } = await import("~/db/gallery.server");
  const { getAllLocations } = await import("~/db/location.server");

  try {
    // Get all menus
    const menus = getAllMenusWithItems();

    // Get all galleries
    const galleries = getAllGalleriesWithItems();

    // Get all locations
    const locations = getAllLocations();

    return { translations, menus, galleries, locations };
  } catch (error) {
    return { translations };
  }
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { translations, menus, galleries, locations } = loaderData;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantJsonLd),
        }}
      />
      <Header translations={translations.navigation}>
        <Hero translations={translations.hero} />
        <Features translations={translations.benefits} />
        {menus && menus.length ? (
          <Menu translations={translations.menu} menus={menus} />
        ) : null}
        <About translations={translations.story} />
        {galleries && galleries.length ? (
          <Gallery translations={translations.gallery} galleries={galleries} />
        ) : null}
        <Logos translations={translations.instagram} />
        {locations && locations.length ? (
          <FindUs translations={translations.findUs} locations={locations} />
        ) : null}
        {/* <Footer translations={translations.footer} /> */}
      </Header>
    </>
  );
}
