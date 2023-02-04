import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Meta from '../components/Meta'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import { useParams } from "react-router-dom";
import Message from '../components/Message'
import { listProducts  } from '../actions/productActions'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = () => {
  const dispatch = useDispatch()
  let { keyword } = useParams();
  let { pageNumber } = useParams() || 1;
  const productList = useSelector(state => state.productList)
  const { loading, error, products, page, pages } = productList
 

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

 
  return (
    <>
    <Meta />
    <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-dark">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : 
      <>
      <Row>
        {products.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
      />
      </>
      }
      
    </>
  )
}

export default HomeScreen