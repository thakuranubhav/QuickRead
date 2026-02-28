import { NextResponse } from "next/server";

type Context = {
  params: Promise<{ city: string }>;
};

export async function GET(
  req: Request,
  { params }: Context
) {
  const resolvedParams = await params;
  const city = resolvedParams.city;

  if (!city) {
    return NextResponse.json({ error: "City parameter missing" }, { status: 400 });
  }

  try {
    // 1️⃣ Get Latitude & Longitude
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geo = await geoRes.json();

    if (!geo.results || geo.results.length === 0) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const { latitude, longitude, name } = geo.results[0];

    // 2️⃣ Fetch Weather (current + hourly + daily)
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,cloud_cover_mean`
    );

    const weather = await weatherRes.json();

    return NextResponse.json({
      city: name,
      latitude,
      longitude,

      // 🌤 CURRENT
      current: {
        temperature: weather.current.temperature_2m,
        wind: Math.round(weather.current.wind_speed_10m * 3.6),
        humidity: weather.current.relative_humidity_2m,
        updated: weather.current.time,
      },

      // 🕒 HOURLY (next 24 hours)
      hourly: {
        time: weather.hourly.time.slice(0, 24),
        temperature: weather.hourly.temperature_2m.slice(0, 24),
        humidity: weather.hourly.relative_humidity_2m.slice(0, 24),
        wind: weather.hourly.wind_speed_10m.slice(0, 24),
        rain: weather.hourly.precipitation_probability.slice(0, 24),
        uv: weather.hourly.uv_index.slice(0, 24),
      },

      // 📅 DAILY (next 7 days)
      daily: {
        time: weather.daily.time.slice(0, 7),
        max: weather.daily.temperature_2m_max.slice(0, 7),
        min: weather.daily.temperature_2m_min.slice(0, 7),
        rain: weather.daily.precipitation_sum.slice(0, 7),
        uv: weather.daily.uv_index_max.slice(0, 7),
        cloud:weather.daily.cloud_cover_mean.slice(0,7),
      },
    });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
