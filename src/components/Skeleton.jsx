// Loading skeleton components for polished loading states

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3 animate-pulse" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
    </div>
  )
}

export function SkeletonAnalyzeResult() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
      
      {/* Category section */}
      <div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
        <div className="h-8 bg-blue-100 dark:bg-blue-900/30 rounded w-40" />
      </div>
      
      {/* Urgency section */}
      <div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
      
      {/* Action section */}
      <div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-2" />
        <div className="h-16 bg-gray-100 dark:bg-gray-700/50 rounded" />
      </div>
      
      {/* Routing section */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28" />
        </div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1 animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-4">
          {[1, 2, 3, 4, 5].map(j => (
            <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      
      {/* Charts placeholder */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse" />
          <div className="h-48 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-4 animate-pulse" />
          <div className="h-48 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
