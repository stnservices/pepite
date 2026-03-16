import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LeadStatusBadge } from '@/components/leads/lead-status-badge'
import { WebsiteQualityBadge } from '@/components/leads/website-quality-badge'
import { LeadForm } from '@/components/leads/lead-form'
import { ActivityTimeline } from '@/components/activity/activity-timeline'
import { ActivityForm } from '@/components/activity/activity-form'
import { useLeadsStore } from '@/stores/leads-store'
import { CATEGORIES, PIPELINE_STAGES } from '@/lib/constants'
import type { LeadStatus } from '@/types'

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getLeadById, updateLead, changeStatus, getActivitiesByLead } = useLeadsStore()

  const lead = getLeadById(id!)
  const activities = getActivitiesByLead(id!)

  if (!lead) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate('/leads')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
        <p className="mt-8 text-center text-muted-foreground">Lead not found.</p>
      </div>
    )
  }

  const CategoryIcon = CATEGORIES[lead.category].icon

  // Quick status change buttons (next logical statuses)
  const statusFlow: LeadStatus[] = ['new', 'contacted', 'responded', 'meeting', 'proposal_sent', 'negotiating', 'won']
  const currentIndex = statusFlow.indexOf(lead.status)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <CategoryIcon className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold tracking-tight">{lead.businessName}</h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {lead.address}, {lead.city}
            </span>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-foreground">
                <Phone className="h-3.5 w-3.5" />
                {lead.phone}
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-foreground">
                <Mail className="h-3.5 w-3.5" />
                {lead.email}
              </a>
            )}
            {lead.website && (
              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                <Globe className="h-3.5 w-3.5" />
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Quick status buttons */}
        <div className="flex gap-2">
          {lead.status !== 'won' && lead.status !== 'lost' && (
            <>
              {currentIndex >= 0 && currentIndex < statusFlow.length - 1 && (
                <Button
                  size="sm"
                  onClick={() => changeStatus(lead.id, statusFlow[currentIndex + 1])}
                >
                  Move to {PIPELINE_STAGES[statusFlow[currentIndex + 1]].label}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-emerald-600 hover:text-emerald-700"
                onClick={() => changeStatus(lead.id, 'won')}
              >
                Mark Won
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => changeStatus(lead.id, 'lost')}
              >
                Mark Lost
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Website Quality</p>
          <div className="mt-1">
            <WebsiteQualityBadge quality={lead.websiteQuality} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Priority</p>
          <p className="text-lg font-semibold mt-1">{'★'.repeat(lead.priority)}{'☆'.repeat(5 - lead.priority)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Price Offered</p>
          <p className="text-lg font-semibold mt-1">{lead.priceOffered ? `${lead.priceOffered}€` : '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Created</p>
          <p className="text-sm font-medium mt-1">{format(new Date(lead.createdAt), 'MMM d, yyyy')}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">
            Activity ({activities.length})
          </TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Edit Lead</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadForm
                defaultValues={lead}
                onSubmit={(values) => updateLead(lead.id, values)}
                submitLabel="Save Changes"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4 space-y-4">
          <ActivityForm leadId={lead.id} />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Website Preview</p>
              <p className="text-sm mt-1">Preview templates will be available in a future update.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
