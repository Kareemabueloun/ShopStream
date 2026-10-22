import { useState } from "react";
import {Container,Row,Col,Card,Button,} from "react-bootstrap";
import { Link } from "react-router-dom";
import {FiArrowRight,FiChevronLeft,FiChevronRight,FiHeadphones,FiTruck,FiShield,FiRefreshCw,} from "react-icons/fi";
import heroHeadphones from "../assets/home/hero-headphones.png";
import computing from "../assets/home/computing.png";
import wearables from "../assets/home/wearables.png";
import audio from "../assets/home/audio.png";
import homeTheater from "../assets/home/home-theater.png";
import airpods from "../assets/home/airpods.png";
import keyboard from "../assets/home/keyboard.png";
import drone from "../assets/home/drone.png";
import mouse from "../assets/home/mouse.png";

const categories = [
  {
    title: "Computing",
    description: "Work and play without limits",
    image: computing,
    link: "/products/category/computing",
  },
  {
    title: "Wearables",
    description: "Technology on your wrist",
    image: wearables,
    link: "/products/category/wearables",
  },
  {
    title: "Audio",
    description: "Sound that moves you",
    image: audio,
    link: "/products/category/audio",
  },
  {
    title: "Home Theater",
    description: "Your home entertainment",
    image: homeTheater,
    link: "/products/category/home-theater",
  },
];

const products = [
  {
    id: 1,
    brand: "AUDIO",
    title: "SoundPods Pro Gen 2",
    description: "Wireless audio experience",
    price: 199,
    image: airpods,
    badge: "BEST SELLER",
    link: "/products/category/audio",
  },
  {
    id: 2,
    brand: "ACCESSORIES",
    title: "StreamKey Ultra Slim",
    description: "Built for performance",
    price: 129,
    image: keyboard,
    badge: "",
    link: "/products/category/computing",
  },
  {
    id: 3,
    brand: "DRONES",
    title: "AeroStream V3",
    description: "Capture every moment",
    price: 849,
    image: drone,
    badge: "NEW",
    link: "/products/category/electronics",
  },
  {
    id: 4,
    brand: "GAMING",
    title: "Nebula Glide Pro",
    description: "Precision and comfort",
    price: 89,
    image: mouse,
    badge: "",
    link: "/products/category/computing",
  },
];

