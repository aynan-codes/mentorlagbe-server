import { getDB } from "./db.js";

export const createIndexes = async () => {
  const db = getDB();

  await db.collection("users").createIndex(
    { email: 1 },
    {
      unique: true,
      partialFilterExpression: {
        __ba_model: "user",
      },
    }
  );

  await db.collection("payments").createIndex(
    { stripeSessionId: 1 },
    { unique: true }
  );

  await db.collection("tuitions").createIndex({
    approvalStatus: 1,
    isActive: 1,
    createdAt: -1,
  });

  await db.collection("applications").createIndex({
    studentEmail: 1,
    status: 1,
  });

  await db.collection("applications").createIndex({
    tutorEmail: 1,
    status: 1,
  });

  console.log("MongoDB Indexes Created Successfully!");
};