/**
 * Utility function to send JWT token in cookie and JSON response
 * @param {string} message - Success message
 * @param {object} user - User object
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 */
export const sendToken = (message, user, res, statusCode) => {
  try {
    // 1. Generate JWT token
    const token = user.getJWTToken();

    // 2. Validate and set cookie expiration (default: 7 days)
    const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;
    if (isNaN(cookieExpireDays) || cookieExpireDays <= 0) {
      throw new Error('Invalid COOKIE_EXPIRE environment variable');
    }
    const cookieExpireMs = cookieExpireDays * 24 * 60 * 60 * 1000;

    // 3. Configure cookie options
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpireMs),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      ...(isProduction && { domain: '13.48.137.48' }) // Only set domain in production
    };

    // 4. Clear any existing token first
    res.clearCookie('token');

    // 5. Set new token cookie and send response
    res.status(statusCode)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
          // Include only necessary user fields
        }
        // Omit token from JSON response if not needed by client
      });

  } catch (error) {
    console.error('Error in sendToken:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};
