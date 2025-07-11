import { Router } from "express";
import {
  createItem,
  deleteItemById,
  getAllItems,
  getItemById,
  patchUpdateItemById,
  putUpdateItemById,
} from "../controllers/itemController.js";
import {
  validateCreateItem,
  validatePatchUpdateItem,
  validatePutUpdateItem,
} from "../middlewares/itemInputValidator.js";

const router = Router();

router.post("/", validateCreateItem, createItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.put("/:id", validatePutUpdateItem, putUpdateItemById);
router.patch("/:id", validatePatchUpdateItem, patchUpdateItemById);
router.delete("/:id", deleteItemById);

export default router;
