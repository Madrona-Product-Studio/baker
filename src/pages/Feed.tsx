import { useState } from 'react';
import { CheckInCard } from '../components/CheckInCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { useCheckIns } from '../hooks/useCheckIns';
import { useTripPlan } from '../hooks/useTripPlan';

type TimeFilter = 'today' | 'week';
type RouteFilter = 'all' | 'mine';

export function Feed() {
  const { checkIns } = useCheckIns();
  const { plan } = useTripPlan();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [routeFilter, setRouteFilter] = useState<RouteFilter>('all');

  const now = Date.now();
  const filtered = checkIns.filter((c) => {
    const age = now - new Date(c.timestamp).getTime();
    if (timeFilter === 'today' && age > 24 * 60 * 60 * 1000) return false;
    if (timeFilter === 'week' && age > 7 * 24 * 60 * 60 * 1000) return false;
    if (routeFilter === 'mine' && plan && c.route !== plan.route) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <OfflineBanner />

      <div className="px-4 pt-6">
        <h2 className="font-mono text-lg font-bold text-primary">Trail Feed</h2>
        <p className="text-sm text-secondary mt-1">Conditions from other hikers</p>
      </div>

      <div className="px-4 flex gap-2">
        <div className="flex bg-surface border border-white/5 rounded-lg overflow-hidden text-xs font-mono">
          {(['all', 'mine'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setRouteFilter(v)}
              className={`px-3 py-1.5 transition-colors ${routeFilter === v ? 'bg-baker-blue text-white' : 'text-secondary'}`}
            >
              {v === 'all' ? 'All trails' : 'My route'}
            </button>
          ))}
        </div>
        <div className="flex bg-surface border border-white/5 rounded-lg overflow-hidden text-xs font-mono">
          {(['today', 'week'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setTimeFilter(v)}
              className={`px-3 py-1.5 transition-colors ${timeFilter === v ? 'bg-baker-blue text-white' : 'text-secondary'}`}
            >
              {v === 'today' ? 'Today' : 'This week'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-3 pb-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary text-sm">No reports yet for today.</p>
            <p className="text-secondary text-xs mt-1">Be the first — check in on your way down.</p>
          </div>
        ) : (
          filtered.map((c) => <CheckInCard key={c.id} checkIn={c} />)
        )}
      </div>
    </div>
  );
}
