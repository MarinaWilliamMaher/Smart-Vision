import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Toolbar from "@mui/material/Toolbar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import "./StyleSheets/Header.css";
import Menu from "./Menu";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import axios from "axios";
import LoginMessage from "../e-commers/LoginMessage";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";
const Header = () => {
  const language = JSON.parse(window?.localStorage.getItem("language"));
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { customer } = useSelector((state) => state.customer);
  const { cart } = useSelector((state) => state.cart);
  const [productsInCart, setproductsInCart] = useState(null);
  const [showSearchResults, setshowSearchResults] = useState(false);
  const [Products, setProducts] = useState([]);
  const [filteredProducts, setfilteredProducts] = useState([]);
  const [searchValue, setsearchValue] = useState("");
  const [showLoginMessage, setshowLoginMessage] = useState(false);

  async function getProducts() {
    try {
      await axios
        .get(`/products/`)
        .then((res) => {
          setProducts(res?.data?.products);
          setfilteredProducts(res?.data?.products);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getProducts();
  }, []);

  const renderUserName = () => {
    if (!customer || !customer.username) {
      return t("Log in or sign up");
    }
    return customer.username;
  };

  function numOfProductsInCart(cart) {
    let numOfProducts = 0;
    cart.map((product) => {
      numOfProducts = numOfProducts + product?.quantity;
    });
    return numOfProducts;
  }

  useEffect(() => {
    setproductsInCart(numOfProductsInCart(cart));
  }, [cart]);

  useEffect(() => {
    const filtered = Products?.filter((item) => {
      const nameMatch = item.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const ARNameMatch = item.ARName.includes(searchValue.toLowerCase());
      const categoryMatch = item.category
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const description = item.description
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const ARdescription = item.ARDescription.includes(
        searchValue.toLowerCase()
      );

      if (
        nameMatch ||
        categoryMatch ||
        ARNameMatch ||
        description ||
        ARdescription
      ) {
        return item;
      }
    });
    setfilteredProducts(filtered);
  }, [searchValue]);

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    window.localStorage.setItem("language", JSON.stringify(newLanguage));
  };
  return (
    <header style={{ display: "flex", direction: "ltr" }}>
      <div className="menu">
        <Menu></Menu>
        <p>{t("Menu")}</p>
      </div>
      <div style={{ position: "relative" }} className="head">
        <Toolbar
          style={{ display: "flex", justifyContent: "space-between" }}
          className="header-row"
        >
          <div className="header-logo">
            <Link to={"/home"}>
              <img src="/smartVisionLogo.png" />
            </Link>
          </div>
          <div className="icons">
            <Link to={"/profile"}>
              <button
                className="userAccount btnHover"
                style={{ display: "flex", padding: "10px 20px 10px 8px" }}
              >
                <Avatar sx={{ width: 35, height: 35 }} className="avatar" />
                <p
                  style={{
                    fontSize: "19px",
                    paddingTop: "0.2rem",
                    marginLeft: "0.5rem",
                    // width:"210px",
                    // marginLeft:"-0.7rem"
                  }}
                  className=""
                >
                  {renderUserName()}
                </p>
              </button>
            </Link>
            <button
              className="btnHover favorite"
              style={{ outline: "none", padding: "4px 12px" }}
              onClick={() => {
                customer?._id
                  ? navigate("/favourites")
                  : setshowLoginMessage(true);
              }}
            >
              <FavoriteIcon
                style={{ fontSize: "22px", marginTop: "0.8rem" }}
              ></FavoriteIcon>
            </button>
            <Link to={"./bag"}>
              <IconButton
                aria-label="cart"
                style={{ padding: "12px", marginLeft: "2px" }}
                className="badge"
              >
                <Badge
                  badgeContent={
                    <span
                      style={{
                        fontSize: "16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {productsInCart}
                    </span>
                  }
                  color="black"
                >
                  {" "}
                  <ShoppingBasketIcon
                    style={{ color: "black", fontSize: "25px" }}
                  />
                </Badge>
              </IconButton>
            </Link>
          </div>
        </Toolbar>
        <Toolbar className="searchinput">
          <div
            className="btnHover search"
            style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
          >
            <InputAdornment position="start">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
            <input
              className="searchInput"
              type="search"
              value={searchValue}
              placeholder={t("What Are You Looking For ?")}
              onChange={(e) => setsearchValue(e.target.value)}
              onFocus={() => setshowSearchResults(true)}
              onBlur={() => {
                setTimeout(() => {
                  setsearchValue("");
                  setshowSearchResults(false);
                }, 300);
              }}
            />
            {showSearchResults ? (
              <ul className="searchInputResults">
                {filteredProducts?.length > 0 ? (
                  filteredProducts?.map((item, idx) => {
                    return (
                      <li
                        className="searchInputResultsLi"
                        key={idx}
                        onClick={() => navigate(`/product/${item?._id}`)}
                      >
                        <div className="flex">
                          <img src={item?.images[0]} />
                          <div className="ml-2 items-center flex w-10/12 flex-wrap">
                            <p className="searchInputResultsProductName">
                              {language === "en" ? item?.name : item?.ARName}
                            </p>
                            <p className="searchInputResultsProductCategory">
                              {t(item?.category?.toLowerCase())}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="searchInputResultsNotFound">
                    {t("No product found")}
                  </li>
                )}
              </ul>
            ) : null}
          </div>
        </Toolbar>
        <Toolbar className="row3">
          <ul
            className="headerUl links"
            style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
          >
            <li>
              <Link to="/home">{t("Home")}</Link>
            </li>
            <li>
              <Link to="/store">{t("Products")}</Link>
            </li>
            <li>
              <Link to="/services">{t("Services")}</Link>
            </li>
            <li>
              <Link to="/about">{t("About Us")}</Link>
            </li>
            <li>
              <Link to="/contact-us">{t("Contact Us")}</Link>
            </li>
          </ul>
          <button
            className="btnHover lang"
            onClick={toggleLanguage}
            style={{
              fontSize: "19px",
              outline: "none",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            {i18n.language === "en" ? (
              <>
                العربية
                <span>
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/fluency/48/egypt-circular.png"
                    alt="egypt-circular"
                  />
                </span>
              </>
            ) : (
              <>
                English
                <span>
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/fluency/48/usa-circular.png"
                    alt="usa-circular"
                  />
                </span>
              </>
            )}
          </button>
        </Toolbar>
      </div>
      <LoginMessage
        showLoginMessage={showLoginMessage}
        setshowLoginMessage={setshowLoginMessage}
      />
    </header>
  );
};

export default Header;
