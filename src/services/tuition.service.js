import { ObjectId } from "mongodb";

import { getDB } from "../config/db.js";

// Custom Error
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Escape Regex Characters
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Create Tuition
export const createTuitionService = async (userId, data) => {
  const db = getDB();

  const {
    title,
    subject,
    classLevel,
    mode,
    location,
    monthlyFee,
    daysPerWeek,
    bannerImage,
    description,
  } = data;

  if (
    !title?.trim() ||
    !subject?.trim() ||
    !classLevel?.trim() ||
    !mode ||
    monthlyFee === undefined ||
    daysPerWeek === undefined ||
    !description?.trim()
  ) {
    throw createError(
      "Please provide all required tuition information.",
      400
    );
  }

  if (!["online", "offline", "both"].includes(mode)) {
    throw createError("Invalid tuition mode.", 400);
  }

  if (
    !Number.isFinite(Number(monthlyFee)) ||
    Number(monthlyFee) <= 0 ||
    !Number.isInteger(Number(daysPerWeek)) ||
    Number(daysPerWeek) < 1 ||
    Number(daysPerWeek) > 7
  ) {
    throw createError("Invalid monthly fee or days per week.", 400);
  }

  // Find Tutor
  const tutor = await db.collection("users").findOne({
    id: userId,
    __ba_model: "user",
  });

  if (!tutor) {
    throw createError("Tutor not found.", 404);
  }

  if (tutor.role !== "tutor") {
    throw createError("Only tutors can create tuition posts.", 403);
  }

  // Free Plan Limit
  if (tutor.plan !== "pro") {
    const totalTuitions = await db.collection("tuitions").countDocuments({
      tutorEmail: tutor.email,
      isSeedData: { $ne: true },
    });

    if (totalTuitions >= 2) {
      const error = createError(
        "Free plan allows only 2 tuition posts. Upgrade to Pro for unlimited posts.",
        403
      );

      error.plan = "free";
      error.limit = 2;

      throw error;
    }
  }

  // Tuition Data
  const tuition = {
    title: title.trim(),
    subject: subject.trim(),
    classLevel: classLevel.trim(),
    mode,
    location: location?.trim() || "",
    monthlyFee: Number(monthlyFee),
    daysPerWeek: Number(daysPerWeek),
    bannerImage: bannerImage?.trim() || "",
    description: description.trim(),
    tutorName: tutor.name,
    tutorEmail: tutor.email,
    approvalStatus: "pending",
    isActive: true,
    createdAt: new Date(),
  };

  const result = await db.collection("tuitions").insertOne(tuition);

  return {
    _id: result.insertedId,
    ...tuition,
  };
};

// Get All Approved Tuitions
export const getAllTuitionsService = async (filters) => {
  const db = getDB();

  const {
    search = "",
    subject = "",
    classLevel = "",
    mode = "",
    location = "",
    sortBy = "newest",
    page = "1",
    limit = "10",
  } = filters;

  // Filter Validation
  if (
    typeof search !== "string" ||
    typeof subject !== "string" ||
    typeof classLevel !== "string" ||
    typeof mode !== "string" ||
    typeof location !== "string"
  ) {
    throw createError("Invalid search or filter parameters.", 400);
  }

  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);

  const perPage = Math.min(
    50,
    Math.max(1, Number.parseInt(limit, 10) || 10)
  );

  if (!["newest", "price-asc", "price-desc"].includes(sortBy)) {
    throw createError("Invalid sorting option.", 400);
  }

  const query = {
    approvalStatus: "approved",
    isActive: true,
  };

  // Search Filter
  if (search.trim()) {
    const searchRegex = {
      $regex: escapeRegex(search.trim()),
      $options: "i",
    };

    query.$or = [
      { title: searchRegex },
      { subject: searchRegex },
    ];
  }

  // Subject Filter
  if (subject.trim()) {
    query.subject = {
      $regex: escapeRegex(subject.trim()),
      $options: "i",
    };
  }

  // Class Level Filter
  if (classLevel.trim()) {
    query.classLevel = {
      $regex: escapeRegex(classLevel.trim()),
      $options: "i",
    };
  }

  // Tuition Mode Filter
  if (mode) {
    if (!["online", "offline", "both"].includes(mode)) {
      throw createError("Invalid tuition mode.", 400);
    }

    query.mode = mode;
  }

  // Division / Location Filter
  if (location.trim()) {
    query.location = location.trim();
  }

  // Sorting
  const sortOptions = {
    newest: { createdAt: -1 },
    "price-asc": { monthlyFee: 1, createdAt: -1 },
    "price-desc": { monthlyFee: -1, createdAt: -1 },
  };

  // Total Matching Tuitions
  const total = await db.collection("tuitions").countDocuments(query);

  // Get Filtered Tuitions
  const tuitions = await db
    .collection("tuitions")
    .find(query)
    .sort(sortOptions[sortBy])
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .toArray();

  return {
    total,
    currentPage,
    totalPages: Math.ceil(total / perPage),
    tuitions,
  };
};

