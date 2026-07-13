import React from 'react';
import { LogoMark } from './Logo';

/*
 * Shared recipe card. The image area is a fixed 4:3 slot so the grid stays
 * uniform while final photos are still being added — dishes without a photo
 * get a quiet branded placeholder that disappears once an image is uploaded.
 */
export const DishCard = ({ dish, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group block w-full cursor-pointer overflow-hidden rounded-md bg-surface text-start shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:-translate-y-1 focus-visible:shadow-md active:translate-y-0"
  >
    <div className="aspect-[4/3] w-full overflow-hidden bg-surface-muted">
      {dish.images?.[0] ? (
        <img
          src={dish.images[0].url}
          alt={dish.name}
          loading="lazy"
          width={440}
          height={330}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <LogoMark className="h-14 w-14 opacity-25" />
        </div>
      )}
    </div>
    <div className="p-4">
      <span className="mb-1 block font-display text-md font-bold leading-snug text-ink">
        {dish.name}
      </span>
      {dish.description && (
        <p className="m-0 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {dish.description}
        </p>
      )}
    </div>
  </button>
);
