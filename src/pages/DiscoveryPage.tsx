import { useRef, useState } from 'react'
import {
  Search,
  Plus,
  Check,
  Star,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
  Loader2,
  AlertCircle,
  List,
  Map as MapIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettingsStore } from '@/stores/settings-store'
import { useLeadsStore } from '@/stores/leads-store'
import { searchPlaces, type PlaceResult } from '@/lib/google-places'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ResultsMap } from '@/components/discovery/results-map'
import { useToast } from '@/hooks/use-toast'
import type { BusinessCategory } from '@/types'

export default function DiscoveryPage() {
  const { toast } = useToast()
  const { defaultCity } = useSettingsStore()
  const { leads, addLead } = useLeadsStore()

  const [query, setQuery] = useState('')
  const [city, setCity] = useState(defaultCity || 'București Sector 3')
  const [category, setCategory] = useState<string>('restaurant')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [view, setView] = useState<'list' | 'map'>('list')
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Check which results are already saved as leads
  const isAlreadySaved = (placeId: string) => {
    return leads.some((l) => l.googlePlaceId === placeId) || savedIds.has(placeId)
  }

  const handleSearch = async () => {
    const searchQuery = city
      ? `${category !== 'all' ? CATEGORIES[category as BusinessCategory]?.label + ' ' : ''}${query} in ${city}`
      : query

    if (!searchQuery.trim()) {
      setError('Enter a search query or city')
      return
    }

    setLoading(true)
    setError('')

    try {
      const places = await searchPlaces(searchQuery, {
        pageSize: 20,
      })
      setResults(places)
      if (places.length === 0) {
        setError('No results found. Try a different query.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAsLead = (place: PlaceResult) => {
    addLead({
      businessName: place.name,
      category: place.category,
      address: place.address,
      city: place.city || city,
      phone: place.phone,
      website: place.website,
      googleMapsUrl: place.googleMapsUrl,
      googlePlaceId: place.placeId,
      rating: place.rating,
      reviewCount: place.reviewCount,
      websiteQuality: place.website ? 'mediocre' : 'none',
      priority: 3,
      status: 'new',
      currency: 'EUR',
      notes: place.primaryType ? `Type: ${place.primaryType}` : '',
      tags: [],
    })
    setSavedIds((prev) => new Set(prev).add(place.placeId))
    toast({
      title: 'Lead saved',
      description: `${place.name} has been added to your leads.`,
    })
  }

  const unsavedResults = results.filter((r) => !isAlreadySaved(r.placeId))

  const handleSaveAll = () => {
    unsavedResults.forEach((place) => {
      addLead({
        businessName: place.name,
        category: place.category,
        address: place.address,
        city: place.city || city,
        phone: place.phone,
        website: place.website,
        googleMapsUrl: place.googleMapsUrl,
        googlePlaceId: place.placeId,
        rating: place.rating,
        reviewCount: place.reviewCount,
        websiteQuality: place.website ? 'mediocre' : 'none',
        priority: 3,
        status: 'new',
        currency: 'EUR',
        notes: place.primaryType ? `Type: ${place.primaryType}` : '',
        tags: [],
      })
    })
    setSavedIds((prev) => {
      const next = new Set(prev)
      unsavedResults.forEach((r) => next.add(r.placeId))
      return next
    })
    toast({
      title: `${unsavedResults.length} leads saved`,
      description: 'All businesses have been added to your leads.',
    })
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Discover Businesses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find local businesses that need websites.
        </p>
      </div>

      {/* Search Form */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="salon">Salon / Beauty</SelectItem>
              <SelectItem value="mechanic">Mechanic / Auto</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="real_estate">Real Estate</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="w-full sm:flex-1 sm:min-w-[200px]"
            placeholder="Search query (optional refinement)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Input
            className="w-full sm:w-[200px]"
            placeholder="City..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setView('list')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setView('map')}
              className="rounded-l-none"
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Map View */}
      {view === 'map' && results.length > 0 && (
        <ResultsMap
          results={results}
          onMarkerClick={(place) => {
            setHighlightedId(place.placeId)
            const card = cardRefs.current[place.placeId]
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            setTimeout(() => setHighlightedId(null), 3000)
          }}
        />
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {results.length} businesses found
            </p>
            {unsavedResults.length > 0 && (
              <Button size="sm" onClick={handleSaveAll}>
                <Plus className="h-4 w-4 mr-1" />
                Save All ({unsavedResults.length})
              </Button>
            )}
          </div>
          <div className="grid gap-3">
            {results.map((place) => {
              const saved = isAlreadySaved(place.placeId)
              const CategoryIcon = CATEGORIES[place.category]?.icon
              return (
                <Card
                  key={place.placeId}
                  ref={(el) => { cardRefs.current[place.placeId] = el }}
                  className={cn(
                    'p-4 transition-colors',
                    saved && 'opacity-60',
                    highlightedId === place.placeId && 'ring-2 ring-primary'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {CategoryIcon && (
                          <CategoryIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <h3 className="font-medium truncate">{place.name}</h3>
                        {place.primaryType && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {place.primaryType}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {place.address}
                        </span>
                        {place.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            {place.rating}
                            {place.reviewCount && (
                              <span className="text-xs">({place.reviewCount})</span>
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm">
                        {place.phone && (
                          <a
                            href={`tel:${place.phone}`}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {place.phone}
                          </a>
                        )}
                        {place.website ? (
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Has website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                            <Globe className="h-3.5 w-3.5" />
                            No website
                          </span>
                        )}
                        {place.googleMapsUrl && (
                          <a
                            href={place.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            Maps
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={saved ? 'secondary' : 'default'}
                      disabled={saved}
                      onClick={() => handleSaveAsLead(place)}
                      className="shrink-0"
                    >
                      {saved ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Save Lead
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && results.length === 0 && (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <div className="h-5 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-72 bg-muted animate-pulse rounded" />
                <div className="h-4 w-36 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
