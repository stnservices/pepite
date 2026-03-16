import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ACTIVITY_TYPES, CONTACT_METHODS } from '@/lib/constants'
import { useLeadsStore } from '@/stores/leads-store'
import type { ActivityType, ContactMethod } from '@/types'
import { Plus } from 'lucide-react'

interface ActivityFormProps {
  leadId: string
}

export function ActivityForm({ leadId }: ActivityFormProps) {
  const addActivity = useLeadsStore((s) => s.addActivity)
  const [type, setType] = useState<ActivityType>('note')
  const [contactMethod, setContactMethod] = useState<ContactMethod | 'none'>('none')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (!description.trim()) return
    addActivity({
      leadId,
      type,
      description: description.trim(),
      contactMethod: contactMethod === 'none' ? undefined : contactMethod,
    })
    setDescription('')
    setContactMethod('none')
    setType('note')
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex gap-3">
        <Select value={type} onValueChange={(v) => setType(v as ActivityType)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ACTIVITY_TYPES)
              .filter(([key]) => key !== 'status_change')
              .map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  {config.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={contactMethod} onValueChange={(v) => setContactMethod(v as ContactMethod | 'none')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Contact via..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {Object.entries(CONTACT_METHODS).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Textarea
        placeholder="Describe the interaction..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <Button onClick={handleSubmit} size="sm" disabled={!description.trim()}>
        <Plus className="h-4 w-4 mr-1" />
        Add Activity
      </Button>
    </div>
  )
}
