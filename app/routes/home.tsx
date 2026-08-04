import { useLoaderData, type LoaderFunction } from "react-router";
import type { Route } from "./+types/home";

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
  est,
  eng,
  rus,
} as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
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
  const lang = params.lang as keyof typeof translationsMap;

  const translations = translationsMap[lang] ?? translationsMap.est;

  return { translations };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { translations } = loaderData;

  return (
    <>
      <Header translations={translations.navigation}>
        <Hero translations={translations.hero} />
        <Features translations={translations.benefits} />
        <Menu translations={translations.menu} />
        <About translations={translations.story} />
        <Gallery translations={translations.gallery} />
        <Logos translations={translations.instagram} />
        <FindUs translations={translations.findUs} />
        <Footer translations={translations.footer} />
      </Header>
    </>
  );
}
