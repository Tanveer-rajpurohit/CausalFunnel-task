import { useState, useEffect } from 'react';
import { SessionAPI, EventAPI } from '../service/api.service';
import { EventData, HeatmapData } from '../types/api.types';

export function useSessionEvents(sessionId: string, type: string) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await SessionAPI.getSessionEvents(sessionId, type);
        setEvents(response.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred fetching the event timeline');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sessionId, type]);

  return { events, isLoading, error };
}

export function useHeatmap(pageUrl: string, sessionId?: string) {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pageUrl || pageUrl === 'all') {
      setHeatmapData([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await EventAPI.getHeatmap(pageUrl, sessionId);
        setHeatmapData(response.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch heatmap data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageUrl, sessionId]);

  return { heatmapData, isLoading, error };
}
