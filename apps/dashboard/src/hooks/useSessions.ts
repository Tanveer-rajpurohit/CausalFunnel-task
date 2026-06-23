import { useState, useEffect } from 'react';
import { SessionAPI } from '../service/api.service';
import { useAppStore } from '../store/useAppStore';

export function useSessionList(limit: number, page: number, sortBy: string, order: string) {
  const [data, setData] = useState<{ sessions: Record<string, unknown>[], meta: Record<string, unknown> } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await SessionAPI.getSessions(limit, page, sortBy, order);
        setData({ sessions: response.data, meta: response.meta });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred fetching sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [limit, page, sortBy, order]);

  return { data, isLoading, error };
}

export function useDropdownPages() {
  const { availablePages, setAvailablePages } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (availablePages.length > 0) return;

    const fetchPages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await SessionAPI.getDistinctPages();
        setAvailablePages(response.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dynamic page filters');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPages();
  }, [availablePages.length, setAvailablePages]);

  return { pages: availablePages, isLoading, error };
}
