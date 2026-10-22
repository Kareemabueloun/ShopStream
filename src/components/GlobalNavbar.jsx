import {Container,Form,Nav,Navbar,} from "react-bootstrap";
import { Link } from "react-router-dom";
import {FiSearch,FiShoppingCart,FiUser,FiX,} from "react-icons/fi";

export default function GlobalNavbar({
  SearchValue,setSearchValue,
}) {

  return (
    <Navbar expand="lg"bg="light" className="border-bottom shadow-sm">
      <Container fluid>

        {/* Logo */}
        <Navbar.Brand as={Link} to="/"className="fw-bold text-primary fs-4">
          ShopStream
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* Links */}
          <Nav className="me-auto ms-3">

            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/products"
              onClick={() => setSearchValue("")}
            >
              Categories
            </Nav.Link>

          </Nav>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">

            {/* Search */}
            <div className="d-flex align-items-center border rounded">

              <Link
                to="/products"
                className="text-dark text-decoration-none"
              >
                <FiSearch className="ms-2" />
              </Link>

              <Form.Control
                type="search"
                placeholder="Search products..."
                value={SearchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                className="border-0 shadow-none"
              />

              {SearchValue !== "" && (
                <Link
                  to="/"
                  className="text-dark"
                  onClick={() => {
                    setSearchValue("");
                  }}
                >
                  <FiX className="me-2" />
                </Link>
              )}

            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="text-dark"
            >
              <FiShoppingCart size={21} />
            </Link>

            {/* User */}
            <Link
              to="/login"
              className="text-dark"
            >
              <FiUser size={21} />
            </Link>

          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}