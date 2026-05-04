interface Props {
  condition: 'good' | 'heads-up' | 'turn-back';
  size?: 'sm' | 'lg';
}

const CONFIG = {
  good: { label: 'All good', icon: '✅', classes: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50' },
  'heads-up': { label: 'Heads up', icon: '⚠️', classes: 'bg-amber-900/50 text-amber-300 border-amber-700/50' },
  'turn-back': { label: 'Turn back', icon: '🔴', classes: 'bg-red-900/50 text-red-300 border-red-700/50' },
} as const;

export function ConditionBadge({ condition, size = 'sm' }: Props) {
  const { label, icon, classes } = CONFIG[condition];
  const sizeClasses = size === 'lg' ? 'px-4 py-2 text-base' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${classes} ${sizeClasses}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
