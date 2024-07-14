import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import ProgressBar from "react-bootstrap/ProgressBar";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Tooltip,
} from "@mui/material";
import "../e-commers/StyleSheets/ProductDetails.css";
import ReviewPresenter from "../../components/Presenter/ReviewsPresenter";
import Loading from "../../components/shared/Loading";
import { apiRequest } from "../../utils";
import { t } from "i18next";
import i18n from "../../../Language/translate";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ProductDetailsPresenter() {
  const language = JSON.parse(window?.localStorage.getItem("language"));
  const { employee } = useSelector((state) => state?.employee);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState();
  const [reviews, setReviews] = useState(null);
  const [totalRating, setTotalRating] = useState(null);
  const [progressBar, setProgressBar] = useState(null);
  const [showDeleteMessage, setshowDeleteMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //set valuse to prograss bar
  function setUpPrograssBar(reviews) {
    const totalRatings = [
      { number: 5, numOfRating: 0, progres: 0 },
      { number: 4, numOfRating: 0, progres: 0 },
      { number: 3, numOfRating: 0, progres: 0 },
      { number: 2, numOfRating: 0, progres: 0 },
      { number: 1, numOfRating: 0, progres: 0 },
    ];
    reviews.map((review) => {
      totalRatings.map((rating) => {
        if (review?.rating === rating.number) {
          rating.numOfRating++;
          rating.progres = Math.floor(
            (rating.numOfRating / reviews.length) * 100
          );
        }
      });
    });
    return totalRatings;
  }
  //Update prograss bar after any changes in reviews
  function updatePrograssBar(review, progressBar) {
    let totalReviews = 0;
    progressBar.map((rating) => {
      totalReviews = totalReviews + rating.numOfRating;
    });
    //
    progressBar.map((rating) => {
      if (review?.rating === rating.number) {
        rating.numOfRating--;
        totalReviews--;
      }
    });
    progressBar.map((rating) => {
      rating.progres = Math.floor((rating.numOfRating / totalReviews) * 100);
    });
    return progressBar;
  }

  //handel remove product
  const handelDeleteProduct = async (productId) => {
    const res = await apiRequest({
      url: "/products/",
      method: "DELETE",
      data: { productId: productId },
      token: employee?.token,
    });
    if (res?.data?.success) {
      console.log(res.data);
      history.back();
    } else {
      console.log(res?.message);
    }
  };

  async function getProduct(productId) {
    await axios
      .get(`/products/${productId}`)
      .then((res) => {
        setProduct(res?.data?.product);
        const product = res?.data?.product;
        setMainImage(product?.images[0]);
        setReviews(product?.reviews);
        setTotalRating(product?.totalRating);
        setProgressBar(setUpPrograssBar(product?.reviews));
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getProduct(productId);
  }, []);

  // Delete review from product
  async function deleteReview(customerId, reviewId) {
    const res = await apiRequest({
      url: "/employees/presenter/delete-review",
      method: "DELETE",
      data: { customerId, reviewId, productId },
      token: employee?.token,
    });
    if (res?.data?.success) {
      console.log(res.data);
      setReviews((prevReviews) => {
        return prevReviews.filter((review) => review._id !== reviewId);
      });
      setTotalRating(res.data.totalRating);
      setProgressBar(updatePrograssBar(res.data.deletedReview, progressBar));
    } else {
      console.log(res?.message);
    }
  }

  const handleAgreeDeleteProductMessage = () => {
    handelDeleteProduct(productId);
  };

  const handleDisagreeDeleteProductMessage = () => {
    setshowDeleteMessage(false);
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
    <main className="productDetailMain mt-4" style={{ direction: "ltr" }}>
      {isLoading ? (
        <div className="flex h-56 ">
          <div className=" m-auto">
            <Loading />
          </div>
        </div>
      ) : (
        <>
          <div className="productDetailDivForImgAndData">
            <div className="productDetailImages">
              <img className="productDetailMainImg" src={mainImage} />
              <div className="productDetailSubImages">
                {product?.images.map((src, idx) => {
                  if (idx < 3) {
                    return (
                      <img
                        key={idx}
                        className="productDetailSubImag"
                        src={src}
                        onClick={() => setMainImage(src)}
                      />
                    );
                  }
                })}
              </div>
            </div>
            <div
              className="productDetailData"
              style={{ direction: i18n?.language === "ar" ? "rtl" : "ltr" }}
            >
              <div>
                <h1>{language === "en" ? product?.name : product?.ARName}</h1>
                <div className="productDetailCategory">
                  <h2>{t("Category")}: </h2>
                  <p className="mr-2"> {getCategoryName(product?.category)}</p>
                </div>
                <div className="productDetailRating">
                  <Rating
                    readOnly
                    name="half-rating"
                    value={totalRating}
                    precision={0.5}
                    sx={{ fontSize: 30 }}
                  />
                  <p>
                    ({totalRating}) {t("basedOn")} ({reviews?.length}){" "}
                    {t("review")}
                  </p>
                </div>
                <h3 className="text-lg font-bold">{t("description")}:</h3>
                <p className="productDetailDescription">
                  {language === "en"
                    ? product?.description
                    : product?.ARDescription}
                </p>
                <h3 className="text-lg font-bold">{t("dimensions")}:</h3>
                <div className="flex gap-2 flex-wrap">
                  <p className="productDetailDescription">
                    {t("height")}: {product?.dimensions?.height}
                    {t("cm")}
                  </p>
                  <p className="productDetailDescription">
                    {t("width")}: {product?.dimensions?.width}
                    {t("cm")}
                  </p>
                  <p className="productDetailDescription">
                    {t("weight")}: {product?.dimensions?.weight}
                    {t("kg")}
                  </p>
                </div>
                <div className="productDetailColors">
                  <p>{t("Color")}: </p>
                  {product?.colors.map((color, idx) => (
                    <span key={idx}>{t(color)} -</span>
                  ))}
                </div>
                <p className="productDetailsPrice">
                  {product?.price} {t("EGP")}
                </p>
              </div>
              <div className="productDetailsDataFooter">
                <Link
                  className="flex items-center text-xl bg-slate-700 hover:bg-slate-800 text-white py-2 px-3 rounded-xl"
                  to={`/presenter/update/product/${product?._id}`}
                >
                  {t("edit")}
                  <EditIcon sx={{ fontSize: "20px", marginLeft: "5px" }} />
                </Link>
                <button onClick={() => setshowDeleteMessage(true)}>
                  <Tooltip title={t("delete")} placement="top">
                    <DeleteForeverIcon sx={{ fontSize: "40px" }} />
                  </Tooltip>
                </button>
              </div>
            </div>
          </div>
          <div
            className="productDetailReviews"
            style={{ direction: i18n?.language === "ar" ? "rtl" : "ltr" }}
          >
            <div className="productDetailReviewsDetails">
              <h4>{t("customerReviews")}</h4>
              <div className="productDetailRatingForReviews">
                <Rating
                  readOnly
                  name="half-rating"
                  value={totalRating}
                  precision={0.5}
                  sx={{ fontSize: 25 }}
                />
                <p>
                  ({totalRating}) {t("basedOn")} ({reviews?.length}){" "}
                  {t("review")}
                </p>
              </div>
              <div className="productDetailRatingAllBars">
                {progressBar ? (
                  progressBar.map((bar, idx) => {
                    return (
                      <div className="productDetailRatingBar" key={idx}>
                        <div className="flex">
                          <p className="mr-1">{bar.number}</p>
                          <StarIcon sx={{ color: "#ffbb00", fontSize: 20 }} />
                        </div>
                        <ProgressBar
                          now={bar.progres}
                          className="productDetailProgressBar"
                          variant="warning"
                        />
                        <p className="w-10">{bar.progres}%</p>
                      </div>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
              <div className="productDetailReviewsFooter">
                <h5>{t("shareyourthoughts")}</h5>
                <p>{t("shareYourThoughts")}</p>
              </div>
            </div>
            <div
              className="productDetailReviewsData"
              style={{ direction: "ltr" }}
            >
              {reviews?.length ? (
                reviews.map((review) => {
                  return (
                    <ReviewPresenter
                      key={review._id}
                      review={review}
                      deleteReview={deleteReview}
                    />
                  );
                })
              ) : (
                <div className="productDetailNoReviews">
                  <h5>{t("currentlyNoReviews")}</h5>
                </div>
              )}
            </div>
          </div>
          <Dialog
            open={showDeleteMessage}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDisagreeDeleteProductMessage}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle
              sx={{
                fontSize: "25px",
                fontWeight: "bold",
                direction: i18n.language === "ar" ? "rtl" : "ltr",
              }}
            >
              {t("delete")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-slide-description"
                sx={{
                  fontSize: "18px",
                  direction: i18n.language === "ar" ? "rtl" : "ltr",
                }}
              >
                {t("wantDeletionThisProduct")}
                <br />
                <br />
                {t("actionCannotUndone")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDisagreeDeleteProductMessage}
                sx={{
                  marginRight: "auto",
                }}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleAgreeDeleteProductMessage}>
                {t("agree")}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </main>
  );
}

export default ProductDetailsPresenter;
