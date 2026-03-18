import { useState } from 'react'
import { Download, Upload, Database, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSettingsStore } from '@/stores/settings-store'
import { useLeadsStore } from '@/stores/leads-store'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api'
import { seedLeads, seedActivities } from '@/lib/seed-data'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { toast } = useToast()
  const settings = useSettingsStore()
  const leadsStore = useLeadsStore()
  const [city, setCity] = useState(settings.defaultCity)
  const [radius, setRadius] = useState(String(settings.defaultSearchRadius))
  const [currency, setCurrency] = useState(settings.defaultCurrency)

  const handleSaveSettings = () => {
    settings.updateSettings({
      defaultCity: city,
      defaultSearchRadius: Number(radius) || 5000,
      defaultCurrency: currency,
    })
    toast({ title: 'Settings saved', description: 'Your preferences have been updated.' })
  }

  const logout = useAuthStore((s) => s.logout)

  const handleLoadSeedData = async () => {
    useLeadsStore.setState({ leads: seedLeads, activities: seedActivities })
    await api.put('/leads', { leads: seedLeads, activities: seedActivities }).catch(console.error)
    toast({ title: 'Seed data loaded', description: `Loaded ${seedLeads.length} leads and ${seedActivities.length} activities.` })
  }

  const handleExport = () => {
    const data = leadsStore.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pepite-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Data exported', description: 'Your data has been downloaded as JSON.' })
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.leads) {
            leadsStore.importLeads(data.leads)
          }
          if (data.activities) {
            useLeadsStore.setState((state) => ({
              activities: [
                ...state.activities,
                ...data.activities.filter(
                  (a: { id: string }) => !state.activities.some((existing) => existing.id === a.id)
                ),
              ],
            }))
          }
          toast({ title: 'Data imported', description: 'Your data has been imported successfully.' })
        } catch {
          toast({ title: 'Import failed', description: 'Invalid JSON file.' })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your Pepite preferences.</p>
      </div>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Default values for discovery and lead management.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">Default City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Paris"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="radius">Search Radius (m)</Label>
              <Input
                id="radius"
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="5000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="EUR"
              />
            </div>
          </div>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export, import, or load sample data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button variant="outline" onClick={handleLoadSeedData}>
              <Database className="h-4 w-4 mr-2" />
              Load Sample Data
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Currently storing {leadsStore.leads.length} leads and {leadsStore.activities.length} activities.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => logout()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
