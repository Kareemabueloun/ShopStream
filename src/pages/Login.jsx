import { useState } from "react";
import {Alert,Button,Card,Col,Container,Form,InputGroup,Row,} from "react-bootstrap";
import {Link,Navigate,useLocation,useNavigate,} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {FiArrowRight,FiEye,FiEyeOff,FiLock,FiMail,} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import { loginSuccess } from "../store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();

  const { token, role } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const location = useLocation();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (token) {
    return (
      <Navigate
        to={role === "admin" ? "/dashboard" : "/profile"}
        replace
      />
    );
  }

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);

      // Project demo administrator account
      if (username.trim() === "admin" && password === "Admin@123") {
        const adminUser = {
          id: "shopstream-admin",
          username: "admin",
          firstName: "ShopStream",
          lastName: "Admin",
          email: "admin@shopstream.demo",
          role: "admin",
        };

        dispatch(
          loginSuccess({
            token: "shopstream-demo-admin-token",
            user: adminUser,
            role: "admin",
          })
        );

        toast.success("Admin login successful");

        navigate("/dashboard", { replace: true });
        return;
      }

      // Check locally registered demo customers
      const registeredUsers = JSON.parse(
        localStorage.getItem("shopstreamRegisteredUsers") || "[]"
      );

      const registeredUser = registeredUsers.find(
        (user) =>
          (user.username.toLowerCase() === username.trim().toLowerCase() ||
            user.email.toLowerCase() === username.trim().toLowerCase()) &&
          user.password === password
      );

      if (registeredUser) {
        const userData = { ...registeredUser };
        delete userData.password;

        dispatch(
          loginSuccess({
            token: `shopstream-customer-${registeredUser.id}`,
            user: userData,
            role: "customer",
          })
        );

        toast.success("Login successful");

        const destination =
          location.state?.from?.pathname === "/dashboard"
            ? "/profile"
            : location.state?.from?.pathname || "/profile";

        navigate(destination, { replace: true });
        return;
      }

      // Login using DummyJSON
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password,
        expiresInMins: rememberMe ? 43200 : 60,
      });

      dispatch(
        loginSuccess({
          token: response.data.accessToken || response.data.token,
          user: response.data,
          role: "customer",
        })
      );

      toast.success("Login successful");

      const destination =
        location.state?.from?.pathname === "/dashboard"
          ? "/profile"
          : location.state?.from?.pathname || "/profile";

      navigate(destination, { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please check your username and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
  
      <Container fluid className="flex-grow-1 bg-light">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={7} lg={5}xl={4}className="my-4">
            <Card className="shadow-sm border">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h1 className="fw-bold fs-3 mb-1">
                    Welcome Back
                  </h1>

                  <p className="text-muted small mb-0">
                    Please enter your details to sign in.
                  </p>
                </div>

                <Form onSubmit={handleLogin}>
                  
                  {error && (
                    <Alert variant="danger" className="small py-2">
                      {error}
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">
                      Email or Username
                    </Form.Label>

                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <FiMail />
                      </InputGroup.Text>

                      <Form.Control
                        type="text"
                        placeholder="name@example.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Label className="small fw-semibold mb-1">
                        Password
                      </Form.Label>

                      <span className="small text-primary fw-semibold">
                        Forgot?
                      </span>
                    </div>

                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <FiLock />
                      </InputGroup.Text>

                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <Button
                        variant="light"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Stay signed in for 30 days"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="small text-muted mb-3"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 d-flex justify-content-center align-items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      "Signing In..."
                    ) : (
                      <>
                        Sign In
                        <FiArrowRight />
                      </>
                    )}
                  </Button>
                </Form>

                <div className="d-flex align-items-center my-4">
                  <hr className="flex-grow-1" />

                  <span className="text-muted small mx-3">
                    Or continue with
                  </span>

                  <hr className="flex-grow-1" />
                </div>

                <Row className="g-2">
                  <Col>
                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      disabled
                    >
                      <span className="fw-bold me-2">G</span>
                      Google
                    </Button>
                  </Col>

                  <Col>
                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      disabled
                    >
                      <span className="me-2"></span>
                      Apple
                    </Button>
                  </Col>
                </Row>

                <p className="text-center text-muted small mt-4 mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-primary text-decoration-none"
                  >
                    Register
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="bg-primary-subtle border-top py-4">
        <Container fluid>
          <Row className="align-items-center">
            <Col
              xs={12}
              md={6}
              className="text-center text-md-start"
            >
              <div className="fw-bold text-primary small">
                ShopStream
              </div>

              <div className="text-muted small">
                © 2024 ShopStream Inc. All rights reserved.
              </div>
            </Col>

            <Col
              xs={12}
              md={6}
              className="mt-3 mt-md-0"
            >
              <div className="d-flex justify-content-center justify-content-md-end gap-3 flex-wrap">
                <span className="text-muted small">
                  Privacy Policy
                </span>

                <span className="text-muted small">
                  Terms of Service
                </span>

                <span className="text-muted small">
                  Contact Us
                </span>

                <span className="text-muted small">
                  Shipping Info
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}