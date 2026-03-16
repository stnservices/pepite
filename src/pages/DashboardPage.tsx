import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Trophy,
  TrendingUp,
  DollarSign,
  Search,
  Plus,
  Kanban,
  ArrowRight,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LeadStatusBadge } from '@/components/leads/lead-status-badge'
import { LeadForm } from '@/components/leads/lead-form'
import { useLeadsStore } from '@/stores/leads-store'
import { PIPELINE_STAGES, KANBAN_STATUSES, CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { LeadStatus } from '@/types'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { leads, activities, addLead } = useLeadsStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  const stats = useMemo(() => {
    const total = leads.length
    const contacted = leads.filter((l) => l.contactedAt).length
    const contactedPct = total > 0 ? Math.round((contacted / total) * 100) : 0
    const won = leads.filter((l) => l.status === 'won')
    const revenue = won.reduce((sum, l) => sum + (l.priceAccepted ?? l.priceOffered ?? 0), 0)
    return { total, contactedPct, wonCount: won.length, revenue }
  }, [leads])

  const recentActivities = useMemo(
    () =>
      [...activities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10),
    [activities]
  )

  const topPriorityLeads = useMemo(
    () =>
      leads
        .filter((l) => l.status === 'new')
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 5),
    [leads]
  )

  const pipelineBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    const activeStatuses: LeadStatus[] = [...KANBAN_STATUSES, 'won', 'lost']
    activeStatuses.forEach((s) => {
      counts[s] = leads.filter((l) => l.status === s).length
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return { counts, total, statuses: activeStatuses }
  }, [leads])

  const handleAddLead = (values: Parameters<typeof addLead>[0]) => {
    addLead(values)
    setDialogOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your leads and pipeline.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contacted</p>
              <p className="text-2xl font-bold">{stats.contactedPct}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Trophy className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Won Deals</p>
              <p className="text-2xl font-bold">{stats.wonCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">{stats.revenue}€</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline Overview */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {pipelineBreakdown.total > 0 ? (
                <>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    {pipelineBreakdown.statuses.map((status) => {
                      const count = pipelineBreakdown.counts[status]
                      if (count === 0) return null
                      const pct = (count / pipelineBreakdown.total) * 100
                      return (
                        <div
                          key={status}
                          className={cn(PIPELINE_STAGES[status].color, 'transition-all')}
                          style={{ width: `${pct}%` }}
                          title={`${PIPELINE_STAGES[status].label}: ${count}`}
                        />
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {pipelineBreakdown.statuses.map((status) => {
                      const count = pipelineBreakdown.counts[status]
                      if (count === 0) return null
                      return (
                        <div key={status} className="flex items-center gap-1.5 text-xs">
                          <div className={cn('h-2.5 w-2.5 rounded-full', PIPELINE_STAGES[status].color)} />
                          <span className="text-muted-foreground">
                            {PIPELINE_STAGES[status].label}: {count}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No leads in pipeline yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Priority Leads */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Top Priority Leads</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
                  View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {topPriorityLeads.length > 0 ? (
                <div className="space-y-3">
                  {topPriorityLeads.map((lead) => {
                    const Icon = CATEGORIES[lead.category].icon
                    return (
                      <div
                        key={lead.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-md p-2 -mx-2 transition-colors"
                        onClick={() => navigate(`/leads/${lead.id}`)}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lead.businessName}</p>
                          <p className="text-xs text-muted-foreground">{lead.city}</p>
                        </div>
                        <span className="text-xs">{'★'.repeat(lead.priority)}</span>
                        {lead.priceOffered && (
                          <span className="text-xs text-muted-foreground">{lead.priceOffered}€</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No new leads. Time to discover some businesses!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/discover')}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Businesses
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                  </DialogHeader>
                  <LeadForm
                    onSubmit={handleAddLead}
                    onCancel={() => setDialogOpen(false)}
                    submitLabel="Add Lead"
                  />
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/pipeline')}
              >
                <Kanban className="h-4 w-4 mr-2" />
                View Pipeline
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity) => {
                    const lead = leads.find((l) => l.id === activity.leadId)
                    return (
                      <div
                        key={activity.id}
                        className="cursor-pointer hover:bg-muted/50 rounded-md p-2 -mx-2 transition-colors"
                        onClick={() => lead && navigate(`/leads/${lead.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {lead?.businessName ?? 'Unknown'}
                          </p>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {activity.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
