import { api } from '@/lib/api'
import type { BusinessCategory } from '@/types'

export interface PlaceResult {
  placeId: string
  name: string
  address: string
  city: string
  phone?: string
  website?: string
  googleMapsUrl?: string
  rating?: number
  reviewCount?: number
  category: BusinessCategory
  primaryType?: string
  location?: {
    lat: number
    lng: number
  }
}

interface GooglePlaceResponse {
  places?: Array<{
    id: string
    displayName?: { text: string }
    formattedAddress?: string
    nationalPhoneNumber?: string
    internationalPhoneNumber?: string
    websiteUri?: string
    googleMapsUri?: string
    rating?: number
    userRatingCount?: number
    primaryType?: string
    primaryTypeDisplayName?: { text: string }
    addressComponents?: Array<{
      longText: string
      types: string[]
    }>
    location?: {
      latitude: number
      longitude: number
    }
  }>
}

const TYPE_TO_CATEGORY: Record<string, BusinessCategory> = {
  restaurant: 'restaurant',
  cafe: 'restaurant',
  bakery: 'restaurant',
  bar: 'restaurant',
  meal_delivery: 'restaurant',
  meal_takeaway: 'restaurant',
  food: 'restaurant',
  hair_salon: 'salon',
  beauty_salon: 'salon',
  hair_care: 'salon',
  spa: 'salon',
  nail_salon: 'salon',
  car_repair: 'mechanic',
  car_dealer: 'mechanic',
  car_wash: 'mechanic',
  auto_parts_store: 'mechanic',
  lawyer: 'professional',
  dentist: 'professional',
  doctor: 'professional',
  accounting: 'professional',
  insurance_agency: 'professional',
  real_estate_agency: 'real_estate',
  gym: 'fitness',
  fitness_center: 'fitness',
  clothing_store: 'retail',
  shoe_store: 'retail',
  jewelry_store: 'retail',
  shopping_mall: 'retail',
  store: 'retail',
  hardware_store: 'construction',
  electrician: 'construction',
  plumber: 'construction',
  roofing_contractor: 'construction',
  general_contractor: 'construction',
  hospital: 'health',
  pharmacy: 'health',
  physiotherapist: 'health',
  veterinary_care: 'health',
}

function mapCategory(primaryType?: string): BusinessCategory {
  if (!primaryType) return 'other'
  return TYPE_TO_CATEGORY[primaryType] || 'other'
}

function extractCity(addressComponents?: Array<{ longText: string; types?: string[] }>): string {
  if (!addressComponents) return ''
  const city = addressComponents.find((c) =>
    c.types?.includes('locality') || c.types?.includes('administrative_area_level_1')
  )
  return city?.longText || ''
}

export async function searchPlaces(
  query: string,
  options?: {
    locationBias?: { lat: number; lng: number; radius: number }
    pageSize?: number
  }
): Promise<PlaceResult[]> {
  const body: Record<string, unknown> = {
    textQuery: query,
    pageSize: options?.pageSize || 20,
    languageCode: 'ro',
  }

  if (options?.locationBias) {
    body.locationBias = {
      circle: {
        center: {
          latitude: options.locationBias.lat,
          longitude: options.locationBias.lng,
        },
        radius: options.locationBias.radius,
      },
    }
  }

  // Call our backend proxy (key is server-side)
  const data = await api.post<GooglePlaceResponse>('/places/search', body)

  if (!data.places) return []

  return data.places.map((place) => ({
    placeId: place.id,
    name: place.displayName?.text || '',
    address: place.formattedAddress || '',
    city: extractCity(place.addressComponents),
    phone: place.internationalPhoneNumber || place.nationalPhoneNumber,
    website: place.websiteUri,
    googleMapsUrl: place.googleMapsUri,
    rating: place.rating,
    reviewCount: place.userRatingCount,
    category: mapCategory(place.primaryType),
    primaryType: place.primaryTypeDisplayName?.text || place.primaryType,
    location: place.location
      ? { lat: place.location.latitude, lng: place.location.longitude }
      : undefined,
  }))
}
