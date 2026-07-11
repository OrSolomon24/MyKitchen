import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const CategoryListSkeleton = () => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-11 w-full rounded-full" />
    ))}
  </div>
);
