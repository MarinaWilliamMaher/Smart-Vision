import React from "react";
import "./StyleSheets/page404.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "-70px",
          }}
        >
          <img
            src="../3030image.jpg"
            style={{ width: "60vw", height: "260px" }}
          ></img>
        </p>
        <p className="not-found-text">{t("There's Nothing Here...")}</p>
        <Link to={"/"}>
          <button
            className="not-found-button"
            style={{
              fontSize: "20px",
              borderRadius: "7px",
              backgroundColor: "#0077b6",
            }}
          >
            {t("Go Home")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
