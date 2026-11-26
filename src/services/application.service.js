// import { ObjectId } from "mongodb";
// import { getDB } from "../config/db.js";

// const createError = (message, statusCode = 500) => {
//   const error = new Error(message);
//   error.statusCode = statusCode;
//   return error;
// };

// // Student Applies for a Tuition
// export const createApplicationService = async (
//   userId,
//   tuitionId,
//   preferredSchedule,
//   studentNote
// ) => {
//   const db = getDB();

//   if (!ObjectId.isValid(tuitionId)) {
//     throw createError("Invalid tuition ID.", 400);
//   }

//   if (
//     typeof preferredSchedule !== "string" ||
//     !preferredSchedule.trim()
//   ) {
//     throw createError("Preferred schedule is required.", 400);
//   }

//   if (
//     studentNote !== undefined &&
//     typeof studentNote !== "string"
//   ) {
//     throw createError("Student note must be a string.", 400);
//   }

//   const tuition = await db.collection("tuitions").findOne({
//     _id: new ObjectId(tuitionId),
//     approvalStatus: "approved",
//     isActive: true,
//   });

//   if (!tuition) {
//     throw createError("Approved tuition not found.", 404);
//   }

//   const student = await db.collection("users").findOne({
//     id: userId,
//     __ba_model: "user",
//   });

//   if (!student || student.role !== "student") {
//     throw createError("Student not found.", 404);
//   }

//   const existingApplication = await db
//     .collection("applications")
//     .findOne({
//       tuitionId: new ObjectId(tuitionId),
//       studentEmail: student.email,
//       status: { $in: ["pending", "accepted"] },
//     });

//   if (existingApplication) {
//     throw createError(
//       "You have already applied for this tuition.",
//       409
//     );
//   }

//   const application = {
//     tuitionId: new ObjectId(tuitionId),
//     tuitionTitle: tuition.title,
//     subject: tuition.subject,
//     monthlyFee: tuition.monthlyFee,
//     tutorEmail: tuition.tutorEmail,
//     studentName: student.name,
//     studentEmail: student.email,
//     studentPhone: student.phone || "",
//     preferredSchedule: preferredSchedule.trim(),
//     studentNote: studentNote?.trim() || "",
//     status: "pending",
//     appliedAt: new Date(),
//   };

//   const result = await db
//     .collection("applications")
//     .insertOne(application);

//   return {
//     _id: result.insertedId,
//     ...application,
//   };
// };

// // Get Student Applications
// export const getMyApplicationsService = async (studentEmail) => {
//   const db = getDB();

//   return await db
//     .collection("applications")
//     .find({ studentEmail })
//     .sort({ appliedAt: -1 })
//     .toArray();
// };

// // Get Tutor Applications
// export const getTutorApplicationsService = async (tutorEmail) => {
//   const db = getDB();

//   return await db
//     .collection("applications")
//     .find({ tutorEmail })
//     .sort({ appliedAt: -1 })
//     .toArray();
// };

// // Tutor Updates Application Status
// export const updateApplicationStatusService = async (
//   id,
//   tutorEmail,
//   status
// ) => {
//   const db = getDB();

//   if (!ObjectId.isValid(id)) {
//     throw createError("Invalid application ID.", 400);
//   }

//   if (!["accepted", "rejected"].includes(status)) {
//     throw createError(
//       "Status must be accepted or rejected.",
//       400
//     );
//   }

//   const result = await db.collection("applications").updateOne(
//     {
//       _id: new ObjectId(id),
//       tutorEmail,
//       status: "pending",
//     },
//     {
//       $set: {
//         status,
//         updatedAt: new Date(),
//       },
//     }
//   );

//   if (result.matchedCount === 0) {
//     throw createError(
//       "Pending application not found or you do not own it.",
//       404
//     );
//   }

//   return true;
// };

// // Student Cancels Pending Application
// export const cancelApplicationService = async (
//   id,
//   studentEmail
// ) => {
//   const db = getDB();

