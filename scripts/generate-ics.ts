import { writeFileSync, mkdirSync } from 'fs';
import { createEvents, EventAttributes } from 'ics';
import { format, addDays } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import citiesData from '../data/cities.json';

const DAYS_AHEAD = 30;
const OUTPUT_DIR = 'public/calendars';

interface City {
  slug: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  method: number;
}

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

async function fetchPrayerTimes(
  city: City,
  date: Date
): Promise<PrayerTimes> {
  const dateStr = format(date, 'dd-MM-yyyy');
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${city.latitude}&longitude=${city.longitude}&method=${city.method}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.timings;
  } catch (error) {
    console.error(`Error fetching times for ${city.name} on ${dateStr}:`, error);
    throw error;
  }
}

function parseTime(
  timeStr: string,
  date: Date,
  timezone: string
): [number, number, number, number, number] {
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Create a date object in the local time of the city's timezone
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0
  );
  
  // Convert the local time to UTC
  const utcDate = fromZonedTime(localDate, timezone);

  return [
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth() + 1,
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes()
  ];
}

async function generateCityCalendar(city: City): Promise<void> {
  console.log(`Generating calendar for ${city.name}...`);

  const events: EventAttributes[] = [];
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = addDays(new Date(), i);
    
    try {
      const times = await fetchPrayerTimes(city, date);

      for (const prayer of prayers) {
        const timeStr = times[prayer];
        const start = parseTime(timeStr, date, city.timezone);

        events.push({
          title: prayer,
          start,
          startInputType: 'utc',
          startOutputType: 'utc',
          duration: { minutes: 30 },
          status: 'CONFIRMED',
          transp: 'TRANSPARENT',
          uid: `${prayer.toLowerCase()}-${format(date, 'yyyyMMdd')}-${city.slug}@salat-sync`,
          description: `${prayer} prayer time for ${city.name}`,
          categories: ['Prayer'],
          calName: `Prayer Times - ${city.name}`,
        });
      }

      // Rate limiting: wait 200ms between API calls
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Skipping ${format(date, 'yyyy-MM-dd')} for ${city.name}`);
    }
  }

  if (events.length === 0) {
    console.error(`No events generated for ${city.slug}`);
    return;
  }

  const { value, error } = createEvents(events);

  if (error) {
    console.error(`Error creating events for ${city.slug}:`, error);
    return;
  }

  if (!value) {
    console.error(`No ICS value generated for ${city.slug}`);
    return;
  }

  writeFileSync(`${OUTPUT_DIR}/${city.slug}.ics`, value);
  console.log(`✓ Generated ${city.slug}.ics with ${events.length} events`);
}

async function main() {
  console.log('🕌 Salat-Sync Calendar Generator\n');

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const cities = citiesData.cities as City[];
  console.log(`Found ${cities.length} cities to process\n`);

  // Generate calendar for each city sequentially
  for (const city of cities) {
    await generateCityCalendar(city);
  }

  console.log('\n✓ All calendars generated successfully!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
