// src/components/BudgetBreakdown.jsx
import { Hotel, Utensils, Car, Ticket, Train, IndianRupee, TrendingUp } from "lucide-react";

const ROWS = [
  { key: "hotelCost",       label: "Hotel Accommodation",   icon: Hotel,     color: "text-blue-600",   bg: "bg-blue-50",   bar: "bg-blue-500"   },
  { key: "foodCost",        label: "Food & Dining",          icon: Utensils,  color: "text-orange-600", bg: "bg-orange-50", bar: "bg-orange-500" },
  { key: "localTransport",  label: "Local Transport",        icon: Car,       color: "text-teal-600",   bg: "bg-teal-50",   bar: "bg-teal-500"   },
  { key: "activities",      label: "Activities & Entry Fees",icon: Ticket,    color: "text-purple-600", bg: "bg-purple-50", bar: "bg-purple-500" },
  { key: "travelCost",      label: "Travel to Destination",  icon: Train,     color: "text-red-600",    bg: "bg-red-50",    bar: "bg-red-500"    },
];

const fmt = (n) =>
  n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

const pct = (val, total) =>
  total > 0 ? Math.min(100, Math.round((val / total) * 100)) : 0;

const CATEGORY_STYLE = {
  Budget:    "bg-green-100 text-green-700 border-green-300",
  "Mid-Range": "bg-blue-100  text-blue-700  border-blue-300",
  Luxury:    "bg-purple-100 text-purple-700 border-purple-300",
};

export default function BudgetBreakdown({ budgetData, days }) {
  if (!budgetData) return null;

  const total  = budgetData.total || 0;
  const cat    = budgetData.category;
  const catCls = CATEGORY_STYLE[cat] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <IndianRupee size={17} className="text-green-600" />
          Budget Breakdown
        </h2>
        <div className="flex items-center gap-3">
          {cat && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${catCls}`}>
              {cat}
            </span>
          )}
          <span className="text-xs text-gray-400">{days} day{days !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {ROWS.map(({ key, label, icon: Icon, color, bg, bar }) => {
          const val = budgetData[key];
          const p   = pct(val, total);
          return (
            <div key={key} className="px-5 py-3 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bg} ${color} shrink-0`}>
                <Icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700">{label}</span>
                  <span className="text-sm font-bold text-gray-900">{fmt(val)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${p}%` }} />
                </div>
              </div>
              <span className="text-xs text-gray-400 w-8 text-right shrink-0">{p}%</span>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span className="font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={16} className="text-green-600" />
          Total Estimated Cost
        </span>
        <span className="text-xl font-black text-green-700">{fmt(total)}</span>
      </div>
    </div>
  );
}
