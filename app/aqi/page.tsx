"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AQIPage() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  async function searchAQI() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/aqi/${city}`);
      const json = await res.json();

      if (json.error) {
        setError("❗ City not valid or data unavailable.");
        setLoading(false);
        return;
      }

      setResult(json);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  }

  function aqiColor(aqi: number) {
    if (aqi <= 50) return "#00e400";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 150) return "#ff7e00";
    if (aqi <= 200) return "#ff0000";
    if (aqi <= 300) return "#8f3f97";
    return "#7e0023";
  }

  const chartData = [
    { name: "PM2.5", value: result?.pollutants.pm25 },
    { name: "PM10", value: result?.pollutants.pm10 },
    { name: "O₃", value: result?.pollutants.o3 },
    { name: "NO₂", value: result?.pollutants.no2 },
    { name: "SO₂", value: result?.pollutants.so2 },
    { name: "CO", value: result?.pollutants.co }
  ];

  return (
    <main className="min-h-screen w-full px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-28 text-gray-200 flex flex-col items-center bg-gradient-to-b from-gray-950 to-gray-900">

      {/* HEADER */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-blue-400 font-bold tracking-wide">
          QuickRead
        </h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5 md:mt-0 w-full max-w-lg">
          <input
            value={city}
            placeholder="Enter city name"
            onChange={(e) => setCity(e.target.value)}
            className="
              flex-1 p-3 sm:p-4 text-base sm:text-lg rounded-lg bg-gray-900
              border border-gray-700 text-gray-100 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg
            "
          />

          <button
            disabled={loading}
            onClick={searchAQI}
            className="
              px-6 py-3 rounded-lg text-base sm:text-lg font-semibold
              bg-blue-500 hover:bg-blue-400 text-white shadow-lg
              transition hover:scale-105
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            Search
          </button>
        </div>
      </div>

      {/* LOADING */}
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
        <p className="text-red-400 mt-6 text-lg font-medium animate-pulse">
          {error}
        </p>
      )}

      {/* RESULT */}
      {result && (
        <div className="w-full max-w-6xl mt-6 flex flex-col md:flex-row gap-6 sm:gap-10">

          {/* LEFT SIDE - AQI CARD */}
          <div className="w-full md:w-[58%]">
            <div className="
              bg-gray-900/80 border border-gray-700 rounded-2xl shadow-xl
              p-6 sm:p-10 text-center backdrop-blur-md
            ">
              <h2 className="text-3xl sm:text-4xl text-blue-300 font-bold mb-4">
                {result.city}
              </h2>

              <p className="text-6xl sm:text-7xl font-bold text-blue-400 mt-2 drop-shadow-lg">
                {result.aqi}
              </p>

              <p className="text-lg sm:text-xl mt-4 text-gray-300">
                Severity: <span className="font-bold text-gray-100">{result.severity}</span>
              </p>

              <p className="mt-6 text-gray-200 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                {result.impact}
              </p>

              <p className="mt-8 text-gray-400 text-sm">
                Dominant Pollutant: <span className="text-gray-200">{result.dominant}</span>
              </p>

              <div
                className="
                  w-full py-4 mt-8 rounded-xl text-black font-semibold tracking-wide
                "
                style={{ background: aqiColor(result.aqi) }}
              >
                AQI Severity Indicator
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - POLLUTANTS + CHARTS */}
          <div className="w-full md:w-[42%] flex flex-col gap-6">

            {/* TITLE + BUTTON */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-400">
                Major Pollutants
              </h3>

              <button
                onClick={() => setShowCharts(!showCharts)}
                className="
                  px-4 py-2 rounded-lg text-sm font-medium
                  bg-blue-500 hover:bg-blue-400 text-white shadow-md
                  transition hover:scale-105
                "
              >
                {showCharts ? "Show Cards" : "Show Charts"}
              </button>
            </div>

            {/* CARDS VIEW */}
            {!showCharts && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(result.pollutants).map(([key, value]) => (
                  <div
                    key={key}
                    className="
                      bg-gray-900 border border-gray-700 p-5 rounded-xl
                      text-center hover:-translate-y-1 transition shadow-lg
                    "
                  >
                    <p className="text-blue-300 font-medium text-lg uppercase">
                      {key}
                    </p>

                    <p className="text-3xl font-bold text-gray-100 mt-3">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CHART VIEW */}
            {showCharts && (
              <div className="
                w-full h-64 bg-gray-900 border border-gray-700
                rounded-xl shadow-xl p-6
              ">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" />
                    <XAxis dataKey="name" stroke="#d1d5db" />
                    <YAxis stroke="#d1d5db" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
