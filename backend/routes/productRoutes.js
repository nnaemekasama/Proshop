import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getTopProucts,
  reviewProduct,
  updateProduct,
} from "../controllers/productController.js";
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route("/")
.get(getProducts)
.post(protect, admin, createProduct)
router.route("/:id/reviews").post(protect, reviewProduct);
router.get("/top", getTopProucts);

router.route("/:id")
.get(getProductById)
.delete(protect, admin, deleteProduct)
.put(protect, admin, updateProduct)


export default router