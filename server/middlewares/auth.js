import { verifyToken } from "@clerk/express";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    //   console.log("header", req.headers);
    const token = req.cookies?.token  || req.headers["authorization"]?.replace("Bearer ", "") || req.body?.token;
   
    //  console.log("Received token:", token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is missing",
        });
    }
    try{
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
          });
          req.clerkUserId = payload.sub;
        //   console.log("Clerk user ID from token:", req.clerkUserId);.

          const user = await User.findOne({ clerkId: payload.sub }).select("_id").lean();
          
          // console.log("User found in database:", user);
          if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
          }
        req.userId = user._id.toString();

        // console.log("Authenticated user ID:", req.userId);
        
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token",
        });
    }
}