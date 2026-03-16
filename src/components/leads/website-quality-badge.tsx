import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { WEBSITE_QUALITY } from '@/lib/constants'
import type { WebsiteQuality } from '@/types'

const qualityVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      quality: {
        none: 'bg-red-500/15 text-red-700 dark:text-red-400',
        terrible: 'bg-red-400/15 text-red-600 dark:text-red-400',
        poor: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
        mediocre: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
        decent: 'bg-lime-500/15 text-lime-700 dark:text-lime-400',
        good: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
      },
    },
  }
)

interface WebsiteQualityBadgeProps {
  quality: WebsiteQuality
  className?: string
}

export function WebsiteQualityBadge({ quality, className }: WebsiteQualityBadgeProps) {
  return (
    <span className={cn(qualityVariants({ quality }), className)}>
      {WEBSITE_QUALITY[quality].label}
    </span>
  )
}
