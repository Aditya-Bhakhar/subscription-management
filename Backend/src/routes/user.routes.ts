// src/routes/user.routes.ts

import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  putUpdateUserById,
  patchUpdateUserById,
  deleteUserById,
} from "../controllers/userController.js";
import upload from "../middlewares/upload.js";
import { validateCreateUser, validatePatchUpdateUser, validatePutUpdateUser } from "../middlewares/userInputValidator.js";

const router = Router();

router.post("/", upload.single("profile_picture"), validateCreateUser, createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", upload.single("profile_picture"), validatePutUpdateUser, putUpdateUserById);
router.patch("/:id", upload.single("profile_picture"), validatePatchUpdateUser, patchUpdateUserById);
router.delete("/:id", deleteUserById);

export default router;
