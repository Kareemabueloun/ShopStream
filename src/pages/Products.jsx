import { Container,Row,Col,Card,CardBody,CardImg,Button,Form,Pagination,} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { addTocart } from "../store/slices/cartSlice";
import { FiShoppingCart, FiChevronLeft, FiChevronRight,FiGlobe,FiMail} from "react-icons/fi";

function sortProducts(items, sortBy, maxPrice, selectedRating) {
  const sortedProducts = items.filter(
    (item) =>
      item.price <= maxPrice &&
      item.rating >= selectedRating
  );

  if (sortBy === "newest") {
    sortedProducts.sort((a, b) => b.id - a.id);
  } else if (sortBy === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "title") {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sortedProducts;
}

export default function Products({ SearchValue }) {
  const { category } = useParams();

  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedRating, setSelectedRating] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const [skip, setSkip] = useState(0);
  const [currentpage, setCurrentPage] = useState(1);
  const [totalpages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const limit = 12;

  function updatepaignation(page) {
    setCurrentPage(page);
    setSkip((page - 1) * limit);
  }

  // Get Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://dummyjson.com/products/categories"
        );

        setCategories(response.data);

        const productsResponse = await axios.get(
          "https://dummyjson.com/products?limit=0"
        );

        const allBrands = [
          ...new Set(
            productsResponse.data.products
              .map((item) => item.brand)
              .filter(Boolean)
          ),
        ].sort();

        setBrands(allBrands);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  // Get Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        let response;

        // Computing
        if (category === "computing") {
          const laptops = await axios.get(
            "https://dummyjson.com/products/category/laptops?limit=0"
          );

          const tablets = await axios.get(
            "https://dummyjson.com/products/category/tablets?limit=0"
          );

          let computingProducts = [
            ...laptops.data.products,
            ...tablets.data.products,
          ];

          if (brandSearch !== "") {
            computingProducts = computingProducts.filter(
              (item) =>
                item.brand &&
                item.brand
                  .toLowerCase()
                  .includes(brandSearch.toLowerCase())
            );
          }

          const filteredProducts = sortProducts(
            computingProducts,
            sortBy,
            maxPrice,
            selectedRating
          );

          setTotalProducts(filteredProducts.length);
          setProducts(filteredProducts.slice(skip, skip + limit));
          setTotalPages(Math.ceil(filteredProducts.length / limit));
        }

        // Wearables
        else if (category === "wearables") {
          const mensWatches = await axios.get(
            "https://dummyjson.com/products/category/mens-watches?limit=0"
          );

          const womensWatches = await axios.get(
            "https://dummyjson.com/products/category/womens-watches?limit=0"
          );

          let wearablesProducts = [
            ...mensWatches.data.products,
            ...womensWatches.data.products,
          ];

          if (brandSearch !== "") {
            wearablesProducts = wearablesProducts.filter(
              (item) =>
                item.brand &&
                item.brand
                  .toLowerCase()
                  .includes(brandSearch.toLowerCase())
            );
          }

          const filteredProducts = sortProducts(
            wearablesProducts,
            sortBy,
            maxPrice,
            selectedRating
          );

          setTotalProducts(filteredProducts.length);
          setProducts(filteredProducts.slice(skip, skip + limit));
          setTotalPages(Math.ceil(filteredProducts.length / limit));
        }

        // Audio
        else if (category === "audio") {
          response = await axios.get(
            "https://dummyjson.com/products/category/mobile-accessories?limit=0"
          );

          let audioProducts = response.data.products;

          if (brandSearch !== "") {
            audioProducts = audioProducts.filter(
              (item) =>
                item.brand &&
                item.brand
                  .toLowerCase()
                  .includes(brandSearch.toLowerCase())
            );
          }

          const filteredProducts = sortProducts(
            audioProducts,
            sortBy,
            maxPrice,
            selectedRating
          );

          setTotalProducts(filteredProducts.length);
          setProducts(filteredProducts.slice(skip, skip + limit));
          setTotalPages(Math.ceil(filteredProducts.length / limit));
        }

        // Home Theater
        else if (category === "home-theater") {
          const furniture = await axios.get(
            "https://dummyjson.com/products/category/furniture?limit=0"
          );

          const homeDecoration = await axios.get(
            "https://dummyjson.com/products/category/home-decoration?limit=0"
          );

          let homeTheaterProducts = [
            ...furniture.data.products,
            ...homeDecoration.data.products,
          ];

          if (brandSearch !== "") {
            homeTheaterProducts = homeTheaterProducts.filter(
              (item) =>
                item.brand &&
                item.brand
                  .toLowerCase()
                  .includes(brandSearch.toLowerCase())
            );
          }

          const filteredProducts = sortProducts(
            homeTheaterProducts,
            sortBy,
            maxPrice,
            selectedRating
          );

          setTotalProducts(filteredProducts.length);
          setProducts(filteredProducts.slice(skip, skip + limit));
          setTotalPages(Math.ceil(filteredProducts.length / limit));
        }

        // Electronics
        else if (category === "electronics") {
          const smartphones = await axios.get(
            "https://dummyjson.com/products/category/smartphones?limit=0"
          );

          const laptops = await axios.get(
            "https://dummyjson.com/products/category/laptops?limit=0"
          );

          const tablets = await axios.get(
            "https://dummyjson.com/products/category/tablets?limit=0"
          );

          const mobileAccessories = await axios.get(
            "https://dummyjson.com/products/category/mobile-accessories?limit=0"
          );

          let electronicsProducts = [
            ...smartphones.data.products,
            ...laptops.data.products,
            ...tablets.data.products,
            ...mobileAccessories.data.products,
          ];

          if (brandSearch !== "") {
            electronicsProducts = electronicsProducts.filter(
              (item) =>
                item.brand &&
                item.brand
                  .toLowerCase()
                  .includes(brandSearch.toLowerCase())
            );
          }

          const filteredProducts = sortProducts(
            electronicsProducts,
            sortBy,
            maxPrice,
            selectedRating
          );

          setTotalProducts(filteredProducts.length);
          setProducts(filteredProducts.slice(skip, skip + limit));
          setTotalPages(Math.ceil(filteredProducts.length / limit));
        }

        // Selected Category
        else if (selectedCategory !== "") {
          response = await axios.get(
            `https://dummyjson.com/products/category/${selectedCategory}?limit=0`
          );

          let categoryProducts = response.data.products;

          if (brandSearch !== "") {
            categoryProducts = categoryProducts.filter(
              (item) =>
                item.brand &&
                item.brand
                  .toLowerCase()
                  .includes(brandSearch.toLowerCase())
            );
          }

          const filteredProducts = sortProducts(
            categoryProducts,
            sortBy,
            maxPrice,
            selectedRating
          );

          setTotalProducts(filteredProducts.length);
          setProducts(filteredProducts.slice(skip, skip + limit));
          setTotalPages(Math.ceil(filteredProducts.length / limit));
        }

        // Search
        else if (SearchValue !== "") {
          response = await axios.get(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(SearchValue)}&limit=0`
          );

          let searchedProducts = response.data.products;

          if (brandSearch !== "") {
            searchedProducts = searchedProducts.filter(
              (item) =>
                item.brand &&
                item.brand
                  .toLowerCase()
                  .includes(brandSearch.toLowerCase())
            );
          }

          const filteredProducts = sortProducts(
            searchedProducts,
            sortBy,
            maxPrice,
            selectedRating
          );

          setTotalProducts(filteredProducts.length);
          setProducts(filteredProducts.slice(skip, skip + limit));
          setTotalPages(Math.ceil(filteredProducts.length / limit));
        }

        // All Products
        else {
          response = await axios.get(
            "https://dummyjson.com/products?limit=0"
          );

          let allProducts = response.data.products;

          if (brandSearch !== "") {
            allProducts = allProducts.filter(
              (item) =>
                item.brand &&
                item.brand
                  .toLowerCase()
                  .includes(brandSearch.toLowerCase())
            );
          }

          const filteredProducts = sortProducts(
            allProducts,
            sortBy,
            maxPrice,
            selectedRating
          );

          setTotalProducts(filteredProducts.length);
          setProducts(filteredProducts.slice(skip, skip + limit));
          setTotalPages(Math.ceil(filteredProducts.length / limit));
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchProducts();
  }, [
    SearchValue,
    category,
    selectedCategory,
    brandSearch,
    maxPrice,
    selectedRating,
    sortBy,
    skip,
  ]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#f8f9ff",
          minHeight: "100vh",
        }}
      >
        <Container fluid className="px-5 py-4">
          <Row>
            {/* Sidebar */}
            <Col lg={2} className="pe-4">
              {/* Category */}
              <div className="mb-4">
                <h6
                  className="text-uppercase mb-3"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "1px",
                  }}
                >
                  Category
                </h6>

                <Form.Check
                  type="checkbox"
                  label="All Products"
                  checked={
                    selectedCategory === "" &&
                    category === undefined
                  }
                  onChange={() => {
                    setSelectedCategory("");
                    setCurrentPage(1);
                    setSkip(0);
                  }}
                  className="mb-2"
                />

                {categories.map((item) => (
                  <Form.Check
                    key={item.slug}
                    type="checkbox"
                    label={item.name}
                    checked={selectedCategory === item.slug}
                    onChange={() => {
                      setSelectedCategory(item.slug);
                      setCurrentPage(1);
                      setSkip(0);
                    }}
                    className="mb-2"
                  />
                ))}
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h6
                  className="text-uppercase mb-3"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "1px",
                  }}
                >
                  Price Range
                </h6>

                <Form.Range
                  min={0}
                  max={1000}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                    setSkip(0);
                  }}
                />

                <div className="d-flex justify-content-between small">
                  <span>$0</span>
                  <span>
                    {maxPrice === 1000 ? "$1,000+" : `$${maxPrice}`}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <h6
                  className="text-uppercase mb-3"
                  style={{
                    fontSize: "18px",
                    letterSpacing: "1px",
                    color: "#454553",
                  }}
                >
                  RATING
                </h6>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <span
                      key={rating}
                      onClick={() => {
                        setSelectedRating(rating);
                        setCurrentPage(1);
                        setSkip(0);
                      }}
                      title={`${rating} star${rating > 1 ? "s" : ""} and up`}
                      style={{
                        cursor: "pointer",
                        color: "#087d67",
                        fontSize: "23px",
                        lineHeight: "1",
                        marginRight: "-9px",
                      }}
                    >
                      {rating <= selectedRating ? "★" : "☆"}
                    </span>
                  ))}

                  <span
                    style={{
                      fontSize: "20px",
                      color: "#202938",
                      marginLeft: "3px",
                    }}
                  >
                    & Up
                  </span>
                </div>
              </div>

              {/* Brand */}
              <div className="mb-4">
                <h6
                  className="text-uppercase mb-3"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "1px",
                  }}
                >
                  Brand
                </h6>

                <Form.Select
                  value={brandSearch}
                  onChange={(e) => {
                    setBrandSearch(e.target.value);
                    setCurrentPage(1);
                    setSkip(0);
                  }}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #d9deea",
                    borderRadius: "8px",
                    color: "#565a68",
                    padding: "10px 14px",
                  }}
                >
                  <option value="">All Brands</option>

                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <Button
                variant="light"
                className="w-100"
                onClick={() => {
                  setSelectedCategory("");
                  setBrandSearch("");
                  setMaxPrice(1000);
                  setSelectedRating(1);
                  setCurrentPage(1);
                  setSkip(0);
                }}
                style={{
                  backgroundColor: "#dbe7fc",
                  border: "none",
                }}
              >
                Clear Filters
              </Button>
            </Col>

            {/* Products */}
            <Col lg={10}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="mb-1">
                    All Products
                  </h5>

                  <p className="text-muted small mb-0">
                    Showing{" "}
                    {totalProducts === 0 ? 0 : skip + 1}-
                    {Math.min(skip + limit, totalProducts)}{" "}
                    of {totalProducts} results
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">
                    Sort by:
                  </span>

                  <Form.Select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                      setSkip(0);
                    }}
                    style={{
                      width: "145px",
                    }}
                  >
                    <option value="newest">
                      Newest Arrivals
                    </option>

                    <option value="price-asc">
                      Price: Low to High
                    </option>

                    <option value="price-desc">
                      Price: High to Low
                    </option>

                    <option value="rating">
                      Rating
                    </option>

                    <option value="title">
                      Title
                    </option>
                  </Form.Select>
                </div>
              </div>

              {/* Products */}
              <Row className="g-3">
                {products.length === 0 && (
                  <h5>
                    Product Not Found
                  </h5>
                )}

                {products.map((product) => (
                  <Col
                    key={product.id}
                    md={6}
                    lg={4}
                  >
                    <Card
                      className="h-100"
                      style={{
                        border: "1px solid #c8cee0",
                        borderRadius: "14px",
                        overflow: "hidden",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {/* Image */}
                      <Link
                        to={`/products/${product.id}`}
                        className="text-decoration-none"
                      >
                        <div
                          style={{
                            padding: "10px",
                          }}
                        >
                          <CardImg
                            src={product.thumbnail}
                            variant="top"
                            alt={product.title}
                            style={{
                              height: "250px",
                              objectFit: "cover",
                              borderRadius: "9px",
                            }}
                          />
                        </div>
                      </Link>

                      {/* Product Information */}
                      <Link
                        to={`/products/${product.id}`}
                        className="text-decoration-none text-dark"
                      >
                        <CardBody
                          style={{
                            padding: "12px 18px 8px 18px",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <Card.Title
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                marginBottom: "8px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "75%",
                              }}
                            >
                              {product.title}
                            </Card.Title>

                            <span
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                              }}
                            >
                              <span
                                style={{
                                  color: "#087d67",
                                  marginRight: "4px",
                                }}
                              >
                                ★
                              </span>

                              {product.rating}
                            </span>
                          </div>

                          <Card.Text
                            style={{
                              fontSize: "16px",
                              lineHeight: "1.45",
                              color: "#565a68",
                              height: "48px",
                              overflow: "hidden",
                              marginBottom: "22px",
                            }}
                          >
                            {product.description}
                          </Card.Text>

                          <span
                            style={{
                              color: "#087d67",
                              fontSize: "18px",
                              fontWeight: "500",
                            }}
                          >
                            ${product.price}
                          </span>
                        </CardBody>
                      </Link>

                      {/* Add */}
                      <div
                        style={{
                          padding: "0 18px 14px 18px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          size="sm"
                          onClick={() => {
                            dispatch(addTocart(product));
                          }}
                          style={{
                            backgroundColor: "#3927d8",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            padding: "9px 16px",
                          }}
                        >
                          <FiShoppingCart
                            className="me-1"
                            size={18}
                          />
                          Add
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <Pagination className="justify-content-center mt-4">
                <Pagination.Prev
                  disabled={currentpage === 1}
                  onClick={() =>
                    updatepaignation(currentpage - 1)
                  }
                >
                  <FiChevronLeft />
                </Pagination.Prev>

                {Array.from({
                  length: totalpages,
                }).map((item, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentpage}
                    onClick={() =>
                      updatepaignation(index + 1)
                    }
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  onClick={() => {
                    if (currentpage === totalpages) {
                      updatepaignation(1);
                    } else {
                      updatepaignation(currentpage + 1);
                    }
                  }}
                >
                  <FiChevronRight />
                </Pagination.Next>
              </Pagination>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#dce5fa",
        }}
      >
        <Container fluid className="px-5">
          <Row className="py-3 align-items-center">
            <Col md={4}>
              <h6 className="fw-bold text-primary mb-1">
                ShopStream
              </h6>

              <small>
                © 2024 ShopStream Inc. All rights reserved.
              </small>
            </Col>

            <Col md={5}>
              <div className="d-flex justify-content-center gap-3 small">
                <a
                  href="#"
                  className="text-dark text-decoration-none"
                >
                  Privacy Policy
                </a>

                <a
                  href="#"
                  className="text-dark text-decoration-none"
                >
                  Terms of Service
                </a>

                <a
                  href="#"
                  className="text-dark text-decoration-none"
                >
                  Contact Us
                </a>

                <a
                  href="#"
                  className="text-dark text-decoration-none"
                >
                  Shipping Info
                </a>
              </div>
            </Col>

            <Col md={3}>
              <div className="d-flex justify-content-end gap-3">
                <FiGlobe />
                <FiMail />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}