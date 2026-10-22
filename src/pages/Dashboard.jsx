
import { useCallback, useEffect, useState } from "react";
import {Alert,Badge,Button,Card,Col,Container,Form,Modal,Nav,Pagination,Row,Spinner,Table,} from "react-bootstrap";
import {FiBox,FiUsers,FiShoppingCart,FiGrid,FiSearch,FiRefreshCw,FiPlus,FiEye,FiEdit2,FiTrash2,FiLogOut,FiChevronRight,FiMenu,FiDollarSign,} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { logout } from "../store/slices/authSlice";

const PAGE_SIZE = 8;
const BLUE = "#2563eb";
const NAVY = "#172554";

const navItems = [
  { key: "Overview", label: "Overview", icon: FiGrid },
  { key: "Products", label: "Products", icon: FiBox },
  { key: "Users", label: "Users", icon: FiUsers },
  { key: "Carts", label: "Carts", icon: FiShoppingCart },
];

// Read users registered through Register.jsx.
const getRegisteredUsers = () => {
  try {
    const savedUsers = JSON.parse(
      localStorage.getItem("shopstreamRegisteredUsers") || "[]"
    );

    if (!Array.isArray(savedUsers)) return [];

    return savedUsers.map((person, index) => {
      const nameParts = String(
        person.firstName || person.name || ""
      ).split(" ");

      return {
        ...person,
        id:
          person.id ??
          `local-${index}-${person.email || person.username || "user"}`,
        firstName: person.firstName || nameParts[0] || "",
        lastName: person.lastName || nameParts.slice(1).join(" ") || "",
        username: person.username || person.userName || "",
        email: person.email || "",
        source: "local",
      };
    });
  } catch {
    return [];
  }
};

