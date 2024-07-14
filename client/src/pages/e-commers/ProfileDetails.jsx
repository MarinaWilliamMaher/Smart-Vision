import React from "react";
import "./StyleSheets/ProfileDetails.css";
import OffcanvasForPD from "../../components/e-commers/OffcanvasForPD";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

function ProfileDetails() {
  const { customer } = useSelector((state) => state.customer);
  const { t } = useTranslation();

  return (
    <section className="ProfileDetails">
      <div className="sbProfileDetails">
        <h1>{t("Profile details")}</h1>
      </div>
      <div className="sbProfileDetails">
        <div className="userInfo">
          <div className="userInofHeader">
            <h2>{t("Personal info")}</h2>
            <OffcanvasForPD placement={"end"} />
          </div>
          <div className="Info">
            <div className="InfoContant">
              <h4>{t("Name")}</h4>
              <p>{customer?.username}</p>
            </div>
            <div className="InfoContant">
              <h4>{t("Gender")}</h4>
              <p>{customer?.gender}</p>
            </div>
            <div className="InfoContant">
              <h4>{t("Email")}</h4>
              <p>{customer?.email}</p>
            </div>
            <div className="InfoContant">
              <h4>{t("Phone")}</h4>
              <p>{customer?.phone}</p>
            </div>
            <div className="InfoContant">
              <h4>{t("Address")}</h4>
              <p>
                {customer?.address ? customer?.address : t("No address added")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileDetails;
