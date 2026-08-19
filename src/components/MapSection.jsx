// src/components/MapSection.jsx

export default function MapSection({ destination }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!destination || !apiKey) return null;

  const query = encodeURIComponent(`hotels and tourist places in ${destination} India`);
  const src   = `https://www.google.com/maps/embed/v1/search?q=${query}&key=${apiKey}&zoom=13`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900 text-base">
            📍 Map — {destination}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Hotels and tourist attractions in the area
          </p>
        </div>
        <a
          href={`https://www.google.com/maps/search/hotels+in+${encodeURIComponent(destination)}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-[#003B95] hover:underline"
        >
          Open in Maps ↗
        </a>
      </div>

      {/* Responsive map iframe */}
      <div className="relative" style={{ paddingBottom: "52%" }}>
        <iframe
          title={`Map of ${destination}`}
          src={src}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
