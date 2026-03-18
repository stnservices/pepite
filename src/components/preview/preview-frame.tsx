import { cn } from '@/lib/utils'

interface PreviewFrameProps {
  url?: string
  children: React.ReactNode
  className?: string
}

export function PreviewFrame({ url = 'www.example.com', children, className }: PreviewFrameProps) {
  return (
    <div className={cn('rounded-lg border shadow-lg overflow-hidden bg-background', className)}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/50">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center border">
            {url}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="overflow-y-auto max-h-[400px] lg:max-h-[600px]">
        {children}
      </div>
    </div>
  )
}
