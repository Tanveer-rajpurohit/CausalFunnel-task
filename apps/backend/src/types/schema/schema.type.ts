import { z } from "zod";
import { Document } from "mongoose";


export const eventValidationSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  eventType: z.enum(['page_view', 'click']),
  pageUrl: z.string().url("Must be a valid URL"),
  timestamp: z.coerce.date().default(() => new Date()),
  coordX: z.number().optional(),
  coordY: z.number().optional(),
});


export type EventPayload = z.infer<typeof eventValidationSchema>;

export interface IEvent extends EventPayload, Document {}


