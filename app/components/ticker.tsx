"use client";

interface TickerProps {
  headlines: string[];
}

export default function Ticker({ headlines }: TickerProps) {
  // duplicate headlines array for smooth looping
  const loopData = [...headlines, ...headlines];

  return (
    <div className="relative overflow-hidden whitespace-nowrap bg-black text-white py-2">
      <div className="ticker">
        {loopData.map((h, i) => (
          <span key={i} className="mx-8 text-sm font-medium inline-block">
            {h}
          </span>
        ))}
      </div>

      <style jsx>{`
        .ticker {
          display: inline-block;
          padding-left: 100%;
          animation: tickerScroll 60s linear infinite;
        }

        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