// Combine API users with locally registered users.
const combineUsers = (apiUsers = []) => {
  const registeredUsers = getRegisteredUsers();

  const knownEmails = new Set(
    apiUsers.map((person) => person.email?.toLowerCase()).filter(Boolean)
  );

  const knownUsernames = new Set(
    apiUsers.map((person) => person.username?.toLowerCase()).filter(Boolean)
  );

  const newRegisteredUsers = registeredUsers.filter((person) => {
    const email = person.email.toLowerCase();
    const username = person.username.toLowerCase();

    return (
      !(email && knownEmails.has(email)) &&
      !(username && knownUsernames.has(username))
    );
  });

  return [...newRegisteredUsers, ...apiUsers];
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [activeSection, setActiveSection] = useState("Overview");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCarts, setTotalCarts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    title: "",
    category: "beauty",
    price: "",
    stock: "10",
  });

  // Load dashboard data.
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [productResponse, userResponse, cartResponse] =
          await Promise.all([
            api.get("/products?limit=100"),
            api.get("/users?limit=100"),
            api.get("/carts?limit=100"),
          ]);

        if (cancelled) return;

        setProducts(productResponse.data.products || []);

        const combinedUsers = combineUsers(
          userResponse.data.users || []
        );

        setUsers(combinedUsers);
        setCarts(cartResponse.data.carts || []);

        setTotalProducts(
          productResponse.data.total ??
            productResponse.data.products?.length ??
            0
        );

        setTotalUsers(combinedUsers.length);

        setTotalCarts(
          cartResponse.data.total ??
            cartResponse.data.carts?.length ??
            0
        );
      } catch {
        if (!cancelled) {
          setError(
            "Could not load dashboard data. Please refresh and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Refresh dashboard data.
  const loadData = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      const [productResponse, userResponse, cartResponse] =
        await Promise.all([
          api.get("/products?limit=100"),
          api.get("/users?limit=100"),
          api.get("/carts?limit=100"),
        ]);

      setProducts(productResponse.data.products || []);

      const combinedUsers = combineUsers(
        userResponse.data.users || []
      );

      setUsers(combinedUsers);
      setCarts(cartResponse.data.carts || []);

      setTotalProducts(
        productResponse.data.total ??
          productResponse.data.products?.length ??
          0
      );

      setTotalUsers(combinedUsers.length);

      setTotalCarts(
        cartResponse.data.total ??
          cartResponse.data.carts?.length ??
          0
      );

      toast.success("Dashboard refreshed.");
    } catch {
      setError("Could not refresh dashboard data.");
      toast.error("Could not refresh dashboard.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Calculate total sales from loaded carts.
  const totalSales = carts.reduce(
    (total, cart) => total + Number(cart.total || 0),
    0
  );

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(number);

  const changeSection = (section) => {
    setActiveSection(section);
    setPage(1);
    setSearch("");
  };

  // Search products.
  const filteredProducts = products.filter((item) =>
    `${item.title || ""} ${item.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Search users, including locally registered users.
  const filteredUsers = users.filter((item) =>
    `${item.firstName || ""} ${item.lastName || ""} ${
      item.username || ""
    } ${item.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Search carts.
  const filteredCarts = carts.filter((item) =>
    `${item.id} ${item.userId}`.includes(search)
  );

  const currentRows =
    activeSection === "Products"
      ? filteredProducts
      : activeSection === "Users"
        ? filteredUsers
        : filteredCarts;

  const pageCount = Math.max(
    1,
    Math.ceil(currentRows.length / PAGE_SIZE)
  );

  const visibleRows = currentRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Add product.
  const openAddProduct = () => {
    setEditingProduct(null);

    setProductForm({
      title: "",
      category: "beauty",
      price: "",
      stock: "10",
    });

    setShowProductModal(true);
  };

  // Edit product.
  const openEditProduct = (product) => {
    setEditingProduct(product);

    setProductForm({
      title: product.title || "",
      category: product.category || "beauty",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0),
    });

    setShowProductModal(true);
  };

  // Save product.
  const saveProduct = async (event) => {
    event.preventDefault();

    const payload = {
      title: productForm.title.trim(),
      category: productForm.category.trim(),
      price: Number(productForm.price),
      stock: Number(productForm.stock) || 0,
    };

    if (
      !payload.title ||
      productForm.price === "" ||
      payload.price < 0
    ) {
      toast.error("Enter a product name and a valid price.");
      return;
    }

    try {
      if (editingProduct) {
        const response = await api.put(
          `/products/${editingProduct.id}`,
          payload
        );

        setProducts((items) =>
          items.map((item) =>
            item.id === editingProduct.id
              ? { ...item, ...response.data, ...payload }
              : item
          )
        );

        toast.success("Product updated in the demo.");
      } else {
        const response = await api.post("/products/add", payload);

        setProducts((items) => [
          {
            id: response.data.id || Date.now(),
            ...payload,
          },
          ...items,
        ]);

        setTotalProducts((total) => total + 1);
        toast.success("Product added to the demo list.");
      }

      setShowProductModal(false);
    } catch {
      toast.error("Could not save this product.");
    }
  };

  // Delete product.
  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;

    try {
      await api.delete(`/products/${product.id}`);

      setProducts((items) =>
        items.filter((item) => item.id !== product.id)
      );

      setTotalProducts((total) => Math.max(0, total - 1));
      toast.success("Product removed from the demo list.");
    } catch {
      toast.error("Could not delete this product.");
    }
  };

  // Add user.
  const addUser = async () => {
    const firstName = window.prompt("First name:");
    if (!firstName?.trim()) return;

    const lastName = window.prompt("Last name:") || "";
    const username = window.prompt("Username:");
    if (!username?.trim()) return;

    const email = window.prompt("Email:");
    if (!email?.trim()) return;

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
    };

    try {
      const response = await api.post("/users/add", payload);

      setUsers((items) => [
        {
          id: response.data.id || Date.now(),
          ...payload,
        },
        ...items,
      ]);

      setTotalUsers((total) => total + 1);
      toast.success("User added to the demo list.");
    } catch {
      toast.error("Could not add this user.");
    }
  };

  // Edit user
  const editUser = async (person) => {
    const firstName = window.prompt(
      "First name:",
      person.firstName || ""
    );

    if (firstName === null || !firstName.trim()) return;

    const lastName = window.prompt(
      "Last name:",
      person.lastName || ""
    );

    if (lastName === null) return;

    const email = window.prompt("Email:", person.email || "");

    if (email === null || !email.trim()) return;

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };

    try {
      if (person.source === "local") {
        const registeredUsers = JSON.parse(
          localStorage.getItem("shopstreamRegisteredUsers") || "[]"
        );

        const updatedUsers = registeredUsers.map((item) =>
          item.id === person.id ? { ...item, ...payload } : item
        );

        localStorage.setItem(
          "shopstreamRegisteredUsers",
          JSON.stringify(updatedUsers)
        );

        setUsers((items) =>
          items.map((item) =>
            item.id === person.id ? { ...item, ...payload } : item
          )
        );

        toast.success("Registered user updated.");
        return;
      }

      await api.put(`/users/${person.id}`, payload);

      setUsers((items) =>
        items.map((item) =>
          item.id === person.id ? { ...item, ...payload } : item
        )
      );

      toast.success("User updated in the demo list.");
    } catch {
      toast.error("Could not update this user.");
    }
  };

  const deleteUser = async (person) => {
    if (
      !window.confirm(
        `Delete ${person.firstName || ""} ${person.lastName || ""}?`
      )
    ) {
      return;
    }

    try {
      if (person.source === "local") {
        const registeredUsers = JSON.parse(
          localStorage.getItem("shopstreamRegisteredUsers") || "[]"
        );

        const updatedUsers = registeredUsers.filter(
          (item) => item.id !== person.id
        );

        localStorage.setItem(
          "shopstreamRegisteredUsers",
          JSON.stringify(updatedUsers)
        );

        setUsers((items) =>
          items.filter((item) => item.id !== person.id)
        );

        setTotalUsers((total) => Math.max(0, total - 1));
        toast.success("Registered user deleted.");
        return;
      }

      await api.delete(`/users/${person.id}`);

      setUsers((items) =>
        items.filter((item) => item.id !== person.id)
      );

      setTotalUsers((total) => Math.max(0, total - 1));
      toast.success("User removed from the demo list.");
    } catch {
      toast.error("Could not delete this user.");
    }
  };

  // Edit cart.
  const editCart = async (cart) => {
    const total = window.prompt(
      "Cart total ($):",
      String(cart.total || 0)
    );

    if (
      total === null ||
      total.trim() === "" ||
      Number(total) < 0 ||
      Number.isNaN(Number(total))
    ) {
      return;
    }

    try {
      await api.put(`/carts/${cart.id}`, {
        total: Number(total),
      });

      setCarts((items) =>
        items.map((item) =>
          item.id === cart.id
            ? { ...item, total: Number(total) }
            : item
        )
      );

      toast.success("Cart total updated in the demo.");
    } catch {
      toast.error("Could not update this cart.");
    }
  };

  // Delete cart.
  const deleteCart = async (cart) => {
    if (!window.confirm(`Delete cart #${cart.id}?`)) return;

    try {
      await api.delete(`/carts/${cart.id}`);

      setCarts((items) =>
        items.filter((item) => item.id !== cart.id)
      );

      setTotalCarts((total) => Math.max(0, total - 1));
      toast.success("Cart removed from the demo list.");
    } catch {
      toast.error("Could not delete this cart.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  // Pagination.
  const renderPagination = () => {
    if (pageCount <= 1) return null;

    return (
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
        <small className="text-muted">
          Showing {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, currentRows.length)} of{" "}
          {currentRows.length} results
        </small>

        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          />

          {Array.from(
            { length: pageCount },
            (_, index) => index + 1
          )
            .slice(
              Math.max(0, page - 3),
              Math.min(pageCount, page + 2)
            )
            .map((number) => (
              <Pagination.Item
                key={number}
                active={number === page}
                onClick={() => setPage(number)}
              >
                {number}
              </Pagination.Item>
            ))}

          <Pagination.Next
            disabled={page === pageCount}
            onClick={() => setPage((current) => current + 1)}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="d-flex min-vh-100">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside
            className="d-flex flex-column flex-shrink-0 bg-white border-end"
            style={{
              width: "240px",
              minHeight: "100vh",
              color: NAVY,
            }}
          >
            <div className="px-4 py-4 border-bottom">
              <div className="text-uppercase text-primary small">
                ShopStream
              </div>

              <div className="fs-4 fw-bold" style={{ color: NAVY }}>
                Admin Panel
              </div>

              <div className="text-muted small mt-1">
                Store management
              </div>
            </div>

            <div className="px-3 pt-4 pb-2 text-uppercase text-muted small">
              Main menu
            </div>

            <Nav className="flex-column px-2 gap-1">
              {navItems.map(({ key, label, icon: Icon }) => (
                <Nav.Link
                  key={key}
                  onClick={() => changeSection(key)}
                  className="d-flex align-items-center gap-3 rounded px-3 py-3"
                  style={
                    activeSection === key
                      ? {
                          backgroundColor: BLUE,
                          color: "#ffffff",
                        }
                      : {
                          backgroundColor: "#ffffff",
                          color: "#475569",
                        }
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>

                  {activeSection === key && (
                    <FiChevronRight className="ms-auto" />
                  )}
                </Nav.Link>
              ))}
            </Nav>

            <div className="mt-auto p-3 border-top">
              <div className="small text-muted mb-2">Signed in as</div>

              <div className="fw-semibold" style={{ color: NAVY }}>
                {user?.firstName || "Admin"} {user?.lastName || ""}
              </div>

              <div className="small text-muted mb-3">
                {user?.username || "admin"}
              </div>

              <Button
                variant="outline-primary"
                size="sm"
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <FiLogOut /> Logout
              </Button>
            </div>
          </aside>
        )}

        <main className="flex-grow-1 overflow-hidden">
          {/* Header */}
          <header className="bg-white border-bottom shadow-sm px-3 px-lg-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="light"
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label="Toggle sidebar"
              >
                <FiMenu />
              </Button>

              <div>
                <div className="fw-semibold" style={{ color: NAVY }}>
                  ShopStream Admin Dashboard
                </div>

                <small className="text-muted">
                  Administration / {activeSection}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="fw-semibold">
                  {user?.firstName || "Admin"} {user?.lastName || ""}
                </div>

                <small className="text-muted">
                  {user?.role === "admin"
                    ? "Administrator"
                    : "Customer"}
                </small>
              </div>

              <div
                className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: 42,
                  height: 42,
                  backgroundColor: BLUE,
                }}
              >
                {(user?.firstName || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          <Container fluid className="p-3 p-lg-4">
            {/* Heading and actions */}
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
              <div>
                <div className="small text-primary fw-semibold text-uppercase">
                  Administration
                </div>

                <h1 className="h3 fw-bold mb-1">{activeSection}</h1>

                <p className="text-muted mb-0">
                  {activeSection === "Overview"
                    ? "Monitor your store at a glance."
                    : `Manage your store ${activeSection.toLowerCase()}.`}
                </p>
              </div>

              <div className="d-flex gap-2">
                {activeSection === "Products" && (
                  <Button
                    onClick={openAddProduct}
                    className="d-flex align-items-center gap-2"
                    style={{
                      backgroundColor: BLUE,
                      borderColor: BLUE,
                      color: "#ffffff",
                    }}
                  >
                    <FiPlus /> Add Product
                  </Button>
                )}

                {activeSection === "Users" && (
                  <Button
                    onClick={addUser}
                    className="d-flex align-items-center gap-2"
                    style={{
                      backgroundColor: BLUE,
                      borderColor: BLUE,
                      color: "#ffffff",
                    }}
                  >
                    <FiPlus /> Add User
                  </Button>
                )}

                <Button
                  variant="outline-primary"
                  onClick={loadData}
                  disabled={refreshing}
                  className="d-flex align-items-center gap-2"
                >
                  <FiRefreshCw />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: BLUE }} />

                <div className="text-muted mt-2">
                  Loading store data...
                </div>
              </div>
            ) : (
              <>
                {/* Overview cards */}
                {activeSection === "Overview" && (
                  <>
                    <Row className="g-3 mb-4">
                      {[
                        {
                          label: "Total Products",
                          value: totalProducts,
                          icon: FiBox,
                          description: "Catalog",
                        },
                        {
                          label: "Registered Users",
                          value: totalUsers,
                          icon: FiUsers,
                          description: "Accounts",
                        },
                        {
                          label: "Shopping Carts",
                          value: totalCarts,
                          icon: FiShoppingCart,
                          description: "Shopping data",
                        },
                        {
                          label: "Total Sales",
                          value: totalSales,
                          icon: FiDollarSign,
                          description: "Sales revenue",
                          sales: true,
                        },
                      ].map(
                        ({
                          label,
                          value,
                          icon: Icon,
                          description,
                          sales,
                        }) => (
                          <Col xs={12} md={6} xl={3} key={label}>
                            <Card className="border-0 shadow-sm h-100">
                              <Card.Body className="d-flex align-items-center justify-content-between">
                                <div>
                                  <div className="text-muted small">
                                    {label}
                                  </div>

                                  <div className="fs-4 fw-bold">
                                    {sales
                                      ? `$${formatNumber(value)}`
                                      : formatNumber(value)}
                                  </div>

                                  <Badge style={{ backgroundColor: BLUE }}>
                                    {description}
                                  </Badge>
                                </div>

                                <div
                                  className="rounded-3 p-3"
                                  style={{
                                    backgroundColor: "#eff6ff",
                                    color: BLUE,
                                  }}
                                >
                                  <Icon size={26} />
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      )}
                    </Row>

                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-white py-3">
                        <span className="fw-bold">Quick management</span>
                      </Card.Header>

                      <Card.Body>
                        <Row className="g-3">
                          {navItems.slice(1).map(
                            ({ key, label, icon: Icon }) => (
                              <Col xs={12} md={4} key={key}>
                                <Button
                                  variant="outline-primary"
                                  className="w-100 p-3 d-flex align-items-center justify-content-center gap-2"
                                  onClick={() => changeSection(key)}
                                >
                                  <Icon /> Manage {label}
                                </Button>
                              </Col>
                            )
                          )}
                        </Row>
                      </Card.Body>
                    </Card>
                  </>
                )}

                {/* Products, users, and carts */}
                {activeSection !== "Overview" && (
                  <Card className="border-0 shadow-sm">
                    <Card.Body>
                      <Row className="align-items-center g-3 mb-3">
                        <Col>
                          <h2 className="h5 fw-bold mb-0">
                            {activeSection === "Products"
                              ? "Inventory"
                              : activeSection === "Users"
                                ? "Customer data"
                                : "Shopping carts"}
                          </h2>

                          <small className="text-muted">
                            Search, review and manage records
                          </small>
                        </Col>

                        <Col xs={12} md={5} lg={4}>
                          <div className="position-relative">
                            <FiSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />

                            <Form.Control
                              className="ps-5"
                              placeholder={`Search ${activeSection.toLowerCase()}...`}
                              value={search}
                              onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                              }}
                            />
                          </div>
                        </Col>
                      </Row>

                      <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                          <thead
                            style={{
                              backgroundColor: NAVY,
                              color: "#ffffff",
                            }}
                          >
                            {activeSection === "Products" && (
                              <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                              </tr>
                            )}

                            {activeSection === "Users" && (
                              <tr>
                                <th>ID</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Actions</th>
                              </tr>
                            )}

                            {activeSection === "Carts" && (
                              <tr>
                                <th>Cart ID</th>
                                <th>User ID</th>
                                <th>Products</th>
                                <th>Total items</th>
                                <th>Total</th>
                                <th>Actions</th>
                              </tr>
                            )}
                          </thead>

                          <tbody>
                            {activeSection === "Products" &&
                              visibleRows.map((item) => (
                                <tr key={item.id}>
                                  <td className="text-muted">{item.id}</td>
                                  <td className="fw-semibold">
                                    {item.title}
                                  </td>
                                  <td>
                                    <Badge
                                      style={{
                                        backgroundColor: "#eff6ff",
                                        color: BLUE,
                                      }}
                                    >
                                      {item.category || "—"}
                                    </Badge>
                                  </td>
                                  <td>
                                    ${Number(item.price || 0).toFixed(2)}
                                  </td>
                                  <td>{item.stock ?? "—"}</td>
                                  <td>
                                    <div className="d-flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        title="View"
                                        onClick={() =>
                                          window.alert(
                                            `${item.title}\nCategory: ${item.category}\nPrice: $${item.price}\nStock: ${item.stock ?? "—"}`
                                          )
                                        }
                                      >
                                        <FiEye />
                                      </Button>

                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        title="Edit"
                                        onClick={() => openEditProduct(item)}
                                      >
                                        <FiEdit2 />
                                      </Button>

                                      <Button
                                        size="sm"
                                        variant="outline-danger"
                                        title="Delete"
                                        onClick={() => deleteProduct(item)}
                                      >
                                        <FiTrash2 />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}

                            {activeSection === "Users" &&
                              visibleRows.map((person) => (
                                <tr key={person.id}>
                                  <td className="text-muted">
                                    {person.id}
                                  </td>
                                  <td>{person.firstName}</td>
                                  <td>{person.lastName}</td>
                                  <td>{person.username}</td>
                                  <td>{person.email}</td>
                                  <td>
                                    <div className="d-flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        title="View"
                                        onClick={() =>
                                          window.alert(
                                            `${person.firstName} ${person.lastName}\nUsername: ${person.username}\nEmail: ${person.email}`
                                          )
                                        }
                                      >
                                        <FiEye />
                                      </Button>

                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        title="Edit"
                                        onClick={() => editUser(person)}
                                      >
                                        <FiEdit2 />
                                      </Button>

                                      <Button
                                        size="sm"
                                        variant="outline-danger"
                                        title="Delete"
                                        onClick={() => deleteUser(person)}
                                      >
                                        <FiTrash2 />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}

                            {activeSection === "Carts" &&
                              visibleRows.map((cart) => (
                                <tr key={cart.id}>
                                  <td>{cart.id}</td>
                                  <td>{cart.userId}</td>
                                  <td>
                                    {(cart.products || [])
                                      .map((item) => item.title)
                                      .slice(0, 2)
                                      .join(", ") || "—"}
                                  </td>
                                  <td>{cart.totalProducts ?? "—"}</td>
                                  <td>
                                    ${Number(cart.total || 0).toFixed(2)}
                                  </td>
                                  <td>
                                    <div className="d-flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        title="View"
                                        onClick={() =>
                                          window.alert(
                                            `Cart #${cart.id}\nUser ID: ${cart.userId}\nProducts: ${(cart.products || [])
                                              .map(
                                                (item) =>
                                                  `${item.title} x${item.quantity}`
                                              )
                                              .join("\n")}\nTotal: $${cart.total}`
                                          )
                                        }
                                      >
                                        <FiEye />
                                      </Button>

                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        title="Edit total"
                                        onClick={() => editCart(cart)}
                                      >
                                        <FiEdit2 />
                                      </Button>

                                      <Button
                                        size="sm"
                                        variant="outline-danger"
                                        title="Delete"
                                        onClick={() => deleteCart(cart)}
                                      >
                                        <FiTrash2 />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </div>

                      {currentRows.length === 0 && (
                        <div className="text-center text-muted py-5">
                          No records found.
                        </div>
                      )}

                      {renderPagination()}
                    </Card.Body>
                  </Card>
                )}
              </>
            )}

            <div className="text-center text-muted small mt-4">
              ShopStream Admin Panel
            </div>
          </Container>
        </main>
      </div>

      {/* Add/Edit product modal */}
      <Modal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        centered
      >
        <Form onSubmit={saveProduct}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingProduct ? "Edit product" : "Add new product"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                value={productForm.title}
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    title: event.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        price: event.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        stock: event.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={productForm.category}
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    category: event.target.value,
                  })
                }
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowProductModal(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              style={{
                backgroundColor: BLUE,
                borderColor: BLUE,
                color: "#ffffff",
              }}
            >
              {editingProduct ? "Save changes" : "Add product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
