import { WifiOff } from 'lucide-react';
import { useOffline } from '../hooks/useOffline';

export function OfflineBanner() {
  const offline = useOffline();

  if (!offline) return null;

  return (
    <div className="bg-sun/15 border-b border-sun/30 text-bark px-4 py-2 flex items-center gap-2 text-sm">
      <WifiOff size={16} />
      <span>You're offline — cached data shown</span>
    </div>
  );
}
