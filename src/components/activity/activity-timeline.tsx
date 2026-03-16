import { formatDistanceToNow } from 'date-fns'
import { ACTIVITY_TYPES, CONTACT_METHODS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Activity } from '@/types'

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No activities yet. Add your first interaction.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const typeConfig = ACTIVITY_TYPES[activity.type]
        const Icon = typeConfig.icon
        const contactConfig = activity.contactMethod
          ? CONTACT_METHODS[activity.contactMethod]
          : null

        return (
          <div key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  activity.type === 'status_change'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < activities.length - 1 && (
                <div className="w-px flex-1 bg-border mt-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{typeConfig.label}</span>
                {contactConfig && (
                  <span className="text-xs text-muted-foreground">
                    via {contactConfig.label}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activity.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
