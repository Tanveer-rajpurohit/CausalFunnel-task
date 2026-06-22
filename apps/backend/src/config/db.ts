import mongoose from "mongoose";

const connectDb = async (retries = 3, delay = 3000): Promise<void> => {
    
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/CausalFunnel-task";

    while (retries > 0) {
        try {
            await mongoose.connect(MONGODB_URI, {
                serverSelectionTimeoutMS: 3000,
            });
            console.log("Database successfully connected");
            return; 
        } catch (err) {
            retries -= 1;
            console.error(`Unable to connect to the database. Retries left: ${retries}`);
            
            if (retries === 0) {
                console.error("All database connection retries failed. Exiting process.");
                process.exit(1);
            }
            
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

export default connectDb;