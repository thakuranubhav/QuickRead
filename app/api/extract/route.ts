import * as cheerio from "cheerio";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response(
      JSON.stringify({ text: "" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);

    // Extract paragraphs cleanly
    const paragraphText = $("p")
      .map((_i, el) => $(el).text())
      .get()
      .join("\n");

    return new Response(
      JSON.stringify({ text: paragraphText }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ text: "" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
