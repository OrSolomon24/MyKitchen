import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const DishCardSkeleton = () => (
  <div className="overflow-hidden rounded-md bg-surface shadow-sm">
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="p-4">
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
);
