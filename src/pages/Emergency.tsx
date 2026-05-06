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
      <div className="bg-alert/10 border-b border-alert/20 px-4 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={24} className="text-alert" />
          <h2 className="font-sans text-xl font-semibold text-alert tracking-wider">EMERGENCY</h2>
        </div>
      </div>

      <div className="px-4 space-y-3">
        <a
          href="tel:911"
          className="block w-full bg-alert text-cream font-mono text-lg py-4 rounded-md text-center font-bold active:opacity-80"
        >
          <Phone size={20} className="inline mr-2 -mt-1" />
          Call 911
        </a>

        <div className="bg-cream border border-snow rounded-lg p-4 space-y-2">
          <h3 className="font-mono text-sm font-medium text-forest">Emergency SOS via Satellite</h3>
          <p className="text-xs text-stone leading-relaxed">
            iPhone 14 or later: point your phone at open sky and hold the side button.
            Go to Settings → Emergency SOS to configure.
          </p>
        </div>

        <a
          href="tel:+13606766911"
          className="block w-full bg-cream border border-snow text-forest font-mono text-sm py-3 rounded-md text-center active:bg-snow"
        >
          <Phone size={16} className="inline mr-2 -mt-0.5" />
          Whatcom County SAR — (360) 676-6911
        </a>
      </div>

      <div className="px-4">
        <div className="bg-cream border border-snow rounded-lg p-4 space-y-3">
          <h3 className="font-mono text-sm font-medium text-forest">Your Trip Plan</h3>
          {plan && trail ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone">Route</span>
                <span className="text-forest font-mono">{trail.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Party size</span>
                <span className="text-forest font-mono">{plan.partySize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Departure</span>
                <span className="text-forest font-mono">{formatDT(plan.departureTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Expected return</span>
                <span className="text-forest font-mono">{formatDT(plan.expectedReturn)}</span>
              </div>
              {plan.emergencyContactName && (
                <div className="flex justify-between">
                  <span className="text-stone">Emergency contact</span>
                  <span className="text-forest font-mono">
                    {plan.emergencyContactName} — {plan.emergencyContactPhone}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-sun">
              No trip plan saved. Set one before you head out — it could save your life.
            </p>
          )}
        </div>
      </div>

      <div className="px-4">
        <div className="bg-cream border border-snow rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Navigation size={16} className="text-trail" />
            <h3 className="font-mono text-sm font-medium text-forest">Last Known Location</h3>
          </div>
          {lat && lng ? (
            <p className="font-mono text-lg text-forest">
              {lat.toFixed(5)}°N, {Math.abs(lng).toFixed(5)}°W
            </p>
          ) : (
            <p className="text-sm text-stone">Acquiring GPS signal...</p>
          )}
          <p className="text-[10px] text-stone">Updates every 30 seconds</p>
        </div>
      </div>
    </div>
  );
}
