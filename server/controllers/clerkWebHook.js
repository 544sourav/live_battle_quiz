import { Webhook } from "svix";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config()

export const clerkWebHook = async (req, res) => {
  console.log("Received webhook:", req.body);
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    console.log(req.body);
    const payload = wh.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    // console.log(payload);
    const eventType = payload.type;

    if (eventType === "user.created") {
      const { id, email_addresses, image_url } = payload.data;
      // console.log("User created:", payload.data);
      // console.log("Creating user with email:", email_addresses[0].email_address);
      // console.log("Creating user with image URL:", image_url);
      // console.log("Creating user with clerk ID:", id);
      // console.log("Creating user with username:", email_addresses[0].email_address.split("@")[0]);
      
      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        console.log("User already exists with clerk ID:", id);
        return res.status(200).json({
          success: true,
        });
      }
      await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        userName: email_addresses[0].email_address.split("@")[0],
        imageUrl: image_url,
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      success: false,
      message: "Invalid Webhook",
    });
  }
};
