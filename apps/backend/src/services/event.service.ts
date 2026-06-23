import EventModel from "../models/Event";
import { EventPayload } from "../types/schema/schema.type";

export const saveEvent = async (eventData: EventPayload) => {
    const event = new EventModel(eventData);
    await event.save();
    return event;
};

export const getHeatmap = async (pageUrl: string, sessionId?: string) => {
    const safePath = pageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const urlRegex = new RegExp(`${safePath}$`, 'i');

    const query: Record<string, unknown> = { 
        pageUrl: urlRegex, 
        eventType: 'click' 
    };

    if (sessionId) {
        query.sessionId = sessionId;
    }

    const clicks = await EventModel.find(query).select('coordX coordY timestamp -_id');

    return clicks;
};
