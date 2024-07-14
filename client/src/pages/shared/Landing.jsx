import React from "react";
import "./StyleSheets/Landing.css";
import { Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate.jsx";
function Landing() {
  const { t } = useTranslation();
  return (
    <div className="landding flex text-center text-white bg-dark">
      <div className=" w-full flex w-100 h-100 p-3 mx-auto flex-col">
        <div className="mb-auto">
          <div className="">
            <h3 className="md:float-left text-3xl mb-0">Smart Vision</h3>
            <nav className="nav gap-3 justify-center md:float-right">
              <NavLink
                to={"/store"}
                className="nav-links active"
                aria-current="pages"
              >
                {t("Home")}
              </NavLink>
              <NavLink to={"/login"} className="nav-links text-gray-400">
                {t("Login")}
              </NavLink>
              <NavLink to={"/register"} className="nav-links text-gray-400">
                {t("Register")}
              </NavLink>
            </nav>
          </div>
        </div>
        <div className="px-3">
          <h1 className="text-4xl">Smart Vision</h1>
          <p className="lead">
            {t("Welcome to")} Smart Vision <br />{" "}
            {t("Jump right in and explore our many products.")} <br />
            {t("Feel free to share some of your own and comment on others!")}
          </p>
          <Link
            to="/store"
            className="btn btn-lg btn-secondary font-bold  text-white mt-4"
          >
            {t("View Products")}
          </Link>
        </div>

        <div className="mt-auto text-white-50">
          <p>&copy; 2024 </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
