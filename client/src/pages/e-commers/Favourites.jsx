import React, { useEffect, useState } from "react";
import ProductCard from "../../components/e-commers/ProductCard.jsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SetCustomer } from "../../redux/CustomerSlice.js";
import toast, { Toaster } from "react-hot-toast";
import "./StyleSheets/Favorites.css";
import Loading from "../../components/shared/Loading.jsx";
import { setCart } from "../../redux/CartSlice.js";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";

function Favourites() {
  const { t } = useTranslation();
  const { customer } = useSelector((state) => state.customer);
  const { cart } = useSelector((state) => state.cart);
  const [favoritProducts, setFavoritProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const getFavorits = async (id) => {
    await axios
      .get(`/customers/favorite/${id}`)
      .then((res) => {
        setFavoritProducts(res.data.favorites);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  async function handelFavorit(productId) {
    //console.log(id, productId);
    await axios
      .post("/customers/favorite", { id: customer._id, productId })
      .then((res) => {
        const newData = {
          token: localStorage?.getItem("token"),
          ...res.data?.newCustomerData,
        };
        dispatch(SetCustomer(newData));
        setTimeout(() => {
          setFavoritProducts((prevfavlist) => {
            return prevfavlist.filter((t) => t._id !== productId);
          });
          toast.dismiss();
          toast("Removed successfully");
        }, 500);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const handelCart = (id, name, price, images, points) => {
    const inCart = cart.find((prod) => {
      return prod._id === id;
    });
    //item all ready in the cart
    if (inCart) {
      dispatch(setCart(cart.filter((t) => t._id !== id)));
    } else {
      dispatch(
        setCart([
          ...cart,
          { _id: id, name, price, images, points, quantity: 1 },
        ])
      );
    }
  };

  useEffect(() => {
    getFavorits(customer?._id);
  }, []);

  return (
    <>
      <main className="favoritesMain">
        <Toaster
          toastOptions={{
            style: {
              duration: 3000,
              backgroundColor: "#65B741",
              padding: "16px",
              color: "white",
              fontWeight: "Bold",
              marginTop: "65px",
              textAlign: "center",
            },
          }}
        />
        <h1>{t("Favorites")}</h1>
        {isLoading ? (
          <Loading />
        ) : (
          <div
            className={
              favoritProducts.length > 0
                ? "favoritesProductes"
                : "EmptyfavoriteProducte"
            }
            style={{ display: "flex", justifyContent: "center" }}
          >
            {favoritProducts.length > 0 ? (
              favoritProducts.map((product) => {
                return (
                  <div
                    key={product._id}
                    className="favoriteProducteDiv"
                    style={{ paddingBottom: "30px" }}
                  >
                    <ProductCard
                      product={product}
                      favoriteList={customer?.favoriteList}
                      handelFavorit={handelFavorit}
                      handelCart={handelCart}
                    />
                  </div>
                );
              })
            ) : (
              <h2>{t("Your favorite list is empty.")}</h2>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default Favourites;
