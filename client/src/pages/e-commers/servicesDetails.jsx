import React from "react";
import { useLocation } from "react-router-dom";
import BookingServiceForm from "../../components/e-commers/BookingServiceForm";
import "./StyleSheets/ServicesDetails.css";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "../../../Language/translate";

function ServicesDetails({ socket, setSocket }) {
  const { t } = useTranslation();
  const { state } = useLocation();
  const service = state ? state.service : null;

  return (
    <div className="ServicesDetails">
      <Grid
        container
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Grid item lg={5.5} md={5.5} sm={12}>
          <div className="ServicesDetailsContent">
            <h2 className="text-3xl font-bold mt-5 mb-3">{t(service.title)}</h2>
            <img
              src={service.image_url}
              alt={service.title}
              width={250}
              height={250}
              className="imageServices"
            />
            <p
              className="text-gray-600 mt-3 descriptionServices"
              style={{ maxWidth: "90vw" }}
            >
              {t(service.description)}
            </p>
          </div>
        </Grid>
        <Grid item lg={5.5} md={5.5} sm={12}>
          <div className="formContent">
            <BookingServiceForm socket={socket} setSocket={socket} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ServicesDetails;
