import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const token = process.env.WAQI_TOKEN;

  const res = await fetch(
    `https://api.waqi.info/feed/${city}/?token=${token}`
  );

  const json = await res.json();
  console.log(json); // You saw this working ✔

  function aqiSeverity(aqi: number) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function aqiHealthImpact(aqi: number) {
  if (aqi <= 50) return "Air quality poses little or no risk.";
  if (aqi <= 100) return "Satisfactory air quality, some pollutants may affect sensitive people.";
  if (aqi <= 150) return "Sensitive groups may experience breathing discomfort.";
  if (aqi <= 200) return "Everyone may begin to experience health effects.";
  if (aqi <= 300) return "Risk of serious respiratory issues for all.";
  return "Emergency conditions — avoid outdoor activities.";
}
  const AQI=json.data.aqi;

  return NextResponse.json({
    city: json.data.city.name,
    aqi: json.data.aqi,
    severity: aqiSeverity(AQI),
    impact: aqiHealthImpact(AQI),
    dominant: json.data.dominentpol,
    updated: json.data.time.s,
    pollutants: {
    pm25: json.data.iaqi.pm25?.v,
    pm10: json.data.iaqi.pm10?.v,
    o3: json.data.iaqi.o3?.v,
    no2: json.data.iaqi.no2?.v,
    so2: json.data.iaqi.so2?.v,
    co: json.data.iaqi.co?.v
  }
  });
}
