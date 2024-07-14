import React, { useEffect, useState } from "react";
import "./StyleSheets/BagPage.css";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../redux/CartSlice";
import LoginMessage from "../../components/e-commers/LoginMessage";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";

const Bag = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customer } = useSelector((state) => state.customer);
  const { cart } = useSelector((state) => state.cart);
  const [productsInCart, setproductsInCart] = useState(null);
  const [showLoginMessage, setshowLoginMessage] = useState(false);

  function numOfProductsInCart() {
    let numOfProducts = 0;
    cart.map((product) => {
      numOfProducts = numOfProducts + product?.quantity;
    });
    return numOfProducts;
  }

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    dispatch(setCart(updatedCart));
  };

  const handleIncreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    dispatch(setCart(updatedCart));
  };

  const handleDecreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    dispatch(setCart(updatedCart));
  };

  function handleCheckout() {
    customer._id ? navigate("/checkout") : setshowLoginMessage(true);
  }

  function calculateTotalPrice() {
    if (!cart || cart.length === 0) {
      return 0;
    }
    const totalPrice = cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    return totalPrice;
  }

  const totalPrice = calculateTotalPrice();

  useEffect(() => {
    setproductsInCart(numOfProductsInCart());
  }, [cart]);

  return (
    <>
      {cart.length === 0 ? (
        <div className="BagIsEmptyDiv">
          <div>
            <h2>{t("Your bag is empty")}</h2>
            <p>{t("Add some Products")}</p>
            <Link
              to="/store"
              className="btn btn-lg btn-secondary font-bold text-white mt-2"
            >
              {t("View Product")}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="BagContent">
            <h1
              style={{
                fontWeight: "bold",
                marginBottom: "1rem",
                fontSize: "40px",
                color: "#333",
              }}
              className="BagHeader"
            >
              {t("Your Bag")}
            </h1>
            <p
              style={{
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              {t("Total Items")}: {productsInCart}
            </p>
            <hr />
            <ul className="BagList">
              {cart.map((item) => (
                <li
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "20px 0px",
                  }}
                >
                  {item.images && item.images.length > 0 && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      style={{
                        width: "270px",
                        height: "170px",
                        marginRight: "10px",
                      }}
                    />
                  )}

                  <div
                    style={{
                      marginLeft: i18n.language === "en" ? "20px" : "0px",
                      marginRight: i18n.language === "ar" ? "2rem" : "0px",
                    }}
                  >
                    <div style={{ maxWidth: "300px" }}>
                      <p>{item.name}</p>
                      <p>
                        {t("Price")}: {item.price} {t("EGP")}
                      </p>
                    </div>
                    <div>
                      <div style={{ display: "flex" }} className="divsContent">
                        <div
                          className="quantity-controls"
                          style={{
                            padding: "7px 3px",
                            borderRadius: "30px",
                          }}
                        >
                          <button
                            onClick={() => handleDecreaseQuantity(item._id)}
                          >
                            -
                          </button>
                          <span
                            style={{
                              padding: "20px",
                            }}
                          >
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item._id)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          style={{
                            marginTop: "15px",
                            marginLeft:
                              i18n.language === "en" ? "1rem" : "0rem",
                            marginRight:
                              i18n.language === "ar" ? "1rem" : "0rem",
                          }}
                        >
                          <DeleteSharpIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                </li>
              ))}
            </ul>
            <p className="BagTotalPrice">
              {t("Total Price")}: {totalPrice} {t("EGP")}
            </p>
            <div className="w-full flex justify-center">
              <Button
                type="submit"
                variant="contained"
                className="checkoutButton"
                onClick={handleCheckout}
              >
                {t("checkout")}
              </Button>
            </div>
          </div>
        </>
      )}
      <LoginMessage
        showLoginMessage={showLoginMessage}
        setshowLoginMessage={setshowLoginMessage}
      />
    </>
  );
};

export default Bag;
