// import {
//   createApplicationService,
//   getMyApplicationsService,
//   getTutorApplicationsService,
//   updateApplicationStatusService,
//   cancelApplicationService,
// } from "../services/application.service.js";

// // Student Applies for a Tuition
// export const createApplication = async (req, res) => {
//   try {
//     const { tuitionId, preferredSchedule, studentNote } = req.body;

//     const application = await createApplicationService(
//       req.user.id,
//       tuitionId,
//       preferredSchedule,
//       studentNote
//     );

//     return res.status(201).json({
//       success: true,
//       message: "Application submitted successfully.",
//       application,
//     });
//   } catch (error) {
//     console.error("Create Application Error:", error.message);

//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Failed to submit application.",
//     });
//   }
// };

// // Get Logged-in Student's Applications
// export const getMyApplications = async (req, res) => {
//   try {
//     const applications = await getMyApplicationsService(
//       req.user.email
//     );

//     return res.status(200).json({
//       success: true,
//       total: applications.length,
//       applications,
//     });
//   } catch (error) {
//     console.error("Get My Applications Error:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve applications.",
//     });
//   }
// };

// // Get Tutor's Applications
// export const getTutorApplications = async (req, res) => {
//   try {
//     const applications = await getTutorApplicationsService(
//       req.user.email
//     );

//     return res.status(200).json({
//       success: true,
//       total: applications.length,
//       applications,
//     });
//   } catch (error) {
//     console.error("Get Tutor Applications Error:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve applications.",
//     });
//   }
// };

// // Tutor Accepts or Rejects an Application
// export const updateApplicationStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     await updateApplicationStatusService(
//       id,
//       req.user.email,
//       status
//     );

//     return res.status(200).json({
//       success: true,
//       message: `Application ${status} successfully.`,
//     });
//   } catch (error) {
//     console.error(
//       "Update Application Status Error:",
//       error.message
//     );

//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message:
//         error.message || "Failed to update application status.",
//     });
//   }
// };

// // Student Cancels a Pending Application
// export const cancelApplication = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await cancelApplicationService(id, req.user.email);

//     return res.status(200).json({
//       success: true,
//       message: "Application cancelled successfully.",
//     });
//   } catch (error) {
//     console.error("Cancel Application Error:", error.message);

//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Unable to cancel application.",
//     });
//   }
// };





import {
  createApplicationService,
  getMyApplicationsService,
  getTutorApplicationsService,
  updateApplicationStatusService,
  cancelApplicationService,
} from "../services/application.service.js";

// Student Applies for a Tuition
export const createApplication = async (req, res) => {
  try {
    const {
      tuitionId,
      studentPhone,
      preferredSchedule,
      studentNote,
    } = req.body;

    const application = await createApplicationService(
      req.user.id,
      tuitionId,
      studentPhone,
      preferredSchedule,
      studentNote
    );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Create Application Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to submit application.",
    });
  }
};

// Get Student Applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await getMyApplicationsService(
      req.user.email
    );

    return res.status(200).json({
      success: true,
      total: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get My Applications Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve applications.",
    });
  }
};

// Get Tutor Applications
export const getTutorApplications = async (req, res) => {
  try {
    const applications = await getTutorApplicationsService(
      req.user.email
    );

    return res.status(200).json({
      success: true,
      total: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Tutor Applications Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve applications.",
    });
  }
};

// Tutor Accepts or Rejects an Application
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await updateApplicationStatusService(
      id,
      req.user.email,
      status
    );

    return res.status(200).json({
      success: true,
      message: `Application ${status} successfully.`,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update application status.",
    });
  }
};

// Student Cancels a Pending Application
export const cancelApplication = async (req, res) => {
  try {
    const { id } = req.params;

    await cancelApplicationService(id, req.user.email);

    return res.status(200).json({
      success: true,
      message: "Application cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel Application Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to cancel application.",
    });
  }
};