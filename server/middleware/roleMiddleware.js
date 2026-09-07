/**
 * Middleware to restrict access to specific user roles
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'owner')
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in to proceed.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}]. Current role: '${req.user.role}'`,
      });
    }

    next();
  };
};

/**
 * Convenient shortcut middleware for admin-only endpoints
 */
export const requireAdmin = requireRole('admin');

export default { requireRole, requireAdmin };
