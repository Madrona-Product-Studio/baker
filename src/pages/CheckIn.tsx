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
          <div className="w-12 h-12 rounded-full bg-trail/15 text-trail flex items-center justify-center mx-auto mb-4 text-xl">✓</div>
          <h2 className="font-sans text-lg font-semibold text-forest">Check-in saved</h2>
          <p className="text-sm text-stone mt-2 max-w-xs mx-auto">
            It'll sync when you're back in range — and share automatically with nearby hikers.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="bg-cream border border-snow text-forest font-mono text-sm px-6 py-3 rounded-md active:bg-snow"
        >
          New check-in
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-5">
      <div>
        <h2 className="font-sans text-lg font-semibold text-forest">Check In</h2>
        <p className="text-sm text-stone mt-1">Share conditions for hikers behind you</p>
      </div>

      <div className="bg-cream border border-snow rounded-md p-3 flex items-center gap-2">
        <MapPin size={16} className="text-trail shrink-0" />
        {lat && lng ? (
          <span className="text-xs text-stone font-mono">
            {lat.toFixed(4)}°N, {Math.abs(lng).toFixed(4)}°W
          </span>
        ) : locError ? (
          <span className="text-xs text-sun">Location unavailable — select waypoint below</span>
        ) : (
          <span className="text-xs text-stone">Getting location...</span>
        )}
      </div>

      <div>
        <label className="block text-xs text-stone mb-1 font-mono uppercase tracking-wider">Waypoint</label>
        <select
          value={waypoint}
          onChange={(e) => setWaypoint(e.target.value)}
          className="w-full bg-alpine border border-stone/30 rounded-md px-3 py-2.5 text-sm text-forest focus:border-trail"
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
        <label className="block text-xs text-stone mb-2 font-mono uppercase tracking-wider">Condition</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: 'good', label: 'All good', active: 'border-trail bg-trail/10', dot: 'bg-trail' },
            { value: 'heads-up', label: 'Heads up', active: 'border-sun bg-sun/10', dot: 'bg-sun' },
            { value: 'turn-back', label: 'Turn back', active: 'border-alert bg-alert/10', dot: 'bg-alert' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCondition(opt.value)}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-md border text-sm transition-colors ${
                condition === opt.value
                  ? `${opt.active} text-forest`
                  : 'border-snow bg-cream text-stone'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${opt.dot}`} />
              <span className="font-mono text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-stone mb-1 font-mono uppercase tracking-wider">
          Note <span className="text-stone/60">({140 - note.length} chars left)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 140))}
          rows={3}
          placeholder="Trail conditions, hazards..."
          className="w-full bg-alpine border border-stone/30 rounded-md px-3 py-2.5 text-sm text-forest placeholder:text-stone/50 resize-none focus:border-trail"
        />
      </div>

      <div className="relative">
        {animating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-trail/30 animate-ping" />
          </div>
        )}
        <button
          ref={btnRef}
          onClick={handleSubmit}
          disabled={!condition}
          className="w-full bg-trail text-cream font-mono text-sm py-3 rounded-md active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed relative z-10"
        >
          Submit Check-In
        </button>
      </div>
    </div>
  );
}
