import mongoose, {Schema, Document} from "mongoose";
import { IEvent } from "../types/schema/schema.type";

const EventSchema: Schema = new Schema({
    sessionId: { type: String, required: true, index: true },
    eventType: { type: String, enum: ['page_view', 'click'], required: true },
    pageUrl: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    coordX: { type: Number },
    coordY: { type: Number }
})



EventSchema.index({ sessionId: 1, timestamp: -1 });
EventSchema.index({ pageUrl: 1, eventType: 1, sessionId: 1 });
export default mongoose.model<IEvent>('Event', EventSchema);