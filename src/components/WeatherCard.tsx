import { Cloud, AlertTriangle } from 'lucide-react';
import type { CachedWeather } from '../lib/storage';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const RISK_COLORS: Record<string, string> = {
  low: 'text-trail',
  moderate: 'text-sun',
  considerable: 'text-sun',
  high: 'text-alert',
  extreme: 'text-alert font-bold',
};

export function WeatherCard({ weather }: { weather: CachedWeather }) {
  return (
    <div className="bg-cream border border-snow rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud size={18} className="text-trail" />
          <h3 className="font-mono text-sm font-medium text-forest">Mt. Baker Conditions</h3>
        </div>
        <span className="text-xs text-stone">Updated {timeAgo(weather.updatedAt)}</span>
      </div>

      <p className="text-sm text-stone leading-relaxed">{weather.forecast}</p>

      <div className="flex items-start gap-2 bg-sun/10 rounded-md p-3">
        <AlertTriangle size={16} className="text-sun shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-mono text-forest">
            Avalanche risk:{' '}
            <span className={RISK_COLORS[weather.avalancheRisk]}>
              {weather.avalancheRisk.toUpperCase()}
            </span>
          </p>
          <p className="text-xs text-stone mt-1">{weather.avalancheSummary}</p>
        </div>
      </div>
    </div>
  );
}
