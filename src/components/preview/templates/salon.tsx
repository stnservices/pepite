interface SalonTemplateProps {
  businessName: string
  phone?: string
  address?: string
  city?: string
}

export function SalonTemplate({ businessName, phone, address, city }: SalonTemplateProps) {
  return (
    <div className="font-sans">
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950 dark:via-pink-950 dark:to-purple-950 px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-rose-400 text-sm uppercase tracking-[0.3em] mb-4">Salon de beauté</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">{businessName}</h1>
          <p className="text-stone-600 dark:text-stone-300 text-lg mb-8">Votre beauté, notre passion</p>
          <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-3 rounded-full transition">
            Prendre rendez-vous
          </button>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Nos Services</h2>
          <div className="grid grid-cols-2 gap-6">
            {['Coupe & Coiffure', 'Coloration', 'Soins du visage', 'Manucure & Pédicure'].map((service) => (
              <div key={service} className="border rounded-xl p-6 text-center hover:shadow-lg transition">
                <h3 className="font-semibold mb-2">{service}</h3>
                <p className="text-sm text-muted-foreground">Service professionnel personnalisé</p>
                <p className="text-rose-500 font-bold mt-2">À partir de 25€</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-rose-500 text-white px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Prenez rendez-vous</h2>
          {phone && <p className="text-xl font-bold mt-4">{phone}</p>}
          {address && <p className="text-sm mt-2 opacity-80">{address}{city ? `, ${city}` : ''}</p>}
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-400 px-8 py-8 text-center text-sm">
        <p>&copy; 2026 {businessName}. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
