import EventModel from "../models/Event";
import { EventPayload } from "../types/schema/schema.type";

export const saveEvent = async (eventData: EventPayload) => {
    const event = new EventModel(eventData);
    await event.save();
    return event;
};

export const getHeatmap = async (pageUrl: string) => {
    const safePath = pageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const urlRegex = new RegExp(`${safePath}$`, 'i');

    const clicks = await EventModel.find({ 
        pageUrl: urlRegex, 
        eventType: 'click' 
    }).select('coordX coordY timestamp -_id');

    return clicks;
};
