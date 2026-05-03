import { useEffect, useState } from 'react';
import { fetchMenu } from '../services/api';

const categoryImages = {
  Coffee:
    'https://images.unsplash.com/photo-1447933601403-0c6688ce94ba?w=1200&q=80',
  Pastries:
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80',
  Food: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80',
};

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch(() => setMenu([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = ['Coffee', 'Pastries', 'Food'].map((cat) => ({
    category: cat,
    items: menu.filter((m) => m.category === cat),
    image: categoryImages[cat],
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-coffee-dark">Our Menu</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-stone-600">
          Explore handcrafted drinks, oven-fresh pastries, and satisfying bites — all in one
          place.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-stone-500">Loading…</p>
      ) : (
        <div className="space-y-20">
          {grouped.map((block) => (
            <section key={block.category}>
              <div className="overflow-hidden rounded-[2rem] shadow-card">
                <div className="grid md:grid-cols-2">
                  <div
                    className="relative min-h-[220px] bg-cover bg-center md:min-h-[280px]"
                    style={{ backgroundImage: `url(${block.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/80 to-coffee/30" />
                    <div className="absolute bottom-0 left-0 p-8">
                      <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                        {block.category}
                      </h2>
                    </div>
                  </div>
                  <div className="bg-white p-8 md:p-10">
                    <ul className="divide-y divide-stone-100">
                      {block.items.map((item) => (
                        <li key={item._id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream-dark">
                            <img
                              src={
                                item.image
                                  ? (item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}`)
                                  : 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80'
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h3 className="font-display text-lg font-semibold text-coffee-dark">
                                {item.name}
                              </h3>
                              <span className="font-bold text-coffee">₹{item.price}</span>
                            </div>
                            <p className="mt-1 text-sm text-stone-600">
                              {item.description || 'Made fresh for you.'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
