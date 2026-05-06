interface Props {
  condition: 'good' | 'heads-up' | 'turn-back';
  size?: 'sm' | 'lg';
}

const CONFIG = {
  good: { label: 'All good', classes: 'bg-trail/15 text-trail border-trail/30' },
  'heads-up': { label: 'Heads up', classes: 'bg-sun/20 text-bark border-sun/30' },
  'turn-back': { label: 'Turn back', classes: 'bg-alert/15 text-alert border-alert/30' },
} as const;

export function ConditionBadge({ condition, size = 'sm' }: Props) {
  const { label, classes } = CONFIG[condition];
  const sizeClasses = size === 'lg' ? 'px-4 py-2 text-base' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-mono font-medium ${classes} ${sizeClasses}`}>
      <span>{label}</span>
    </span>
  );
}
