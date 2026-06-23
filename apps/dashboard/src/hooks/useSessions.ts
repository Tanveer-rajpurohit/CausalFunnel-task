import { useState, useEffect } from 'react';
import { SessionAPI } from '../service/api.service';
import { useAppStore } from '../store/useAppStore';
import { PaginatedSessionsResponse } from '../types/api.types';

export function useSessionList(limit: number, page: number, sortBy: string, order: string) {
  const [data, setData] = useState<PaginatedSessionsResponse | null>(null);
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
        const pagesData = response.data || [];
        setAvailablePages(pagesData);
        
        // Auto-select first page
        if (pagesData.length > 0) {
          const store = useAppStore.getState();
          if (store.globalFilterUrl === 'all') store.setGlobalFilterUrl(pagesData[0]);
          if (store.sessionFilterUrl === 'all') store.setSessionFilterUrl(pagesData[0]);
        }
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
