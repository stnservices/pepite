interface RetailTemplateProps {
  businessName: string
  phone?: string
  address?: string
  city?: string
}

export function RetailTemplate({ businessName, phone, address, city }: RetailTemplateProps) {
  return (
    <div className="font-sans">
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{businessName}</h1>
          <p className="text-violet-100 text-lg mb-8">Descoperă colecția noastră</p>
          <button className="bg-white text-violet-700 font-semibold px-8 py-3 rounded-full hover:bg-violet-50 transition">
            Vezi magazinul
          </button>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-10">De ce să ne alegi</h2>
          <div className="grid grid-cols-3 gap-8">
            <div><div className="text-3xl mb-2">✨</div><h3 className="font-semibold">Calitate Premium</h3></div>
            <div><div className="text-3xl mb-2">🚚</div><h3 className="font-semibold">Livrare Rapidă</h3></div>
            <div><div className="text-3xl mb-2">💬</div><h3 className="font-semibold">Serviciu Clienți</h3></div>
          </div>
        </div>
      </section>

      <section className="bg-violet-600 text-white px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Vino să ne vizitezi</h2>
          {phone && <p className="text-xl font-bold mt-4">{phone}</p>}
          {address && <p className="text-sm mt-2 opacity-80">{address}{city ? `, ${city}` : ''}</p>}
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-400 px-8 py-8 text-center text-sm">
        <p>&copy; 2026 {businessName}. Toate drepturile rezervate.</p>
      </footer>
    </div>
  )
}
