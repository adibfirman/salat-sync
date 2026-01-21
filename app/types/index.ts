export interface City {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  timezoneLabel?: string;
  myquranId: string;
}

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface DayPrayers {
  date: string;
  hijri: string;
  prayers: PrayerTimes;
}
