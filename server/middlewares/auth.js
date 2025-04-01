import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Log the cookies for debugging
  console.log("Received cookies:", req.cookies);

  const { token } = req.cookies;
  
  if (!token) {
    console.log("No authentication token found in cookies");
    return next(new ErrorHandler("You must be logged in to access this resource", 401));
  }
  
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("JWT token verified successfully for user ID:", decoded.id);

    // Find the user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log("No user found with the ID from token:", decoded.id);
      return next(new ErrorHandler("User not found, please login again", 401));
    }
    
    // Set the user in the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return next(new ErrorHandler("Invalid token, please login again", 401));
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler("Token expired, please login again", 401));
    }
    
    return next(new ErrorHandler("Authentication error, please login again", 401));
  }
});
