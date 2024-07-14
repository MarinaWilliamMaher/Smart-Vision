import React, { useState, useEffect } from "react";
import { TextField, Button, Grid } from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";
import { apiRequest, setOptionsForTranslate } from "../../utils";
import { useSelector } from "react-redux";
import i18n from "../../../Language/translate";

const UpdateMatrialForm = () => {
  const { matrialId } = useParams();
  const { employee } = useSelector((state) => state?.employee);
  const [matrialData, setMatrialData] = useState({
    id: matrialId,
    name: "",
    ARName: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchMaterialDetails = async () => {
      try {
        const response = await apiRequest({
          url: `/materials/${matrialId}`,
          method: "GET",
          token: employee?.token,
        });
        if (response?.data?.success) {
          setMatrialData(response.data.material);
          console.log(response.data.material);
        } else {
          toast.dismiss();
          toast.error("Failed to get this material");
        }
      } catch (error) {
        console.error("Error fetching material details:", error);
      }
    };

    fetchMaterialDetails();
  }, [matrialId]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "quantity" && value < 0) {
      value = 0;
    }
    setMatrialData({ ...matrialData, [e.target.name]: value });
  };
  const handleNameChange = (e) => {
    let value = e.target.value;
    setMatrialData({
      ...matrialData,
      [i18n.language === "en" ? e.target.name : "ARName"]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(matrialData);
    try {
      const translationRes = await axios.request(
        setOptionsForTranslate([
          i18n.language === "en" ? matrialData?.name : matrialData?.ARName,
        ])
      );
      console.log(translationRes.data);
      const ARname = translationRes?.data[0]?.translations[0]?.text;
      const ENname = translationRes?.data[0]?.translations[1]?.text;
      console.log(ARname, ENname);

      const response = await apiRequest({
        url: "/materials/",
        method: "PUT",
        data: {
          id: matrialId,
          name: ENname,
          ARName: ARname,
          quantity: matrialData.quantity,
        },
        token: employee?.token,
      });
      if (response?.data?.success) {
        toast.dismiss();
        toast.success(t('UpdatedSuccessfully'));
        // console.log(response?.data);
        setMatrialData(response?.data?.material);
      } else {
        toast.error("Failed to update material");
      }
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error(t("FailedTryAgain"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-4/5 m-auto py-7 max-w-4xl">
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
      <Grid container spacing={2} sx={{ marginTop: "6rem" }}>
        <Grid item xs={12} sm={6}>
          <label className="mb-2" htmlFor="name">
            {t("productName")} *
          </label>
          <TextField
            fullWidth
            id="name"
            name="name"
            value={
              i18n.language === "ar" ? matrialData.ARName : matrialData.name
            }
            onChange={handleNameChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <label className="mb-2" htmlFor="Quantity">
            {t("quantity")} *
          </label>
          <TextField
            fullWidth
            id="Quantity"
            variant="outlined"
            name="quantity"
            type="number"
            value={matrialData.quantity}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid container style={{ marginTop: "20px" }}>
          <Grid item xs={12} style={{ display: "flex" }}>
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#edede9",
                color: "black",
                margin: "auto",
                fontSize: "20px",
              }}
            >
              {t("update")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default UpdateMatrialForm;
