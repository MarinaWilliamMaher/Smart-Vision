import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Form from "react-bootstrap/Form";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./StyleSheets/Reviews.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";
import { apiRequest } from "../../utils";
function Reviews({ review, setReviews, setTotalRating, customerReview }) {
  const { t } = useTranslation();
  // console.log(customerReview);
  const { customer } = useSelector((state) => state.customer);
  const reviewCustomer = review?.customer?.username
    ? review?.customer
    : customerReview;
  //console.log(reviewCustomer);
  const [comment, setComment] = useState(review?.comment);
  const [rating, setRating] = useState(review?.rating);
  const [validated, setValidated] = useState(false);
  const [isUserReview, SetIsUserReview] = useState(
    customer?._id === reviewCustomer?._id
  );
  const [inEditMode, setInEditMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  //make avatar to comment
  function stringAvatar(name) {
    //console.log(review);
    return {
      children: `${name?.split(" ")[0][0]}`,
    };
  }

  //handel open menu in review
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //handel close menu in review
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //handel Edit Review by the user
  const handleEditReviewMode = () => {
    handleMenuClose();
    if (inEditMode) {
      setRating(review?.rating);
      setComment(review?.comment);
    }
    setInEditMode(!inEditMode);
  };

  async function deleteReview(customerId, reviewId) {
    try {
      const res = await apiRequest({
        method: "delete",
        url: "/customers/review",
        data: { customerId, reviewId, productId: review?.product },
        token: customer?.token,
      });
      setReviews((prevReviews) => {
        return prevReviews.filter((review) => review._id !== reviewId);
      });
      setTotalRating(res.data.totalRating);
    } catch (error) {
      console.log(error);
    }
  }

  async function editReview(productId, reviewId, comment, rating) {
    try {
      const res = await apiRequest({
        method: "put",
        url: "/customers/review",
        data: { productId, reviewId, comment, rating },
        token: customer?.token,
      });
      setReviews((prevReviews) => {
        return prevReviews.map((review) => {
          if (review?._id === reviewId) {
            return { ...review, comment: comment, rating: rating };
          } else {
            return review;
          }
        });
      });
      setTotalRating(res.data.totalRating);
    } catch (error) {
      console.log(error);
    }
  }
  //handel Delete Review by the user
  const handleDeleteReview = () => {
    handleMenuClose();
    deleteReview(reviewCustomer?._id, review?._id);
  };

  //handel Add Review by the user
  const handleEditReviewSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      editReview(review?.product, review?._id, comment, rating);
      setInEditMode(false);
    }
  };

  return (
    <>
      {inEditMode ? (
        <div className="productDetailUserReview">
          <div className="flex items-center mb-3">
            <div className="mr-3">
              <Avatar {...stringAvatar(reviewCustomer?.username)} />
            </div>
            <div className="">
              <h6>{reviewCustomer?.username}</h6>
            </div>
          </div>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleEditReviewSubmit}
          >
            <Form.Group className="">
              <Rating
                name="rating"
                value={rating}
                sx={{ fontSize: 25 }}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              <Form.Control
                className="InputField h-auto"
                name="comment"
                required
                as="textarea"
                rows={3}
                value={comment}
                placeholder={t("Add your Review here......")}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <div className="flex justify-center gap-2 my-3">
              <button
                type="submit"
                className="buttonForReview bg-slate-700 hover:bg-slate-800"
              >
                {t("Submit")}
              </button>
              <button
                onClick={handleEditReviewMode}
                className="buttonForReview bg-red-600 hover:bg-red-700"
              >
                {t("Cancel")}
              </button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="productDetailUserReview">
          <div className="flex items-center ">
            <div className={`${i18n.language === "en" ? "mr-3" : "ml-3"}`}>
              <Avatar {...stringAvatar(reviewCustomer?.username)} />
            </div>
            <div className="">
              <h6>{reviewCustomer?.username}</h6>
              <Rating
                readOnly
                name="half-rating"
                value={review?.rating}
                precision={0.5}
                sx={{ fontSize: 20 }}
              />
            </div>
            {/* for disblay menu item for user review */}
            {isUserReview ? (
              <div
                className=""
                style={{
                  marginLeft: i18n.language === "en" ? "auto" : "0rem",
                  marginRight: i18n.language === "ar" ? "auto" : "0rem",
                }}
              >
                <IconButton onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleEditReviewMode}>
                    <button className="reviewMenuButton">
                      <p className="text-xl">{t("Edit")}</p>
                      <EditIcon className="ml-2" />
                    </button>
                  </MenuItem>
                  <MenuItem onClick={handleDeleteReview}>
                    <button className="reviewMenuButton">
                      <p className="text-xl">{t("Delete")}</p>
                      <DeleteForeverIcon className="ml-2" />
                    </button>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <></>
            )}
          </div>
          <p className="px-12">{review?.comment}</p>
        </div>
      )}
      {}
    </>
  );
}

export default Reviews;
