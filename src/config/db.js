import { MongoClient } from "mongodb";

let client;
let db;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    client = new MongoClient(uri);

    await client.connect();

    db = client.db(dbName);

    console.log("MongoDB Connected Successfully!");

    return db;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database is not connected yet!");
  }

  return db;
};

const getMongoClient = () => {
  if (!client) {
    throw new Error("MongoDB client is not initialized yet!");
  }

  return client;
};

export { connectDB, getDB, getMongoClient };