import React from 'react';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  width = '100%', 
  height = '20px', 
  className = '',
  count = 1
}) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div 
          key={i}
          className={`animate-pulse bg-gray-200 rounded ${className}`}
          style={{
            width,
            height,
            marginBottom: '0.5rem'
          }}
        />
      ))}
    </>
  );
};

export const QuotesSkeleton = () => {
  return (
    <div className="space-y-4 w-full">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <SkeletonLoader width="200px" height="28px" />
        <SkeletonLoader width="120px" height="38px" />
      </div>
      
      {/* Filter bar skeleton */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SkeletonLoader width="100%" height="38px" />
        </div>
      </div>
      
      {/* Table header skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex-1">
                <SkeletonLoader width="90%" height="20px" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Table rows skeleton */}
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="p-4 border-b">
            <div className="flex">
              {Array(6).fill(0).map((_, j) => (
                <div key={j} className="flex-1">
                  <SkeletonLoader width="90%" height="20px" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarSkeleton = () => {
  return (
    <div className="space-y-4 w-full">
      {/* Header skeleton */}
      <div className="flex justify-between items-center p-4">
        <SkeletonLoader width="200px" height="28px" />
        <SkeletonLoader width="120px" height="38px" />
      </div>
      
      {/* Calendar header skeleton */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex mb-4">
          {Array(7).fill(0).map((_, i) => (
            <div key={i} className="flex-1">
              <SkeletonLoader width="90%" height="20px" />
            </div>
          ))}
        </div>
        
        {/* Calendar body skeleton */}
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex mb-4">
            {Array(7).fill(0).map((_, j) => (
              <div key={j} className="flex-1 border p-2 min-h-[100px]">
                <SkeletonLoader width="90%" height="16px" />
                {Math.random() > 0.6 && (
                  <div className="mt-2">
                    <SkeletonLoader width="80%" height="24px" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
