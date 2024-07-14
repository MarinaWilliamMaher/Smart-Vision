import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import "./StyleSheets/Header.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";

const Menu = () => {
  const { t } = useTranslation();
  const { customer } = useSelector((state) => state.customer);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="btnHover"
        style={{
          borderRadius: "50%",
          outline: "none",
        }}
      >
        <MenuIcon
          style={{
            fontSize: "28px",
          }}
        ></MenuIcon>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="left-modal-title"
        aria-describedby="left-modal-description"
        closeAfterTransition
      >
        <Slide
          direction="right"
          in={open}
          mountOnEnter
          unmountOnExit
          className="slideBar max-w-72"
        >
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              height: "100%",
              width: "500px",
              backgroundColor: "white",
              padding: "30px 20px",
              zIndex: "1000",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                // marginBottom: "7rem",
                marginLeft: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
              >
                <IconButton onClick={handleClose}>
                  <CloseIcon style={{ fontSize: "32px", position: "fixed" }} />
                </IconButton>

                <div
                  style={{
                    marginLeft: "3rem",
                  }}
                >
                  <img
                    src="../smartVisionLogo.png"
                    alt="Logo"
                    style={{
                      width: "100px",
                      height: "60px",
                      border: "none",
                    }}
                  />
                </div>
              </div>
              <ul
                className="MenuUL"
                style={{
                  fontSize: "30px",
                  marginTop: "1rem",
                  fontWeight: "600",
                  textAlign: i18n.language === "ar" ? "end" : "start",
                  paddingRight: "40px",
                }}
              >
                <li>
                  <NavLink
                    to="/home"
                    onClick={handleClose}
                    style={{
                      display: "flex",
                      justifyContent:
                        i18n.language === "ar" ? "flex-end" : "flex-start",
                    }}
                  >
                    <HomeIcon
                      style={{
                        fontSize: "40px",
                        marginRight: i18n.language === "en" ? "0.5rem" : "0",
                        marginLeft: i18n.language === "ar" ? "0.5rem" : "0",
                        order: i18n.language === "ar" ? "2" : "1",
                      }}
                    />
                    <span style={{ order: i18n.language === "ar" ? "1" : "2" }}>
                      {t("Home")}
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/store" onClick={handleClose}>
                    {t("Products")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/services" onClick={handleClose}>
                    {t("Services")}
                  </NavLink>
                </li>
                {customer?._id ? (
                  <>
                    {/* <li>
                      <NavLink to="/Profile" onClick={handleClose}>
                        {t("Profile")}
                      </NavLink>
                    </li> */}
                    <li>
                      <NavLink to="/favourites" onClick={handleClose}>
                        {t("Favorites")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/history" onClick={handleClose}>
                        {t("History")}
                      </NavLink>
                    </li>
                  </>
                ) : null}

                <li>
                  <NavLink to="/bag" onClick={handleClose}>
                    {t("Cart")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" onClick={handleClose}>
                    {t("About Us")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact-us">{t("Contact Us")}</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </Slide>
      </Modal>
    </div>
  );
};

export default Menu;
