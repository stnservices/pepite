import { KanbanBoard } from '@/components/pipeline/kanban-board'
import { PipelineStats } from '@/components/pipeline/pipeline-stats'

export default function PipelinePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drag leads between stages to update their status.
        </p>
      </div>

      <PipelineStats />
      <KanbanBoard />
    </div>
  )
}
