import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  ExternalLink,
  Trash2,
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
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useLeadsStore } from '@/stores/leads-store'
import { CATEGORIES, PIPELINE_STAGES } from '@/lib/constants'
import { TemplateSelector, getDefaultTemplate } from '@/components/preview/template-selector'
import { PreviewFrame } from '@/components/preview/preview-frame'
import { RestaurantTemplate } from '@/components/preview/templates/restaurant'
import { SalonTemplate } from '@/components/preview/templates/salon'
import { MechanicTemplate } from '@/components/preview/templates/mechanic'
import { ProfessionalTemplate } from '@/components/preview/templates/professional'
import { RetailTemplate } from '@/components/preview/templates/retail'
import { GenericTemplate } from '@/components/preview/templates/generic'
import type { LeadStatus } from '@/types'

const TEMPLATE_MAP: Record<string, React.ComponentType<{ businessName: string; phone?: string; address?: string; city?: string }>> = {
  restaurant: RestaurantTemplate,
  salon: SalonTemplate,
  mechanic: MechanicTemplate,
  professional: ProfessionalTemplate,
  retail: RetailTemplate,
  generic: GenericTemplate,
}

function PreviewTemplateRenderer({ template, ...props }: { template: string; businessName: string; phone?: string; address?: string; city?: string }) {
  const Template = TEMPLATE_MAP[template] || GenericTemplate
  return <Template {...props} />
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getLeadById, updateLead, changeStatus, getActivitiesByLead, deleteLead } = useLeadsStore()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const lead = getLeadById(id!)
  const activities = getActivitiesByLead(id!)
  const [previewTemplate, setPreviewTemplate] = useState(getDefaultTemplate(lead?.category))

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
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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

        <TabsContent value="preview" className="mt-4 space-y-4">
          <TemplateSelector
            selected={previewTemplate}
            onSelect={setPreviewTemplate}
            suggestedCategory={lead.category}
          />
          <PreviewFrame url={`www.${lead.businessName.toLowerCase().replace(/\s+/g, '-')}.com`}>
            <PreviewTemplateRenderer
              template={previewTemplate}
              businessName={lead.businessName}
              phone={lead.phone}
              address={lead.address}
              city={lead.city}
            />
          </PreviewFrame>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Lead"
        description={`Are you sure you want to delete "${lead.businessName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          deleteLead(lead.id)
          navigate('/leads')
        }}
      />
    </div>
  )
}
