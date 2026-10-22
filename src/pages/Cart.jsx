
import {Container,Row,Col,Card,Button,} from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiMinus,FiPlus,FiTrash2,FiArrowRight,FiTruck,} from "react-icons/fi";
import { removeFromCart,calcTotalAmount,increasreQauntity,decreasreQauntity,} from "../store/slices/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();

  const items = useSelector(
    (state) => state.cart.items
  );

  const totalAmount = useSelector(
    (state) => state.cart.totalAmount
  );

  useEffect(() => {
    dispatch(calcTotalAmount());
  }, [dispatch]);

  const tax = Math.round(totalAmount * 0.08 * 100) / 100;

  const total =
    Math.round((totalAmount + tax) * 100) / 100;

  return (
    <>
      <div
        style={{
          backgroundColor: "#f8f9ff",
          minHeight: "100vh",
        }}
      >
        <Container fluid className="px-4 px-lg-5 py-4">

          <h2 className="fw-bold mb-4">
            Your Shopping Cart
          </h2>

          <Row className="g-4">

            <Col lg={8}>

              {items.length === 0 ? (

                <Card
                  className="border-0 text-center p-5"
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                  }}
                >

                  <h4 className="fw-bold">
                    Your cart is feeling light
                  </h4>

                  <p className="text-muted">
                    It looks like you haven't added anything
                    to your cart yet.
                  </p>

                  <Button
                    as={Link}
                    to="/products"
                    style={{
                      backgroundColor: "#3927d8",
                      border: "none",
                    }}
                  >
                    Start Shopping
                  </Button>

                </Card>

              ) : (

                items.map((item) => (

                  <Card
                    key={item.id}
                    className="mb-3"
                    style={{
                      border: "1px solid #c8cee0",
                      borderRadius: "10px",
                    }}
                  >

                    <Card.Body>

                      <Row className="align-items-center">

                        <Col xs={4} md={2}>

                          <img src={item.thumbnail}alt={item.title}
                            style={{
                              width: "100%",
                              height: "88px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />

                        </Col>

                        <Col xs={8} md={5}>

                          <h5 className="fw-bold mb-1">
                            {item.title}
                          </h5>

                          <p className="text-muted small mb-3">
                            {item.brand} | {item.category}
                          </p>

                          <div
                            className="d-flex align-items-center"
                            style={{
                              width: "65px",
                              border: "1px solid #c8cee0",
                              borderRadius: "5px",
                              overflow: "hidden",
                            }}
                          >

                            <Button
                              variant="light"
                              size="sm"
                              onClick={() =>
                                dispatch(
                                  decreasreQauntity(item.id)
                                )
                              }
                              style={{
                                border: "none",
                                padding: "2px 6px",
                              }}
                            >
                              <FiMinus size={13} />
                            </Button>

                            <span
                              className="small"
                              style={{
                                padding: "0 5px",
                              }}
                            >
                              {item.quantity}
                            </span>

                            <Button
                              variant="light"
                              size="sm"
                              onClick={() =>
                                dispatch(
                                  increasreQauntity(item.id)
                                )
                              }
                              style={{
                                border: "none",
                                padding: "2px 6px",
                              }}
                            >
                              <FiPlus size={13} />
                            </Button>

                          </div>

                        </Col>

                        <Col
                          xs={6}
                          md={3}
                          className="mt-3 mt-md-0"
                        >

                          <h5
                            className="fw-bold mb-0"
                            style={{
                              color: "#3927d8",
                            }}
                          >
                            ${item.price}
                          </h5>

                        </Col>

                        <Col
                          xs={6}
                          md={2}
                          className="text-end mt-3 mt-md-0"
                        >

                          <Button
                            variant="link"
                            className="text-danger text-decoration-none p-0"
                            onClick={() =>
                              dispatch(
                                removeFromCart(item.id)
                              )
                            }
                          >
                            <FiTrash2
                              size={14}
                              className="me-1"
                            />
                            Remove
                          </Button>

                        </Col>

                      </Row>

                    </Card.Body>

                  </Card>

                ))

              )}

            </Col>

            <Col lg={4}>

              <Card
                className="border-0"
                style={{
                  backgroundColor: "#edf2ff",
                  borderRadius: "10px",
                }}
              >

                <Card.Body className="p-4">

                  <h4 className="fw-bold mb-4">
                    Order Summary
                  </h4>

                  <div className="d-flex justify-content-between mb-3">

                    <span className="text-muted">
                      Subtotal
                    </span>

                    <strong>
                      ${totalAmount}
                    </strong>

                  </div>

                  <div className="d-flex justify-content-between mb-3">

                    <span className="text-muted">
                      Shipping
                    </span>

                    <strong className="text-success">
                      Free
                    </strong>

                  </div>

                  <div className="d-flex justify-content-between mb-3">

                    <span className="text-muted">
                      Estimated Tax
                    </span>

                    <strong>
                      ${tax}
                    </strong>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-4">

                    <h4 className="fw-bold mb-0">
                      Total
                    </h4>

                    <h4
                      className="fw-bold mb-0"
                      style={{
                        color: "#3927d8",
                      }}
                    >
                      ${total}
                    </h4>

                  </div>

                  <Button
                    as={Link}
                    to="/checkout"
                    className="w-100"
                    style={{
                      backgroundColor: "#3927d8",
                      border: "none",
                      padding: "11px",
                    }}
                  >
                    Proceed to Checkout
                    <FiArrowRight className="ms-2" />
                  </Button>

                  <p className="text-muted text-center small mt-3">
                    By proceeding to checkout, you agree to
                    ShopStream's terms and privacy policy.
                  </p>

                  <hr />

                  <div
                    className="d-flex align-items-center gap-3 p-3 mt-3"
                    style={{
                      backgroundColor: "#e1ebff",
                      borderRadius: "8px",
                    }}
                  >

                    <FiTruck
                      size={21}
                      color="#3927d8"
                    />

                    <div>

                      <strong className="small d-block">
                        Free Express Delivery
                      </strong>

                      <span className="text-muted small">
                        Arrives by Oct 24 - 26
                      </span>

                    </div>

                  </div>

                </Card.Body>

              </Card>

            </Col>

          </Row>

        </Container>
      </div>

      <footer
        style={{
          backgroundColor: "#dce5fa",
        }}
      >

        <Container fluid className="px-4 px-lg-5">

          <Row className="py-4 align-items-center">

            <Col md={4}>

              <h6
                className="fw-bold mb-1"
                style={{
                  color: "#3927d8",
                }}
              >
                ShopStream
              </h6>

              <small>
                © 2024 ShopStream Inc. All rights reserved.
              </small>

            </Col>

            <Col md={5}>

              <div className="d-flex justify-content-center gap-3 small">

                <span>
                  Privacy Policy
                </span>

                <span>
                  Terms of Service
                </span>

                <span>
                  Contact Us
                </span>

                <span>
                  Shipping Info
                </span>

              </div>

            </Col>

            <Col md={3}>

              <div className="d-flex justify-content-end">
                <FiTruck />
              </div>

            </Col>

          </Row>

        </Container>

      </footer>
    </>
  );
}
