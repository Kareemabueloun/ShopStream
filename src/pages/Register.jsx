import { useState } from "react";
import { Alert,Button,Card,Col,Container,Form,Row,} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {FiUser,FiAtSign,FiMail,FiLock,FiShield,FiEye,FiEyeOff,FiArrowRight,} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.fullName.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    const nameParts = formData.fullName.trim().split(/\s+/);

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    setLoading(true);

    try {
      const registeredUsers = JSON.parse(
        localStorage.getItem("shopstreamRegisteredUsers") || "[]"
      );

      const usernameExists = registeredUsers.some(
        (user) =>
          user.username.toLowerCase() ===
          formData.username.trim().toLowerCase()
      );

      const emailExists = registeredUsers.some(
        (user) =>
          user.email.toLowerCase() ===
          formData.email.trim().toLowerCase()
      );

      if (usernameExists) {
        setError("This username is already registered.");
        return;
      }

      if (emailExists) {
        setError("This email is already registered.");
        return;
      }

      await api.post("/users/add", {
        firstName,
        lastName,
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "customer",
      };

      registeredUsers.push(newUser);

      localStorage.setItem(
        "shopstreamRegisteredUsers",
        JSON.stringify(registeredUsers)
      );

      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    toast(`${provider} registration is not configured yet.`);
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5} xl={5}>
          <Card className="border shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">
                  Create Account
                </h2>

                <p className="text-muted small mb-0">
                  Join ShopStream for a personalized shopping experience.
                </p>
              </div>

              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold mb-1">
                    Full Name
                  </Form.Label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FiUser />
                    </span>

                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Form.Group>

                <Row className="g-2 mb-3">
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        Username
                      </Form.Label>

                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FiAtSign />
                        </span>

                        <Form.Control
                          type="text"
                          name="username"
                          placeholder="johndoe"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold mb-1">
                        Email Address
                      </Form.Label>

                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FiMail />
                        </span>

                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold mb-1">
                    Password
                  </Form.Label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FiLock />
                    </span>

                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      required
                    />

                    <Button
                      variant="light"
                      className="border"
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold mb-1">
                    Confirm Password
                  </Form.Label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FiShield />
                    </span>

                    <Form.Control
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />

                    <Button
                      variant="light"
                      className="border"
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Check
                  type="checkbox"
                  className="small mb-4"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                  label={
                    <span>
                      I agree to the{" "}
                      <a
                        href="https://dummyjson.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://dummyjson.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  }
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Sign Up <FiArrowRight className="ms-1" />
                    </>
                  )}
                </Button>
              </Form>

              <div className="d-flex align-items-center gap-3 my-4">
                <hr className="flex-grow-1 my-0" />

                <small className="text-muted text-nowrap">
                  Or register with
                </small>

                <hr className="flex-grow-1 my-0" />
              </div>

              <Row className="g-2">
                <Col xs={6}>
                  <Button
                    variant="outline-secondary"
                    className="w-100 text-dark"
                    onClick={() =>
                      handleSocialRegister("Google")
                    }
                  >
                    <span className="me-2">🌐</span>
                    Google
                  </Button>
                </Col>

                <Col xs={6}>
                  <Button
                    variant="outline-secondary"
                    className="w-100 text-dark"
                    onClick={() =>
                      handleSocialRegister("Apple")
                    }
                  >
                    <span className="me-2"></span>
                    Apple
                  </Button>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <small className="text-muted">
                  Already have an account?{" "}
                </small>

                <Link
                  to="/login"
                  className="text-decoration-none small fw-semibold"
                >
                  Sign In
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}