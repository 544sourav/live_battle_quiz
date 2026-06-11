// get user by name /id'
//update user details
//delete user
// get leaderboard

import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import { uploadImageToCloudinary } from "../utils/imageUpload.js";
dotenv.config();

export const getUserById = async (req, res) => {
  try {
    const { username, clerkId } = req.body;
    const conditions = [{ username }, { clerkId }];

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      conditions.unshift({ _id: req.params.id });
    }

    const user = await User.findOne({
      $or: conditions,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isOwner = req.clerkUserId === user.clerkId;

    if (!isOwner) {
      user.email = undefined;
      user.weakTopics = undefined;
      user.strongTopics = undefined;
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isOwner = req.clerkUserId === user.clerkId;
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this user",
      });
    }

    const { userName, imageUrl } = req.body;
    const updateData = {};
    if (typeof userName === "string") updateData.userName = userName;
    if (typeof imageUrl === "string") updateData.imageUrl = imageUrl;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;

    // console.log("Fetching user details for user ID:", userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // console.log("User details fetched successfully:", user);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    const file = req.files?.profilePicture;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No File Found",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const result = await uploadImageToCloudinary(
      file,
      process.env.FOLDER_NAME,
      "auto",
    );
    user.imageUrl = result.secure_url;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        imageUrl: result.secure_url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
