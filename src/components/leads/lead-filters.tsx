import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORY_OPTIONS, STATUS_OPTIONS, WEBSITE_QUALITY_OPTIONS } from '@/lib/constants'
import type { LeadStatus, BusinessCategory, WebsiteQuality } from '@/types'

interface LeadFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: LeadStatus | 'all'
  onStatusFilterChange: (value: LeadStatus | 'all') => void
  categoryFilter: BusinessCategory | 'all'
  onCategoryFilterChange: (value: BusinessCategory | 'all') => void
  qualityFilter: WebsiteQuality | 'all'
  onQualityFilterChange: (value: WebsiteQuality | 'all') => void
}

export function LeadFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  qualityFilter,
  onQualityFilterChange,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as LeadStatus | 'all')}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={(v) => onCategoryFilterChange(v as BusinessCategory | 'all')}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={qualityFilter} onValueChange={(v) => onQualityFilterChange(v as WebsiteQuality | 'all')}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Website" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Quality</SelectItem>
          {WEBSITE_QUALITY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
