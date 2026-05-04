import { useState, useCallback } from 'react';
import { storage, type TripPlan } from '../lib/storage';

export function useTripPlan() {
  const [plan, setPlan] = useState<TripPlan | null>(() => storage.getTripPlan());

  const save = useCallback((p: TripPlan) => {
    storage.saveTripPlan(p);
    setPlan(p);
  }, []);

  const clear = useCallback(() => {
    storage.clearTripPlan();
    setPlan(null);
  }, []);

  return { plan, save, clear };
}
