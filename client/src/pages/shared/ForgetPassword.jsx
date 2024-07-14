import React from "react";
import "./StyleSheets/Login.css"; // Reuse the same stylesheet for consistent styling
import { useForm } from "react-hook-form";
import Loading from "../../components/shared/Loading";
import { apiRequest } from "../../utils/index.js";
import { useTranslation } from "react-i18next";
// import i18n from "../../../Language/translate.jsx";
import { useNavigate } from "react-router-dom";
import i18n from "../../../Language/translate.jsx";

function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleSubmitForm = async (data) => {
    try {
      const response = await apiRequest({
        url: "/customers/request-passwordreset",
        data: data,
        method: "POST",
      }).then(
        navigate("/login", {
          state: {
            message: `An email with a link and next steps will be sent to ${data.email}`,
          },
        })
      );
    } catch (error) {
      console.log(error.response.data.message);
      setError("root", {
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  };
  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    window.localStorage.setItem("language", JSON.stringify(newLanguage));
  };
  return (
    <>
      <div
        style={{
          direction: "rtl",
          margin: "auto",
          marginTop: "2rem",
          justifyContent: "center",
          paddingRight: "2rem",
          marginBottom: "2rem",
          maxWidth: "1300px",
          fontFamily: "revert-layer",
        }}
      >
        <button
          onClick={toggleLanguage}
          style={{
            fontSize: "19px",
            border: "1px solid",
            borderRadius: "5px",
            padding: "2px 5px",
          }}
        >
          {i18n.language === "en" ? "العربية" : "English"}
        </button>
      </div>
      <div
        className="flex items-center justify-center m-auto "
        style={{ maxWidth: "450px", height: "80vh" }}
      >
        <form
          className="form_container"
          style={{ boxShadow: "0px 8px 10px 2px rgba(0, 0, 0, 0.2)" }}
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div className="title_container">
            <p className="title">{t("Reset Password")}</p>
            <span
              style={{
                color: "gray",
                textAlign: "center",
                lineHeight: "1.025rem",
                maxWidth: "82%",
                fontSize: "0.825rem",
              }}
            >
              {t("Enter your email address to receive a password reset link.")}
            </span>
          </div>
          <div className="input_container">
            <label className="input_label" htmlFor="email_field">
              {t("Email")}
            </label>
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#141B34"
                d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
              ></path>
              <path
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="#141B34"
                d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
              ></path>
            </svg>
            <input
              {...register("email", {
                required: t("Email Address is required"),
                validate: (value) => {
                  if (!value.includes("@")) {
                    return t("Email must include @");
                  }
                  return true;
                },
              })}
              placeholder={t("name@mail.com")}
              title="email"
              name="email"
              type="text"
              style={{ paddingRight: "10px" }}
              className="input_field"
              id="email_field"
            />
          </div>
          {isSubmitting ? (
            <Loading />
          ) : (
            <button
              disabled={isSubmitting}
              title="Submit"
              type="submit"
              className="py-2 px-4 bg-blue-700 hover:bg-blue-900 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              <span>{t("Reset Password")}</span>
            </button>
          )}
          {errors.root && (
            <div className="text-red-500">{errors.root.message}</div>
          )}
          <div className="flex items-center justify-between mt-4 w-full">
            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/5"></span>
            <span
              className="text-xs text-black uppercase hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              {t("Back to Login")}
            </span>
            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/5"></span>
          </div>
          <p className="note">
            {t("Terms of use")} &amp; {t("Conditions")}
          </p>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
