import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useParams } from "react-router-dom";
import "./EngineerStyleSheets/CustomizedOrderForm.css";
import {
  apiRequest,
  handleFileUpload,
  setOptionsForTranslateMaterials,
} from "../../utils";
import { useSelector } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/shared/Loading";
import axios from "axios";

const CustomOrderForm = ({ socket, setSocket }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [error, setError] = useState("");
  const { employee } = useSelector((state) => state.employee);
  const [orderDetails, setOrderDetails] = useState({
    customerName: "",
    description: "",
    materials: [],
    additionalDetails: "",
    newMaterialName: "",
    newMaterialQuantity: "",
  });
  const newMaterialNameRef = useRef(null);
  const newMaterialQuantityRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // console.log(requestId);
  useEffect(() => {
    const fetchCustomOrder = async () => {
      try {
        const response = await apiRequest({
          method: "GET",
          url: `/employees/engineer/services/${requestId}`,
          token: employee?.token,
        });
        orderDetails.customerName =
          response.data.service[0]?.customer?.username;
        orderDetails.description = response.data.service[0]?.description;
      } catch (error) {
        console.error("Error fetching custom order:", error);
      }
      setIsLoading(false);
    };

    fetchCustomOrder();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
    // console.log(orderDetails.newMaterialQuantity);
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMaterial();
    }
  };

  const addMaterial = () => {
    const { newMaterialName, newMaterialQuantity } = orderDetails;
    if (newMaterialName && newMaterialQuantity) {
      setOrderDetails({
        ...orderDetails,
        materials: [
          ...orderDetails.materials,
          {
            material: newMaterialName,
            quantity: newMaterialQuantity,
          },
        ],
        newMaterialName: "",
        newMaterialQuantity: "",
      });
      setError("");
      newMaterialNameRef.current.value = "";
      newMaterialQuantityRef.current.value = "";
      newMaterialNameRef.current.blur();
      newMaterialQuantityRef.current.blur();
    }
    if (!newMaterialName) {
      setError(t("materialNameEmpty"));
    } else if (!newMaterialQuantity) {
      setError(t("materialQuantityEmpty"));
    }
  };

  const removeMaterial = (index) => {
    const materials = [...orderDetails.materials];
    materials.splice(index, 1);
    setOrderDetails({ ...orderDetails, materials });
  };
  const handleFileChange = (e) => {
    setOrderDetails({ ...orderDetails, details: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orderDetails.materials.length === 0) {
      setError("Please add materials before submitting.");
      return;
    }
    try {
      const file =
        orderDetails.details && (await handleFileUpload(orderDetails.details));
      console.log(file);
      const translationRes = await axios.request(
        setOptionsForTranslateMaterials(orderDetails.materials)
      );
      // console.log(translationRes?.data);
      const convertedMaterials = orderDetails.materials.map((item, idx) => {
        return {
          ARMaterial: translationRes?.data[idx]?.translations[0]?.text,
          material: translationRes?.data[idx]?.translations[1]?.text,
          quantity: item.quantity,
        };
      });
      console.log(convertedMaterials);
      console.log(orderDetails.materials);

      const response = await apiRequest({
        method: "POST",
        url: "employees/engineer/sendService",
        data: {
          serviceId: requestId,
          engineerId: employee._id,
          materials: convertedMaterials,
          details: file,
        },
        token: employee?.token,
      });
      if (response?.data?.success) {
        setOrderDetails({
          ...orderDetails,
          materials: [],
        });
        console.log("Order placed successfully:", response.data);
        socket?.emit("sendDetails", {
          user: employee,
          type: ["getMaterial", "newOrderToFactory"],
          materialOrder: response.data.materialOrder,
          service: response.data.service,
        });
        navigate("/engineer/orders");
        toast.success("send order details successfully to factory");
      } else {
        toast.error("failed to send order to factory");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  return (
    <>
      {!isLoading ? (
        <form onSubmit={handleSubmit} className="custom-order-form">
          <Grid container spacing={2}>
            <Grid item xs={12} container>
              <label htmlFor="customerName" className="mb-2 text-2xl">
                {t("customerName")}
              </label>
              <TextField
                id="customerName"
                name="customerName"
                value={orderDetails.customerName}
                fullWidth
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="description" className="mb-2 text-2xl">
                {t("description")}
              </label>
              <TextField
                name="description"
                id="description"
                value={orderDetails.description}
                fullWidth
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">{t("materials")}</Typography>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                placeholder={t("name")}
                type="text"
                name="newMaterialName"
                inputRef={newMaterialNameRef}
                value={orderDetails.newMaterialName}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (orderDetails.newMaterialName.trim() !== "")
                      newMaterialQuantityRef.current.focus();
                    else setError(t("materialNameEmpty"));
                  }
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                type="number"
                placeholder={t("quantity")}
                name="newMaterialQuantity"
                inputRef={newMaterialQuantityRef}
                value={orderDetails.newMaterialQuantity}
                onChange={handleChange}
                onKeyDown={handleQuantityKeyDown}
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={2}
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={addMaterial} style={{ marginLeft: "auto" }}>
                {t("add")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              {error && <Typography color="error">{error}</Typography>}
            </Grid>
            {orderDetails.materials.length > 0 && (
              <Grid item xs={12}>
                <List
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    paddingTop: "0px",
                  }}
                >
                  {orderDetails.materials.map((material, index) => (
                    <ListItem
                      key={index}
                      style={{ paddingBottom: "0px", direction: "ltr" }}
                    >
                      <ListItemText primary={material.material} />
                      <ListItemText secondary={material.quantity} />
                      <IconButton
                        aria-label="delete"
                        onClick={() => removeMaterial(index)}
                      >
                        <DeleteForeverIcon sx={{ fontSize: "32px" }} />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-0.5rem",
              }}
            >
              <Grid container item xs={7}>
                <input
                  type="file"
                  id="uploadFile"
                  name="uploadFile"
                  className="uploadBtn file:hidden text-black bg-white w-full p-3 rounded-md border border-gray-300"
                  onChange={handleFileChange}
                  style={{ boxShadow: "none" }}
                />
              </Grid>
              <Grid container item xs={5} justify="center">
                <label
                  htmlFor="uploadFile"
                  className="leading-6  text-md text-gray-500 mt-1 w-full h-full cursor-pointer"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  <CloudUploadIcon className="mx-2" />
                  {t("uploadFile")}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "10px", textTransform: "capitalize" }}
              >
                {t("sendOrderToFactory")}
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <div className="h-96">
          <Loading />
        </div>
      )}
    </>
  );
};

export default CustomOrderForm;
