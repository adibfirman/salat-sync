import { useState, useEffect, useMemo, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import type { City } from "~/types";

interface CitySelectorProps {
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

interface CityGroup {
  timezone: string;
  label: string;
  cities: City[];
}

export default function CitySelector({
  selectedCity,
  onSelectCity,
}: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Load cities from JSON
    fetch("/data/cities.json")
      .then((res) => res.json())
      .then((data) => setCities(data.cities))
      .catch((err) => console.error("Failed to load cities:", err));
  }, []);

  // Group cities by timezone
  const groupedCities = useMemo<CityGroup[]>(() => {
    const groups = cities.reduce((acc: Record<string, City[]>, city) => {
      const tzLabel = city.timezoneLabel || city.timezone;
      if (!acc[tzLabel]) {
        acc[tzLabel] = [];
      }
      acc[tzLabel].push(city);
      return acc;
    }, {});

    return Object.entries(groups).map(([label, cities]) => ({
      timezone: cities[0].timezone,
      label,
      cities,
    }));
  }, [cities]);

  // Filter cities based on search query
  const filteredGroups = useMemo(() => {
    if (query === "") {
      return groupedCities;
    }

    const lowerQuery = query.toLowerCase();
    return groupedCities
      .map((group) => ({
        ...group,
        cities: group.cities.filter((city) =>
          city.name.toLowerCase().includes(lowerQuery),
        ),
      }))
      .filter((group) => group.cities.length > 0);
  }, [groupedCities, query]);

  const handleSelectCity = (city: City | null) => {
    if (city) {
      onSelectCity(city);
      setQuery("");
    }
  };

  return (
    <Listbox value={selectedCity} onChange={handleSelectCity}>
      <div className="relative w-full">
        <ListboxButton
          className="relative w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                   text-left cursor-pointer"
        >
          <span className="block truncate">
            {selectedCity?.name || "Search or find your city..."}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </ListboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <ListboxOptions
            className="absolute z-10 mt-1 w-full max-h-96 rounded-lg 
                     bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 
                     focus:outline-none overflow-hidden"
          >
            {/* Search input inside dropdown */}
            <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                placeholder="Search your city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-80 overflow-auto">
              {filteredGroups.length === 0 && query !== "" ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  Kota tidak ditemukan.
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div key={group.timezone}>
                    <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {group.label}
                    </div>
                    {group.cities.map((city) => (
                      <ListboxOption
                        key={city.slug}
                        value={city}
                        className={({ focus, selected }) =>
                          `relative cursor-pointer select-none px-8 py-3 ${
                            focus
                              ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100"
                              : "text-gray-900 dark:text-gray-100"
                          } ${selected ? "bg-emerald-500 text-white" : ""}`
                        }
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <span
                              className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}
                            >
                              {city.name}
                            </span>
                            {selected && (
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                      </ListboxOption>
                    ))}
                  </div>
                ))
              )}
            </div>
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
