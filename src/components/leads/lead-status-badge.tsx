import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { PIPELINE_STAGES } from '@/lib/constants'
import type { LeadStatus } from '@/types'

const statusVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      status: {
        new: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
        contacted: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
        responded: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
        meeting: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400',
        proposal_sent: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
        negotiating: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
        won: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
        lost: 'bg-red-500/15 text-red-700 dark:text-red-400',
        archived: 'bg-gray-500/15 text-gray-700 dark:text-gray-400',
      },
    },
  }
)

interface LeadStatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  return (
    <span className={cn(statusVariants({ status }), className)}>
      {PIPELINE_STAGES[status].label}
    </span>
  )
}
