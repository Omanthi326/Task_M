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
      console.warn('Invalid COOKIE_EXPIRE environment variable, using default of 7 days');
    }
    const cookieExpireMs = cookieExpireDays * 24 * 60 * 60 * 1000;

    // 3. Configure cookie options - Simplified for development
    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpireMs),
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax',
      path: '/'
    };

    console.log("Setting token cookie with options:", cookieOptions);

    // 4. Set new token cookie and send response
    res.status(statusCode)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar
        }
      });

  } catch (error) {
    console.error('Error in sendToken:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};
