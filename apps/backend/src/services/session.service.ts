import EventModel from "../models/Event";

export const getSessionsList = async () => {
    const sessions = await EventModel.aggregate([
        {
            $group: {
                _id: "$sessionId",
                eventCount: { $sum: 1 },
                lastActive: { $max: "$timestamp" }
            }
        },
        { $sort: { lastActive: -1 } }
    ]);

    return sessions;
};

export const getSessionEvents = async (sessionId: string) => {
    const events = await EventModel.find({ sessionId }).sort({ timestamp: 1 });
    return events;
};
