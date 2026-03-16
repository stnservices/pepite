export type BusinessCategory =
  | 'restaurant'
  | 'salon'
  | 'mechanic'
  | 'professional'
  | 'retail'
  | 'health'
  | 'fitness'
  | 'real_estate'
  | 'construction'
  | 'other'

export type WebsiteQuality = 'none' | 'terrible' | 'poor' | 'mediocre' | 'decent' | 'good'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'responded'
  | 'meeting'
  | 'proposal_sent'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'archived'

export type ContactMethod = 'phone' | 'email' | 'in_person' | 'whatsapp' | 'facebook' | 'instagram'

export type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'visit' | 'status_change' | 'proposal' | 'other'

export interface Lead {
  id: string
  businessName: string
  category: BusinessCategory
  address: string
  city: string
  phone?: string
  email?: string
  website?: string
  googleMapsUrl?: string
  googlePlaceId?: string
  rating?: number
  reviewCount?: number
  websiteQuality: WebsiteQuality
  priority: 1 | 2 | 3 | 4 | 5
  status: LeadStatus
  priceOffered?: number
  priceAccepted?: number
  currency: string
  notes: string
  tags: string[]
  selectedTemplate?: string
  createdAt: string
  updatedAt: string
  contactedAt?: string
  wonAt?: string
  lostAt?: string
  lostReason?: string
}

export interface Activity {
  id: string
  leadId: string
  type: ActivityType
  description: string
  contactMethod?: ContactMethod
  timestamp: string
}

export interface ClientProject {
  id: string
  leadId: string
  businessName: string
  folderName: string
  templateUsed: string
  gitInitialized: boolean
  status: 'scaffolded' | 'in_progress' | 'review' | 'delivered' | 'live'
  deployUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  defaultCurrency: string
  defaultSearchRadius: number
  defaultCity: string
  sidebarCollapsed: boolean
}
