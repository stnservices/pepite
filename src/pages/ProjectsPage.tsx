import { useState } from 'react'
import { format } from 'date-fns'
import {
  Plus,
  ExternalLink,
  FolderGit2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjectsStore } from '@/stores/projects-store'
import { useLeadsStore } from '@/stores/leads-store'
import { CATEGORIES } from '@/lib/constants'

const STATUS_COLORS: Record<string, string> = {
  scaffolded: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  in_progress: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  review: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  delivered: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  live: 'bg-green-500/15 text-green-700 dark:text-green-400',
}

const STATUS_LABELS: Record<string, string> = {
  scaffolded: 'Scaffolded',
  in_progress: 'In Progress',
  review: 'Review',
  delivered: 'Delivered',
  live: 'Live',
}

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjectsStore()
  const leads = useLeadsStore((s) => s.leads)
  const wonLeads = leads.filter((l) => l.status === 'won')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState('')
  const [template, setTemplate] = useState('generic')

  const handleCreateProject = () => {
    const lead = leads.find((l) => l.id === selectedLead)
    if (!lead) return
    const folderName = lead.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    addProject({
      leadId: lead.id,
      businessName: lead.businessName,
      folderName,
      templateUsed: template,
      gitInitialized: false,
      status: 'scaffolded',
    })
    setDialogOpen(false)
    setSelectedLead('')
  }

  const leadsWithoutProjects = wonLeads.filter(
    (l) => !projects.some((p) => p.leadId === l.id)
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client website projects.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={leadsWithoutProjects.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Client Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Client (won leads)</Label>
                <Select value={selectedLead} onValueChange={setSelectedLead}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {leadsWithoutProjects.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="salon">Salon</SelectItem>
                    <SelectItem value="mechanic">Mechanic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="generic">Generic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateProject} disabled={!selectedLead}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <FolderGit2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-sm mt-1">Win a deal first, then create a website project for the client.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => {
            const lead = leads.find((l) => l.id === project.leadId)
            const CategoryIcon = lead ? CATEGORIES[lead.category]?.icon : null
            return (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {CategoryIcon && <CategoryIcon className="h-4 w-4 text-muted-foreground" />}
                      <h3 className="font-semibold">{project.businessName}</h3>
                      <Badge className={STATUS_COLORS[project.status]}>
                        {STATUS_LABELS[project.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Template: {project.templateUsed}</span>
                      <span>Folder: {project.folderName}/</span>
                      <span>Created: {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    {project.deployUrl && (
                      <a
                        href={project.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary mt-1 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {project.deployUrl}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={project.status}
                      onValueChange={(v) => updateProject(project.id, { status: v as typeof project.status })}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scaffolded">Scaffolded</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
