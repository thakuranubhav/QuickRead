export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const apiKey = process.env.GEMINI_KEY!;
    const endpoint =
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
      apiKey;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Summarize this news in 4 bullet points:\n\n${text}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    console.log("GEMINI RAW JSON:", json);

    const summary =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ||
      json?.candidates?.[0]?.content?.text ||
      json?.candidates?.[0]?.text ||
      "";

    if (!summary.trim()) {
      return new Response(
        JSON.stringify({ summary: "⚠️ Gemini returned empty response." }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    console.error("SUMMARIZE ERROR:", error);
    return new Response(
      JSON.stringify({ summary: "❌ Summary unavailable." }),
      { status: 200 }
    );
  }
}
