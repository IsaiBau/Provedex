import express from "express";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../controllers/SupplierController.js";

const router = express.Router();

router.get("/suppliers", getSuppliers);
router.get("/suppliers/:uuid", getSupplierById);
router.post("/suppliers", createSupplier);
router.patch("/suppliers/:uuid", updateSupplier);
router.delete("/suppliers/:uuid", deleteSupplier);

export default router;
