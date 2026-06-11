import express from "express";
import { clerkWebHook } from "../controllers/clerkWebHook.js";

const router = express.Router();

router.post("/clerk", express.raw({ type: "application/json" }), clerkWebHook);

export default router;
