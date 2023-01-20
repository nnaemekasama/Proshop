import React, {  useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'
import { deliverOrder, getOrderDetails } from '../actions/orderActions'
import { PaystackButton } from 'react-paystack'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'

const OrderScreen = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const navigate = useNavigate()
    const orderId = params.id 

    
    const publicKey = 'pk_test_5bec768bf533463f3ba24cf29085f3e425a6a882'
    const user = JSON.parse(localStorage.getItem('userInfo'))



   
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails


    const orderPay = useSelector(state => state.orderPay)
    const { loading:loadingPay, success:successPay  } = orderPay

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo  } = userLogin

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading:loadingDeliver, success:successDeliver  } = orderDeliver

  
    useEffect(() => {
        // if (!order || successPay) {
        //   dispatch({ type: ORDER_PAY_RESET });
        //   if (!order || order._id === id) {
        //     dispatch(getOrderDetails(id));
        //   }
        // }
        if (!userInfo) {
          navigate("/login");
        }
        if (successDeliver) {
          dispatch({ type: ORDER_DELIVER_RESET });
        }
        dispatch({ type: ORDER_PAY_RESET });
        dispatch(getOrderDetails(orderId));
      }, [dispatch, successDeliver, userInfo, orderId, navigate]);

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    if (!loading) {
        //   Calculate prices
        const addDecimals = (num) => {
          return (Math.round(num * 100) / 100).toFixed(2)
        }
    
        order.itemsPrice = addDecimals(
          order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
      }


      const componentProps = {
        email: user.email,
        amount: parseInt(order?.totalPrice) * 100,
        metadata: {
          name: user.name,
          phone: 123456789,
        },
        publicKey,
        text: "Pay Now",
        onSuccess: (res) =>{
        if(res.status === 'success'){
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            }
            const body = {
                reference: res.reference,
                id: order._id
            }
            console.log(res)
            axios.post('/api/orders/pay', body, config).then((resp) => {
                console.log(resp)
                window.location.reload()
            }).catch((err) => {
                console.log(err)
            })

        }
    },
        onClose: () => alert("try again!!!"),
      }




  return loading ? <Loader /> : error ? <Message variant='danger'>{error}
  </Message> : <>
        <h1>Order {order._id}</h1>
        <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p><strong>Name: </strong> {order.user.name}</p>
                    <p><strong>Email: </strong>{' '}
                    <a style={{textDecoration: 'none'}} 
                    href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                    <p>
                    <strong>Address: </strong>
                        {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                        {order.shippingAddress.postalCode},{' '}
                        {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt} </Message>
                    : <Message variant='danger'>Not Delivered</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                    </p>
                    {order.isPaid ? <Message variant='success'>Paid on {order.paidAt} </Message>
                    : <Message variant='danger'>Not Paid</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.length === 0 ? <Message>Order is empty</Message>
                    : (
                        <ListGroup variant='flush'>
                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} 
                                            fluid rounded />
                                        </Col>
                                        <Col>
                                            <Link style={{textDecoration: 'none'}} to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.qty} x ${item.price} = ${item.qty * item.price}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>${order.itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping</Col>
                            <Col>${order.shippingPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>${order.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  <Row>
                    {loadingPay && <Loader />}
                    {error && <Message>{error}</Message>}
                    <PaystackButton {...componentProps} className="paystack" />
                  </Row>
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Row>
                      <Button
                        type="button"
                        className="btn btn-block"
                        onClick={deliverHandler}
                      >
                        Mark As Shipped
                      </Button>
                    </Row>
                  </ListGroup.Item>
                )}
                </ListGroup>
            </Card>
        </Col>
    </Row>
  </>

}

export default OrderScreen