import { useState, useEffect, useCallback } from 'react';

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  uvIndex: number;
  precipitation: number;
  updatedAt: Date;
}

export interface WeatherError {
  message: string;
}

export interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: WeatherError | null;
  refresh: () => void;
}

/** Map WMO weather interpretation codes to human-readable descriptions */
export function describeWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Freezing Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 66 && code <= 67) return 'Freezing Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 85 && code <= 86) return 'Snow Showers';
  if (code === 95) return 'Thunderstorm';
  if (code >= 96 && code <= 99) return 'Thunderstorm with Hail';
  return 'Unknown';
}

/** Map WMO weather codes to a simple emoji for accessible visual cue */
export function weatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 2) return isDay ? '⛅' : '🌙';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

/** Wind direction degrees to compass label */
export function compassDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(degrees / 45) % 8;
  return dirs[idx];
}

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface OpenMeteoCurrentUnits {
  temperature_2m: string;
  apparent_temperature: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  weather_code: string;
  is_day: string;
  uv_index: string;
  precipitation: string;
}

interface OpenMeteoCurrentValues {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
  is_day: number;
  uv_index: number;
  precipitation: number;
}

interface OpenMeteoResponse {
  current_units: OpenMeteoCurrentUnits;
  current: OpenMeteoCurrentValues;
}

/**
 * Fetches weather data for a given city name using:
 * - Open-Meteo Geocoding API (free, no key)
 * - Open-Meteo Forecast API (free, no key)
 */
async function fetchWeather(city: string): Promise<WeatherData> {
  // Step 1: Geocode the city
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) {
    throw new Error(`Geocoding failed: ${geoRes.statusText}`);
  }
  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`City not found: "${city}"`);
  }
  const place: GeoResult = geoData.results[0];

  // Step 2: Fetch current weather
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${place.latitude}&longitude=${place.longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
    `wind_speed_10m,wind_direction_10m,weather_code,is_day,uv_index,precipitation` +
    `&wind_speed_unit=mph` +
    `&temperature_unit=fahrenheit` +
    `&timezone=auto`;

  const weatherRes = await fetch(weatherUrl);
  if (!weatherRes.ok) {
    throw new Error(`Weather fetch failed: ${weatherRes.statusText}`);
  }
  const weatherJson: OpenMeteoResponse = await weatherRes.json();
  const c = weatherJson.current;

  const locationLabel = place.admin1
    ? `${place.name}, ${place.admin1}, ${place.country}`
    : `${place.name}, ${place.country}`;

  return {
    location: locationLabel,
    latitude: place.latitude,
    longitude: place.longitude,
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: Math.round(c.wind_speed_10m),
    windDirection: c.wind_direction_10m,
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    uvIndex: c.uv_index,
    precipitation: c.precipitation,
    updatedAt: new Date(),
  };
}

/**
 * React hook for fetching and managing weather data.
 *
 * Uses the Open-Meteo API — completely free, no API key required.
 * Auto-refreshes every 10 minutes.
 */
export function useWeather(initialCity = 'New York'): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WeatherError | null>(null);

  // The actual re-fetch trigger: attach `initialCity` + a counter so we can force-refresh
  const [fetchCount, setFetchCount] = useState(0);

  const forceRefresh = useCallback(() => {
    setLoading(true);
    setFetchCount(n => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeather(initialCity);
        if (!cancelled) {
          setWeather(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError({ message: err instanceof Error ? err.message : String(err) });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    // Auto-refresh every 10 minutes
    const interval = setInterval(load, 10 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [initialCity, fetchCount]);

  return { weather, loading, error, refresh: forceRefresh };
}

/** Same hook but lets the consumer control the city externally */
export function useWeatherForCity(city: string): Omit<UseWeatherResult, 'refresh'> & { refresh: () => void } {
  const [fetchCount, setFetchCount] = useState(0);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WeatherError | null>(null);

  const refresh = useCallback(() => setFetchCount(n => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeather(city);
        if (!cancelled) setWeather(data);
      } catch (err) {
        if (!cancelled) {
          setError({ message: err instanceof Error ? err.message : String(err) });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [city, fetchCount]);

  return { weather, loading, error, refresh };
}
