import { useEffect, useRef, useState } from "react";
import HomeSlider from "../../components/e-commers/HomeSlider";
import Store from "./Store";
import "./StyleSheets/Homepage.css";
import axios from "axios";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import "react-slideshow-image/dist/styles.css";
import { Fade, Zoom, Slide } from "react-slideshow-image";
import Loading from "../../components/shared/Loading";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";

function Homepage() {
  const { t } = useTranslation();
  const storeRef = useRef(null);
  const categories = [
    { id: 1, name: "bed", imageUrl: "../beds.avif" },
    { id: 6, name: "closet", imageUrl: "../closet.avif" },
    { id: 2, name: "sofa", imageUrl: "../sofa.jpeg" },
    { id: 3, name: "chair", imageUrl: "../chair.avif" },
    { id: 4, name: "kitchen", imageUrl: "../kitchen.avif" },
    { id: 5, name: "table", imageUrl: "../TABLE.jpg" },
    { id: 9, name: "Last", imageUrl: "" },
  ];
  const prices = [
    {
      low: 5000,
      imageUrl: "../chair.jpg",
      name: ` ${t("Under")} 5000 ${t("EGP")}`,
    },
    {
      low: 13000,
      imageUrl: "../sofa.avif",
      name: ` ${t("Under")} 13000 ${t("EGP")}`,
    },
    {
      low: 33000,
      imageUrl: "../bed.jpg",
      name: ` ${t("Under")} 33000 ${t("EGP")}`,
    },
    { low: "", name: "Last", imageUrl: "" },
  ];
  const offers = [
    {
      id: 1,
      title: "50% Off",
      description: "Get 50% off on selected items",
      imageUrl: "../50%.avif",
    },
    {
      id: 2,
      title: "Flash Sale",
      description: "Limited time offer! Flash sale on all products",
      imageUrl: "../flash-sale-3d.jpg",
    },
    {
      id: 3,
      title: "Free Shipping",
      description: "Enjoy free shipping on all orders over $50",
      imageUrl: "../free_delivery.jpg",
    },
    // Add more offers as needed
  ];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products/");
        // console.log("API response:", response.data.products);
        setProducts(response.data.products);
        setIsLoading(false);
        // console.log(response.data.products[0].images[0])
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    if (selectedCategory || selectedPrice) {
      storeRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCategory, selectedPrice]);
  return (
    <div className="Home">
      <div
        className="rounded-lg  md:h-full overflow-hidden"
        style={{ marginBottom: "3.2rem", width: "90%", margin: "auto" }}
      >
        <div className=" ">
          <div className="inline md:slide-container">
            <Slide>
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="offer-item rounded-lg  xs:h-full w-full"
                >
                  <div
                    className="flex flex-col justify-center items-center w-full h-[400px] bg-center"
                    style={{
                      backgroundImage: `url(${offer.imageUrl})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                </div>
              ))}
            </Slide>
          </div>
        </div>
      </div>
      <h2 style={{ fontWeight: "bold", fontSize: "27px" }}>
        {t("Browse furniture sale")}
      </h2>
      <HomeSlider
        items={categories}
        option="category"
        setSelectedOption={setSelectedCategory}
      />
      <h2 style={{ fontWeight: "bold", fontSize: "27px" }}>
        {t("Shop BY Price")}
      </h2>
      <HomeSlider
        items={prices}
        option="price"
        setSelectedOption={setSelectedPrice}
      />
      {isLoading && !selectedCategory && !selectedPrice ? (
        <Loading />
      ) : (
        <>
          <h2 style={{ fontWeight: "bold", fontSize: "27px" }}>
            {t("Our Products")}
          </h2>
          <HomeSlider items={products} option="product" />
        </>
      )}
      <div ref={storeRef}>
        {(selectedCategory || selectedPrice) && (
          <Store
            key={selectedCategory}
            selectedCategory={
              selectedCategory ? selectedCategory?.toLowerCase() : "All"
            }
            selectedPrice={selectedPrice}
          />
        )}
      </div>

      <div
        className="mt-10 w-full  flex flex-col md:flex-row bg-slate-200 justify-between overflow-hidden rounded-lg "
        style={{ marginBottom: "2rem" }}
      >
        <div className="md:w-1/3 flex flex-col  bg-slate-300  p-10 hover:bg-slate-100 transition ease-in duration-800">
          <img
            src="/vision.png"
            alt="vision"
            width={60}
            height={60}
            className="self-center"
          />
          <h2 className="text-3xl text-blue-500 text-center ">
            {t("OurVision")}
          </h2>
          <p className="text-black">{t("SmartVisionMessage")}</p>
        </div>
        <div className="md:w-1/3 flex flex-col p-10 hover:bg-slate-100 transition ease-in duration-800">
          <img
            src="/mission.png"
            alt="vision"
            width={60}
            height={60}
            className="self-center"
          />
          <h2 className="text-3xl text-blue-500 text-center">{t("Mission")}</h2>
          <p className="text-black">{t("SmartVisionMessage1")}</p>
        </div>
        <div className="md:w-1/3 flex flex-col  bg-slate-300  p-10 hover:bg-slate-100 transition ease-in duration-800">
          <img
            src="/commitment.png"
            alt="vision"
            width={60}
            height={60}
            className="self-center"
          />
          <h2 className="text-3xl text-blue-500 text-center">
            {t("Commitment")}
          </h2>
          <p className="text-black">{t("SmartVisionMessage2")}</p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
