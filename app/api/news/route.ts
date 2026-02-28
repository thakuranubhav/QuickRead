import { NextResponse } from "next/server";

export const runtime = "nodejs";

const categoryMap: Record<string, string> = {
  tech: "technology",
  science: "science",
  business: "business",
  sports: "sports",
  politics: "politics",
  health: "health",
  environment: "science",
};

const allowedCategories = new Set([
  "business",
  "entertainment",
  "environment",
  "food",
  "health",
  "politics",
  "science",
  "sports",
  "technology",
  "top",
  "world",
]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") ?? "";
    const category = searchParams.get("category") ?? "";

    const apiKey =
      process.env.NEWSDATA_API_KEY ?? process.env.NEXT_PUBLIC_NEWSDATA_API_KEY ?? "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing NEWSDATA API key in environment variables." },
        { status: 500 }
      );
    }

    let url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&size=10`;
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }
    if (category) {
      const providerCategory = categoryMap[category] ?? category;
      if (allowedCategories.has(providerCategory)) {
        url += `&category=${encodeURIComponent(providerCategory)}`;
      }
    }

    const response = await fetch(url, { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.message || "Failed to fetch news from provider." },
        { status: response.status }
      );
    }

    if (payload?.status === "error") {
      const providerMessage =
        payload?.results?.message || payload?.message || "Failed to fetch news from provider.";
      return NextResponse.json({ error: providerMessage }, { status: 502 });
    }

    const results = Array.isArray(payload?.results) ? payload.results : [];
    const data = results
      .filter((item: any) => Boolean(item?.title))
      .map((item: any, index: number) => ({
        uuid: item.article_id ?? item.link ?? `${Date.now()}-${index}`,
        title: item.title,
        description: item.description ?? "",
        url: item.link ?? "",
        image_url: item.image_url ?? "",
      }));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch news." }, { status: 500 });
  }
}
