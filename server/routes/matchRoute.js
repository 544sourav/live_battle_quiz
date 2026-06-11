import express from "express"
import { MatchHistoryByUserId, getMatchById } from "../controllers/match.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/matchhistory", authMiddleware, MatchHistoryByUserId);
router.get("/getmatch", authMiddleware, getMatchById);

export default router;