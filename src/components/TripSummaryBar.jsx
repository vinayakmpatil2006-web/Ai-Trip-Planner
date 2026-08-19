// src/components/TripSummaryBar.jsx
import { MapPin, Calendar, Users, Tag, LayoutList, Hotel } from "lucide-react";

const CAT_STYLE = {
  Budget:      "bg-green-100 text-green-700 border-green-300",
  "Mid-Range": "bg-blue-100  text-blue-700  border-blue-300",
  Luxury:      "bg-purple-100 text-purple-700 border-purple-300",
};

export default function TripSummaryBar({ userSelection, tripData }) {
  const dest      = userSelection?.destination || "—";
  const days      = userSelection?.days || "—";
  const traveler  = (userSelection?.traveler || "—").split(" ")[0];
  const budget    = userSelection?.budget;
  const cat       = tripData?.budget_breakdown?.category;
  const places    = (tripData?.itinerary || []).reduce(
    (acc, d) => acc + (d.activities?.length || 0), 0
  );
  const hotels    = tripData?.hotels?.length || 0;
  const catCls    = CAT_STYLE[cat] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-2">
          <Stat icon={<MapPin size={14} className="text-[#003B95]" />}   label="Destination"   value={dest} />
          <Stat icon={<Calendar size={14} className="text-orange-500" />} label="Duration"      value={`${days} nights`} />
          <Stat icon={<Users size={14} className="text-teal-600" />}     label="Travelers"     value={traveler} />
          <Stat icon={<LayoutList size={14} className="text-indigo-600" />} label="Places"    value={`${places} spots`} />
          <Stat icon={<Hotel size={14} className="text-pink-600" />}     label="Hotels Listed" value={`${hotels} options`} />
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Category</span>
            {cat ? (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-bold w-fit ${catCls}`}>
                <Tag size={10} /> {cat}
              </span>
            ) : (
              <span className="text-sm font-bold text-gray-700">
                {budget ? `₹${Number(budget).toLocaleString("en-IN")}` : "—"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5 flex items-center gap-1">
        {icon}{label}
      </span>
      <span className="text-sm font-bold text-gray-800 truncate">{value}</span>
    </div>
  );
}
