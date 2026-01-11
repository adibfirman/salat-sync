import { createEvents, type EventAttributes } from "ics";
import { format, addDays } from "date-fns";
import type { Route } from "./+types/generate-ics";

const DAYS_AHEAD = 30;

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

async function fetchPrayerTimes(
  latitude: string,
  longitude: string,
  method: string,
  date: Date
): Promise<PrayerTimes> {
  const dateStr = format(date, "dd-MM-yyyy");
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data.timings;
}

function parseTime(
  timeStr: string,
  date: Date
): [number, number, number, number, number] {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day, hours, minutes];
}

function createSlug(name: string, lat: string, lng: string): string {
  return `custom-${name.toLowerCase().replace(/\s+/g, "-")}-${parseFloat(lat).toFixed(2)}-${parseFloat(lng).toFixed(2)}`;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Extract query parameters
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  const method = url.searchParams.get("method") || "3";
  const tz = url.searchParams.get("tz") || "UTC";
  const name = url.searchParams.get("name") || "Custom Location";

  // Validate required parameters
  if (!lat || !lng) {
    return new Response("Missing required parameters: lat and lng", {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // Validate coordinates
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return new Response("Invalid coordinates: lat and lng must be numbers", {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return new Response("Invalid coordinates: lat must be -90 to 90, lng must be -180 to 180", {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  try {
    const events: EventAttributes[] = [];
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
    const slug = createSlug(name, lat, lng);

    // Fetch prayer times for the next 30 days
    for (let i = 0; i < DAYS_AHEAD; i++) {
      const date = addDays(new Date(), i);

      try {
        const times = await fetchPrayerTimes(lat, lng, method, date);

        for (const prayer of prayers) {
          const timeStr = times[prayer];
          if (!timeStr) continue;

          const start = parseTime(timeStr, date);

          events.push({
            title: prayer,
            start,
            duration: { minutes: 30 },
            uid: `${prayer.toLowerCase()}-${format(date, "yyyyMMdd")}-${slug}@salat-sync`,
            description: `${prayer} prayer time for ${name}`,
            categories: ["Prayer"],
            calName: `Prayer Times - ${name}`,
          });
        }

        // Rate limiting: small delay between API calls
        if (i < DAYS_AHEAD - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error fetching times for ${format(date, "yyyy-MM-dd")}:`, error);
        // Continue with other days even if one fails
      }
    }

    if (events.length === 0) {
      return new Response("Failed to generate calendar: no prayer times available", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Generate ICS content
    const { value, error } = createEvents(events);

    if (error || !value) {
      console.error("Error creating ICS:", error);
      return new Response("Failed to generate calendar file", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Return ICS file with proper headers
    const filename = `${name.replace(/[^a-zA-Z0-9-_]/g, "-")}.ics`;

    return new Response(value, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=43200", // 12 hours cache
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating ICS:", error);
    return new Response("Internal server error", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
