interface RestaurantTemplateProps {
  businessName: string
  phone?: string
  address?: string
  city?: string
}

export function RestaurantTemplate({ businessName, phone, address, city }: RestaurantTemplateProps) {
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-900 via-stone-900 to-stone-950 text-white px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4">Bienvenue chez</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{businessName}</h1>
          <p className="text-stone-300 text-lg mb-8">Une expérience culinaire unique au coeur de {city || 'la ville'}</p>
          <div className="flex justify-center gap-4">
            <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg transition">
              Réserver une table
            </button>
            <button className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg transition">
              Voir le menu
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-stone-50 dark:bg-stone-900 px-8 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">🍽️</div>
            <h3 className="font-semibold mb-1">Cuisine Authentique</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">Des recettes traditionnelles préparées avec passion</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🌿</div>
            <h3 className="font-semibold mb-1">Produits Frais</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">Ingrédients locaux et de saison</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🍷</div>
            <h3 className="font-semibold mb-1">Cave à Vins</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">Une sélection de vins soigneusement choisis</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 text-black px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Réservez votre table</h2>
          <p className="mb-4">Appelez-nous ou réservez en ligne</p>
          {phone && <p className="text-xl font-bold">{phone}</p>}
          {address && <p className="text-sm mt-2 opacity-80">{address}{city ? `, ${city}` : ''}</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 px-8 py-8 text-center text-sm">
        <p>&copy; 2026 {businessName}. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
