
import { Container,Row,Col,Card,Button,} from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addTocart } from "../store/slices/cartSlice";
import { FiShoppingCart,FiHeart,FiTruck,FiShield,FiHeadphones,FiArrowRight,FiGlobe,FiMail,} from "react-icons/fi";

export default function ProductDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Get Product
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/${id}`
        );

        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProduct();
  }, [id]);

  // Get Recommended Products
  useEffect(() => {
    async function fetchRecommendedProducts() {
      try {
        const response = await axios.get(
          "https://dummyjson.com/products?limit=4"
        );

        setRecommendedProducts(response.data.products);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRecommendedProducts();
  }, []);

  function increaseQuantity() {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  if (!product.id) {
    return (
      <Container className="py-5">
        <h5>Loading...</h5>
      </Container>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <Container className="py-3">
        <div className="small text-muted">
          <Link
            to="/"
            className="text-decoration-none text-muted"
          >
            Home
          </Link>

          {" > "}

          <Link
            to="/products"
            className="text-decoration-none text-muted"
          >
            Products
          </Link>

          {" > "}

          <span className="text-muted">
            {product.category}
          </span>

          {" > "}

          <span className="text-dark">
            {product.title}
          </span>
        </div>
      </Container>

      {/* Product */}
      <Container>
        <Row className="g-4">

          {/* Images */}
          <Col lg={6}>
            <Row className="g-3">

              <Col xs={2}>
                <div className="d-flex flex-column gap-2">
                  {product.images &&
                    product.images.map((image, index) => (
                      <Button
                        key={index}
                        variant="light"
                        onClick={() => setActiveImage(index)}
                        className="p-1"
                        style={{
                          border:
                            activeImage === index
                              ? "2px solid #3127db"
                              : "1px solid #d7dbea",
                        }}
                      >
                        <img
                          src={image}
                          alt={product.title}
                          style={{
                            width: "100%",
                            height: "55px",
                            objectFit: "cover",
                          }}
                        />
                      </Button>
                    ))}
                </div>
              </Col>

              <Col xs={10}>
                <div
                  className="position-relative"
                  style={{
                    border: "1px solid #d7dbea",
                    borderRadius: "7px",
                    backgroundColor: "#edf1fb",
                    height: "430px",
                  }}
                >
                  <img
                    src={
                      product.images
                        ? product.images[activeImage]
                        : product.thumbnail
                    }
                    alt={product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />

                  <Button
                    variant="light"
                    className="position-absolute top-0 end-0 m-2 rounded-circle"
                  >
                    <FiHeart />
                  </Button>
                </div>
              </Col>

            </Row>
          </Col>

          {/* Details */}
          <Col lg={6}>
            <div className="mb-2">
              <span className="badge bg-success">
                New Arrival
              </span>

              <span className="small text-muted ms-2">
                SKU: {product.sku}
              </span>
            </div>

            <h2 className="fw-bold">
              {product.title}
            </h2>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="text-success">
                ★★★★★
              </span>

              <span>
                {product.rating}
              </span>

              <span className="small text-muted">
                {product.reviews
                  ? product.reviews.length
                  : 0}{" "}
                Reviews
              </span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <h2 className="fw-bold mb-0">
                ${product.price}
              </h2>

              {product.discountPercentage && (
                <span className="small text-muted">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <p className="small text-muted mt-1">
              Shipping calculated at checkout.
              Free shipping on orders over $500.
            </p>

            <p className="text-muted mt-4">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-3">
              <p className="small fw-bold mb-2">
                Quantity
              </p>

              <div
                className="d-flex align-items-center"
                style={{
                  width: "110px",
                  border: "1px solid #d7dbea",
                  borderRadius: "5px",
                }}
              >
                <Button
                  variant="light"
                  onClick={decreaseQuantity}
                  style={{
                    border: "none",
                  }}
                >
                  -
                </Button>

                <span className="mx-auto">
                  {quantity}
                </span>

                <Button
                  variant="light"
                  onClick={increaseQuantity}
                  style={{
                    border: "none",
                  }}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Buttons */}
            <Row className="g-2">
              <Col xs={8}>
                <Button
                  className="w-100"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      dispatch(addTocart(product));
                    }
                  }}
                  style={{
                    backgroundColor: "#3127db",
                    border: "none",
                  }}
                >
                  <FiShoppingCart className="me-2" />
                  Add to Cart
                </Button>
              </Col>

              <Col xs={4}>
                <Button
                  className="w-100"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      dispatch(addTocart(product));
                    }

                    navigate("/checkout");
                  }}
                  style={{
                    backgroundColor: "#057a55",
                    border: "none",
                  }}
                >
                  Buy Now
                </Button>
              </Col>
            </Row>

            {/* Services */}
            <Row className="mt-4 g-3">
              <Col md={4}>
                <div className="small">
                  <FiShield className="text-success me-1" />
                  2 Year Warranty
                </div>
              </Col>

              <Col md={4}>
                <div className="small">
                  <FiTruck className="text-success me-1" />
                  Fast 2-Day Delivery
                </div>
              </Col>

              <Col md={4}>
                <div className="small">
                  <FiHeadphones className="text-success me-1" />
                  Lifetime Support
                </div>
              </Col>
            </Row>
          </Col>

        </Row>
      </Container>

      {/* Specifications */}
      <Container className="py-5">
        <div className="border-bottom mb-4">
          <span
            className="d-inline-block pb-2"
            style={{
              color: "#3127db",
              borderBottom: "2px solid #3127db",
            }}
          >
            Specifications
          </span>

          <span className="ms-4 text-muted small">
            User Reviews
          </span>

          <span className="ms-4 text-muted small">
            Q&A
          </span>

          <span className="ms-4 text-muted small">
            Downloads
          </span>
        </div>

        <Row className="g-3">
          <Col md={4}>
            <Card
              className="border-0 h-100"
              style={{
                backgroundColor: "#edf1fb",
              }}
            >
              <Card.Body>
                <h5 className="fw-bold">
                  Product Specs
                </h5>

                <div className="small mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Brand</span>
                    <span>{product.brand}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Category</span>
                    <span>{product.category}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Stock</span>
                    <span>{product.stock}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card
              className="border-0 h-100"
              style={{
                backgroundColor: "#edf1fb",
              }}
            >
              <Card.Body>
                <h5 className="fw-bold">
                  Physical
                </h5>

                <div className="small mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Weight</span>
                    <span>{product.weight}</span>
                  </div>

                  {product.dimensions && (
                    <>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Width</span>
                        <span>{product.dimensions.width}</span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span>Height</span>
                        <span>{product.dimensions.height}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Depth</span>
                        <span>{product.dimensions.depth}</span>
                      </div>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card
              className="border-0 h-100"
              style={{
                backgroundColor: "#edf1fb",
              }}
            >
              <Card.Body>
                <h5 className="fw-bold">
                  In the Box
                </h5>

                <p className="small text-muted mt-3">
                  Everything you need to start your
                  product experience.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Complete Your Setup */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#f4f6fd",
        }}
      >
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">
                Complete Your Setup
              </h2>

              <p className="text-muted mb-0">
                Recommended products based on your interest.
              </p>
            </div>

            <Link
              to="/products"
              className="text-decoration-none fw-bold"
              style={{
                color: "#3127db",
              }}
            >
              View All
              <FiArrowRight className="ms-2" />
            </Link>
          </div>

          <Row className="g-4">
            {recommendedProducts.map((item) => (
              <Col md={6} lg={3} key={item.id}>
                <Card
                  className="h-100"
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <Link
                    to={`/products/${item.id}`}
                    className="text-decoration-none"
                  >
                    <Card.Img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{
                        height: "165px",
                        objectFit: "contain",
                        backgroundColor: "#edf1fb",
                      }}
                    />
                  </Link>

                  <Card.Body>
                    <Card.Title
                      className="fw-bold"
                      style={{
                        fontSize: "15px",
                      }}
                    >
                      {item.title}
                    </Card.Title>

                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className="fw-bold"
                        style={{
                          color: "#087f5b",
                        }}
                      >
                        ${item.price}
                      </span>

                      <Button
                        style={{
                          backgroundColor: "#3127db",
                          border: "none",
                        }}
                      >
                        <FiShoppingCart />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#dbe5f8",
        }}
      >
        <Container className="py-5">
          <Row className="g-4">
            <Col md={4}>
              <h5
                className="fw-bold"
                style={{
                  color: "#3127db",
                }}
              >
                ShopStream
              </h5>

              <p className="text-muted mb-0">
                Your destination for professional audio gear
                and premium electronics.
              </p>
            </Col>

            <Col md={5}>
              <div className="d-flex gap-4">
                <span className="small">
                  Privacy Policy
                </span>

                <span className="small">
                  Terms of Service
                </span>

                <span className="small">
                  Contact Us
                </span>

                <span className="small">
                  Shipping Info
                </span>
              </div>
            </Col>

            <Col md={3}>
              <div className="d-flex justify-content-end gap-3">
                <FiGlobe />
                <FiMail />
              </div>

              <p className="small text-muted text-end mt-2 mb-0">
                © 2024 ShopStream Inc. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}
