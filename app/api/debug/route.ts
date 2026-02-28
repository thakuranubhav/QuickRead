export async function GET() {
  const result = await fetch(
    "https://generativelanguage.googleapis.com/v1/models?key=" + process.env.GEMINI_KEY
  ).then(r => r.json());

  console.log("MODEL LIST:", result);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
