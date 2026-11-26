import {
  getPendingTuitionsService,
  getAllTuitionsService,
  updateTuitionApprovalService,
  getAllUsersService,
  updateUserRoleService,
  getAllTransactionsService,
} from "../services/admin.service.js";

// Get All Pending Tuitions
export const getPendingTuitions = async (req, res) => {
  try {
    const tuitions = await getPendingTuitionsService();

    return res.status(200).json({
      success: true,
      total: tuitions.length,
      tuitions,
    });
  } catch (error) {
    console.error("Get Pending Tuitions Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve pending tuitions.",
    });
  }
};

// Get All Tuitions
export const getAllTuitions = async (req, res) => {
  try {
    const tuitions = await getAllTuitionsService();

    return res.status(200).json({
      success: true,
      total: tuitions.length,
      tuitions,
    });
  } catch (error) {
    console.error("Get All Tuitions Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve all tuitions.",
    });
  }
};

// Approve or Reject Tuition
export const updateTuitionApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    await updateTuitionApprovalService(
      id,
      approvalStatus,
      req.user.email
    );

    return res.status(200).json({
      success: true,
      message: `Tuition ${approvalStatus} successfully.`,
    });
  } catch (error) {
    console.error("Update Tuition Approval Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update tuition approval.",
    });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users.",
    });
  }
};

// Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await updateUserRoleService(id, role, req.user.id);

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully.`,
    });
  } catch (error) {
    console.error("Update User Role Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update user role.",
    });
  }
};

// Get All Payment Transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await getAllTransactionsService();

    return res.status(200).json({
      success: true,
      total: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get All Transactions Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions.",
    });
  }
};