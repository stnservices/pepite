interface MechanicTemplateProps {
  businessName: string
  phone?: string
  address?: string
  city?: string
}

export function MechanicTemplate({ businessName, phone, address, city }: MechanicTemplateProps) {
  return (
    <div className="font-sans">
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{businessName}</h1>
          <p className="text-blue-200 text-lg mb-8">Votre garage de confiance à {city || 'proximité'}</p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition">
              Prendre rendez-vous
            </button>
            {phone && (
              <button className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg transition">
                {phone}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Nos Services</h2>
          <div className="grid grid-cols-3 gap-6">
            {['Révision', 'Freinage', 'Pneus', 'Vidange', 'Diagnostic', 'Climatisation'].map((service) => (
              <div key={service} className="border rounded-lg p-5 text-center hover:border-blue-500 transition">
                <h3 className="font-semibold">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white px-8 py-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Besoin d'un dépannage ?</h2>
            <p className="text-blue-100">Nous sommes disponibles du lundi au samedi</p>
          </div>
          {phone && <p className="text-2xl font-bold">{phone}</p>}
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 px-8 py-8 text-center text-sm">
        <p>&copy; 2026 {businessName}. Tous droits réservés.</p>
        {address && <p className="mt-1">{address}{city ? `, ${city}` : ''}</p>}
      </footer>
    </div>
  )
}
