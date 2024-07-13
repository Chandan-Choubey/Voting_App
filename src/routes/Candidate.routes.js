import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import {
  createCandidate,
  deleteCandidate,
  getVoteCount,
  updateCandidate,
  voteCandidate,
} from "../controllers/Candidate.controller.js";
const router = Router();

router.route("/").post(verifyjwt, createCandidate);
router.route("/:id").post(verifyjwt, updateCandidate);
router.route("/:id").delete(verifyjwt, deleteCandidate);
router.route("/vote/:id").post(verifyjwt, voteCandidate);
router.route("/getvote").get(verifyjwt, getVoteCount);

export default router;
