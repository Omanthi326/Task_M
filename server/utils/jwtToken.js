export const sendToken = (message, user, res, statusCode) => {
  // Generate the JWT token using the getJWTToken method
  const token = user.getJWTToken();

  // Ensure that COOKIE_EXPIRE is properly set in the environment variables
  const cookieExpire = parseInt(process.env.COOKIE_EXPIRE, 10);

  if (isNaN(cookieExpire) || cookieExpire <= 0) {
    return res.status(500).json({
      success: false,
      message: "Invalid cookie expiration time",
    });
  }

  // Set options for the cookie
  const options = {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000), // Cookie expires in the specified days
    httpOnly: true, // Ensures the cookie can't be accessed via JavaScript (mitigates XSS)
    secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent only over HTTPS in production
  };

  // Send the token as a cookie and respond with JSON
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
