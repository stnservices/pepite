interface ProfessionalTemplateProps {
  businessName: string
  phone?: string
  address?: string
  city?: string
}

export function ProfessionalTemplate({ businessName, phone, address, city }: ProfessionalTemplateProps) {
  return (
    <div className="font-sans">
      <section className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{businessName}</h1>
          <p className="text-emerald-200 text-lg mb-8">Expertiză și profesionalism la dispoziția dumneavoastră</p>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg transition">
            Contactați-ne
          </button>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Despre noi</h2>
            <p className="text-muted-foreground leading-relaxed">Cu mulți ani de experiență, cabinetul nostru vă însoțește cu rigoare și profesionalism în toate demersurile dumneavoastră.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Serviciile Noastre</h2>
            <ul className="space-y-3">
              {['Consultanță', 'Asistență', 'Expertiză', 'Monitorizare personalizată'].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-emerald-600 text-white px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Contactați-ne</h2>
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