//   if (!ObjectId.isValid(id)) {
//     throw createError("Invalid application ID.", 400);
//   }

//   const result = await db.collection("applications").deleteOne({
//     _id: new ObjectId(id),
//     studentEmail,
//     status: "pending",
//   });

//   if (result.deletedCount === 0) {
//     throw createError("Pending application not found.", 404);
//   }

//   return true;
// };






import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Student Applies for a Tuition
export const createApplicationService = async (
  userId,
  tuitionId,
  studentPhone,
  preferredSchedule,
  studentNote
) => {
  const db = getDB();

  if (!ObjectId.isValid(tuitionId)) {
    throw createError("Invalid tuition ID.", 400);
  }

  if (
    typeof studentPhone !== "string" ||
    !studentPhone.trim()
  ) {
    throw createError("Phone number is required.", 400);
  }

  if (
    typeof preferredSchedule !== "string" ||
    !preferredSchedule.trim()
  ) {
    throw createError("Preferred schedule is required.", 400);
  }

  if (
    studentNote !== undefined &&
    typeof studentNote !== "string"
  ) {
    throw createError("Student note must be a string.", 400);
  }

  const tuition = await db.collection("tuitions").findOne({
    _id: new ObjectId(tuitionId),
    approvalStatus: "approved",
    isActive: true,
  });

  if (!tuition) {
    throw createError("Approved tuition not found.", 404);
  }

  const student = await db.collection("users").findOne({
    id: userId,
    __ba_model: "user",
  });

  if (!student || student.role !== "student") {
    throw createError("Student not found.", 404);
  }

  // Prevent duplicate applications
  const existingApplication = await db
    .collection("applications")
    .findOne({
      tuitionId: new ObjectId(tuitionId),
      studentEmail: student.email,
    });

  if (existingApplication) {
    throw createError(
      "You have already applied for this tuition.",
      409
    );
  }

  const application = {
    tuitionId: new ObjectId(tuitionId),
    tuitionTitle: tuition.title,
    subject: tuition.subject,
    monthlyFee: tuition.monthlyFee,
    tutorEmail: tuition.tutorEmail,
    studentName: student.name,
    studentEmail: student.email,
    studentPhone: studentPhone.trim(),
    preferredSchedule: preferredSchedule.trim(),
    studentNote: studentNote?.trim() || "",
    status: "pending",
    appliedAt: new Date(),
  };

  const result = await db
    .collection("applications")
    .insertOne(application);

  return {
    _id: result.insertedId,
    ...application,
  };
};

// Get Student Applications
export const getMyApplicationsService = async (studentEmail) => {
  const db = getDB();

  return await db
    .collection("applications")
    .find({ studentEmail })
    .sort({ appliedAt: -1 })
    .toArray();
};

// Get Tutor Applications
export const getTutorApplicationsService = async (tutorEmail) => {
  const db = getDB();

  return await db
    .collection("applications")
    .find({ tutorEmail })
    .sort({ appliedAt: -1 })
    .toArray();
};

// Tutor Updates Application Status
export const updateApplicationStatusService = async (
  id,
  tutorEmail,
  status
) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw createError("Invalid application ID.", 400);
  }

  if (!["accepted", "rejected"].includes(status)) {
    throw createError(
      "Status must be accepted or rejected.",
      400
    );
  }

  const result = await db.collection("applications").updateOne(
    {
      _id: new ObjectId(id),
      tutorEmail,
      status: "pending",
    },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw createError(
      "Pending application not found or you do not own it.",
      404
    );
  }

  return true;
};

// Student Cancels Pending Application
export const cancelApplicationService = async (
  id,
  studentEmail
) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw createError("Invalid application ID.", 400);
  }

  const result = await db.collection("applications").deleteOne({
    _id: new ObjectId(id),
    studentEmail,
    status: "pending",
  });

  if (result.deletedCount === 0) {
    throw createError("Pending application not found.", 404);
  }

  return true;
};