import EventModel from "../models/Event";
import { EventPayload } from "../types/schema/schema.type";

export const saveEvent = async (eventData: EventPayload) => {
    const event = new EventModel(eventData);
    await event.save();
    return event;
};

export const getHeatmap = async (pageUrl: string, sessionId?: string) => {
    // Escapes special characters, then matches any URL ending with this path
    const safePath = pageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const urlRegex = new RegExp(`${safePath}$`, 'i');

    const query: any = { 
        pageUrl: urlRegex, 
        eventType: 'click' 
    };

    if (sessionId) {
        query.sessionId = sessionId;
    }

    const clicks = await EventModel.find(query).select('coordX coordY timestamp -_id');

    return clicks;
};
