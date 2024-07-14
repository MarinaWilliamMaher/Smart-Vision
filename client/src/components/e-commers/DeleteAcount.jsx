import React, { useState } from "react";
import "./StyleSheets/DeleteAcount.css";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
const DeleteAccount = ({ onDelete }) => {
  const { t, i18n } = useTranslation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = () => {
    if (password) {
      onDelete(password);
    } else {
      setError("Please enter a valid password.");
    }
  };

  return (
    <div className="delete-account-container">
      <a href="./">{t("Account Home")}</a>
      {i18n.language === "ar" ? <ArrowLeftIcon /> : <ArrowRightIcon />}{" "}
      <span>{t("Delete Account")}</span>
      <h2 className="delete-account-heading">{t("Delete Account")}</h2>
      <p>
        {t(
          "Time to say goodbye? We miss you already! The following happens when you delete your account"
        )}
        :-
      </p>
      <br />
      <ul className="list">
        <li>
          {t("You delete all personal information and your shopping lists")}.
        </li>
        <li>
          {t(
            "You will no longer have access to your account or be able to enjoy any member benefits"
          )}
          .
        </li>
      </ul>
      <p className="paragraph">
        {t("Remember that you are always welcome back")}!
      </p>
      <hr />
      <p className="paragraph">
        {t("To delete your account, please enter your password")}:
      </p>
      <div className="deleteAccountInputAndButtonDiv">
        <div className="deleteAccountInputDiv">
          <TextField
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="delete-account-input"
            label={t("password")}
            dir={"ltr"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <p style={{ color: "red" }}>{error}</p>
        </div>
        <Button
          onClick={handleDelete}
          className="delete-account-button"
          type="submit"
          variant="contained"
        >
          {t("Delete Account")}
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccount;
