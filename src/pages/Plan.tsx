import { useState } from 'react';
import { Share2, Trash2, Pencil } from 'lucide-react';
import { useTripPlan } from '../hooks/useTripPlan';
import { TRAILS } from '../data/trails';
import type { TripPlan } from '../lib/storage';

function formatDT(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export function Plan() {
  const { plan, save, clear } = useTripPlan();
  const [editing, setEditing] = useState(!plan);
  const [form, setForm] = useState<Partial<TripPlan>>(plan ?? { route: '', partySize: 1 });

  const set = (key: keyof TripPlan, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.route || !form.departureTime || !form.expectedReturn) return;
    const full: TripPlan = {
      route: form.route!,
      partySize: form.partySize ?? 1,
      departureTime: form.departureTime!,
      expectedReturn: form.expectedReturn!,
      emergencyContactName: form.emergencyContactName ?? '',
      emergencyContactPhone: form.emergencyContactPhone ?? '',
      savedAt: new Date().toISOString(),
    };
    save(full);
    setEditing(false);
  };

  const handleShare = async () => {
    if (!plan) return;
    const trail = TRAILS.find((t) => t.id === plan.route);
    const text = [
      `🏔 HikerLink Trip Plan`,
      `Route: ${trail?.name ?? plan.route}`,
      `Party size: ${plan.partySize}`,
      `Departure: ${formatDT(plan.departureTime)}`,
      `Expected return: ${formatDT(plan.expectedReturn)}`,
      plan.emergencyContactName && `Emergency contact: ${plan.emergencyContactName} ${plan.emergencyContactPhone}`,
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      await navigator.share({ title: 'HikerLink Trip Plan', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Trip plan copied to clipboard');
    }
  };

  if (plan && !editing) {
    const trail = TRAILS.find((t) => t.id === plan.route);
    return (
      <div className="px-4 pt-6 space-y-4">
        <h2 className="font-mono text-lg font-bold text-primary">Trip Plan</h2>

        <div className="bg-surface border border-white/5 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-sm text-primary">{trail?.name}</p>
              <p className="text-xs text-secondary">{trail?.distance} · {trail?.elevation}</p>
            </div>
            <span className="text-[10px] text-secondary">Saved {formatDT(plan.savedAt)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-secondary">Party size</p>
              <p className="text-primary">{plan.partySize}</p>
            </div>
            <div>
              <p className="text-xs text-secondary">Departure</p>
              <p className="text-primary">{formatDT(plan.departureTime)}</p>
            </div>
            <div>
              <p className="text-xs text-secondary">Expected return</p>
              <p className="text-primary">{formatDT(plan.expectedReturn)}</p>
            </div>
            {plan.emergencyContactName && (
              <div>
                <p className="text-xs text-secondary">Emergency contact</p>
                <p className="text-primary">{plan.emergencyContactName}</p>
                <p className="text-xs text-secondary">{plan.emergencyContactPhone}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 bg-baker-blue text-white font-mono text-sm py-3 rounded-lg flex items-center justify-center gap-2 active:opacity-80"
          >
            <Share2 size={16} /> Share Plan
          </button>
          <button
            onClick={() => { setForm(plan); setEditing(true); }}
            className="bg-surface border border-white/10 text-primary font-mono text-sm px-4 py-3 rounded-lg flex items-center gap-2 active:bg-white/5"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => { clear(); setEditing(true); setForm({ route: '', partySize: 1 }); }}
            className="bg-surface border border-red-900/30 text-red-400 font-mono text-sm px-4 py-3 rounded-lg flex items-center gap-2 active:bg-red-900/20"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <h2 className="font-mono text-lg font-bold text-primary">Trip Plan</h2>
      <p className="text-sm text-secondary">Set your trip before you leave. This is what gets shared with SAR if something goes wrong.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-secondary mb-1 font-mono">Route</label>
          <select
            value={form.route ?? ''}
            onChange={(e) => set('route', e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary"
          >
            <option value="">Select a trail...</option>
            {TRAILS.map((t) => (
              <option key={t.id} value={t.id}>{t.name} — {t.distance}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-secondary mb-1 font-mono">Party size</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => set('partySize', Math.max(1, (form.partySize ?? 1) - 1))}
              className="w-10 h-10 bg-surface border border-white/10 rounded-lg text-primary text-lg"
            >
              −
            </button>
            <span className="font-mono text-primary text-lg w-8 text-center">{form.partySize ?? 1}</span>
            <button
              onClick={() => set('partySize', Math.min(12, (form.partySize ?? 1) + 1))}
              className="w-10 h-10 bg-surface border border-white/10 rounded-lg text-primary text-lg"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-secondary mb-1 font-mono">Departure time</label>
          <input
            type="datetime-local"
            value={form.departureTime?.slice(0, 16) ?? ''}
            onChange={(e) => set('departureTime', new Date(e.target.value).toISOString())}
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-secondary mb-1 font-mono">Expected return</label>
          <input
            type="datetime-local"
            value={form.expectedReturn?.slice(0, 16) ?? ''}
            onChange={(e) => set('expectedReturn', new Date(e.target.value).toISOString())}
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary"
          />
        </div>

        <div>
          <label className="block text-xs text-secondary mb-1 font-mono">Emergency contact name</label>
          <input
            type="text"
            value={form.emergencyContactName ?? ''}
            onChange={(e) => set('emergencyContactName', e.target.value)}
            placeholder="Name"
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-secondary/50"
          />
        </div>

        <div>
          <label className="block text-xs text-secondary mb-1 font-mono">Emergency contact phone</label>
          <input
            type="tel"
            value={form.emergencyContactPhone ?? ''}
            onChange={(e) => set('emergencyContactPhone', e.target.value)}
            placeholder="(360) 555-0100"
            className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary placeholder:text-secondary/50"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!form.route || !form.departureTime || !form.expectedReturn}
          className="w-full bg-baker-blue text-white font-mono text-sm py-3 rounded-lg active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save Trip Plan
        </button>
      </div>
    </div>
  );
}
