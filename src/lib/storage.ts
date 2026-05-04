export interface TripPlan {
  route: string;
  partySize: number;
  departureTime: string;
  expectedReturn: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  savedAt: string;
}

export interface CheckIn {
  id: string;
  route: string;
  waypoint: string;
  condition: 'good' | 'heads-up' | 'turn-back';
  note: string;
  photoUrl?: string;
  timestamp: string;
  lat?: number;
  lng?: number;
  source: 'self' | 'peer' | 'network';
}

export interface CachedWeather {
  forecast: string;
  avalancheRisk: 'low' | 'moderate' | 'considerable' | 'high' | 'extreme';
  avalancheSummary: string;
  updatedAt: string;
}

const KEYS = {
  tripPlan: 'baker:tripPlan',
  checkIns: 'baker:checkIns',
  weather: 'baker:weather',
} as const;

function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string): void {
  localStorage.removeItem(key);
}

export const storage = {
  getTripPlan: () => get<TripPlan>(KEYS.tripPlan),
  saveTripPlan: (plan: TripPlan) => set(KEYS.tripPlan, plan),
  clearTripPlan: () => remove(KEYS.tripPlan),

  getCheckIns: () => get<CheckIn[]>(KEYS.checkIns) ?? [],
  saveCheckIn: (checkIn: CheckIn) => {
    const existing = get<CheckIn[]>(KEYS.checkIns) ?? [];
    existing.unshift(checkIn);
    set(KEYS.checkIns, existing);
  },

  getWeather: () => get<CachedWeather>(KEYS.weather),
  saveWeather: (weather: CachedWeather) => set(KEYS.weather, weather),
};
