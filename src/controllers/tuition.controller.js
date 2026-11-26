import {
  createTuitionService,
  getAllTuitionsService,
  getTuitionByIdService,
  getMyTuitionsService,
  updateTuitionService,
  deleteTuitionService,
  updateTuitionStatusService,
} from "../services/tuition.service.js";

// Create New Tuition
export const createTuition = async (req, res) => {
  try {
    const tuition = await createTuitionService(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Tuition created successfully. Waiting for admin approval.",
      tuition,
    });
  } catch (error) {
    console.error("Create Tuition Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to create tuition.",
      ...(error.plan && { plan: error.plan }),
      ...(error.limit && { limit: error.limit }),
    });
  }
};

// Get All Approved Tuitions
export const getAllTuitions = async (req, res) => {
  try {
    const result = await getAllTuitionsService(req.query);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get Tuitions Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to retrieve tuitions.",
    });
  }
};

// Get Single Tuition
export const getTuitionById = async (req, res) => {
  try {
    const tuition = await getTuitionByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      tuition,
    });
  } catch (error) {
    console.error("Get Tuition Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to retrieve tuition.",
    });
  }
};

// Get Logged-in Tutor's Tuitions
export const getMyTuitions = async (req, res) => {
  try {
    const result = await getMyTuitionsService(req.user.email);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get My Tuitions Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your tuitions.",
    });
  }
};

// Update Tuition
export const updateTuition = async (req, res) => {
  try {
    const tuition = await updateTuitionService(
      req.params.id,
      req.user.email,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Tuition updated successfully. Waiting for admin approval.",
      tuition,
    });
  } catch (error) {
    console.error("Update Tuition Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to update tuition.",
    });
  }
};

// Delete Tuition (Soft Delete)
export const deleteTuition = async (req, res) => {
  try {
    await deleteTuitionService(req.params.id, req.user.email);

    return res.status(200).json({
      success: true,
      message: "Tuition deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Tuition Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to delete tuition.",
    });
  }
};

// Tutor Activates or Closes Own Tuition
export const updateTuitionStatus = async (req, res) => {
  try {
    const isActive = await updateTuitionStatusService(
      req.params.id,
      req.user.email,
      req.body.isActive
    );

    return res.status(200).json({
      success: true,
      message: isActive
        ? "Tuition activated successfully."
        : "Tuition closed successfully.",
    });
  } catch (error) {
    console.error("Update Tuition Status Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to update tuition status.",
    });
  }
};