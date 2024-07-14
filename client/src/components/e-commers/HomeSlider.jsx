import { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import "../../pages/e-commers/StyleSheets/Homepage.css";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../redux/CartSlice";
import { SetCustomer } from "../../redux/CustomerSlice";
import { useNavigate } from "react-router-dom";
import i18n from "../../../Language/translate";

function HomeSlider({ items, option, setSelectedOption }) {
  const categoryCardsRef = useRef(null);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const [itemsToScroll, setItemsToScroll] = useState(5.75); // Initial value
  //add by youssef
  const { customer } = useSelector((state) => state.customer);
  const { cart } = useSelector((state) => state.cart);
  const [favoriteList, setFavoriteList] = useState(customer?.favoriteList);
  const [inCart, setInCart] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //remove product from cart
  function deleteProductFromCart(prevCart, id) {
    return prevCart.filter((t) => t._id !== id);
  }

  const handelCart = (id, name, price, images, points) => {
    const inCart = cart.find((prod) => {
      return prod._id === id;
    });
    //item all ready in the cart
    if (inCart) {
      dispatch(setCart(deleteProductFromCart(cart, id)));
      setInCart(false);
    } else {
      dispatch(
        setCart([
          ...cart,
          { _id: id, name, price, images, points, quantity: 1 },
        ])
      );
      setInCart(true);
    }
  };

  const handelFavorit = (id) => {
    if (customer?._id) {
      favorites(customer?._id, id);
    } else {
      navigate("/login");
    }
  };
  async function favorites(id, productId) {
    await axios
      .post("/customers/favorite", { id, productId })
      .then((res) => {
        const newData = { ...res.data?.newCustomerData };
        dispatch(SetCustomer(newData));
        setFavoriteList(customer?.favoriteList);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    // const container = categoryCardsRef.current;
    const updateItemsToScroll = () => {
      // Check if the screen width is less than or equal to a certain value (e.g., 600px)
      const screenWidth = window.innerWidth;
      console.log(screenWidth); // Log the screenWidth

      if (screenWidth < 580 && option !== "product") {
        setItemsToScroll(1.08);
      } else if (screenWidth < 890 && option !== "product") {
        setItemsToScroll(2.1);
      } else if (screenWidth <= 1035 && option !== "product") {
        setItemsToScroll(3.2);
      } else if (screenWidth <= 1410 && option !== "product") {
        setItemsToScroll(4.3);
      } else if (option === "product" && screenWidth < 780) {
        setItemsToScroll(1);
      } else {
        setItemsToScroll(5.3);
      }
    };

    updateItemsToScroll();
    window.addEventListener("resize", updateItemsToScroll);
    return () => window.removeEventListener("resize", updateItemsToScroll);
  }, []);

  useEffect(() => {
    const container = categoryCardsRef.current;
    const sliderContainer = sliderContainerRef.current;

    const handleScroll = () => {
      if (container) {
        let showLeftArrow, showRightArrow;

        if (i18n.language === "ar") {
          showLeftArrow =
            container.scrollLeft >
              container.offsetWidth - container.scrollWidth + 1 ||
            (container.scrollLeft === 0 && items.length > 4);
          showRightArrow =
            container.scrollLeft >=
              container.offsetWidth - container.scrollWidth &&
            container.scrollLeft < 0;
        } else {
          showLeftArrow = container.scrollLeft > 0;
          showRightArrow =
            container.scrollLeft <
            container.scrollWidth - container.offsetWidth - 1;
        }
        // console.log("Scroll Left:", container.scrollLeft);
        // console.log("Scroll Width:", container.scrollWidth);
        // console.log("Offset Width:", container.offsetWidth);
        // console.log("Client Width:", container.clientWidth);
        // console.log("Show Left Arrow:", showLeftArrow);
        // console.log("Show Right Arrow:", showRightArrow);

        if (leftArrowRef.current) {
          leftArrowRef.current.style.visibility = showLeftArrow
            ? "visible"
            : "hidden";
        }
        if (rightArrowRef.current) {
          rightArrowRef.current.style.visibility = showRightArrow
            ? "visible"
            : "hidden";
        }
      }
    };

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    if (container) {
      container.addEventListener("scroll", throttledScroll);
    }

    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () => {
        if (container) {
          let showLeftArrow, showRightArrow;

          if (i18n.language === "ar") {
            showLeftArrow =
              container.scrollLeft >
                container.offsetWidth - container.scrollWidth + 1 ||
              (container.scrollLeft === 0 && items.length > 4);
            showRightArrow =
              container.scrollLeft >=
                container.offsetWidth - container.scrollWidth &&
              container.scrollLeft < 0;
          } else {
            showLeftArrow = container.scrollLeft > 0;
            showRightArrow =
              container.scrollLeft <
              container.scrollWidth - container.offsetWidth - 1;
          }

          if (leftArrowRef.current) {
            leftArrowRef.current.style.visibility = showLeftArrow
              ? "visible"
              : "hidden";
          }
          if (rightArrowRef.current) {
            rightArrowRef.current.style.visibility = showRightArrow
              ? "visible"
              : "hidden";
          }
        }
      });

      sliderContainer.addEventListener("mouseleave", () => {
        if (leftArrowRef.current && rightArrowRef.current) {
          leftArrowRef.current.style.visibility = "hidden";
          rightArrowRef.current.style.visibility = "hidden";
        }
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", throttledScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    const container = categoryCardsRef.current;
    if (container) {
      const scrollWidth = itemsToScroll * container.children[0].offsetWidth;
      let scrollAmount = 1 * scrollWidth;
      container.scrollTo({
        left: container.scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const container = categoryCardsRef.current;
    if (container) {
      const scrollWidth = itemsToScroll * container.children[0].offsetWidth;
      let scrollAmount = -1 * scrollWidth;
      container.scrollTo({
        left: container.scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="home-slider-container"
      style={{ position: "relative" }}
      ref={sliderContainerRef}
    >
      <div className="category-cards" ref={categoryCardsRef}>
        {items.map((item, index) =>
          option === "category" || option === "price" ? (
            <CategoryCard
              key={index}
              name={item.name}
              imageUrl={item.imageUrl}
              isLast={index === items.length - 1}
              onClick={() =>
                setSelectedOption(option === "category" ? item.name : item.low)
              }
            />
          ) : (
            <ProductCard
              key={index}
              product={item}
              favoriteList={favoriteList}
              handelFavorit={handelFavorit}
              handelCart={handelCart}
              name="home"
            />
          )
        )}
      </div>

      <div
        className="overlay"
        style={{
          position: "absolute",
          width: "100%",
          height: "20%",
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          direction: "ltr",
        }}
      >
        <button
          className="arrow left-arrow presenterarrow"
          onClick={scrollLeft}
          ref={leftArrowRef}
          style={{
            visibility: "hidden",
            pointerEvents: "auto",
          }}
        >
          &#10094;
        </button>
        <button
          className="arrow right-arrow presenterarrow "
          onClick={scrollRight}
          ref={rightArrowRef}
          style={{
            visibility: "hidden",
            pointerEvents: "auto",
          }}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default HomeSlider;
