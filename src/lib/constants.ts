import {
  Building2,
  Scissors,
  Wrench,
  Briefcase,
  ShoppingBag,
  Heart,
  Dumbbell,
  Home,
  HardHat,
  MoreHorizontal,
  Circle,
  Send,
  MessageSquare,
  CalendarCheck,
  FileText,
  Handshake,
  Trophy,
  XCircle,
  Archive,
  Phone,
  Mail,
  User,
  MessageCircle,
  Facebook,
  Instagram,
  StickyNote,
  PhoneCall,
  MapPin,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import type { BusinessCategory, LeadStatus, WebsiteQuality, ContactMethod, ActivityType } from '@/types'

// Category config
export const CATEGORIES: Record<BusinessCategory, { label: string; icon: LucideIcon }> = {
  restaurant: { label: 'Restaurant', icon: Building2 },
  salon: { label: 'Salon / Beauty', icon: Scissors },
  mechanic: { label: 'Mechanic / Auto', icon: Wrench },
  professional: { label: 'Professional', icon: Briefcase },
  retail: { label: 'Retail', icon: ShoppingBag },
  health: { label: 'Health', icon: Heart },
  fitness: { label: 'Fitness', icon: Dumbbell },
  real_estate: { label: 'Real Estate', icon: Home },
  construction: { label: 'Construction', icon: HardHat },
  other: { label: 'Other', icon: MoreHorizontal },
}

// Pipeline stages config
export const PIPELINE_STAGES: Record<LeadStatus, { label: string; color: string; icon: LucideIcon; order: number }> = {
  new: { label: 'New', color: 'bg-blue-500', icon: Circle, order: 0 },
  contacted: { label: 'Contacted', color: 'bg-indigo-500', icon: Send, order: 1 },
  responded: { label: 'Responded', color: 'bg-purple-500', icon: MessageSquare, order: 2 },
  meeting: { label: 'Meeting', color: 'bg-cyan-500', icon: CalendarCheck, order: 3 },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-amber-500', icon: FileText, order: 4 },
  negotiating: { label: 'Negotiating', color: 'bg-orange-500', icon: Handshake, order: 5 },
  won: { label: 'Won', color: 'bg-emerald-500', icon: Trophy, order: 6 },
  lost: { label: 'Lost', color: 'bg-red-500', icon: XCircle, order: 7 },
  archived: { label: 'Archived', color: 'bg-gray-500', icon: Archive, order: 8 },
}

// Kanban columns (excludes won/lost/archived - those are end states)
export const KANBAN_STATUSES: LeadStatus[] = ['new', 'contacted', 'responded', 'meeting', 'proposal_sent', 'negotiating']

// Website quality config
export const WEBSITE_QUALITY: Record<WebsiteQuality, { label: string; color: string }> = {
  none: { label: 'No Website', color: 'bg-red-500 text-white' },
  terrible: { label: 'Terrible', color: 'bg-red-400 text-white' },
  poor: { label: 'Poor', color: 'bg-orange-500 text-white' },
  mediocre: { label: 'Mediocre', color: 'bg-yellow-500 text-black' },
  decent: { label: 'Decent', color: 'bg-lime-500 text-white' },
  good: { label: 'Good', color: 'bg-emerald-500 text-white' },
}

// Contact methods
export const CONTACT_METHODS: Record<ContactMethod, { label: string; icon: LucideIcon }> = {
  phone: { label: 'Phone', icon: Phone },
  email: { label: 'Email', icon: Mail },
  in_person: { label: 'In Person', icon: User },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle },
  facebook: { label: 'Facebook', icon: Facebook },
  instagram: { label: 'Instagram', icon: Instagram },
}

// Activity types
export const ACTIVITY_TYPES: Record<ActivityType, { label: string; icon: LucideIcon }> = {
  note: { label: 'Note', icon: StickyNote },
  call: { label: 'Call', icon: PhoneCall },
  email: { label: 'Email', icon: Mail },
  meeting: { label: 'Meeting', icon: CalendarCheck },
  visit: { label: 'Visit', icon: MapPin },
  status_change: { label: 'Status Change', icon: Clock },
  proposal: { label: 'Proposal', icon: FileText },
  other: { label: 'Other', icon: MoreHorizontal },
}

// Category list for dropdowns
export const CATEGORY_OPTIONS = Object.entries(CATEGORIES).map(([value, { label }]) => ({
  value: value as BusinessCategory,
  label,
}))

// Status list for dropdowns
export const STATUS_OPTIONS = Object.entries(PIPELINE_STAGES)
  .sort(([, a], [, b]) => a.order - b.order)
  .map(([value, { label }]) => ({
    value: value as LeadStatus,
    label,
  }))

// Website quality list for dropdowns
export const WEBSITE_QUALITY_OPTIONS = Object.entries(WEBSITE_QUALITY).map(([value, { label }]) => ({
  value: value as WebsiteQuality,
  label,
}))

// Priority options
export const PRIORITY_OPTIONS = [
  { value: 1, label: '1 - Low' },
  { value: 2, label: '2' },
  { value: 3, label: '3 - Medium' },
  { value: 4, label: '4' },
  { value: 5, label: '5 - High' },
] as const
