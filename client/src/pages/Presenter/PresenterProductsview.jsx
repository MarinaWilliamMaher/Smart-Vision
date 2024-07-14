import React, { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./StyleSheets/PresenterProductsView.css"; // Import custom CSS for advanced styling
import Loading from "../../components/shared/Loading";
import { apiRequest } from "../../utils";
import { t } from "i18next";

function PresenterProductsView() {
  const language = JSON.parse(window?.localStorage.getItem("language"));
  const { employee } = useSelector((state) => state?.employee);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest({
          url: "/employees/presenter/not-shown/",
          method: "GET",
          token: employee?.token,
        });
        console.log("API response:", response.data.products);
        setProducts(response.data.products);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error.response.data.message);
      }
    };

    fetchProducts();
  }, []);

  // Function to truncate text
  const truncateText = (text, length) => {
    if (text?.length <= length) {
      return text;
    }
    return text?.substring(0, length) + "...";
  };

  // Function to handle the toggling of the description
  const handleToggle = (index) => {
    setIsExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="presenter-products-container"
    >
      {" "}
      {/* Apply advanced styling class */}
      {isLoading ? (
        <Grid item>
          <Loading />
        </Grid>
      ) : products?.length > 0 ? (
        <Grid item xs={12} sm={10} md={10}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ marginBottom: "1rem" }}
          >
            {t("productsInInventory")}
          </Typography>
          <Grid
            container
            spacing={3}
            className="presenter-products"
            align="center"
            justifyContent="space-evenly"
          >
            {products?.map((product, index) => (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <div className={`presenter-product-card`}>
                  <Typography
                    variant="h6"
                    align="center"
                    gutterBottom
                    className="presenter-product-title"
                  >
                    {language === "en" ? product?.name : product?.ARName}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    gutterBottom
                    className="presenter-product-info"
                  >
                    {t("quantity")}: {product.quantity}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    gutterBottom
                    className="presenter-product-description"
                  >
                    {t("description")}:{" "}
                    {isExpanded[index]
                      ? language === "en"
                        ? product?.description
                        : product?.ARDescription
                      : truncateText(
                          language === "en"
                            ? product?.description
                            : product?.ARDescription,
                          150
                        )}
                    {(language === "en"
                      ? product?.description
                      : product?.ARDescription
                    )?.length > 170 && (
                      <span
                        onClick={() => handleToggle(index)}
                        style={{ color: "blue", cursor: "pointer" }}
                        onMouseOver={(e) =>
                          (e.target.style.textDecoration = "underline")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.textDecoration = "none")
                        }
                      >
                        {isExpanded[index] ? t(" show less") : t(" read more")}
                      </span>
                    )}
                  </Typography>
                  <div className="button-container">
                    {" "}
                    <Link
                      to={`/presenter/add-to-store/product/${product?._id}`}
                      className="link-style"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        className="add-to-store-button"
                        style={{
                          background:
                            "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                          textTransform: "capitalize",
                          height: 34,
                          padding: "0px 15px",
                        }}
                      >
                        {t("addToStore")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12} sm={8} sx={{ display: "flex" }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              padding: "20px",
              backgroundColor: "#f0f0f0",
              borderRadius: "5px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "25px",
              width: "80vw",
              marginTop: "5rem ",
              marginInline: "auto",
            }}
          >
            {t("allProductsAdded")}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default PresenterProductsView;
