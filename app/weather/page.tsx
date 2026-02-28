"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false);
  const [activeMode, setActiveMode] = useState<"hourly" | "daily">("daily");

  const hourlyRef = useRef<HTMLDivElement>(null);
  const dailyRef = useRef<HTMLDivElement>(null);

  async function fetchWeather() {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);

    const res = await fetch(`/api/weather/${city}`);
    const data = await res.json();

    if (data.error) return setError(data.error);
    setWeather(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-28 text-gray-200 flex flex-col items-center bg-gradient-to-b from-gray-950 to-gray-900">

      {/* HEADER ROW */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
        <Link href="/" className="text-2xl sm:text-3xl font-bold tracking-wide text-blue-400">
          AQImaster
        </Link>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-lg">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={fetchWeather}
            className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-lg font-semibold shadow-md"
          >
            Search
          </button>

          <Link
            href="/aqi"
            className="px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 font-semibold"
          >
            AQI
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center mt-4 gap-4 animate-fadeIn">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-300 text-lg font-medium animate-pulse">
            Fetching AQI data...
          </p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-400 mt-4 mb-4 text-lg font-medium animate-pulse">
          ❗ {error}
        </p>
      )}

      {/* CURRENT WEATHER */}
      {weather && (
        <div className="mt-4 max-w-4xl w-full bg-gray-900 rounded-2xl border border-gray-700 p-6 sm:p-10 text-center shadow-xl shadow-black/30">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-400">
            {weather.city}
          </h2>

          <p className="mt-6 text-5xl sm:text-6xl font-bold text-gray-100 drop-shadow-lg">
            {weather.current.temperature}°
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-10 text-lg font-medium">
            <p className="text-gray-300">
              💧 Humidity:
              <span className="text-blue-400"> {weather.current.humidity}%</span>
            </p>

            <p className="text-gray-300">
              💨 Wind:
              <span className="text-blue-400"> {weather.current.wind} km/h</span>
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Last updated: {weather.current.updated}
          </p>
        </div>
      )}

      {/* TOGGLE BUTTONS */}
      {weather && (
        <div className="mt-10 sm:mt-14 flex gap-3 sm:gap-6 justify-center">
          <button
            onClick={() => {
              setActiveMode("hourly");
              setTimeout(() => {
                hourlyRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`
              px-5 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition
              ${activeMode === "hourly"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-400/30"
                : "bg-gray-800 border border-gray-600 hover:bg-gray-700"}
            `}
          >
            Hourly
          </button>

          <button
            onClick={() => {
              setActiveMode("daily");
              setTimeout(() => {
                dailyRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={`
              px-5 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition
              ${activeMode === "daily"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-400/30"
                : "bg-gray-800 border border-gray-600 hover:bg-gray-700"}
            `}
          >
            Daily
          </button>
        </div>
      )}

      {/* HOURLY VIEW */}
      {weather && activeMode === "hourly" && (
        <div ref={hourlyRef} className="mt-12 sm:mt-16 max-w-6xl w-full">
          <h3 className="text-2xl sm:text-3xl text-blue-400 font-semibold mb-6 sm:mb-8 text-center">
            Hourly Forecast (Next 24 Hours)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {weather.hourly.time.map((t: string, i: number) => (
              <div
                key={i}
                className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-700 text-center shadow-md hover:-translate-y-1 transition"
              >
                <p className="text-gray-400 text-sm mb-3">
                  {new Date(t).toLocaleTimeString("en-IN", { hour: "2-digit" })}
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-blue-300">
                  {weather.hourly.temperature[i]}°
                </p>

                <p className="text-gray-400 text-sm mt-3">
                  💧 {weather.hourly.humidity[i]}%
                </p>

                <p className="text-gray-400 text-sm">
                  💨 {weather.hourly.wind[i]} km/h
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAILY VIEW */}
      {weather && activeMode === "daily" && (
        <div ref={dailyRef} className="mt-12 sm:mt-16 max-w-6xl w-full">
          <h3 className="text-2xl sm:text-3xl text-blue-400 font-semibold mb-6 sm:mb-8 text-center">
            Daily Forecast (Next 7 Days)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-6">
            {weather.daily.time.map((d: string, i: number) => (
              <div
                key={i}
                className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-700 text-center shadow-md hover:-translate-y-1 transition"
              >
                <p className="text-blue-300 text-lg font-medium">
                  {new Date(d).toLocaleDateString("en-IN", { weekday: "short" })}
                </p>

                <p className="text-2xl text-gray-100 mt-3 font-bold">
                  🔺 {weather.daily.max[i]}°
                </p>

                <p className="text-gray-400 text-sm">
                  🔻 {weather.daily.min[i]}°
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  🌧 {weather.daily.rain[i]} mm
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}
