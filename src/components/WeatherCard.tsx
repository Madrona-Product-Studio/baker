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
  low: 'text-emerald-400',
  moderate: 'text-yellow-400',
  considerable: 'text-amber-400',
  high: 'text-red-400',
  extreme: 'text-red-300 font-bold',
};

export function WeatherCard({ weather }: { weather: CachedWeather }) {
  return (
    <div className="bg-surface border border-white/5 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud size={18} className="text-baker-blue" />
          <h3 className="font-mono text-sm font-medium text-primary">Mt. Baker Conditions</h3>
        </div>
        <span className="text-xs text-secondary">Updated {timeAgo(weather.updatedAt)}</span>
      </div>

      <p className="text-sm text-secondary leading-relaxed">{weather.forecast}</p>

      <div className="flex items-start gap-2 bg-white/5 rounded-md p-3">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-mono">
            Avalanche risk:{' '}
            <span className={RISK_COLORS[weather.avalancheRisk]}>
              {weather.avalancheRisk.toUpperCase()}
            </span>
          </p>
          <p className="text-xs text-secondary mt-1">{weather.avalancheSummary}</p>
        </div>
      </div>
    </div>
  );
}
