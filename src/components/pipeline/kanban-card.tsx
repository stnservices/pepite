import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { Phone, Mail, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import { WebsiteQualityBadge } from '@/components/leads/website-quality-badge'
import type { Lead } from '@/types'

interface KanbanCardProps {
  lead: Lead
  isDragging?: boolean
}

export function KanbanCard({ lead, isDragging }: KanbanCardProps) {
  const navigate = useNavigate()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id, data: { lead } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const CategoryIcon = CATEGORIES[lead.category].icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border bg-card p-3 shadow-sm cursor-pointer transition-shadow hover:shadow-md',
        (isDragging || isSortableDragging) && 'opacity-50 shadow-lg'
      )}
      onClick={() => navigate(`/leads/${lead.id}`)}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <CategoryIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium truncate">{lead.businessName}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <WebsiteQualityBadge quality={lead.websiteQuality} />
            {lead.priceOffered && (
              <span className="text-xs text-muted-foreground">
                {lead.priceOffered}€
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {lead.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
