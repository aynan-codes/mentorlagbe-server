// Verify User Role Middleware
export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied! You do not have permission.",
        });
      }

      next();
    } catch (error) {
      console.error("Role Verification Error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Role verification failed.",
      });
    }
  };
};