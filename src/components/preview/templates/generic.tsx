interface GenericTemplateProps {
  businessName: string
  phone?: string
  address?: string
  city?: string
}

export function GenericTemplate({ businessName, phone, address, city }: GenericTemplateProps) {
  return (
    <div className="font-sans">
      <section className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{businessName}</h1>
          <p className="opacity-80 text-lg mb-8">Bine ați venit pe site-ul nostru</p>
          <button className="bg-white text-stone-900 font-semibold px-8 py-3 rounded-lg hover:bg-stone-50 transition">
            Contactați-ne
          </button>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Despre noi</h2>
          <p className="text-muted-foreground leading-relaxed">Suntem o afacere dedicată, pasionată de a oferi servicii de calitate clienților noștri. Contactați-ne pentru mai multe detalii.</p>
        </div>
      </section>

      <section className="bg-muted px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          {phone && <p className="text-xl font-bold">{phone}</p>}
          {address && <p className="text-muted-foreground mt-2">{address}{city ? `, ${city}` : ''}</p>}
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-400 px-8 py-8 text-center text-sm">
        <p>&copy; 2026 {businessName}. Toate drepturile rezervate.</p>
      </footer>
    </div>
  )
}
