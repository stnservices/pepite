import { Router } from 'express'

const router = Router()

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || ''

router.post('/search', async (req, res) => {
  if (!GOOGLE_PLACES_API_KEY) {
    res.status(500).json({ error: 'Google Places API key not configured on server' })
    return
  }

  try {
    const { textQuery, pageSize, languageCode, locationBias } = req.body

    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.nationalPhoneNumber',
      'places.internationalPhoneNumber',
      'places.websiteUri',
      'places.googleMapsUri',
      'places.rating',
      'places.userRatingCount',
      'places.primaryType',
      'places.primaryTypeDisplayName',
      'places.addressComponents',
      'places.location',
    ].join(',')

    const body: Record<string, unknown> = {
      textQuery,
      pageSize: pageSize || 20,
      languageCode: languageCode || 'ro',
    }

    if (locationBias) {
      body.locationBias = locationBias
    }

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      res.status(response.status).json(data)
      return
    }

    res.json(data)
  } catch (err) {
    console.error('Places search error:', err)
    res.status(500).json({ error: 'Failed to search places' })
  }
})

export default router
