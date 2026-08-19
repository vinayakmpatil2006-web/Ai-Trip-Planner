// Loading skeleton component for smooth loading experiences
export function SkeletonCard() {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden animate-pulse">
      <div className="h-48 bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array(lines).fill(0).map((_, i) => (
        <div key={i} className="h-4 bg-white/10 rounded animate-pulse" />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-white/10 rounded w-3/4" />
      <div className="grid grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-20 bg-white/10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
