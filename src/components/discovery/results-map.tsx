import { useEffect, useRef, useState } from 'react'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { api } from '@/lib/api'
import type { PlaceResult } from '@/lib/google-places'

interface ResultsMapProps {
  results: PlaceResult[]
  onMarkerClick?: (place: PlaceResult) => void
  center?: { lat: number; lng: number }
}

// Bucharest Sector 3 default center (Drumul Gura Fagetului area)
const DEFAULT_CENTER = { lat: 44.4058, lng: 26.1567 }

let apiConfigured = false

export function ResultsMap({ results, onMarkerClick, center }: ResultsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  const onMarkerClickRef = useRef(onMarkerClick)
  onMarkerClickRef.current = onMarkerClick

  // Load Google Maps
  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        if (!apiConfigured) {
          const { key } = await api.get<{ key: string }>('/config/maps-key')
          if (!key || cancelled) return
          setOptions({ key, v: 'weekly' })
          apiConfigured = true
        }

        const { Map } = await importLibrary('maps') as google.maps.MapsLibrary
        if (cancelled || !mapRef.current) return

        mapInstance.current = new Map(mapRef.current, {
          center: center || DEFAULT_CENTER,
          zoom: 14,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        })

        setLoaded(true)
      } catch (err) {
        console.error('Map load error:', err)
        setError('Failed to load map')
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  // Update center when prop changes
  useEffect(() => {
    if (mapInstance.current && center) {
      mapInstance.current.panTo(center)
    }
  }, [center])

  // Update markers when results change
  useEffect(() => {
    if (!mapInstance.current || !loaded) return

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    if (results.length === 0) return

    const bounds = new google.maps.LatLngBounds()

    results.forEach((place) => {
      if (!place.location) return

      const position = { lat: place.location.lat, lng: place.location.lng }
      bounds.extend(position)

      const hasWebsite = !!place.website
      const marker = new google.maps.Marker({
        map: mapInstance.current!,
        position,
        title: `${place.name}${hasWebsite ? '' : ' — No website'}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: hasWebsite ? '#f59e0b' : '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      })

      marker.addListener('click', () => {
        onMarkerClickRef.current?.(place)
      })

      markersRef.current.push(marker)
    })

    const locatedResults = results.filter((r) => r.location)
    if (locatedResults.length > 1) {
      mapInstance.current.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 })
    } else if (locatedResults[0]?.location) {
      mapInstance.current.panTo({ lat: locatedResults[0].location.lat, lng: locatedResults[0].location.lng })
      mapInstance.current.setZoom(15)
    }
  }, [results, loaded])

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px] rounded-lg border bg-muted/30 text-muted-foreground">
        {error}
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[500px] rounded-lg border" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg border bg-muted/30">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      {results.length > 0 && (
        <div className="absolute bottom-3 left-3 flex gap-2 text-xs">
          <span className="flex items-center gap-1 bg-background/90 backdrop-blur rounded-full px-2.5 py-1 border shadow-sm">
            <span className="h-3 w-3 rounded-full bg-red-500 inline-block" /> No website
          </span>
          <span className="flex items-center gap-1 bg-background/90 backdrop-blur rounded-full px-2.5 py-1 border shadow-sm">
            <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" /> Has website
          </span>
        </div>
      )}
    </div>
  )
}
