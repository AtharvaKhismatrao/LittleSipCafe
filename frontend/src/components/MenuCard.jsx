import { useState } from 'react';

export default function MenuCard({ item, onAdd }) {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const initialImageSrc = item.image 
    ? (item.image.startsWith('http') ? item.image : `${baseURL}${item.image}`) 
    : 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80';

  const [imageSrc, setImageSrc] = useState(initialImageSrc);

  const handleError = () => {
    setImageSrc('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80');
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-cream-dark">
        <img
          src={imageSrc}
          alt={item.name}
          onError={handleError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-coffee shadow-sm">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-coffee-dark">{item.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">
          {item.description || 'Freshly prepared for you.'}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-coffee">₹{item.price}</p>
          <button
            type="button"
            onClick={() => onAdd(item)}
            className="rounded-full bg-coffee px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-coffee-dark active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
