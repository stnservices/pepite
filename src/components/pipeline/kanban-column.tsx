import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { PIPELINE_STAGES } from '@/lib/constants'
import { KanbanCard } from './kanban-card'
import type { Lead, LeadStatus } from '@/types'

interface KanbanColumnProps {
  status: LeadStatus
  leads: Lead[]
}

export function KanbanColumn({ status, leads }: KanbanColumnProps) {
  const config = PIPELINE_STAGES[status]
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const totalPrice = leads.reduce((sum, l) => sum + (l.priceOffered ?? 0), 0)

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border bg-muted/30 min-w-[280px] w-[280px]',
        isOver && 'ring-2 ring-primary/50'
      )}
    >
      <div className="p-3 border-b">
        <div className={cn('h-1 rounded-full mb-2', config.color)} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{config.label}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {leads.length}
            </span>
          </div>
          {totalPrice > 0 && (
            <span className="text-xs text-muted-foreground">{totalPrice}€</span>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div ref={setNodeRef} className="space-y-2 min-h-[100px]">
          <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            {leads.map((lead) => (
              <KanbanCard key={lead.id} lead={lead} />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  )
}