// Get Single Tuition
export const getTuitionByIdService = async (id) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw createError("Invalid tuition ID.", 400);
  }

  const tuition = await db.collection("tuitions").findOne({
    _id: new ObjectId(id),
    approvalStatus: "approved",
    isActive: true,
  });

  if (!tuition) {
    throw createError("Tuition not found.", 404);
  }

  return tuition;
};

// Get Tutor's Own Tuitions
export const getMyTuitionsService = async (email) => {
  const db = getDB();

  const tuitions = await db
    .collection("tuitions")
    .find({ tutorEmail: email })
    .sort({ createdAt: -1 })
    .toArray();

  return {
    total: tuitions.length,
    tuitions,
  };
};

// Update Tuition
export const updateTuitionService = async (id, email, data) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw createError("Invalid tuition ID.", 400);
  }

  const allowedFields = [
    "title",
    "subject",
    "classLevel",
    "mode",
    "location",
    "monthlyFee",
    "daysPerWeek",
    "bannerImage",
    "description",
  ];

  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw createError("No valid fields provided for update.", 400);
  }

  // Text Validation
  for (const field of ["title", "subject", "classLevel", "description"]) {
    if (
      updateData[field] !== undefined &&
      (typeof updateData[field] !== "string" ||
        !updateData[field].trim())
    ) {
      throw createError(`Invalid ${field}.`, 400);
    }

    if (typeof updateData[field] === "string") {
      updateData[field] = updateData[field].trim();
    }
  }

  // Mode Validation
  if (
    updateData.mode !== undefined &&
    !["online", "offline", "both"].includes(updateData.mode)
  ) {
    throw createError("Invalid tuition mode.", 400);
  }

  // Monthly Fee Validation
  if (updateData.monthlyFee !== undefined) {
    if (
      !Number.isFinite(Number(updateData.monthlyFee)) ||
      Number(updateData.monthlyFee) <= 0
    ) {
      throw createError("Invalid monthly fee.", 400);
    }

    updateData.monthlyFee = Number(updateData.monthlyFee);
  }

  // Days Validation
  if (updateData.daysPerWeek !== undefined) {
    if (
      !Number.isInteger(Number(updateData.daysPerWeek)) ||
      Number(updateData.daysPerWeek) < 1 ||
      Number(updateData.daysPerWeek) > 7
    ) {
      throw createError("Days per week must be between 1 and 7.", 400);
    }

    updateData.daysPerWeek = Number(updateData.daysPerWeek);
  }

  // Location and Image Validation
  for (const field of ["location", "bannerImage"]) {
    if (
      updateData[field] !== undefined &&
      typeof updateData[field] !== "string"
    ) {
      throw createError(`Invalid ${field}.`, 400);
    }

    if (typeof updateData[field] === "string") {
      updateData[field] = updateData[field].trim();
    }
  }

  // Updated Tuition Requires Admin Approval Again
  updateData.approvalStatus = "pending";
  updateData.updatedAt = new Date();

  const result = await db.collection("tuitions").updateOne(
    {
      _id: new ObjectId(id),
      tutorEmail: email,
      isActive: true,
      isSeedData: { $ne: true },
    },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    throw createError(
      "Tuition not found or you do not own this tuition.",
      404
    );
  }

  return db.collection("tuitions").findOne({
    _id: new ObjectId(id),
    tutorEmail: email,
  });
};

// Soft Delete Tuition
export const deleteTuitionService = async (id, email) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw createError("Invalid tuition ID.", 400);
  }

  const result = await db.collection("tuitions").updateOne(
    {
      _id: new ObjectId(id),
      tutorEmail: email,
      isActive: true,
      isSeedData: { $ne: true },
    },
    {
      $set: {
        isActive: false,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw createError(
      "Tuition not found or you do not own this tuition.",
      404
    );
  }

  return true;
};

// Activate or Close Tuition
export const updateTuitionStatusService = async (id, email, isActive) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw createError("Invalid tuition ID.", 400);
  }

  if (typeof isActive !== "boolean") {
    throw createError("isActive must be true or false.", 400);
  }

  const result = await db.collection("tuitions").updateOne(
    {
      _id: new ObjectId(id),
      tutorEmail: email,
      isSeedData: { $ne: true },
    },
    {
      $set: {
        isActive,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw createError(
      "Tuition not found or you do not own this tuition.",
      404
    );
  }

  return isActive;
};