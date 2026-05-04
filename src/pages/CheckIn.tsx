import { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { useCheckIns } from '../hooks/useCheckIns';
import { useTripPlan } from '../hooks/useTripPlan';
import { TRAILS } from '../data/trails';

type Condition = 'good' | 'heads-up' | 'turn-back';

export function CheckIn() {
  const { lat, lng, error: locError } = useLocation();
  const { addCheckIn } = useCheckIns();
  const { plan } = useTripPlan();

  const [condition, setCondition] = useState<Condition | null>(null);
  const [waypoint, setWaypoint] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const selectedTrail = plan ? TRAILS.find((t) => t.id === plan.route) : null;

  const handleSubmit = () => {
    if (!condition) return;

    const checkIn = {
      id: crypto.randomUUID(),
      route: plan?.route ?? 'unknown',
      waypoint: waypoint || 'Unknown waypoint',
      condition,
      note,
      timestamp: new Date().toISOString(),
      lat: lat ?? undefined,
      lng: lng ?? undefined,
      source: 'self' as const,
    };

    addCheckIn(checkIn);
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setCondition(null);
    setWaypoint('');
    setNote('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="px-4 pt-6 space-y-6 text-center">
        <div className="py-12">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="font-mono text-lg font-bold text-primary">Check-in saved</h2>
          <p className="text-sm text-secondary mt-2 max-w-xs mx-auto">
            It'll sync when you're back in range — and share automatically with nearby hikers.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="bg-surface border border-white/10 text-primary font-mono text-sm px-6 py-3 rounded-lg active:bg-white/5"
        >
          New check-in
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-5">
      <div>
        <h2 className="font-mono text-lg font-bold text-primary">Check In</h2>
        <p className="text-sm text-secondary mt-1">Share conditions for hikers behind you</p>
      </div>

      <div className="bg-surface border border-white/5 rounded-lg p-3 flex items-center gap-2">
        <MapPin size={16} className="text-baker-blue shrink-0" />
        {lat && lng ? (
          <span className="text-xs text-secondary font-mono">
            {lat.toFixed(4)}°N, {Math.abs(lng).toFixed(4)}°W
          </span>
        ) : locError ? (
          <span className="text-xs text-amber-400">Location unavailable — select waypoint below</span>
        ) : (
          <span className="text-xs text-secondary">Getting location...</span>
        )}
      </div>

      <div>
        <label className="block text-xs text-secondary mb-1 font-mono">Waypoint</label>
        <select
          value={waypoint}
          onChange={(e) => setWaypoint(e.target.value)}
          className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary"
        >
          <option value="">Select waypoint...</option>
          {selectedTrail
            ? selectedTrail.waypoints.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))
            : TRAILS.map((t) => (
                <optgroup key={t.id} label={t.name}>
                  {t.waypoints.map((w) => (
                    <option key={`${t.id}-${w}`} value={w}>{w}</option>
                  ))}
                </optgroup>
              ))
          }
        </select>
      </div>

      <div>
        <label className="block text-xs text-secondary mb-2 font-mono">Condition</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: 'good', label: 'All good', icon: '✅' },
            { value: 'heads-up', label: 'Heads up', icon: '⚠️' },
            { value: 'turn-back', label: 'Turn back', icon: '🔴' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCondition(opt.value)}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-lg border text-sm transition-colors ${
                condition === opt.value
                  ? 'border-baker-blue bg-baker-blue/10 text-primary'
                  : 'border-white/10 bg-surface text-secondary'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="font-mono text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-secondary mb-1 font-mono">
          Note <span className="text-secondary/60">(optional, {140 - note.length} chars left)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 140))}
          rows={3}
          placeholder="Trail conditions, hazards, good vibes..."
          className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-secondary/50 resize-none"
        />
      </div>

      <div className="relative">
        {animating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-baker-blue/30 animate-ping" />
          </div>
        )}
        <button
          ref={btnRef}
          onClick={handleSubmit}
          disabled={!condition}
          className="w-full bg-baker-blue text-white font-mono text-sm py-3 rounded-lg active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed relative z-10"
        >
          Submit Check-In
        </button>
      </div>
    </div>
  );
}
