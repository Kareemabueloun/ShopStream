import { useCallback, useEffect, useState } from "react";
import { Badge,Button,Card,Col,Container,Form,Modal,Row,Spinner,Table,} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {FiBarChart2,FiCheckCircle,FiClock,FiEdit,FiGift,FiLogOut,FiPackage,FiSettings,FiShoppingBag,FiStar,FiUser,} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import { logout, setUser } from "../store/slices/authSlice";


function getCurrentUserOrders(user) {
  try {
    const savedOrders = JSON.parse(
      localStorage.getItem("shopstreamOrders") || "[]"
    );

    const currentUserId = user?.id;
    const currentUserEmail = user?.email?.toLowerCase();
    const currentUsername = user?.username?.toLowerCase();

    const currentUserOrders = savedOrders.filter((order) => {
      const orderEmail = order.userEmail?.toLowerCase();
      const orderUsername = order.username?.toLowerCase();

      if (currentUserEmail && orderEmail) {
        return currentUserEmail === orderEmail;
      }

      if (currentUsername && orderUsername) {
        return currentUsername === orderUsername;
      }

      if (order.userId != null && currentUserId != null) {
        return String(order.userId) === String(currentUserId);
      }

      return false;
    });

    return currentUserOrders
      .map((order, index) => {
        const products = order.items || [];

        return {
          id: order.orderId || `SS-${index}`,
          orderNumber: order.orderId || `SS-${index}`,
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "",
          total: Number(order.total) || 0,
          quantity: products.reduce(
            (total, product) =>
              total + (Number(product.quantity) || 1),
            0
          ),
          status: order.status || "Processing",
          products,
        };
      })
      .reverse();
  } catch {
    return [];
  }
}

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem("emailNotifications") !== "false"
  );

  const [orderNotifications, setOrderNotifications] = useState(
    localStorage.getItem("orderNotifications") !== "false"
  );

  const [orders, setOrders] = useState(() =>
    getCurrentUserOrders(user)
  );

  const [ordersLoading, setOrdersLoading] = useState(false);

  const isLocalAccount =
    String(token || "").startsWith("shopstream-customer-") ||
    token === "shopstream-demo-admin-token";

  useEffect(() => {
    let cancelled = false;

    async function getUser() {
      if (!token || !user) {
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      const fillForm = (currentUser) => {
        if (cancelled) return;

        setProfileForm({
          firstName: currentUser?.firstName || "",
          lastName: currentUser?.lastName || "",
          email: currentUser?.email || "",
          phone: currentUser?.phone || "",
        });
      };

      if (isLocalAccount) {
        fillForm(user);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (cancelled) return;

        const updatedUser = {
          ...user,
          ...response.data,
        };

        fillForm(updatedUser);

        if (
          updatedUser.firstName !== user.firstName ||
          updatedUser.lastName !== user.lastName ||
          updatedUser.email !== user.email ||
          updatedUser.phone !== user.phone
        ) {
          dispatch(setUser(updatedUser));
        }
      } catch {
        fillForm(user);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    getUser();

    return () => {
      cancelled = true;
    };
  }, [token, user, dispatch, navigate, isLocalAccount]);

  const loadOrders = useCallback(() => {
    setOrdersLoading(true);

    const currentOrders = getCurrentUserOrders(user);

    setOrders(currentOrders);
    setOrdersLoading(false);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    if (
      !profileForm.firstName.trim() ||
      !profileForm.lastName.trim() ||
      !profileForm.email.trim()
    ) {
      toast.error("First name, last name and email are required.");
      return;
    }

    setSavingProfile(true);

    try {
      if (isLocalAccount) {
        dispatch(setUser({ ...user, ...profileForm }));
      } else {
        const response = await api.put(
          `/users/${user.id}`,
          profileForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(
          setUser({
            ...user,
            ...profileForm,
            ...response.data,
          })
        );
      }

      setShowEditProfile(false);
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Could not update your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEmailNotifications = (value) => {
    setEmailNotifications(value);
    localStorage.setItem("emailNotifications", String(value));

    toast.success(
      value
        ? "Email notifications enabled."
        : "Email notifications disabled."
    );
  };

  const handleOrderNotifications = (value) => {
    setOrderNotifications(value);
    localStorage.setItem("orderNotifications", String(value));

    toast.success(
      value
        ? "Order notifications enabled."
        : "Order notifications disabled."
    );
  };

// Order History

  const openOrderHistory = () => {
    loadOrders();
    setShowOrders(true);
  };

// Order Details

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

//Tracking
  const openTracking = (order) => {
    setSelectedOrder(order);
    setShowTracking(true);
  };

// Loading
  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <Spinner animation="border" />
            <p className="mt-3 text-muted">Loading profile...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="bg-light py-4">
        <Container>
          <Row className="g-4">
            {/* SIDEBAR */}

            <Col xs={12} md={3} lg={2}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-3">
                  <div className="mb-3">
                    <h6 className="fw-bold text-primary mb-1">
                      Account
                    </h6>
                    <small className="text-muted">
                      Manage your account
                    </small>
                  </div>

                  <hr />

                  <Button
                    variant="primary"
                    className="w-100 text-start d-flex align-items-center mb-2"
                  >
                    <FiUser className="me-2" />
                    My Profile
                  </Button>

                  <Button
                    variant="light"
                    className="w-100 text-start d-flex align-items-center mb-2"
                    onClick={openOrderHistory}
                  >
                    <FiClock className="me-2" />
                    Order History
                  </Button>

                  <Button
                    variant="light"
                    className="w-100 text-start d-flex align-items-center mb-3"
                    onClick={() => setShowSettings(true)}
                  >
                    <FiSettings className="me-2" />
                    Account Settings
                  </Button>

                  <hr />

                  <Button
                    variant="light"
                    className="w-100 text-start text-danger d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="me-2" />
                    Sign Out
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* MAIN CONTENT */}

            <Col xs={12} md={9} lg={10}>
              {/* PROFILE HEADER */}

              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <Row className="align-items-center g-4">
                    <Col xs={12} lg={8}>
                      <div className="d-flex align-items-center">
                        <img
                          src={user?.image}
                          alt={user?.firstName}
                          width="90"
                          height="90"
                          className="rounded-circle border me-3"
                        />

                        <div>
                          <h2 className="fw-bold mb-1">
                            {user?.firstName} {user?.lastName}
                          </h2>

                          <p className="text-muted mb-2">
                            {user?.email}
                          </p>

                          <div className="d-flex flex-wrap gap-2">
                            <Badge
                              bg="success"
                              className="rounded-pill px-3 py-2"
                            >
                              Premium Member
                            </Badge>

                            <Badge
                              bg="secondary"
                              className="rounded-pill px-3 py-2"
                            >
                              Member since 2022
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} lg={4}>
                      <div className="d-grid gap-2">
                        <Button
                          variant="primary"
                          className="d-flex align-items-center justify-content-center"
                          onClick={() => setShowEditProfile(true)}
                        >
                          <FiEdit className="me-2" />
                          Edit Profile
                        </Button>

                        <Button
                          variant="outline-primary"
                          className="d-flex align-items-center justify-content-center"
                          onClick={() => setShowAnalytics(true)}
                        >
                          <FiBarChart2 className="me-2" />
                          View Analytics
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* STATISTICS */}

              <Row className="g-3 mb-4">
                <Col xs={12} md={4}>
                  <Card className="border shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <small className="text-muted">
                            Total Orders
                          </small>
                          <h3 className="fw-bold mt-2 mb-0">
                            {orders.length}
                          </h3>
                        </div>

                        <div className="text-primary fs-4">
                          <FiShoppingBag />
                        </div>
                      </div>

                      <small className="text-success fw-semibold">
                        Orders from your account
                      </small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={4}>
                  <Card className="border shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <small className="text-muted">
                            Wallet Balance
                          </small>
                          <h3 className="fw-bold mt-2 mb-0">
                            $1,248.50
                          </h3>
                        </div>

                        <div className="text-success fs-4">
                          <FiGift />
                        </div>
                      </div>

                      <small className="text-muted">
                        Available balance
                      </small>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={4}>
                  <Card className="border shadow-sm h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <small className="text-muted">
                            Loyalty Points
                          </small>
                          <h3 className="fw-bold mt-2 mb-0">
                            4,800
                          </h3>
                        </div>

                        <div className="text-warning fs-4">
                          <FiStar />
                        </div>
                      </div>

                      <small className="text-muted">
                        Current loyalty points
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* RECENT ORDERS */}

              <Card className="border shadow-sm">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Recent Orders</h5>

                    <Button
                      variant="link"
                      className="text-decoration-none"
                      onClick={openOrderHistory}
                    >
                      View All
                    </Button>
                  </div>
                </Card.Header>

                <Card.Body>
                  {ordersLoading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-4">
                      <FiPackage size={40} />
                      <p className="text-muted mt-3 mb-0">
                        No orders found.
                      </p>
                    </div>
                  ) : (
                    orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="p-3 border-bottom"
                      >
                        <Row className="align-items-center g-3">
                          <Col xs={12} md={7}>
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <FiPackage
                                  size={35}
                                  className="text-primary"
                                />
                              </div>

                              <div>
                                <h6 className="fw-bold mb-1">
                                  Order {order.orderNumber}
                                </h6>

                                <small className="text-muted">
                                  {order.quantity} products
                                </small>

                                <small className="text-muted ms-3">
                                  {order.date}
                                </small>
                              </div>
                            </div>
                          </Col>

                          <Col xs={6} md={2}>
                            <h6 className="fw-bold text-primary mb-0">
                              ${order.total}
                            </h6>
                          </Col>

                          <Col xs={6} md={3}>
                            <div className="text-md-end">
                              <Badge
                                bg={
                                  order.status === "Delivered"
                                    ? "success"
                                    : order.status === "Shipped"
                                    ? "primary"
                                    : "secondary"
                                }
                                className="rounded-pill px-3 py-2"
                              >
                                {order.status}
                              </Badge>

                              <div className="mt-2">
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-decoration-none p-0 me-3"
                                  onClick={() => openTracking(order)}
                                >
                                  Track
                                </Button>

                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-decoration-none p-0"
                                  onClick={() => openOrderDetails(order)}
                                >
                                  Details
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* EDIT PROFILE MODAL */}

      <Modal
        show={showEditProfile}
        onHide={() => setShowEditProfile(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleUpdateProfile}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={profileForm.firstName}
                onChange={handleProfileChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={profileForm.lastName}
                onChange={handleProfileChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditProfile(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={savingProfile}
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ACCOUNT SETTINGS */}

      <Modal
        show={showSettings}
        onHide={() => setShowSettings(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Account Settings</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center border-bottom py-3">
            <div>
              <h6 className="fw-bold mb-1">
                Email Notifications
              </h6>
              <small className="text-muted">
                Receive updates by email.
              </small>
            </div>

            <Form.Check
              type="switch"
              checked={emailNotifications}
              onChange={(event) =>
                handleEmailNotifications(event.target.checked)
              }
            />
          </div>

          <div className="d-flex justify-content-between align-items-center border-bottom py-3">
            <div>
              <h6 className="fw-bold mb-1">
                Order Notifications
              </h6>
              <small className="text-muted">
                Receive updates about your orders.
              </small>
            </div>

            <Form.Check
              type="switch"
              checked={orderNotifications}
              onChange={(event) =>
                handleOrderNotifications(event.target.checked)
              }
            />
          </div>

          <div className="py-3">
            <h6 className="fw-bold">Account Email</h6>
            <p className="text-muted mb-0">{user?.email}</p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowSettings(false)}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ORDER HISTORY */}

      <Modal
        show={showOrders}
        onHide={() => setShowOrders(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Order History</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {ordersLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <FiPackage size={50} />
              <h5 className="mt-3">No orders found</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.date}</td>
                      <td>{order.quantity}</td>
                      <td>${order.total}</td>
                      <td>
                        <Badge
                          bg={
                            order.status === "Delivered"
                              ? "success"
                              : order.status === "Shipped"
                              ? "primary"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openOrderDetails(order)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* orders details */}

      <Modal
        show={showOrderDetails}
        onHide={() => setShowOrderDetails(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="mb-4">
                <h5 className="fw-bold">
                  {selectedOrder.orderNumber}
                </h5>

                <p className="text-muted mb-1">
                  Order date: {selectedOrder.date}
                </p>

                <p className="text-muted">
                  Status: {selectedOrder.status}
                </p>
              </div>

              <h6 className="fw-bold mb-3">Products</h6>

              {selectedOrder.products.map((product, index) => (
                <div
                  key={product.id || index}
                  className="d-flex justify-content-between align-items-center border-bottom py-3"
                >
                  <div>
                    <h6 className="mb-1">{product.title}</h6>

                    <small className="text-muted">
                      Quantity: {product.quantity}
                    </small>
                  </div>

                  <span className="fw-bold">
                    $
                    {Number(product.price || 0) *
                      Number(product.quantity || 1)}
                  </span>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-4">
                <strong>Total</strong>
                <strong className="text-primary">
                  ${selectedOrder.total}
                </strong>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => {
              setShowOrderDetails(false);
              setShowTracking(true);
            }}
          >
            Track Order
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowOrderDetails(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* tracking */}

      <Modal
        show={showTracking}
        onHide={() => setShowTracking(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Track Package</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="text-center mb-4">
                <FiPackage size={50} className="text-primary" />

                <h5 className="fw-bold mt-3">
                  {selectedOrder.orderNumber}
                </h5>

                <Badge bg="primary" className="px-3 py-2">
                  {selectedOrder.status}
                </Badge>
              </div>

              <div className="border-start border-primary border-3 ps-3">
                <div className="mb-4">
                  <FiCheckCircle className="text-success me-2" />
                  Order confirmed
                </div>

                <div className="mb-4">
                  <FiPackage className="text-primary me-2" />
                  Package prepared
                </div>

                <div className="mb-4">
                  <FiClock className="text-warning me-2" />
                  Current status: {selectedOrder.status}
                </div>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowTracking(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ANALYTICS */}

      <Modal
        show={showAnalytics}
        onHide={() => setShowAnalytics(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Account Analytics</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-3">
            <Col xs={6}>
              <Card className="text-center h-100">
                <Card.Body>
                  <FiShoppingBag
                    size={30}
                    className="text-primary"
                  />

                  <h4 className="fw-bold mt-2">
                    {orders.length}
                  </h4>

                  <small className="text-muted">
                    Total Orders
                  </small>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6}>
              <Card className="text-center h-100">
                <Card.Body>
                  <FiStar size={30} className="text-warning" />

                  <h4 className="fw-bold mt-2">4,800</h4>

                  <small className="text-muted">
                    Loyalty Points
                  </small>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12}>
              <Card>
                <Card.Body>
                  <h6 className="fw-bold">Account Status</h6>

                  <div className="d-flex align-items-center">
                    <FiCheckCircle className="text-success me-2" />
                    <span>Your account is active.</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowAnalytics(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}