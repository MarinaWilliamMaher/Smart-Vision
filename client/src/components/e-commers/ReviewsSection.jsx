import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import ProgressBar from "react-bootstrap/ProgressBar";
import StarIcon from "@mui/icons-material/Star";
import Reviews from "./Reviews";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";
function ReviewsSection({
  reviews,
  TotalProductRating,
  setReviews,
  setTotalRating,
}) {
  const { t } = useTranslation();
  const { productId } = useParams();
  const location = useLocation();
  const inReviewsPage = location?.pathname?.includes("reviews");
  const [progressBar, setProgressBar] = useState([]);
  //set valuse to prograss bar
  function setUpPrograssBar() {
    const totalRatings = [
      { number: 5, numOfRating: 0, progres: 0 },
      { number: 4, numOfRating: 0, progres: 0 },
      { number: 3, numOfRating: 0, progres: 0 },
      { number: 2, numOfRating: 0, progres: 0 },
      { number: 1, numOfRating: 0, progres: 0 },
    ];
    reviews?.map((review) => {
      totalRatings?.map((rating) => {
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
  function updatePrograssBar(review, progressBar, method, oldReview) {
    let totalReviews = 0;
    progressBar.map((rating) => {
      totalReviews = totalReviews + rating.numOfRating;
    });
    if (method === "add") {
      progressBar.map((rating) => {
        if (review?.rating === rating.number) {
          rating.numOfRating++;
          totalReviews++;
        }
      });
    } else if (method === "delete") {
      progressBar.map((rating) => {
        if (review?.rating === rating.number) {
          rating.numOfRating--;
          totalReviews--;
        }
      });
    } else if (method === "edit") {
      progressBar.map((rating) => {
        if (review?.rating === rating.number) {
          rating.numOfRating++;
          totalReviews++;
        }
        if (oldReview?.rating === rating.number) {
          rating.numOfRating--;
          totalReviews--;
        }
      });
    }
    progressBar.map((rating) => {
      rating.progres = Math.floor((rating.numOfRating / totalReviews) * 100);
    });
    return progressBar;
  }

  useEffect(() => {
    setProgressBar(setUpPrograssBar());
    // setTotalRating(TotalProductRating);
  }, [reviews]);

  return (
    <>
      <div className="productDetailReviews">
        <div className="productDetailReviewsDetails">
          <h4>{t("Customer Reviews")}</h4>
          <div className="productDetailRatingForReviews">
            <Rating
              readOnly
              name="half-rating"
              value={TotalProductRating}
              precision={0.5}
              sx={{ fontSize: 25 }}
            />
            <p>
              {i18n.language === "en"
                ? `${TotalProductRating} ${t("Based on")} ${
                    reviews?.length
                  } ${t("Reviews")}`
                : `${TotalProductRating} ${t("Based on")} ${
                    reviews?.length
                  } ${t("Reviews")} `}
            </p>
          </div>
          <div className="productDetailRatingAllBars">
            {progressBar ? (
              progressBar?.map((bar, idx) => {
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
            <h5>{t("Share your thoughts")}</h5>
            <p>
              {t(
                "If you have used this product, share your thoughts with other customers"
              )}
              .
            </p>
          </div>
        </div>
        <div className="productDetailReviewsData">
          {reviews?.length ? (
            inReviewsPage ? (
              //show all reviews
              reviews
                ?.slice()
                ?.reverse()
                .map((review) => (
                  <Reviews
                    key={review._id}
                    review={review}
                    setReviews={setReviews}
                    setTotalRating={setTotalRating}
                  />
                ))
            ) : (
              // show last 3 reviews only
              reviews
                ?.slice(-3)
                ?.reverse()
                ?.map((review) => (
                  <Reviews
                    key={review._id}
                    review={review}
                    setReviews={setReviews}
                    setTotalRating={setTotalRating}
                  />
                ))
            )
          ) : (
            <div className="productDetailNoReviews">
              <h5>{t("Currently, there are no reviews available")}</h5>
            </div>
          )}
          {reviews?.length > 3 && !inReviewsPage ? (
            <Link to={`/product/${productId}/reviews`}>
              <div className="showMoreReviews">{t("View More Reviews")}</div>
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default ReviewsSection;
