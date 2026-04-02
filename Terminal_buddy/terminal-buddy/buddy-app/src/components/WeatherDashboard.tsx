import React, { useState, useRef } from 'react';
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  MapPin,
  RefreshCw,
  AlertCircle,
  Search,
} from 'lucide-react';
import {
  useWeatherForCity,
  describeWeatherCode,
  weatherEmoji,
  compassDirection,
} from '../hooks/useWeather';
import './WeatherDashboard.css';

interface WeatherDashboardProps {
  /** Initial city to display on first load. Defaults to "New York". */
  defaultCity?: string;
}

/** Categorise UV index into a human-readable risk level */
function getUvCategory(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

/**
 * WeatherDashboard
 *
 * Displays real-time weather data fetched from the Open-Meteo API
 * (free, no API key required).  Designed to match the Terminal Buddy
 * aesthetic: dark OLED palette, Atkinson Hyperlegible font, WCAG AAA
 * contrast ratios.
 */
export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  defaultCity = 'New York',
}) => {
  const [inputValue, setInputValue] = useState(defaultCity);
  const [activeCity, setActiveCity] = useState(defaultCity);
  const inputRef = useRef<HTMLInputElement>(null);

  const { weather, loading, error, refresh } = useWeatherForCity(activeCity);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase() === activeCity.toLowerCase()) {
      refresh();
    } else {
      setActiveCity(trimmed);
    }
  };

  const uvPercent = weather ? Math.min((weather.uvIndex / 11) * 100, 100) : 0;

  const formattedTime = weather
    ? weather.updatedAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <section
      className="weather-dashboard"
      aria-label="Weather Dashboard"
      aria-live="polite"
      aria-busy={loading}
    >
      {/* ── Search ──────────────────────────────────────────── */}
      <form
        className="weather-search"
        onSubmit={handleSearch}
        role="search"
        aria-label="Search for a city's weather"
      >
        <label htmlFor="weather-city-input" className="sr-only">
          City name
        </label>
        <input
          id="weather-city-input"
          ref={inputRef}
          type="text"
          className="weather-search-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Enter a city (e.g. London, Tokyo)"
          autoComplete="off"
          spellCheck={false}
          aria-label="City name"
        />
        <button
          type="submit"
          className="weather-search-btn"
          aria-label="Search weather"
          disabled={loading}
        >
          <Search size={16} aria-hidden="true" />
          Search
        </button>
      </form>

      {/* ── Loading ──────────────────────────────────────────── */}
      {loading && (
        <div className="weather-loading" role="status" aria-label="Loading weather data">
          <div className="weather-spinner" aria-hidden="true" />
          <p>Fetching weather for {activeCity}…</p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="weather-error" role="alert">
          <AlertCircle className="weather-error-icon" aria-hidden="true" />
          <h3>Could not load weather</h3>
          <p>{error.message}</p>
          <button
            className="weather-retry-btn"
            onClick={refresh}
            aria-label="Retry fetching weather"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Try Again
          </button>
        </div>
      )}

      {/* ── Weather Data ─────────────────────────────────────── */}
      {!loading && !error && weather && (
        <>
          {/* Hero card */}
          <div className="weather-hero" aria-label={`Current weather in ${weather.location}`}>
            <div className="weather-location">
              <MapPin className="weather-location-icon" aria-hidden="true" />
              <span>{weather.location}</span>
            </div>

            <div className="weather-main">
              <span
                className="weather-emoji"
                role="img"
                aria-label={describeWeatherCode(weather.weatherCode)}
              >
                {weatherEmoji(weather.weatherCode, weather.isDay)}
              </span>

              <div className="weather-temp-block">
                <div className="weather-temp" aria-label={`${weather.temperature} degrees Fahrenheit`}>
                  {weather.temperature}
                  <span className="weather-temp-unit" aria-hidden="true">°F</span>
                </div>
                <div className="weather-condition">
                  {describeWeatherCode(weather.weatherCode)}
                </div>
                <div className="weather-feels-like">
                  Feels like {weather.feelsLike}°F
                </div>
              </div>
            </div>

            <p className="weather-updated">
              Updated at {formattedTime}
              {' · '}
              <button
                onClick={refresh}
                className="weather-retry-btn weather-retry-btn-inline"
                aria-label="Refresh weather data"
              >
                <RefreshCw size={12} aria-hidden="true" />
                Refresh
              </button>
            </p>
          </div>

          {/* Stats grid */}
          <div className="weather-stats" role="list" aria-label="Weather statistics">

            {/* Humidity */}
            <div className="weather-stat-card" role="listitem">
              <div className="weather-stat-label">
                <Droplets className="weather-stat-icon" aria-hidden="true" />
                Humidity
              </div>
              <div
                className="weather-stat-value"
                aria-label={`Humidity ${weather.humidity} percent`}
              >
                {weather.humidity}<span aria-hidden="true">%</span>
              </div>
              <div className="weather-stat-sub">Relative humidity</div>
            </div>

            {/* Wind */}
            <div className="weather-stat-card" role="listitem">
              <div className="weather-stat-label">
                <Wind className="weather-stat-icon" aria-hidden="true" />
                Wind
              </div>
              <div
                className="weather-stat-value"
                aria-label={`Wind speed ${weather.windSpeed} miles per hour`}
              >
                {weather.windSpeed}<span aria-hidden="true"> mph</span>
              </div>
              <div className="weather-stat-sub">
                {compassDirection(weather.windDirection)} · {weather.windDirection}°
              </div>
            </div>

            {/* Precipitation */}
            <div className="weather-stat-card" role="listitem">
              <div className="weather-stat-label">
                <Cloud className="weather-stat-icon" aria-hidden="true" />
                Precipitation
              </div>
              <div
                className="weather-stat-value"
                aria-label={`Precipitation ${weather.precipitation} millimeters`}
              >
                {weather.precipitation}<span aria-hidden="true"> mm</span>
              </div>
              <div className="weather-stat-sub">Current hour</div>
            </div>

            {/* UV Index */}
            <div className="weather-stat-card" role="listitem">
              <div className="weather-stat-label">
                <Sun className="weather-stat-icon" aria-hidden="true" />
                UV Index
              </div>
              <div
                className="weather-stat-value"
                aria-label={`UV index ${weather.uvIndex}`}
              >
                {weather.uvIndex.toFixed(1)}
              </div>
              <div className="uv-bar-track" aria-hidden="true">
                <div
                  className="uv-bar-fill"
                  style={{ width: `${uvPercent}%` }}
                />
              </div>
              <div className="weather-stat-sub">
                {getUvCategory(weather.uvIndex)}
              </div>
            </div>

            {/* Feels Like */}
            <div className="weather-stat-card" role="listitem">
              <div className="weather-stat-label">
                <Thermometer className="weather-stat-icon" aria-hidden="true" />
                Feels Like
              </div>
              <div
                className="weather-stat-value"
                aria-label={`Feels like ${weather.feelsLike} degrees Fahrenheit`}
              >
                {weather.feelsLike}<span aria-hidden="true">°F</span>
              </div>
              <div className="weather-stat-sub">Apparent temperature</div>
            </div>

          </div>

          {/* Attribution */}
          <p className="weather-attribution">
            Weather data provided by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open-Meteo (opens in new tab)"
            >
              Open-Meteo
            </a>{' '}
            — free &amp; open-source, no API key required.
          </p>
        </>
      )}
    </section>
  );
};

export default WeatherDashboard;
