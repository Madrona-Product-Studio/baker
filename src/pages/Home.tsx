import { useNavigate } from 'react-router-dom';
import { Map, Radio, CheckCircle } from 'lucide-react';
import { WeatherCard } from '../components/WeatherCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { MOCK_WEATHER } from '../data/mockWeather';
import { storage } from '../lib/storage';

export function Home() {
  const navigate = useNavigate();
  const weather = storage.getWeather() ?? MOCK_WEATHER;

  return (
    <div className="space-y-6">
      <OfflineBanner />

      <div className="px-4 pt-6">
        <h1 className="font-mono text-2xl font-bold text-primary tracking-tight">HikerLink</h1>
        <p className="text-secondary text-sm mt-1 italic">Know before you go. And after.</p>
      </div>

      <div className="px-4">
        <WeatherCard weather={weather} />
      </div>

      <div className="px-4 grid grid-cols-3 gap-3">
        <button
          onClick={() => navigate('/plan')}
          className="bg-surface border border-white/5 rounded-lg p-4 flex flex-col items-center gap-2 active:bg-white/5 transition-colors"
        >
          <Map size={24} className="text-baker-blue" />
          <span className="text-xs text-primary font-mono">Trip Plan</span>
        </button>
        <button
          onClick={() => navigate('/feed')}
          className="bg-surface border border-white/5 rounded-lg p-4 flex flex-col items-center gap-2 active:bg-white/5 transition-colors"
        >
          <Radio size={24} className="text-baker-blue" />
          <span className="text-xs text-primary font-mono">Trail Feed</span>
        </button>
        <button
          onClick={() => navigate('/checkin')}
          className="bg-surface border border-white/5 rounded-lg p-4 flex flex-col items-center gap-2 active:bg-white/5 transition-colors"
        >
          <CheckCircle size={24} className="text-baker-blue" />
          <span className="text-xs text-primary font-mono">Check In</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <p className="text-[11px] text-secondary text-center">
          Mt. Baker, WA — 48.7768°N, 121.8144°W — Elev. 10,781 ft
        </p>
      </div>
    </div>
  );
}
