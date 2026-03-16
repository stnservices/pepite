import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LeadStatusBadge } from '@/components/leads/lead-status-badge'
import { WebsiteQualityBadge } from '@/components/leads/website-quality-badge'
import { LeadFilters } from '@/components/leads/lead-filters'
import { LeadForm } from '@/components/leads/lead-form'
import { useLeadsStore } from '@/stores/leads-store'
import { CATEGORIES } from '@/lib/constants'
import { useDebounce } from '@/hooks/use-debounce'
import type { LeadStatus, BusinessCategory, WebsiteQuality } from '@/types'

type SortKey = 'businessName' | 'city' | 'websiteQuality' | 'status' | 'priority' | 'priceOffered' | 'createdAt'
type SortDir = 'asc' | 'desc'

export default function LeadsPage() {
  const navigate = useNavigate()
  const { leads, addLead } = useLeadsStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<BusinessCategory | 'all'>('all')
  const [qualityFilter, setQualityFilter] = useState<WebsiteQuality | 'all'>('all')

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const debouncedSearch = useDebounce(search, 300)

  const filteredLeads = useMemo(() => {
    let result = [...leads]

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (l) =>
          l.businessName.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.notes.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter)
    }
    if (categoryFilter !== 'all') {
      result = result.filter((l) => l.category === categoryFilter)
    }
    if (qualityFilter !== 'all') {
      result = result.filter((l) => l.websiteQuality === qualityFilter)
    }

    result.sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [leads, debouncedSearch, statusFilter, categoryFilter, qualityFilter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleAddLead = (values: Parameters<typeof addLead>[0]) => {
    addLead(values)
    setDialogOpen(false)
  }

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <button
      className="flex items-center gap-1 hover:text-foreground"
      onClick={() => toggleSort(sortKeyName)}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  )

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">{filteredLeads.length} leads found</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
      </div>

      <LeadFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        qualityFilter={qualityFilter}
        onQualityFilterChange={setQualityFilter}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortHeader label="Business" sortKeyName="businessName" /></TableHead>
              <TableHead><SortHeader label="City" sortKeyName="city" /></TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><SortHeader label="Priority" sortKeyName="priority" /></TableHead>
              <TableHead><SortHeader label="Price" sortKeyName="priceOffered" /></TableHead>
              <TableHead><SortHeader label="Created" sortKeyName="createdAt" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No leads found. Add your first lead to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => {
                const CategoryIcon = CATEGORIES[lead.category].icon
                return (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{lead.businessName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{lead.city}</TableCell>
                    <TableCell>
                      <WebsiteQualityBadge quality={lead.websiteQuality} />
                    </TableCell>
                    <TableCell>
                      <LeadStatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{'★'.repeat(lead.priority)}{'☆'.repeat(5 - lead.priority)}</span>
                    </TableCell>
                    <TableCell>
                      {lead.priceOffered ? `${lead.priceOffered}€` : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
