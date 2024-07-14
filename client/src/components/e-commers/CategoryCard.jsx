import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import i18n from "../../../Language/translate";
const CategoryCard = ({ name, imageUrl, onClick, isLast }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`category-card active `}
      style={{
        width: "220px",
        height: "300px",
        position: "relative",
        borderRadius: "10px",
        backgroundColor: isLast ? "red" : "white",
        cursor:"pointer"
      }}
      onClick={onClick}
    >
      {isLast ? (
        <Link to={"/store"}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f2e9e4",
              borderRadius: "10px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="currentColor"
              className="bi bi-arrow-full-right"
              viewBox="0 0 16 16"
              style={{ transform: "rotate(180deg)" }}
            >
              <path
                fillRule="evenodd"
                d="M14.5 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 7.5H14a.5.5 0 0 1 .5.5z"
              />
            </svg>
          </div>{" "}
        </Link>
      ) : (
        <img
          src={imageUrl}
          alt={name}
          style={{ width: "100%", height: "100%", borderRadius: "10px" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: "85%",
          width: "100%",
          textAlign: "center",
        }}
      >
        {onClick && !isLast && (
          <button
            style={{
              backgroundColor: "white",
              color: "black",
              padding: "8px 15px",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
          >
            {t(name)}
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
