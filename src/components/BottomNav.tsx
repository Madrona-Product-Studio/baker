import { NavLink } from 'react-router-dom';
import { Mountain, ClipboardList, Radio, CheckCircle, ShieldAlert } from 'lucide-react';

const links = [
  { to: '/', icon: Mountain, label: 'Home' },
  { to: '/plan', icon: ClipboardList, label: 'Plan' },
  { to: '/feed', icon: Radio, label: 'Feed' },
  { to: '/checkin', icon: CheckCircle, label: 'Check In' },
  { to: '/emergency', icon: ShieldAlert, label: 'SOS' },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 bg-cream border-t border-snow pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-14">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] transition-colors duration-150 ${
                isActive
                  ? label === 'SOS'
                    ? 'text-alert'
                    : 'text-trail'
                  : label === 'SOS'
                    ? 'text-alert/50'
                    : 'text-stone'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
