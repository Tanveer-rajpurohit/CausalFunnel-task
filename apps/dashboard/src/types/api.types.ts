export interface Session {
  _id?: string;
  id?: string;
  eventCount: number;
  lastActive: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface PaginatedSessionsResponse {
  sessions: Session[];
  meta: PaginationMeta;
}

export interface EventData {
  _id?: string;
  sessionId: string;
  eventType: 'page_view' | 'click';
  pageUrl: string;
  timestamp: string;
  coordX?: number | null;
  coordY?: number | null;
}

export interface HeatmapData {
  coordX: number;
  coordY: number;
  timestamp: string;
}
