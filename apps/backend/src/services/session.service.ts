import EventModel from "../models/Event";

export const getSessionsList = async (
  sortByField: string,
  sortOrder: 1 | -1,
  limit: number,
  skip: number,
) => {
  const sessions = await EventModel.aggregate([
    {
      $group: {
        _id: "$sessionId",
        eventCount: { $sum: 1 },
        lastActive: { $max: "$timestamp" },
      },
    },
    {
      $sort: { [sortByField]: sortOrder },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  return sessions;
};

export const getSessionEvents = async (sessionId: string, eventType?: string) => {
  const query: any = { sessionId };
  if (eventType && eventType !== "all") {
    query.eventType = eventType;
  }
  const events = await EventModel.find(query).sort({ timestamp: 1 });
  return events;
};

export const getDistinctPages = async () => {
  const fullUrls = await EventModel.distinct("pageUrl");
  
  const paths = fullUrls.map(url => {
    try {
      return new URL(url).pathname;
    } catch {
      return url; 
    }
  });
  
  return [...new Set(paths)];
};
