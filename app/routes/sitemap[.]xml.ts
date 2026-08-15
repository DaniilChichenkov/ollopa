export async function loader() {
  const domain = "https://ollopa.ee";

  const urls = [
    {
      loc: `${domain}/est`,
      lang: "et",
    },
    {
      loc: `${domain}/eng`,
      lang: "en",
    },
    {
      loc: `${domain}/rus`,
      lang: "ru",
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls
  .map(
    ({ loc }) => `  <url>
    <loc>${loc}</loc>

    <xhtml:link
      rel="alternate"
      hreflang="et"
      href="${domain}/est"
    />
    <xhtml:link
      rel="alternate"
      hreflang="en"
      href="${domain}/eng"
    />
    <xhtml:link
      rel="alternate"
      hreflang="ru"
      href="${domain}/rus"
    />
    <xhtml:link
      rel="alternate"
      hreflang="x-default"
      href="${domain}/est"
    />
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
