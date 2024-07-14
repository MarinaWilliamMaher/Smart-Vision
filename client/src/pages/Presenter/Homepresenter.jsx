import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./StyleSheets/homePresenter.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Card from "../../components/Presenter/Card";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Loading from "../../components/shared/Loading";
import { apiRequest } from "../../utils";
import { t } from "i18next";
import { useSelector } from "react-redux";
import i18n from "../../../Language/translate";
const HomePresenter = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: "", name: "" });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const categoryDropdownRef = useRef(null);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const categories = ["sofa", "chair", "bed", "table"];
  const { employee } = useSelector((state) => state?.employee);

  async function handelDeleteProduct(productId) {
    try {
      await apiRequest({
        method: "delete",
        url: "/products/",
        data: { productId },
        token: employee?.token,
      });
      setProducts(products.filter((item) => item._id !== productId));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest({
          url: "/products/",
          method: "GET",
        });
        console.log("API response:", response.data.products);
        setProducts(response.data.products);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) => {
      const index = prevCategories.indexOf(category);

      if (index === -1) {
        const updatedCategories = prevCategories.includes("All")
          ? prevCategories.filter((cat) => cat !== "All")
          : prevCategories;
        return [...updatedCategories, category];
      } else {
        return prevCategories.filter((cat) => cat !== category);
      }
    });
    console.log(selectedCategories);
  };

  useEffect(() => {
    const handleCategoryClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleCategoryClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleCategoryClickOutside);
    };
  }, []);

  const handleNameChange = (e) => {
    if (e && e.target) {
      setFilters({
        ...filters,
        name: e.target.value,
      });
    }
  };

  const filterProducts = () => {
    return products.filter(
      (product) =>
        (selectedCategories.length === 0 ||
          selectedCategories.includes("All") ||
          selectedCategories.includes(product.category)) &&
        (i18n.language === "ar"
          ? filters.name === "" ||
            product.ARName.toLowerCase().includes(filters.name)
          : filters.name === "" ||
            product.name.toLowerCase().includes(filters.name))
    );
  };

  function getCategoryName(category) {
    switch (category) {
      case "sofa":
        return t("sofa");
      case "chair":
        return t("chair");
      case "bed":
        return t("bed");
      case "table":
        return t("table");
      default:
        break;
    }
  }

  return (
    <>
      <div className="store-container">
        <div className="filters-container">
          {/* Category filter */}
          <div
            onClick={toggleCategoryDropdown}
            className="Filter"
            tabIndex="0"
            ref={categoryDropdownRef}
          >
            <h2>
              {t("Category")}
              <span className="presenterarrow mx-2">
                <KeyboardArrowDownIcon />
              </span>
            </h2>
            {showCategoryDropdown && (
              <div
                className="dropDown categorydropDown "
                style={{
                  maxHeight: "200px",
                  marginInline: "-50px",
                  marginTop: "-16px",
                }}
              >
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="categoryOption"
                    style={{
                      padding: "2px 5px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      textAlign: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryChange(category);
                    }}
                  >
                    <span>{getCategoryName(category)}</span>
                    <input
                      style={{
                        cursor: "pointer",
                        width: "17px",
                        height: "17px",
                      }}
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      readOnly
                    />{" "}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Name filter */}
          <div
            style={{
              minWidth: "310px",
              height: "50px",
              backgroundColor: "gray",
              borderRadius: "35px",
              position: "relative",
            }}
          >
            <IconButton
              style={{ position: "absolute", top: "6px", left: "10px" }}
            >
              <SearchIcon />
            </IconButton>
            <input
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
                borderRadius: "30px",
                fontSize: "20px",
                padding: "15px 20px",
                paddingLeft: "50px",
                outline: "none",
              }}
              type="search"
              value={filters.name}
              onChange={(e) => handleNameChange(e)}
              placeholder={t("productName")}
            ></input>
          </div>
        </div>
        {/* Product display */}
        {isLoading ? (
          <div className="h-60">
            <Loading />
          </div>
        ) : (
          <div
            className="products-container"
            style={{
              width: "89%",
              justifyContent: "space-evenly",
            }}
          >
            {filterProducts().length > 0 ? (
              filterProducts().map((product, index) => (
                <Card
                  key={index}
                  product={product}
                  handelDelete={handelDeleteProduct}
                />
              ))
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "25px",
                  width: "65%",
                  margin: "auto",
                  padding: "20px",
                  color: "#a8a8a8",
                  marginTop: "3rem",
                }}
              >
                {t("noResultsFound")}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
// Store.propTypes = {
//   selectedCategory: PropTypes.string,
//   selectedPrice: PropTypes.number,
// };
export default HomePresenter;
