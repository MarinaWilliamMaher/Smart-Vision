import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import "../e-commers/StyleSheets/ProductCard.css";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import i18next, { t } from "i18next";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Card({ product, handelDelete }) {
  const language = JSON.parse(window?.localStorage.getItem("language"));
  const [showDeleteMessage, setshowDeleteMessage] = useState(false);
  const handleAgreeDeleteProductMessage = () => {
    handelDelete(product?._id);
    setshowDeleteMessage(false);
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
    <div className="productCard mb-12">
      <Link
        className="productCardLink"
        to={`/presenter/product/${product?._id}`}
      >
        {product?.images?.length === 1 ? (
          <div className="sbProductCardDivImg">
            <img className="sbProductCardImg" src={product?.images[0]} />
          </div>
        ) : (
          <div className="sbProductCardDivImg">
            <div className="sbProductCardDivFirstImg">
              <img className="sbProductCardImg" src={product?.images[0]} />
            </div>
            <div className="sbProductCardDivsecondtImg">
              <img className="sbProductCardImg" src={product?.images[1]} />
            </div>
          </div>
        )}
        <div className="sbProductCardData">
          <div className="w-full">
            <h5>{language === "en" ? product?.name : product?.ARName}</h5>
            <h6>{getCategoryName(product?.category)}</h6>
            <p>
              {product?.price} {t("EGP")}
            </p>
          </div>
          <div className="sbProductCardDataRating">
            <Rating
              readOnly
              name="half-rating"
              value={product?.totalRating}
              precision={0.5}
              sx={{ fontSize: 30 }}
            />
            <p>
              {product?.totalRating} ({product?.reviews?.length})
            </p>
          </div>
        </div>
      </Link>
      <div className="sbProductCardFooter h-16">
        <Link
          className="flex items-center text-xl bg-slate-700 hover:bg-slate-800 text-white py-1 px-2 rounded-xl"
          to={`/presenter/update/product/${product?._id}`}
        >
          {t("edit")}
          <EditIcon sx={{ fontSize: "20px", marginInline: "5px" }} />
        </Link>
        <button
          onClick={() => {
            setshowDeleteMessage(true);
          }}
        >
          <DeleteForeverIcon sx={{ fontSize: "32px" }} />
        </button>
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
            direction: i18next.language === "ar" ? "rtl" : "ltr",
          }}
        >
          {t("delete")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{
              fontSize: "18px",
              direction: i18next.language === "ar" ? "rtl" : "ltr",
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
    </div>
  );
}

export default Card;
