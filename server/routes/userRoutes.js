import express from "express";
import {
  createUser,
  loginUser,
  updateCurrentPoints,
  getSingleUserCurrentPoints,
  updatePrePoints,
  updateTotalPoints,
  getPreviousPoints,
  getTotalPoints,
  updateUserData,
  verifyReset,
  resetPassword,
  deleteAccount,
} from "../controllers/userControllers.js";

const router = express.Router();

// POST /api/v1/users/create
router.post("/create", createUser);

// POST /api/v1/users/login  { email, password }
router.post("/login", loginUser);

// GET /api/v1/users/getCurrentPoints/:id  (returns the user, without password)
router.get("/getCurrentPoints/:id", getSingleUserCurrentPoints);

// PUT /api/v1/users/updateCurrentPoints/:id
router.put("/updateCurrentPoints/:id", updateCurrentPoints);

// PUT /api/v1/users/updateGkQuestions/previousPoints/:id
router.put("/updateGkQuestions/previousPoints/:id", updatePrePoints);

// PUT /api/v1/users/updateGKQuestions/totalPoints/:id
router.put("/updateGKQuestions/totalPoints/:id", updateTotalPoints);

// GET /api/v1/users/getGkQuestions/previousPoints/:id
router.get("/getGkQuestions/previousPoints/:id", getPreviousPoints);

// GET /api/v1/users/getGkQuestions/totalPoints/:id
router.get("/getGkQuestions/totalPoints/:id", getTotalPoints);

// PUT /api/v1/users/editedUserData/singleUser/:id
router.put("/editedUserData/singleUser/:id", updateUserData);

// POST /api/v1/users/forgotPassword/verify  { email, ph }
router.post("/forgotPassword/verify", verifyReset);

// PATCH /api/v1/users/forgotPassword  { email, ph, password }
router.patch("/forgotPassword", resetPassword);

// DELETE /api/v1/users/deleteAccount/:id
router.delete("/deleteAccount/:id", deleteAccount);

export default router;
