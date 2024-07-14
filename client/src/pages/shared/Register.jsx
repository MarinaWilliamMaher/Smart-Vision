import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StyleSheets/Register.css";
import { useForm } from "react-hook-form";
import Loading from "../../components/shared/Loading";
import toast, { Toaster } from "react-hot-toast";
import { apiRequest } from "../../utils";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate.jsx";
function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const handleSubmitForm = async (data) => {
    try {
      await apiRequest({
        url: "/auth/register",
        data: data,
        method: "POST",
      })
        .then((res) => {
          console.log(res.data);
          toast(res.data.message);
          navigate("/login");
        })
        .catch((error) => {
          throw error.response.data;
        });
      //throw new Error();
      //console.log(data);
    } catch (error) {
      setError("root", {
        message: `${error.message}`,
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
        className="flex items-center justify-center m-auto"
        style={{ maxWidth: "600px", marginTop: "2rem", minHeight: "80vh" }}
      >
        <Toaster
          toastOptions={{
            style: {
              duration: 3000,
              border: "1px solid #6A5ACD",
              backgroundColor: "#6A5ACD",
              padding: "16px",
              color: "white",
              fontWeight: "Bold",
              marginTop: "65px",
              textAlign: "center",
            },
          }}
        />
        <div className="relative py-2 sm:max-w-xl sm:mx-auto form_container">
          <form
            className="max-w-md mx-auto"
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            <div className="mt-3 mb-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 block"
                  htmlFor="username"
                >
                  {t("Username")}
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
                  type="text"
                  id="username"
                  name="username"
                  {...register("username", {
                    required: t("Username is required"),
                  })}
                />
                {errors.username && (
                  <div className="text-red-500 mb-3">
                    {errors.username.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 block"
                  htmlFor="email"
                >
                  {t("Email")}
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
                  type="email"
                  id="email"
                  name="email"
                  {...register("email", {
                    required: t("Email Address is required"),
                    validate: (value) => {
                      if (!value.includes("@")) {
                        return "Email must include @";
                      }
                      return true;
                    },
                  })}
                />
                {errors.email && (
                  <div className="text-red-500 mb-3">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 block"
                  htmlFor="password"
                >
                  {t("Password")}
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1 text-sm w-full "
                  type="password"
                  id="password"
                  name="password"
                  {...register("password", {
                    required: t("Password is required"),
                    minLength: {
                      value: 7,
                      message: t(
                        "Password length should be greater than 6 character"
                      ),
                    },
                  })}
                />
                {errors.password && (
                  <div className="text-red-500 mb-3">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 block"
                  htmlFor="password"
                >
                  {t("Confirm Password")}
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1 text-sm w-full "
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  {...register("confirmPassword", {
                    validate: (value) => {
                      const { password } = getValues();
                      if (password !== value) {
                        return t("Passwords don't match");
                      }
                    },
                  })}
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 mb-3">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 block"
                  htmlFor="phone"
                >
                  {t("Phone")}
                </label>
                <input
                  className="border rounded-lg px-3 py-2 mt-1  text-sm w-full"
                  type="number"
                  id="phone"
                  name="phone"
                  {...register("phone", {
                    required: t("Please enter your phone"),
                  })}
                />
                {errors.phone && (
                  <div className="text-red-500 mb-3">
                    {errors.phone.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="font-semibold text-sm text-gray-600 pb-1 block"
                  htmlFor="gender"
                >
                  {t("Gender")}
                </label>
                <select
                  className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
                  id="gender"
                  name="gender"
                  {...register("gender", {
                    required: "please select you gender",
                  })}
                >
                  <option value="Male">{t("Male")}</option>
                  <option value="Female">{t("Female")}</option>
                </select>
                {errors.gender && (
                  <div className="text-red-500 mb-3">
                    {errors.gender.message}
                  </div>
                )}
              </div>
            </div>
            <div className="">
              {isSubmitting ? (
                <Loading />
              ) : (
                <button
                  disabled={isSubmitting}
                  title="Sign up"
                  type="submit"
                  className="py-2 px-4 bg-blue-700 hover:bg-blue-900 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  <span>{t("Sign up")}</span>
                </button>
              )}
              {errors.root && (
                <div className="text-red-500">{errors.root.message}</div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              <Link
                to={"/login"}
                className="text-xs text-black uppercase hover:underline"
              >
                {t("have an account? Log in")}
              </Link>
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
            </div>
            <p className="note flex justify-center my-3">
              {t("Terms of use")} &amp; {t("Conditions")}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
