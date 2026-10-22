import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container,Row,Col,Card,Form,Button,Badge,InputGroup,} from "react-bootstrap";
import { FiTruck,FiCreditCard,FiShield,FiArrowRight,FiCheckCircle,FiShoppingBag,} from "react-icons/fi";
import toast from "react-hot-toast";
import { clearCart } from "../store/slices/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.items || []
  );

  const user = useSelector((state) => state.auth.user);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });


  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
      Number(item.quantity || 1),
    0
  );

  const shippingCost = 0;
  const tax = subtotal * 0.0825;

  const total = Math.max(
    0,
    subtotal + shippingCost + tax - discount
  );

  const formatPrice = (price) =>
    `$${Number(price).toFixed(2)}`;
    // Shipping
  const handleShippingChange = (event) => {
    setShipping({
      ...shipping,
      [event.target.name]: event.target.value,
    });
  };

  //Payment
  const handlePaymentChange = (event) => {
    setPayment({
      ...payment,
      [event.target.name]: event.target.value,
    });
  };

//Promocode

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code.");
      return;
    }

    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      setIsPromoApplied(true);

      toast.success(
        "Promo code applied! You saved 10%."
      );
    } else {
      setDiscount(0);
      setIsPromoApplied(false);

      toast.error("Invalid promo code.");
    }
  };

  // place Order

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!user) {
      toast.error("Please log in before placing an order.");
      navigate("/login");
      return;
    }

    if (
      paymentMethod === "card" &&
      (
        !payment.cardNumber.trim() ||
        !payment.expiryDate.trim() ||
        !payment.cvc.trim()
      )
    ) {
      toast.error(
        "Please complete your card information."
      );
      return;
    }

    const newOrderId = `SS-${Date.now()}`;

    const order = {
      orderId: newOrderId,
      userId: user.id,
      userEmail: user.email || "",
      username: user.username || "",
      customer: {
        ...shipping,
        userId: user.id,
        email: user.email || "",
      },
      paymentMethod,
      items: cartItems,
      subtotal,
      tax,
      discount,
      total,
      createdAt: new Date().toISOString(),
      status: "Processing",
    };

    try {
      const previousOrders = JSON.parse(
        localStorage.getItem("shopstreamOrders") || "[]"
      );

      localStorage.setItem(
        "shopstreamOrders",
        JSON.stringify([...previousOrders, order])
      );

      dispatch(clearCart());

      toast.success("Demo order placed successfully!");

      navigate("/order-success");
    } catch {
      toast.error(
        "Could not save your order. Please try again."
      );
    }
  };

  return (
    <Container fluid className="bg-light py-4">
      <Container>
        {/* PAGE HEADER */}

        <div className="mb-4">
          <h2 className="fw-bold">
            Checkout
          </h2>

          <p className="text-muted">
            Complete your order information below.
          </p>
        </div>

        <Row className="g-4">
          {/* SHIPPING AND PAYMENT */}

          <Col lg={8}>
            <Form onSubmit={handlePlaceOrder}>
              {/* SHIPPING INFORMATION */}

              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <FiTruck
                      size={24}
                      className="me-2 text-primary"
                    />

                    <h4 className="fw-bold mb-0">
                      Shipping Information
                    </h4>
                  </div>

                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          First Name
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="firstName"
                          value={shipping.firstName}
                          onChange={handleShippingChange}
                          placeholder="Enter first name"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Last Name
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="lastName"
                          value={shipping.lastName}
                          onChange={handleShippingChange}
                          placeholder="Enter last name"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>
                          Address
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="address"
                          value={shipping.address}
                          onChange={handleShippingChange}
                          placeholder="Street address"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          City
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="city"
                          value={shipping.city}
                          onChange={handleShippingChange}
                          placeholder="Enter city"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          ZIP Code
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={shipping.zipCode}
                          onChange={handleShippingChange}
                          placeholder="Enter ZIP code"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>
                          Phone Number
                        </Form.Label>

                        <Form.Control
                          type="tel"
                          name="phone"
                          value={shipping.phone}
                          onChange={handleShippingChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* PAYMENT METHOD */}

              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-4">
                    <FiCreditCard
                      size={24}
                      className="me-2 text-primary"
                    />

                    <h4 className="fw-bold mb-0">
                      Payment Method
                    </h4>
                  </div>

                  <Form.Check
                    type="radio"
                    name="paymentMethod"
                    id="cardPayment"
                    className="mb-3"
                    label="Credit / Debit Card"
                    checked={paymentMethod === "card"}
                    onChange={() =>
                      setPaymentMethod("card")
                    }
                  />

                  <Form.Check
                    type="radio"
                    name="paymentMethod"
                    id="paypalPayment"
                    className="mb-4"
                    label="PayPal"
                    checked={paymentMethod === "paypal"}
                    onChange={() =>
                      setPaymentMethod("paypal")
                    }
                  />

                  {paymentMethod === "card" && (
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>
                            Card Number
                          </Form.Label>

                          <Form.Control
                            type="text"
                            name="cardNumber"
                            value={payment.cardNumber}
                            onChange={handlePaymentChange}
                            placeholder="Enter card number"
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Expiry Date
                          </Form.Label>

                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={payment.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            CVC
                          </Form.Label>

                          <Form.Control
                            type="text"
                            name="cvc"
                            value={payment.cvc}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="p-3 bg-light rounded">
                      <p className="mb-0 text-muted">
                        PayPal is available as a demo
                        payment option.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 text-muted small">
                    <FiShield className="me-2" />
                    Demo checkout only. No real payment
                    will be processed.
                  </div>
                </Card.Body>
              </Card>

              {/* PLACE ORDER */}

              <Button
                type="submit"
                className="w-100 py-3"
                disabled={cartItems.length === 0}
                style={{
                  backgroundColor: "#3927d8",
                  border: "none",
                }}
              >
                <FiCheckCircle className="me-2" />
                Place Order
                <FiArrowRight className="ms-2" />
              </Button>
            </Form>
          </Col>

          {/* ORDER SUMMARY */}

          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <FiShoppingBag
                    size={23}
                    className="me-2 text-primary"
                  />

                  <h4 className="fw-bold mb-0">
                    Order Summary
                  </h4>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-muted">
                    Your cart is empty.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center mb-3"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        width="60"
                        height="60"
                        className="rounded me-3"
                      />

                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">
                          {item.title}
                        </h6>

                        <small className="text-muted">
                          Quantity: {item.quantity || 1}
                        </small>
                      </div>

                      <strong>
                        {formatPrice(
                          Number(item.price || 0) *
                          Number(item.quantity || 1)
                        )}
                      </strong>
                    </div>
                  ))
                )}

                <hr />

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Subtotal
                  </span>

                  <strong>
                    {formatPrice(subtotal)}
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
                    {formatPrice(tax)}
                  </strong>
                </div>

                {/* PROMO CODE */}

                <Form.Group className="mb-3">
                  <Form.Label>
                    Promo Code
                  </Form.Label>

              <InputGroup>
                <Form.Control
                  type="text"
                  value={promoCode}
                  onChange={(event) => {
                    setPromoCode(event.target.value);
                    setIsPromoApplied(false);
                    setDiscount(0);
                  }}
                  placeholder="Enter promo code"
                />

                <Button
                  variant="outline-primary"
                  onClick={applyPromoCode}
                >
                  Apply
                </Button>
              </InputGroup>

              {isPromoApplied && (
                <Badge bg="success" className="mt-2">
                  SAVE10 applied
                </Badge>
              )}
            </Form.Group>

            {discount > 0 && (
              <div className="d-flex justify-content-between mb-3 text-success">
                <span>Discount</span>

                <strong>
                  -{formatPrice(discount)}
                </strong>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Total</h5>
              <h4
                className="fw-bold mb-0"
                style={{ color: "#3927d8" }}
              >
                {formatPrice(total)}
              </h4>
            </div>

            <div className="d-flex align-items-center gap-3 p-3 rounded bg-light">
              <FiTruck
                size={22}
                className="text-primary"
              />

              <div>
                <strong className="small d-block">
                  Free Delivery
                </strong>

                <span className="text-muted small">
                  Shipping cost: $0.00
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </Container>
  </Container>
  );
}
