import express from "express"
const router = express.Router()
import { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid } from "../controllers/orderController.js"
import { protect } from '../middleware/authMiddleware.js'


router.route('/').post(protect, addOrderItems)
router.route('/pay').post(protect, updateOrderToPaid)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
export default router