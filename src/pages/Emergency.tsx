import { Phone, Navigation, AlertTriangle } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { useTripPlan } from '../hooks/useTripPlan';
import { TRAILS } from '../data/trails';

function formatDT(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export function Emergency() {
  const { lat, lng } = useLocation(true, 30000);
  const { plan } = useTripPlan();
  const trail = plan ? TRAILS.find((t) => t.id === plan.route) : null;

  return (
    <div className="space-y-4 pb-4">
      <div className="bg-red-950 px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={24} className="text-red-400" />
          <h2 className="font-mono text-xl font-bold text-red-100 tracking-wider">EMERGENCY</h2>
        </div>
      </div>

      <div className="px-4 space-y-3">
        <a
          href="tel:911"
          className="block w-full bg-signal-red text-white font-mono text-lg py-4 rounded-lg text-center font-bold active:opacity-80"
        >
          <Phone size={20} className="inline mr-2 -mt-1" />
          Call 911
        </a>

        <div className="bg-surface border border-white/5 rounded-lg p-4 space-y-2">
          <h3 className="font-mono text-sm font-medium text-primary">Emergency SOS via Satellite</h3>
          <p className="text-xs text-secondary leading-relaxed">
            iPhone 14 or later: point your phone at open sky and hold the side button.
            Go to Settings → Emergency SOS to configure.
          </p>
        </div>

        <a
          href="tel:+13606766911"
          className="block w-full bg-surface border border-white/10 text-primary font-mono text-sm py-3 rounded-lg text-center active:bg-white/5"
        >
          <Phone size={16} className="inline mr-2 -mt-0.5" />
          Whatcom County SAR — (360) 676-6911
        </a>
      </div>

      <div className="px-4">
        <div className="bg-surface border border-white/5 rounded-lg p-4 space-y-3">
          <h3 className="font-mono text-sm font-medium text-primary">Your Trip Plan</h3>
          {plan && trail ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Route</span>
                <span className="text-primary font-mono">{trail.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Party size</span>
                <span className="text-primary font-mono">{plan.partySize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Departure</span>
                <span className="text-primary font-mono">{formatDT(plan.departureTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Expected return</span>
                <span className="text-primary font-mono">{formatDT(plan.expectedReturn)}</span>
              </div>
              {plan.emergencyContactName && (
                <div className="flex justify-between">
                  <span className="text-secondary">Emergency contact</span>
                  <span className="text-primary font-mono">
                    {plan.emergencyContactName} — {plan.emergencyContactPhone}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-amber-400">
              No trip plan saved. Set one before you head out — it could save your life.
            </p>
          )}
        </div>
      </div>

      <div className="px-4">
        <div className="bg-surface border border-white/5 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Navigation size={16} className="text-baker-blue" />
            <h3 className="font-mono text-sm font-medium text-primary">Last Known Location</h3>
          </div>
          {lat && lng ? (
            <p className="font-mono text-lg text-primary">
              {lat.toFixed(5)}°N, {Math.abs(lng).toFixed(5)}°W
            </p>
          ) : (
            <p className="text-sm text-secondary">Acquiring GPS signal...</p>
          )}
          <p className="text-[10px] text-secondary">Updates every 30 seconds</p>
        </div>
      </div>
    </div>
  );
}
