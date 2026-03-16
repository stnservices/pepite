import { useLeadsStore } from '@/stores/leads-store'
import { Card } from '@/components/ui/card'
import { KANBAN_STATUSES } from '@/lib/constants'

export function PipelineStats() {
  const leads = useLeadsStore((s) => s.leads)
  const inPipeline = leads.filter((l) => KANBAN_STATUSES.includes(l.status))
  const wonLeads = leads.filter((l) => l.status === 'won')
  const lostLeads = leads.filter((l) => l.status === 'lost')
  const totalRevenue = wonLeads.reduce((sum, l) => sum + (l.priceAccepted ?? l.priceOffered ?? 0), 0)
  const conversionRate =
    wonLeads.length + lostLeads.length > 0
      ? Math.round((wonLeads.length / (wonLeads.length + lostLeads.length)) * 100)
      : 0

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">In Pipeline</p>
        <p className="text-2xl font-bold">{inPipeline.length}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Won Deals</p>
        <p className="text-2xl font-bold text-emerald-500">{wonLeads.length}</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Conversion Rate</p>
        <p className="text-2xl font-bold">{conversionRate}%</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Revenue</p>
        <p className="text-2xl font-bold text-primary">{totalRevenue}€</p>
      </Card>
    </div>
  )
}
