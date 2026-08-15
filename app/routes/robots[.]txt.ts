export async function loader() {
  const robots = `User-agent: *
Allow: /

Disallow: /dashboard
Disallow: /login

Sitemap: https://ollopa.ee/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
