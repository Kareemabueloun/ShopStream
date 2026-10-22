import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaGlobe, FaNewspaper, FaDribbble } from "react-icons/fa";
import { FiCreditCard, FiGrid, FiMonitor } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-primary-subtle">

      {/* Main Footer */}
      <Container fluid className="px-4 py-4">

        <Row>
          {/* Left Side */}
          <Col md={6}>
            <h5 className="text-primary fw-bold mb-3">
              ShopStream
            </h5>

            <p className="text-secondary mb-3">
              A premium e-commerce experience dedicated
              <br />
              to delivering the world's most innovative
              <br />
              electronics right to your doorstep.
            </p>
            <div className="d-flex gap-2">

  <a
    href="https://www.google.com"
    target="_blank"
    rel="noreferrer"
    className="btn btn-outline-secondary rounded-circle"
  >
    <FaGlobe />
  </a>

  <a
    href="https://www.google.com"
    target="_blank"
    rel="noreferrer"
    className="btn btn-outline-secondary rounded-circle"
  >
    <FaNewspaper />
  </a>

  <a
    href="https://dribbble.com" target="_blank" rel="" className="btn btn-outline-secondary rounded-circle">
            <FaDribbble />
        </a>

        </div>
          </Col>

          {/* Right Side */}
          <Col md={6}>
            <Row>

              {/* Shop */}
              <Col xs={4}>
                <h6 className="fw-bold">
                  SHOP
                </h6>

                <Nav className="flex-column">
                  <Nav.Link className="p-0 text-secondary">
                    All Electronics
                  </Nav.Link>

                  <Nav.Link className="p-0 text-secondary">
                    Wearables
                  </Nav.Link>

                  <Nav.Link className="p-0 text-secondary">
                    Home Office
                  </Nav.Link>

                  <Nav.Link className="p-0 text-secondary">
                    New Arrivals
                  </Nav.Link>
                </Nav>
              </Col>

              {/* Support */}
              <Col xs={4}>
                <h6 className="fw-bold">
                  SUPPORT
                </h6>

                <Nav className="flex-column">
                  <Nav.Link className="p-0 text-secondary">
                    Contact Us
                  </Nav.Link>

                  <Nav.Link className="p-0 text-secondary">
                    Shipping Info
                  </Nav.Link>

                  <Nav.Link className="p-0 text-secondary">
                    Returns
                  </Nav.Link>

                  <Nav.Link className="p-0 text-secondary">
                    FAQ
                  </Nav.Link>
                </Nav>
              </Col>

              <Col xs={4}>
                <h6 className="fw-bold">
                  LEGAL
                </h6>

                <Nav className="flex-column">
                  <Nav.Link className="p-0 text-secondary">Privacy Policy</Nav.Link>
                  <Nav.Link className="p-0 text-secondary">Terms of Service</Nav.Link>
                </Nav>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Bottom Footer */}
      <Container fluid className="border-top px-4 py-3">
        <Row className="align-items-center">
          <Col><small className="text-secondary">© 2024 ShopStream Inc. All rights reserved.</small></Col>
          <Col className="text-end">
            <div className="d-flex justify-content-end gap-3 text-secondary">
              <FiCreditCard />
              <FiGrid />
              <FiMonitor />
            </div>
          </Col>

        </Row>
      </Container>

    </footer>
  );
}