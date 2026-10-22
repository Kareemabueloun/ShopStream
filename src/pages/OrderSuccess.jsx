
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Container,Row,Col,Card,Button,ProgressBar,} from "react-bootstrap";
import { FiCheck,FiTruck,FiPackage,FiHelpCircle } from "react-icons/fi";

export default function OrderSuccess() {
  const navigate = useNavigate();

  // Get the latest saved order without useEffect or setState
  const order = useMemo(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("shopstreamOrders") || "[]"
    );

    return savedOrders.length > 0
      ? savedOrders[savedOrders.length - 1]
      : null;
  }, []);

  const formatPrice = (price) =>
    `$${Number(price || 0).toFixed(2)}`;

  const customer = order?.customer || {};
  const items = order?.items || [];

  const subtotal =
    order?.subtotal ??
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 1),
      0
    );

  const shippingCost = Number(order?.shippingCost || 0);
  const tax = Number(order?.tax || 0);
  const discount = Number(order?.discount || 0);

  const total =
    order?.total ??
    subtotal + shippingCost + tax - discount;

  const orderNumber = order?.orderId
    ? String(order.orderId).replace(/^SS-/, "")
    : "N/A";

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      <Container fluid="lg" className="py-4 py-lg-5 flex-grow-1">

        {/* SUCCESS HEADER */}

        <div className="text-center mb-4 mb-lg-5">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#65efbd",
              color: "#087957",
            }}
          >
            <FiCheck size={30} />
          </div>

          <h1 className="fw-bold text-dark fs-2">
            Order #{orderNumber} Confirmed
          </h1>

          <p className="text-secondary mb-0">
            Woohoo! Your order has been placed successfully.
            <br />
            Thank you for shopping with ShopStream.
          </p>
        </div>


        <Row className="g-4">
          <Col lg={8}>
            <Card className="h-100 border rounded-3 shadow-sm bg-white">
              <Card.Body className="p-3 p-lg-4">

                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h5 className="fw-bold mb-2">
                      Estimated Delivery
                    </h5>

                    <p className="text-success fw-semibold small mb-0">
                      {deliveryDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <FiTruck
                    size={24}
                    className="text-secondary"
                  />
                </div>

                {/* ORDER PROGRESS */}

                <Row className="align-items-center text-center g-0 mb-4">

                  <Col xs={3}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 text-white"
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#3925d9",
                      }}
                    >
                      <FiCheck size={16} />
                    </div>

                    <small className="fw-semibold">
                      Placed
                    </small>
                  </Col>

                  <Col xs={3}>
                    <ProgressBar
                      now={100}
                      variant="primary"
                      style={{
                        height: 2,
                        borderRadius: 0,
                        marginTop: -22,
                      }}
                    />
                  </Col>

                  <Col xs={3}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#eef1fa",
                        color: "#626b7d",
                      }}
                    >
                      <FiPackage size={15} />
                    </div>

                    <small className="text-secondary">
                      Processing
                    </small>
                  </Col>

                  <Col xs={3}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#eef1fa",
                        color: "#626b7d",
                      }}
                    >
                      <FiTruck size={15} />
                    </div>

                    <small className="text-secondary">
                      Shipped
                    </small>
                  </Col>

                </Row>

                <hr />

                {/* SHIPPING DETAILS */}

                <Row className="g-4 pt-2">

                  <Col sm={6}>
                    <h6 className="text-secondary fw-bold small">
                      SHIPPING ADDRESS
                    </h6>

                    <div className="small text-dark">
                      <div className="fw-semibold">
                        {customer.firstName || ""}{" "}
                        {customer.lastName || ""}
                      </div>

                      <div>
                        {customer.address || "Address not provided"}
                      </div>

                      <div>
                        {customer.city || ""}
                        {customer.zipCode
                          ? `, ${customer.zipCode}`
                          : ""}
                      </div>

                      {customer.phone && (
                        <div>{customer.phone}</div>
                      )}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <h6 className="text-secondary fw-bold small">
                      SHIPPING METHOD
                    </h6>

                    <p className="small mb-1">
                      Standard Delivery
                    </p>

                    <p className="text-secondary small mb-0">
                      3–5 Business Days
                    </p>
                  </Col>

                </Row>

              </Card.Body>
            </Card>
          </Col>

          {/* ORDER SUMMARY */}

          <Col lg={4}>
            <Card
              className="h-100 border rounded-3"
              style={{ backgroundColor: "#f0f3ff" }}
            >
              <Card.Body className="p-3 p-lg-4">

                <h5 className="fw-bold mb-4">
                  Order Summary
                </h5>

                <div className="d-flex flex-column gap-3 mb-4">

                  {items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        src={
                          item.thumbnail ||
                          item.image ||
                          "https://placehold.co/100x100?text=Product"
                        }
                        alt={item.title || item.name || "Product"}
                        className="rounded border bg-white p-1 flex-shrink-0"
                        style={{
                          width: 58,
                          height: 58,
                          objectFit: "contain",
                        }}
                      />

                      <div className="flex-grow-1 overflow-hidden">
                        <div className="fw-semibold small">
                          {item.title || item.name || "Product"}
                        </div>

                        <div className="text-secondary small">
                          Qty: {item.quantity || 1}
                        </div>

                        {item.brand && (
                          <div className="text-secondary small">
                            {item.brand}
                          </div>
                        )}
                      </div>

                      <div className="fw-semibold small text-nowrap">
                        {formatPrice(
                          Number(item.price || 0) *
                            Number(item.quantity || 1)
                        )}
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <p className="text-secondary small">
                      No order items found.
                    </p>
                  )}

                </div>

                <hr />

                <div className="d-flex justify-content-between small text-secondary mb-3">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between small text-success mb-3">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between small text-secondary mb-3">
                  <span>Shipping</span>

                  <span
                    className={
                      shippingCost === 0
                        ? "text-success fw-semibold"
                        : ""
                    }
                  >
                    {shippingCost === 0
                      ? "FREE"
                      : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="d-flex justify-content-between small text-secondary mb-3">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">
                    Total
                  </span>

                  <span
                    className="fw-bold fs-5"
                    style={{ color: "#3925d9" }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>

              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* ACTION BUTTONS */}

        <div className="d-flex justify-content-center flex-wrap gap-3 my-4">

          <Button
            className="px-4 py-2"
            style={{
              backgroundColor: "#3925d9",
              borderColor: "#3925d9",
              minWidth: 200,
            }}
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </Button>

          <Button
            variant="outline-primary"
            className="px-4 py-2"
            style={{ minWidth: 200 }}
            onClick={() => navigate("/profile")}
          >
            View Order History
          </Button>

        </div>

        {/* CUSTOMER SUPPORT */}

        <div
          className="d-flex flex-wrap align-items-center gap-3 rounded-3 border p-3 p-lg-4"
          style={{
            backgroundColor: "#d9faf0",
            borderColor: "#a6eedc",
          }}
        >

          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: 38,
              height: 38,
              backgroundColor: "#65efbd",
              color: "#087957",
            }}
          >
            <FiHelpCircle size={20} />
          </div>

          <div className="flex-grow-1">
            <h6 className="mb-1">
              Need help with your order?
            </h6>

            <p className="small text-secondary mb-0">
              Our support team is available to help you.
              Reference order #{orderNumber} when contacting us.
            </p>
          </div>

          <Button
            size="sm"
            className="rounded-pill px-4"
            style={{
              backgroundColor: "#00835f",
              borderColor: "#00835f",
            }}
            onClick={() => navigate("/profile")}
          >
            Contact Support
          </Button>

        </div>

      </Container>

      {/* FOOTER */}

      <footer
        className="border-top px-3 px-lg-5 py-3"
        style={{ backgroundColor: "#e0e7f8" }}
      >
        <Row className="align-items-center g-3">

          <Col md={2}>
            <span
              className="fw-bold small"
              style={{ color: "#3925d9" }}
            >
              ShopStream
            </span>
          </Col>

          <Col md={6}>
            <div className="d-flex flex-wrap gap-3 small text-secondary">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Us</span>
              <span>Shipping Info</span>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
            <small className="text-secondary">
              © {new Date().getFullYear()} ShopStream Inc. All rights reserved.
            </small>
          </Col>

        </Row>
      </footer>

    </div>
  );
}
