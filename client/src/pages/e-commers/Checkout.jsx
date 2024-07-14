import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddressForm from "./AddressForm";
import Review from "./Review";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/CartSlice";
import { apiRequest } from "../../utils";
import {
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  FormLabel,
  OutlinedInput,
  RadioGroup,
} from "@mui/material";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SimCardRoundedIcon from "@mui/icons-material/SimCardRounded";
import MoneyIcon from "@mui/icons-material/Money";
import { styled } from "@mui/system";
import AlertDialog from "../../components/e-commers/Dialog";
import { useNavigate } from "react-router-dom";
import { SetCustomer } from "../../redux/CustomerSlice";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import i18n from "../../../Language/translate";

const FormGrid = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));
export default function Checkout({ socket, setSocket }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customer);
  const { cart } = useSelector((state) => state.cart);
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [paymentType, setPaymentType] = useState("default");
  const [error, setError] = useState(null);
  const [unavailableProductsDialogOpen, setUnavailableProductsDialogOpen] =
    useState(false);
  const [unavailableProductsList, setUnavailableProductsList] = useState([]);
  const navigate = useNavigate();
  //to get first name and last name from userName
  function setFirstAndLastName() {
    const nameParts = customer?.username.split(" ");
    const result = {
      firstName: "",
      lastName: "",
    };
    if (nameParts?.length === 0) {
    } else if (nameParts?.length === 1) {
      result.firstName = nameParts[0];
    } else if (nameParts?.length >= 1) {
      result.firstName = nameParts[0];
      result.lastName = nameParts[1];
    }
    return result;
  }
  const nameParts = setFirstAndLastName();

  const initCustomerData = {
    firstName: nameParts?.firstName,
    lastName: nameParts?.lastName,
    phoneNumber: customer?.phone,
    city: "",
    country: "",
    address: customer?.address,
  };
  const [shippingInfo, setShippingInfo] = useState(initCustomerData);
  const [errorMessage, setErrorMessage] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    country: "",
    address: "",
  });
  const steps = [
    t("Shipping address"),
    t("Payment options"),
    t("Review your order"),
  ];

  useEffect(() => {
    const formDataString = localStorage.getItem("shippingInfo");
    if (formDataString) {
      setShippingInfo(JSON.parse(formDataString));
    }
  }, []);

  const handleFormChange = (formData) => {
    setShippingInfo(formData);
    localStorage.setItem("shippingInfo", JSON.stringify(formData));
  };

  function validateFormData(formData) {
    const errors = {};
    if (!formData.firstName) {
      errors.firstName = t("First Name is required");
    } else if (!formData.lastName) {
      errors.lastName = t("Last Name is required");
    } else if (!formData.phoneNumber) {
      errors.phoneNumber = t("Phone Number is required");
    } else if (!formData.address) {
      errors.address = t("Address is required");
    } else if (!formData.city) {
      errors.city = t("City is required");
    } else if (!formData.country) {
      errors.country = t("Country is required");
    }
    return errors;
  }

  const handleNext = () => {
    if (activeStep === 0) {
      const errors = validateFormData(shippingInfo);
      if (Object.keys(errors).length > 0) {
        setErrorMessage(errors);
        return;
      }
    }
    setErrorMessage({});
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setPaymentType("default");
    setActiveStep(activeStep - 1);
  };

  function calculateTotalPrice() {
    if (!cart || cart.length === 0) {
      return 0;
    }
    const totalPrice = cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    return totalPrice;
  }
  const totalPrice = calculateTotalPrice();

  function calculateTotalPoints() {
    if (!cart || cart.length === 0) {
      return 0;
    }
    const totalPoints = cart.reduce((total, item) => {
      const points = typeof item.points === "number" ? item.points : 0;
      return total + points;
    }, 0);
    return totalPoints;
  }
  const totalPoints = calculateTotalPoints();

  const handlePlaceOrder = async () => {
    try {
      // Fetch all products from the inventory
      const response = await axios.get("/products/");
      const allProducts = response.data.products;
      console.log(allProducts);
      // Check quantity availability for each product in the cart
      const unavailableProducts = cart.filter((cartProduct) => {
        const inventoryProduct = allProducts.find(
          (product) => product._id === cartProduct._id
        );
        console.log(cartProduct.quantity, inventoryProduct.quantity);
        return (
          !inventoryProduct || cartProduct.quantity > inventoryProduct.quantity
        );
      })
      .map((cartProduct) => {
        const inventoryProduct = allProducts.find(
          (product) => product._id === cartProduct._id
        );
        return inventoryProduct ? { ...inventoryProduct, cartQuantity: cartProduct.quantity } : cartProduct;
      });
      console.log(unavailableProducts);
      // Fetch the actual product details for unavailable products
      const productsWithDetails1 = await Promise.all(
        unavailableProducts.map(async (product) => {
          try {
            const productResponse = await axios.get(`/products/${product._id}`);
            const actualQuantity = productResponse.data.product.quantity;
            return { ...product, actualQuantity };
          } catch (error) {
            console.error("Error fetching product details:", error);
            return { ...product, actualQuantity: 0 };
          }
        })
      );

      console.log(productsWithDetails1);
      if (unavailableProducts.length > 0) {
        setUnavailableProductsList(productsWithDetails1);
        setUnavailableProductsDialogOpen(true);
        return;
      }

      // If all products are available, proceed with placing the order
      const productsWithDetails = cart.map((product) => ({
        product: product?._id,
        quantity: product?.quantity,
      }));
      const res = await apiRequest({
        method: "POST",
        url: "/customers/order",
        data: {
          id: customer._id,
          cart: productsWithDetails,
          totalPrice: totalPrice,
          totalPoints: totalPoints,
          customerData: shippingInfo,
        },
        token: customer?.token,
      });
      console.log("Order placed successfully:", response.data);
      const newData = {
        token: localStorage?.getItem("token"),
        ...res.data?.customer,
      };
      dispatch(SetCustomer(newData));
      socket?.emit("setOrder", {
        user: shippingInfo,
        products: productsWithDetails,
        type: "addOrder",
        order: response.data.order,
      });
      dispatch(clearCart());
      setOrderNumber(res.data.order.orderNumber);
      setActiveStep(activeStep + 1);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleCashPayment = () => {
    setPaymentType("Cash");
    setActiveStep(activeStep + 1);
  };
  const [cardNumber, setCardNumber] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [expirationDate, setExpirationDate] = React.useState("");

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleCardNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (value.length <= 16) {
      setCardNumber(formattedValue);
    }
  };

  const handleCvvChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };
  const handleExpirationDateChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{2})(?=\d{2})/, "$1/");
    if (value.length <= 4) {
      setExpirationDate(formattedValue);
    }
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <AlertDialog
          open={unavailableProductsDialogOpen}
          onClose={() => {
            setUnavailableProductsDialogOpen(false);
            navigate("/bag");
          }}
          products={unavailableProductsList}
          msg={unavailableProductsList
            .map((product) => {
              console.log(product);
              if (product.actualQuantity === 0) {
                return `${product.name} ${t("is out of stock")}.`;
              } else {
                return `${
                  // i18n.language === "en"
                  `${t("The quantity you entered for")} ${
                    i18n.language === "ar" ? product?.ARName : product?.name
                  } ${t("is not available right now")}`
                }.`;
              }
            })
            .join(" ")}
        />

        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 6 },
            p: { xs: 2, md: 3 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography component="h1" variant="h4" align="center">
            {t("Checkout")}
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5, width: "100%" }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                {t("Thank you for your order")}.
              </Typography>
              <Typography variant="subtitle1">
                {t("Your order number is")} #{orderNumber}.{" "}
                {t("and will send you an update when your order has shipped")}
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 && (
                <AddressForm
                  formData={shippingInfo}
                  onChange={handleFormChange}
                  errorMessage={errorMessage}
                />
              )}
              {activeStep === 1 && (
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <RadioGroup
                    aria-label="Payment options"
                    name="paymentType"
                    sx={{
                      flexDirection:
                        paymentType === "default" || paymentType === "Cash"
                          ? "column"
                          : "row",
                      marginBottom: "1rem",
                      gap: 2,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    value={paymentType}
                    onChange={handlePaymentTypeChange}
                  >
                    <Card
                      raised={paymentType === "Cash"}
                      sx={{
                        minWidth: { xs: "100%", sm: "49%" },
                        outline: "1px solid",
                        // marginBottom: "1rem",
                        outlineColor:
                          paymentType === "Cash" ? "primary.main" : "divider",
                        backgroundColor:
                          paymentType === "Cash" ? "background.default" : "",
                      }}
                    >
                      <CardActionArea onClick={handleCashPayment}>
                        <CardContent
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <MoneyIcon color="primary" fontSize="small" />
                          <Typography fontWeight="medium">
                            {t("Cash On Delivery")}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                    <Card
                      raised={paymentType === "creditCard"}
                      sx={{
                        minWidth: { xs: "100%", sm: "49%" },
                        outline: "1px solid",
                        // marginBottom: "1rem",
                        outlineColor:
                          paymentType === "creditCard"
                            ? "primary.main"
                            : "divider",
                        backgroundColor:
                          paymentType === "creditCard"
                            ? "background.default"
                            : "",
                      }}
                    >
                      <CardActionArea
                        onClick={() => setPaymentType("creditCard")}
                      >
                        <CardContent
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CreditCardRoundedIcon
                            color="primary"
                            fontSize="small"
                          />
                          <Typography fontWeight="medium">
                            {t("Credit Card")}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </RadioGroup>
                  {paymentType === "creditCard" && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          p: 3,
                          height: { xs: 300, sm: 350, md: 375 },
                          width: "100%",
                          margin: "auto",
                          backgroundColor: "background.paper",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {t("Credit Card")}
                          </Typography>
                          <CreditCardRoundedIcon
                            sx={{ color: "text.secondary" }}
                          />
                        </Box>
                        <SimCardRoundedIcon
                          sx={{
                            fontSize: { xs: 48, sm: 56 },
                            transform: "rotate(90deg)",
                            color: "text.secondary",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            gap: 2,
                          }}
                        >
                          <FormGrid sx={{ flexGrow: 1 }}>
                            <FormLabel htmlFor="card-number" required>
                              {t("Card number")}
                            </FormLabel>
                            <OutlinedInput
                              id="card-number"
                              autoComplete="card-number"
                              placeholder="0000 0000 0000 0000"
                              required
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                            />
                          </FormGrid>
                          <FormGrid sx={{ maxWidth: "20%" }}>
                            <FormLabel htmlFor="cvv" required>
                              {t("CVV")}
                            </FormLabel>
                            <OutlinedInput
                              id="cvv"
                              autoComplete="CVV"
                              placeholder="123"
                              required
                              value={cvv}
                              onChange={handleCvvChange}
                            />
                          </FormGrid>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <FormGrid sx={{ flexGrow: 1 }}>
                            <FormLabel htmlFor="card-name" required>
                              {t("Name")}
                            </FormLabel>
                            <OutlinedInput
                              id="card-name"
                              autoComplete="card-name"
                              placeholder="John Smith"
                              required
                            />
                          </FormGrid>
                          <FormGrid sx={{ flexGrow: 1 }}>
                            <FormLabel htmlFor="card-expiration" required>
                              {t("Expiration date")}
                            </FormLabel>
                            <OutlinedInput
                              id="card-expiration"
                              autoComplete="card-expiration"
                              placeholder="MM/YY"
                              required
                              value={expirationDate}
                              onChange={handleExpirationDateChange}
                            />
                          </FormGrid>
                        </Box>
                        <Typography variant="body1" color="error">
                          {t(
                            "Sorry, Online payment is not available right now"
                          )}
                          .
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </FormControl>
              )}
              {activeStep === 2 && <Review />}
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    activeStep === 0
                      ? i18n.language === "ar"
                        ? "flex-start"
                        : "flex-end"
                      : "space-between",
                  width: "100%",
                  marginTop: "2rem",
                }}
              >
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{}}>
                    {t("Back")}
                  </Button>
                )}
                {activeStep === 0 && (
                  <Button variant="contained" onClick={handleNext}>
                    {t("Next")}
                  </Button>
                )}
                {activeStep === 2 && (
                  <>
                    {error && <Typography color="error">{error}</Typography>}
                    <Button variant="contained" onClick={handlePlaceOrder}>
                      {t("Place order")}
                    </Button>
                  </>
                )}
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </React.Fragment>
  );
}
