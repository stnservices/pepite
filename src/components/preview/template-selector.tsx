import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BusinessCategory } from '@/types'

const TEMPLATES: { id: string; label: string; categories: BusinessCategory[] }[] = [
  { id: 'restaurant', label: 'Restaurant', categories: ['restaurant'] },
  { id: 'salon', label: 'Salon & Beauty', categories: ['salon'] },
  { id: 'mechanic', label: 'Auto Service', categories: ['mechanic'] },
  { id: 'professional', label: 'Professional', categories: ['professional', 'health'] },
  { id: 'retail', label: 'Retail Shop', categories: ['retail'] },
  { id: 'generic', label: 'Generic', categories: ['other', 'fitness', 'real_estate', 'construction', 'fishing', 'hunting'] },
]

interface TemplateSelectorProps {
  selected: string
  onSelect: (id: string) => void
  suggestedCategory?: BusinessCategory
}

export function TemplateSelector({ selected, onSelect, suggestedCategory }: TemplateSelectorProps) {
  const suggested = suggestedCategory
    ? TEMPLATES.find((t) => t.categories.includes(suggestedCategory))?.id
    : undefined

  return (
    <div className="flex flex-wrap gap-2">
      {TEMPLATES.map((template) => (
        <Button
          key={template.id}
          variant={selected === template.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(template.id)}
          className={cn(
            suggested === template.id && selected !== template.id && 'ring-2 ring-primary/50'
          )}
        >
          {template.label}
          {suggested === template.id && selected !== template.id && (
            <span className="ml-1 text-xs opacity-60">suggested</span>
          )}
        </Button>
      ))}
    </div>
  )
}

export function getDefaultTemplate(category?: BusinessCategory): string {
  if (!category) return 'generic'
  const match = TEMPLATES.find((t) => t.categories.includes(category))
  return match?.id || 'generic'
}
