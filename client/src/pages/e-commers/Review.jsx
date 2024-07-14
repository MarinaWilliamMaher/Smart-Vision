import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook

export default function Review() {
  const { t } = useTranslation(); // Initialize the useTranslation hook

  const [products, setProducts] = React.useState([]);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setProducts(storedCart);
  }, []);
  const [shippingInfo, setShippingInfo] = React.useState(() => {
    const storedShippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
    return storedShippingInfo || {};
  });

  function calculateTotalPrice(cart) {
    if (!cart || cart.length === 0) {
      return 0;
    }
    const totalPrice = cart.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);

    return totalPrice;
  }

  const totalPrice = calculateTotalPrice(products);
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {t("Order summary")}
      </Typography>
      <List disablePadding style={{ width: "100%" }}>
        {products.map((product) => (
          <ListItem
            key={product._id}
            sx={{
              py: 1,
              px: 0,
              borderTop: "1px solid grey",
              borderBottom: "1px solid grey",
              boxShadow: "none",
            }}
            variant="outlined"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              style={{ width: 100, height: 70, marginRight: 10 }}
            />
            <Typography variant="body2" style={{ fontSize: "15px" }}>
              <span style={{ fontSize: "18px" }}>
                {product.quantity ? product.quantity : 1}
              </span>{" "}
              x {product.name}
              <br />
              {/* <span style={{ fontSize: "11px" }}>{product.description}</span> */}
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontWeight: 700, marginRight: 3, marginLeft: "auto" }}
            >
              {product.price} {t("EGP")}
            </Typography>
          </ListItem>
        ))}
        <ListItem
          sx={{
            // py: 1,
            // px: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle1" >{t("Total")}</Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, marginRight: 3 }}
          >
            {totalPrice}
            {t("EGP")}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2} style={{ textAlign: "" }}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            {t("Shipping Info")}
          </Typography>
          {shippingInfo && (
            <React.Fragment>
              <Typography gutterBottom>
                {t("Your Name Is")}: {shippingInfo.firstName}{" "}
                {shippingInfo.lastName}
              </Typography>
              <Typography gutterBottom>
                {t("Your Address Is")}: {shippingInfo.address}
              </Typography>
              <Typography gutterBottom>
                {t("Your Phone Number Is")}: {shippingInfo.phoneNumber}
              </Typography>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
