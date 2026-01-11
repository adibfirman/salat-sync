export interface GeocodingResult {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  type: string;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name: string;
  type: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

// Debounce helper
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '8',
      type: 'city',
      featuretype: 'city',
    });

    // OSM Nominatim requires a User-Agent header
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'User-Agent': 'SalatSync/1.0 (prayer times app)',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const results: NominatimResult[] = await response.json();

    // Filter and map results to our format
    return results
      .filter((r) => {
        // Only include places that are cities/towns/villages
        const validTypes = ['city', 'town', 'village', 'administrative', 'locality'];
        return validTypes.includes(r.type) || r.address.city || r.address.town;
      })
      .map((r) => ({
        name: r.address.city || r.address.town || r.address.village || r.name,
        displayName: r.display_name,
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        country: r.address.country || '',
        countryCode: r.address.country_code?.toUpperCase() || '',
        type: r.type,
      }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

// Country code to timezone mapping (most common timezone per country)
const countryTimezones: Record<string, string> = {
  // Asia
  JP: 'Asia/Tokyo',
  CN: 'Asia/Shanghai',
  KR: 'Asia/Seoul',
  IN: 'Asia/Kolkata',
  ID: 'Asia/Jakarta',
  MY: 'Asia/Kuala_Lumpur',
  SG: 'Asia/Singapore',
  TH: 'Asia/Bangkok',
  VN: 'Asia/Ho_Chi_Minh',
  PH: 'Asia/Manila',
  PK: 'Asia/Karachi',
  BD: 'Asia/Dhaka',
  NP: 'Asia/Kathmandu',
  LK: 'Asia/Colombo',
  MM: 'Asia/Yangon',
  KH: 'Asia/Phnom_Penh',
  LA: 'Asia/Vientiane',
  BN: 'Asia/Brunei',
  TW: 'Asia/Taipei',
  HK: 'Asia/Hong_Kong',
  MO: 'Asia/Macau',
  // Middle East
  SA: 'Asia/Riyadh',
  AE: 'Asia/Dubai',
  QA: 'Asia/Qatar',
  KW: 'Asia/Kuwait',
  BH: 'Asia/Bahrain',
  OM: 'Asia/Muscat',
  YE: 'Asia/Aden',
  JO: 'Asia/Amman',
  LB: 'Asia/Beirut',
  SY: 'Asia/Damascus',
  IQ: 'Asia/Baghdad',
  IR: 'Asia/Tehran',
  IL: 'Asia/Jerusalem',
  PS: 'Asia/Gaza',
  TR: 'Europe/Istanbul',
  // Africa
  EG: 'Africa/Cairo',
  MA: 'Africa/Casablanca',
  DZ: 'Africa/Algiers',
  TN: 'Africa/Tunis',
  LY: 'Africa/Tripoli',
  SD: 'Africa/Khartoum',
  NG: 'Africa/Lagos',
  KE: 'Africa/Nairobi',
  ZA: 'Africa/Johannesburg',
  ET: 'Africa/Addis_Ababa',
  TZ: 'Africa/Dar_es_Salaam',
  // Europe
  GB: 'Europe/London',
  FR: 'Europe/Paris',
  DE: 'Europe/Berlin',
  IT: 'Europe/Rome',
  ES: 'Europe/Madrid',
  PT: 'Europe/Lisbon',
  NL: 'Europe/Amsterdam',
  BE: 'Europe/Brussels',
  CH: 'Europe/Zurich',
  AT: 'Europe/Vienna',
  PL: 'Europe/Warsaw',
  CZ: 'Europe/Prague',
  HU: 'Europe/Budapest',
  RO: 'Europe/Bucharest',
  BG: 'Europe/Sofia',
  GR: 'Europe/Athens',
  SE: 'Europe/Stockholm',
  NO: 'Europe/Oslo',
  DK: 'Europe/Copenhagen',
  FI: 'Europe/Helsinki',
  IE: 'Europe/Dublin',
  RU: 'Europe/Moscow',
  UA: 'Europe/Kiev',
  // Americas
  US: 'America/New_York',
  CA: 'America/Toronto',
  MX: 'America/Mexico_City',
  BR: 'America/Sao_Paulo',
  AR: 'America/Buenos_Aires',
  CL: 'America/Santiago',
  CO: 'America/Bogota',
  PE: 'America/Lima',
  VE: 'America/Caracas',
  // Oceania
  AU: 'Australia/Sydney',
  NZ: 'Pacific/Auckland',
  FJ: 'Pacific/Fiji',
};

// Get timezone from country code with longitude-based fallback
export function getTimezone(
  _latitude: number,
  longitude: number,
  countryCode: string
): string {
  // First try country-based lookup
  const countryTz = countryTimezones[countryCode];
  if (countryTz) {
    return countryTz;
  }

  // Fallback: estimate timezone from longitude
  // This creates IANA-compatible timezone strings
  const offset = Math.round(longitude / 15);
  // Note: Etc/GMT uses inverted sign convention
  return `Etc/GMT${offset <= 0 ? '+' : '-'}${Math.abs(offset)}`;
}

// Determine prayer calculation method based on country/region
export function getCalculationMethod(countryCode: string): number {
  const methodMap: Record<string, number> = {
    // Muslim World League
    DEFAULT: 3,
    // Islamic Society of North America
    US: 2,
    CA: 2,
    // Egyptian General Authority
    EG: 5,
    // Umm Al-Qura University, Makkah
    SA: 4,
    AE: 4,
    QA: 4,
    KW: 4,
    BH: 4,
    OM: 4,
    YE: 4,
    // University of Islamic Sciences, Karachi
    PK: 1,
    AF: 1,
    BD: 1,
    // Institute of Geophysics, University of Tehran
    IR: 7,
    // Shia Ithna-Ashari, Leva Institute, Qum
    IQ: 0,
    // Gulf Region
    // Ministry of Religious Affairs, Indonesia
    ID: 11,
    MY: 3,
    SG: 11,
    BN: 11,
    // Diyanet Isleri Baskanligi, Turkey
    TR: 13,
    // Spiritual Administration of Muslims of Russia
    RU: 14,
    // Moonsighting Committee Worldwide
    GB: 3,
    DE: 3,
    FR: 3,
    NL: 3,
    BE: 3,
  };

  return methodMap[countryCode] ?? methodMap.DEFAULT;
}
