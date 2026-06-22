import EventModel from "../models/Event";
import { EventPayload } from "../types/schema/schema.type";

export const saveEvent = async (eventData: EventPayload) => {
    const event = new EventModel(eventData);
    await event.save();
    return event;
};

export const getHeatmap = async (pageUrl: string) => {
    const clicks = await EventModel.find({ 
        pageUrl: pageUrl, 
        eventType: 'click' 
    }).select('coordX coordY timestamp -_id');

    return clicks;
};
