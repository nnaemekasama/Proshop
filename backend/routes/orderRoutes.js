import express from "express"
const router = express.Router()
import { addOrderItems, getOrderById, updateOrderToPaid } from "../controllers/orderController.js"
import { protect } from '../middleware/authMiddleware.js'


router.route('/').post(protect, addOrderItems)
router.route('/:id').get(protect, getOrderById)
router.route('/pay').post(protect, updateOrderToPaid)

export default router