export default function Home() {
  const [featuredStart, setFeaturedStart] = useState(0);

  const visibleProducts = [
    ...products.slice(featuredStart),
    ...products.slice(0, featuredStart),
  ];

  const showPreviousProducts = () => {
    setFeaturedStart(
      (previous) =>
        (previous - 1 + products.length) % products.length
    );
  };

  const showNextProducts = () => {
    setFeaturedStart(
      (previous) => (previous + 1) % products.length
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="mb-3">
                <span className="badge bg-success">
                  NEW SEASON ARRIVALS
                </span>
              </div>

              <h1 className="display-4 fw-bold">
                Experience the Future
                <br />
                <span className="text-primary">
                  of Innovation.
                </span>
              </h1>

              <p className="text-muted mt-3">
                Explore our curated selection of premium electronics
                designed to elevate your daily stream of life.
                Combining engineering meets minimalist design.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Button
                  as={Link}
                  to="/products/category/electronics"
                  variant="primary"
                >
                  Shop Electronics
                </Button>

                <Button
                  as={Link}
                  to="/products"
                  variant="outline-primary"
                >
                  View Collections
                </Button>
              </div>
            </Col>

            <Col lg={6} className="text-center">
              <img
                src={heroHeadphones}
                alt="Headphones"
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Top Categories */}
      <section className="py-4">
        <Container fluid className="px-3 px-md-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="fw-bold mb-1">
                Top Categories
              </h2>

              <p className="text-muted mb-0">
                Curated gear for every lifestyle.
              </p>
            </div>

            <Link
              to="/products"
              className="text-decoration-none"
            >
              See All <FiArrowRight />
            </Link>
          </div>

          <Row className="g-3">
            {/* Computing */}
            <Col md={6}>
              <Link
                to={categories[0].link}
                className="d-block position-relative ratio ratio-4x3 overflow-hidden rounded-3 text-decoration-none"
              >
                <img
                  src={categories[0].image}
                  alt={categories[0].title}
                  className="w-100 h-100 object-fit-cover"
                />

                <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white bg-dark bg-opacity-50">
                  <h5 className="fw-bold mb-1">
                    {categories[0].title}
                  </h5>

                  <p className="mb-0 small">
                    {categories[0].description}
                  </p>
                </div>
              </Link>
            </Col>

            {/* Wearables, Audio and Home Theater */}
            <Col md={6}>
              <Row className="g-3">
                {categories.slice(1, 3).map((category) => (
                  <Col xs={6} key={category.title}>
                    <Link
                      to={category.link}
                      className="d-block position-relative ratio ratio-4x3 overflow-hidden rounded-3 text-decoration-none"
                    >
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-100 h-100 object-fit-cover"
                      />

                      <div className="position-absolute bottom-0 start-0 w-100 p-2 text-white bg-dark bg-opacity-50">
                        <h6 className="fw-bold mb-1">
                          {category.title}
                        </h6>

                        <p className="mb-0 small">
                          {category.description}
                        </p>
                      </div>
                    </Link>
                  </Col>
                ))}

                <Col xs={12}>
                  <Link
                    to={categories[3].link}
                    className="d-block position-relative ratio ratio-21x9 overflow-hidden rounded-3 text-decoration-none"
                  >
                    <img
                      src={categories[3].image}
                      alt={categories[3].title}
                      className="w-100 h-100 object-fit-cover"
                    />

                    <div className="position-absolute bottom-0 start-0 w-100 p-2 text-white bg-dark bg-opacity-50">
                      <h6 className="fw-bold mb-1">
                        {categories[3].title}
                      </h6>

                      <p className="mb-0 small">
                        {categories[3].description}
                      </p>
                    </div>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">
                Featured Products
              </h2>

              <p className="text-muted mb-0">
                The latest and greatest in tech innovation.
              </p>
            </div>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={showPreviousProducts}
                aria-label="Previous products"
              >
                <FiChevronLeft />
              </Button>

              <Button
                variant="outline-secondary"
                onClick={showNextProducts}
                aria-label="Next products"
              >
                <FiChevronRight />
              </Button>
            </div>
          </div>

          <Row className="g-3">
            {visibleProducts.map((product) => (
              <Col xs={6} md={3} key={product.id}>
                <Card className="h-100">
                  <Link
                    to={product.link}
                    className="text-decoration-none"
                  >
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.title}
                      />

                      {product.badge && (
                        <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </Link>

                  <Card.Body className="d-flex flex-column">
                    <small className="text-primary fw-bold">
                      {product.brand}
                    </small>

                    <Link
                      to={product.link}
                      className="text-decoration-none text-dark"
                    >
                      <Card.Title className="fs-6 mt-2">
                        {product.title}
                      </Card.Title>
                    </Link>

                    <Card.Text className="text-muted small">
                      {product.description}
                    </Card.Text>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold text-success mb-0">
                        ${product.price.toFixed(2)}
                      </h5>

                      <Button
                        as={Link}
                        to={product.link}
                        variant="outline-primary"
                        size="sm"
                        aria-label={`View ${product.title}`}
                      >
                        <FiArrowRight />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stay Ahead */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Stay Ahead
            </h2>

            <p className="text-muted">
              Everything you need for a better shopping experience.
            </p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="text-center">
                <FiTruck size={30} />

                <h5 className="fw-bold mt-3">
                  Fast Shipping
                </h5>

                <p className="text-muted">
                  Get your products delivered quickly.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="text-center">
                <FiShield size={30} />

                <h5 className="fw-bold mt-3">
                  Secure Shopping
                </h5>

                <p className="text-muted">
                  Your shopping experience is protected.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="text-center">
                <FiRefreshCw size={30} />

                <h5 className="fw-bold mt-3">
                  Easy Returns
                </h5>

                <p className="text-muted">
                  Simple and convenient returns.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="text-center">
                <FiHeadphones size={30} />

                <h5 className="fw-bold mt-3">
                  Customer Support
                </h5>

                <p className="text-muted">
                  We're here when you need us.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-top">
        <Container className="py-5">
          <Row className="g-4">
            <Col md={4}>
              <h4 className="fw-bold text-primary">
                ShopStream
              </h4>

              <p className="text-muted">
                Your destination for professional audio gear
                and premium electronics.
              </p>
            </Col>

            <Col md={2}>
              <h6 className="fw-bold">Shop</h6>

              <div className="d-flex flex-column gap-2">
                <Link
                  to="/products"
                  className="text-dark text-decoration-none"
                >
                  All Products
                </Link>

                <Link
                  to="/products/category/smartphones"
                  className="text-dark text-decoration-none"
                >
                  Smartphones
                </Link>

                <Link
                  to="/products/category/laptops"
                  className="text-dark text-decoration-none"
                >
                  Laptops
                </Link>
              </div>
            </Col>

            <Col md={2}>
              <h6 className="fw-bold">Support</h6>

              <div className="d-flex flex-column gap-2">
                <a href="#" className="text-dark text-decoration-none">
                  Contact Us
                </a>

                <a href="#" className="text-dark text-decoration-none">
                  Shipping Info
                </a>

                <a href="#" className="text-dark text-decoration-none">
                  Returns
                </a>
              </div>
            </Col>

            <Col md={2}>
              <h6 className="fw-bold">Legal</h6>

              <div className="d-flex flex-column gap-2">
                <a href="#" className="text-dark text-decoration-none">
                  Privacy Policy
                </a>

                <a href="#" className="text-dark text-decoration-none">
                  Terms of Service
                </a>
              </div>
            </Col>
          </Row>

          <hr />

          <div className="d-flex justify-content-between align-items-center">
            <p className="small text-muted mb-0">
              © 2024 ShopStream Inc. All rights reserved.
            </p>

            <div className="d-flex gap-3">
              <span>🌐</span>
              <span>✉</span>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
