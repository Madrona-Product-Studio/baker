import { Radio, Globe } from 'lucide-react';
import { ConditionBadge } from './ConditionBadge';
import { TRAILS } from '../data/trails';
import type { CheckIn } from '../lib/storage';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function CheckInCard({ checkIn }: { checkIn: CheckIn }) {
  const trail = TRAILS.find((t) => t.id === checkIn.route);

  return (
    <div className="bg-cream border border-snow rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-sm text-forest">{trail?.name ?? checkIn.route}</p>
          <p className="text-xs text-stone">{checkIn.waypoint}</p>
        </div>
        <ConditionBadge condition={checkIn.condition} />
      </div>

      {checkIn.note && (
        <p className="text-sm text-stone leading-relaxed">"{checkIn.note}"</p>
      )}

      <div className="flex items-center justify-between text-xs text-stone pt-1">
        <span>{timeAgo(checkIn.timestamp)}</span>
        <span className="flex items-center gap-1">
          {checkIn.source === 'peer' ? (
            <>
              <Radio size={12} /> Synced from nearby hiker
            </>
          ) : checkIn.source === 'network' ? (
            <>
              <Globe size={12} /> Loaded from network
            </>
          ) : (
            'Your check-in'
          )}
        </span>
      </div>
    </div>
  );
}
