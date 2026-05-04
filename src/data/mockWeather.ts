import type { CachedWeather } from '../lib/storage';

export const MOCK_WEATHER: CachedWeather = {
  forecast: 'Partly cloudy, high of 52°F. Winds W 15-25 mph above 5,000 ft. Chance of afternoon showers.',
  avalancheRisk: 'moderate',
  avalancheSummary: 'Moderate avalanche danger above 5,500 ft on north-facing slopes. Wind slabs possible near ridgelines. Safe travel practices recommended.',
  updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
};
