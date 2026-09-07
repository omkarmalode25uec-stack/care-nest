import https from 'https';

/**
 * Google Places API Integration Service with Clean Adapter Pattern
 * 
 * Supports real Google Places API when GOOGLE_PLACES_API_KEY is configured.
 * When not configured, provides clearly labeled prototype reviews without scraping.
 */
class GooglePlacesService {
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || null;
  }

  /**
   * Check if live Google Places API key is configured
   */
  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim() !== '');
  }

  /**
   * Fetch Place Details & Reviews from Google Places API or return structured prototype fallback
   * @param {string} placeId - Google Place ID
   * @param {Array} fallbackReviews - Pre-seeded demo reviews
   * @param {number} fallbackRating - Fallback rating
   * @param {number} fallbackCount - Fallback review count
   */
  async getPlaceReviews(placeId, fallbackReviews = [], fallbackRating = 4.5, fallbackCount = 50) {
    if (!this.isConfigured() || !placeId) {
      return {
        isConfigured: false,
        source: 'prototype_demo',
        disclaimer: 'Google Places API key not configured. Displaying simulated reviews for Care Nest prototype demonstration.',
        googlePlaceId: placeId || null,
        rating: fallbackRating,
        reviewCount: fallbackCount,
        reviews: fallbackReviews.map((r) => ({
          author: r.author || 'Pilgrim Yatri',
          rating: r.rating || 5,
          text: r.text || '',
          date: r.date || 'Recent Kumbh stay',
          isDemo: true,
        })),
      };
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeId
      )}&fields=name,rating,user_ratings_total,reviews,url&key=${this.apiKey}`;

      const data = await this.httpGet(url);

      if (data.status === 'OK' && data.result) {
        const result = data.result;
        return {
          isConfigured: true,
          source: 'google_places_api',
          disclaimer: 'Reviews retrieved directly from Google Places API',
          googlePlaceId: placeId,
          googleMapsUrl: result.url || null,
          rating: result.rating || fallbackRating,
          reviewCount: result.user_ratings_total || fallbackCount,
          reviews: (result.reviews || []).map((r) => ({
            author: r.author_name,
            rating: r.rating,
            text: r.text,
            date: r.relative_time_description,
            profilePhotoUrl: r.profile_photo_url,
            isDemo: false,
          })),
        };
      } else {
        console.warn(`[GooglePlacesService] Place details returned status '${data.status}' for ID ${placeId}`);
        return {
          isConfigured: true,
          source: 'fallback_on_api_error',
          disclaimer: `Google API returned status: ${data.status}. Showing fallback review data.`,
          googlePlaceId: placeId,
          rating: fallbackRating,
          reviewCount: fallbackCount,
          reviews: fallbackReviews.map((r) => ({ ...r, isDemo: true })),
        };
      }
    } catch (error) {
      console.error('[GooglePlacesService] API request failed:', error.message);
      return {
        isConfigured: true,
        source: 'fallback_on_exception',
        disclaimer: 'Unable to reach Google Places API. Showing cached prototype reviews.',
        googlePlaceId: placeId,
        rating: fallbackRating,
        reviewCount: fallbackCount,
        reviews: fallbackReviews.map((r) => ({ ...r, isDemo: true })),
      };
    }
  }

  /**
   * Helper HTTP GET request
   */
  httpGet(url) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              resolve(jsonParse(body));
            } catch (e) {
              resolve({ status: 'PARSE_ERROR', raw: body });
            }
          });
        })
        .on('error', (err) => reject(err));
    });
  }
}

function jsonParse(str) {
  return JSON.parse(str);
}

export const googlePlacesService = new GooglePlacesService();
export default googlePlacesService;
