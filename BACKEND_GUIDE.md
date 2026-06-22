# Backend Setup Guide (Node.js + Express + TypeScript)

This guide will walk you through setting up a professional Node.js Express backend using TypeScript, tailored for the CausalFunnel analytics tracker.

## 1. Professional Folder Structure

A scalable Express application should separate concerns (Routes, Controllers, Services, Models).

```text
apps/backend/
├── src/
│   ├── config/          # Environment variables and database connection (db.ts)
│   ├── controllers/     # Route handlers (eventController.ts, sessionController.ts)
│   ├── middlewares/     # Express middlewares (cors, error handler, validation)
│   ├── models/          # Mongoose schemas (Event.ts, Session.ts)
│   ├── routes/          # Express routes (eventRoutes.ts, sessionRoutes.ts)
│   ├── services/        # Business logic and database queries (eventService.ts)
│   ├── types/           # TypeScript interfaces
│   └── index.ts         # Entry point (Express app setup)
├── .env                 # Environment variables
├── package.json         
└── tsconfig.json        
```

## 2. Setup Steps

1. **Initialize the App**
   Inside the `apps` folder, create the backend directory and initialize it:
   ```bash
   mkdir backend && cd backend
   npm init -y
   ```

2. **Install Dependencies**
   ```bash
   npm install express mongoose cors dotenv
   npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
   ```

3. **Initialize TypeScript**
   ```bash
   npx tsc --init
   ```
   *Tip: In `tsconfig.json`, set `"outDir": "./dist"` and `"rootDir": "./src"`.*

4. **Add Scripts to `package.json`**
   ```json
   "scripts": {
     "dev": "nodemon src/index.ts",
     "build": "tsc",
     "start": "node dist/index.ts"
   }
   ```

## 3. MongoDB Model Guidelines

Based on the assignment requirements, you need to track `page_view` and `click` events, and display session data. You will need an `Event` model.

### **Event Model (`src/models/Event.ts`)**
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  sessionId: string;
  eventType: 'page_view' | 'click';
  pageUrl: string;
  timestamp: Date;
  coordX?: number; // Optional, only for clicks
  coordY?: number; // Optional, only for clicks
}

const EventSchema: Schema = new Schema({
  sessionId: { type: String, required: true, index: true },
  eventType: { type: String, enum: ['page_view', 'click'], required: true },
  pageUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  coordX: { type: Number },
  coordY: { type: Number }
});

// Adding an index on sessionId and pageUrl helps with the queries mentioned in the assignment
EventSchema.index({ sessionId: 1, timestamp: -1 });
EventSchema.index({ pageUrl: 1, eventType: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
```

## 4. API Endpoints Needed

You will need to create the following routes in `src/routes/` and their respective logic in `src/controllers/`:

1. **`POST /api/events`**
   - **Purpose:** Receive tracking data from your client-side script.
   - **Logic:** Validate the body, ensure `sessionId` exists, and save to MongoDB.

2. **`GET /api/sessions`**
   - **Purpose:** Fetch a list of sessions with event counts.
   - **Logic:** Use MongoDB Aggregation (`$group` by `sessionId` and `$count`) to return the total events per session.

3. **`GET /api/sessions/:sessionId/events`**
   - **Purpose:** Fetch all events for a specific session (User Journey).
   - **Logic:** `Event.find({ sessionId }).sort({ timestamp: 1 })`.

4. **`GET /api/events/heatmap`**
   - **Purpose:** Fetch click data for a specific page.
   - **Logic:** `Event.find({ pageUrl: req.query.url, eventType: 'click' }).select('coordX coordY')`.

## 5. Next Steps for You
1. Create the backend folder and run the setup steps.
2. Write the Express app in `src/index.ts`.
3. Connect to MongoDB in `src/config/db.ts`.
4. Build the `POST /api/events` route first, so your Tracker can actually send data!
