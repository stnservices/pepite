import { useState } from 'react'
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useLeadsStore } from '@/stores/leads-store'
import { KANBAN_STATUSES } from '@/lib/constants'
import { KanbanColumn } from './kanban-column'
import type { LeadStatus } from '@/types'

export function KanbanBoard() {
  const { leads, changeStatus } = useLeadsStore()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const leadId = active.id as string
    const overId = over.id as string

    // Check if dropped on a column (status)
    if (KANBAN_STATUSES.includes(overId as LeadStatus)) {
      const lead = leads.find((l) => l.id === leadId)
      if (lead && lead.status !== overId) {
        changeStatus(leadId, overId as LeadStatus)
      }
      return
    }

    // Dropped on another card — find which column it belongs to
    const overLead = leads.find((l) => l.id === overId)
    if (overLead) {
      const lead = leads.find((l) => l.id === leadId)
      if (lead && lead.status !== overLead.status) {
        changeStatus(leadId, overLead.status)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            leads={leads.filter((l) => l.status === status)}
          />
        ))}
      </div>
    </DndContext>
  )
}
