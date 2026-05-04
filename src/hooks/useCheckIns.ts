import { useState, useCallback } from 'react';
import { storage, type CheckIn } from '../lib/storage';
import { MOCK_FEED } from '../data/mockFeed';

export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const saved = storage.getCheckIns();
    return saved.length > 0 ? saved : MOCK_FEED;
  });

  const addCheckIn = useCallback((checkIn: CheckIn) => {
    storage.saveCheckIn(checkIn);
    setCheckIns((prev) => [checkIn, ...prev]);
  }, []);

  return { checkIns, addCheckIn };
}
