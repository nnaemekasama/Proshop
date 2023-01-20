import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

export const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemPrice, 
        taxPrice,
        shippingPrice, 
        totalPrice 
    } = req.body
    

    if(orderItems && orderItems.length === 0 ) {
        res.status(400)
        throw new Error('No order items')
        return
    } else {
        const order = new Order({
        orderItems, 
        user: req.user._id,
        shippingAddress, 
        paymentMethod, 
        itemPrice, 
        taxPrice,
        shippingPrice, 
        totalPrice 
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
  })

// @desc    GET order by ID
// @route   GET /api/orders/:id
// @access  Private

export const getOrderById = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id).populate('user', 'name email')

   if(order) {
    res.json(order)
   } else {
    res.status(404)
    throw new Error('Order not found')
   }
  })
// @desc    GET update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private



// @desc    GET paystackbtn
// @route   GET /api/
// @access  Private

export const updateOrderToPaid = asyncHandler(async (req, res) => {

    const {id, reference} = req.body
   const order = await Order.findById(id)

   if(order){
    const update = await Order.findByIdAndUpdate(id, {
        paystackReference: reference,
        isPaid: true,
        paidAt: new Date()
    })

    await update.save()

    if(update) {
        res.json(update)
    } else{
        res.status(404)
    throw new Error('Sorry Something Went')
    }
   } else{
    res.status(404)
    throw new Error('Order not found')
   }

  
  })

  export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  });
// @desc    GET loggedIn user order
// @route   GET /api/orders/myorders
// @access  Private

export const getMyOrders = asyncHandler(async (req, res) => {
   const orders = await Order.find({ user: req.user._id })
   res.json(orders)

  
  })

// @desc    GET all orders
// @route   GET /api/orders
// @access  Private/Admin

export const getOrders = asyncHandler(async (req, res) => {
   const orders = await Order.find({}).populate('user', 'id name')
   res.json(orders)

  
  })


