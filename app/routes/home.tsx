import type { Route } from "./+types/home";

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

export default function Home() {
  return (
    <>
      <Header>
        <Hero />
        <Features />
        <Menu />
        <About />
        <Gallery />
        <Logos />
        <FindUs />
        <Footer />
      </Header>
    </>
  );
}
