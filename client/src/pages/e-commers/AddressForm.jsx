// AddressForm.js

import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import i18n from "../../../Language/translate";
export default function AddressForm({ formData, onChange, errorMessage }) {
  const { t } = useTranslation();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...formData, [name]: value });
  };

  useEffect(() => {
    localStorage.setItem("shippingInfo", JSON.stringify(formData));
  }, [formData]);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t("Shipping address")}
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label={t("First Name")}
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              error={!!errorMessage.firstName}
              helperText={errorMessage.firstName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label={t("Last Name")}
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              error={!!errorMessage.lastName}
              helperText={errorMessage.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="phoneNumber"
              name="phoneNumber"
              label={t("Phone Number")}
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              fullWidth
              error={!!errorMessage.phoneNumber}
              helperText={errorMessage.phoneNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="address"
              name="address"
              label={t("Address")}
              autoComplete="shipping address-line1"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              error={!!errorMessage.address}
              helperText={errorMessage.address}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="city"
              name="city"
              label={t("City")}
              autoComplete="shipping address-level2"
              value={formData.city}
              required
              onChange={handleInputChange}
              fullWidth
              error={!!errorMessage.city}
              helperText={errorMessage.city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="country"
              name="country"
              label={t("Country")}
              autoComplete="shipping country"
              value={formData.country}
              required
              onChange={handleInputChange}
              fullWidth
              error={!!errorMessage.country}
              helperText={errorMessage.country}
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
}
