const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1` : 'http://localhost:8080/api/v1';

export const SessionAPI = {
  getSessions: async (limit: number, page: number, sortBy: string, order: string) => {
    const res = await fetch(`${BASE_URL}/sessions?limit=${limit}&page=${page}&sortBy=${sortBy}&order=${order}`);
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
  },

  getSessionEvents: async (sessionId: string, type: string) => {
    const url = new URL(`${BASE_URL}/sessions/${sessionId}/events`);
    if (type && type !== 'all') {
      url.searchParams.append('type', type);
    }
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  },

  getDistinctPages: async () => {
    const res = await fetch(`${BASE_URL}/pages`);
    if (!res.ok) throw new Error("Failed to fetch pages");
    return res.json();
  }
};

export const EventAPI = {
  getHeatmap: async (pageUrl: string, sessionId?: string) => {
    const url = new URL(`${BASE_URL}/events/heatmap`);
    url.searchParams.append('url', pageUrl);
    if (sessionId && sessionId !== 'global') {
      url.searchParams.append('sessionId', sessionId);
    }
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch heatmap data");
    return res.json();
  }
};