import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PreviewFrame } from '@/components/preview/preview-frame'
import { TemplateSelector, getDefaultTemplate } from '@/components/preview/template-selector'
import { RestaurantTemplate } from '@/components/preview/templates/restaurant'
import { SalonTemplate } from '@/components/preview/templates/salon'
import { MechanicTemplate } from '@/components/preview/templates/mechanic'
import { ProfessionalTemplate } from '@/components/preview/templates/professional'
import { RetailTemplate } from '@/components/preview/templates/retail'
import { GenericTemplate } from '@/components/preview/templates/generic'

const TEMPLATE_MAP: Record<string, React.ComponentType<{ businessName: string; phone?: string; address?: string; city?: string }>> = {
  restaurant: RestaurantTemplate,
  salon: SalonTemplate,
  mechanic: MechanicTemplate,
  professional: ProfessionalTemplate,
  retail: RetailTemplate,
  generic: GenericTemplate,
}

export default function PreviewPage() {
  const [template, setTemplate] = useState('restaurant')
  const [businessName, setBusinessName] = useState('Mon Restaurant')
  const [phone, setPhone] = useState('+33 1 23 45 67 89')
  const [address, setAddress] = useState('123 Rue Exemple')
  const [city, setCity] = useState('Paris')

  const Template = TEMPLATE_MAP[template] || GenericTemplate

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Website Preview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Preview what a website could look like for a business.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateSelector selected={template} onSelect={setTemplate} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Business Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Business Name</Label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>City</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="col-span-2">
          <PreviewFrame url={`www.${businessName.toLowerCase().replace(/\s+/g, '-')}.com`}>
            <Template
              businessName={businessName}
              phone={phone}
              address={address}
              city={city}
            />
          </PreviewFrame>
        </div>
      </div>
    </div>
  )
}
