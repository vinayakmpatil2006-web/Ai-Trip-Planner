// src/components/TransportCard.jsx

const MODE_COLOR = {
  Train:  { bg: "bg-blue-50",   border: "border-blue-200",  badge: "bg-blue-100  text-blue-700"  },
  Bus:    { bg: "bg-green-50",  border: "border-green-200", badge: "bg-green-100 text-green-700" },
  Flight: { bg: "bg-sky-50",    border: "border-sky-200",   badge: "bg-sky-100   text-sky-700"   },
};

const DEFAULT = { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-700" };

export default function TransportCard({ transports, destination }) {
  if (!transports || transports.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-bold text-gray-900 text-base">
          🚆 How to Reach {destination}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Suggested transport options from nearby major cities
        </p>
      </div>

      {/* Cards */}
      <div className="divide-y divide-gray-100">
        {transports.map((t, i) => {
          const style = MODE_COLOR[t.mode] || DEFAULT;
          return (
            <div
              key={i}
              className={`px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 ${t.recommended ? style.bg : ""}`}
            >
              {/* Icon + Mode */}
              <div className="flex items-center gap-3 sm:w-40 shrink-0">
                <span className="text-3xl leading-none">{t.icon || "🚀"}</span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{t.mode}</span>
                    {t.recommended && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#003B95] text-white rounded uppercase tracking-wide">
                        Best Value
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded mt-0.5 inline-block ${style.badge}`}>
                    {t.provider}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex gap-8 flex-1">
                <Stat label="Est. Price" value={t.price} />
                <Stat label="Duration"   value={t.duration} />
              </div>

              {/* Notes */}
              {t.notes && (
                <p className="text-xs text-gray-500 sm:max-w-xs border-l border-gray-200 pl-4 hidden sm:block">
                  {t.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-400 font-medium mb-0.5">{label}</div>
      <div className="font-bold text-gray-900 text-sm">{value || "—"}</div>
    </div>
  );
}
