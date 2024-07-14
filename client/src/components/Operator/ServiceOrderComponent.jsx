import { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { apiRequest } from "../../utils";
import Slider from "react-slick";

function ServiceOrderComponent({ order }) {
  const [showOrder, setShowOrder] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState(order);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleOrder = () => {
    setShowOrder(!showOrder);
  };
  const handleStateChange = async (event) => {
    const newState = event.target.value;

    try {
      const response = await apiRequest({
        method: "PUT",
        url: `/employees/services`,
        data: {
          orderId: order._id,
          newState: newState,
        },
      });
    //   console.log(response.data);
    //   setUpdatedOrder(response.data.order);
    //   console.log("Updated order state:", updatedOrder.state);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };
  return (
    <Grid container className="order-container" sx={{ marginBottom: "2rem" }}>
      <Grid
        item
        xs={11}
        sm={9}
        md={9}
        lg={7}
        sx={{ margin: "auto", border: "2px solid #ddd", borderRadius: "10px" }}
      >
        <Grid
          container
          sx={{
            borderBottom: showOrder ? "2px solid #ddd" : "none",
            borderStartEndRadius: "10px",
            borderStartStartRadius: "10px",
            padding: "20px",
            backgroundColor: "#f2f2f2",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={6}
            md={3}
            lg={3}
            sx={{ marginBottom: { xs: "1.5rem", md: "0rem" } }}
          >
            <Typography variant="body1">Date Placed</Typography>
            <Typography variant="body2">
              {order.createdAt.substring(0, 10).split("-").reverse().join("-")}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            md={3}
            lg={3}
            sx={{
              textAlign: { xs: "end", md: "center" },
              marginBottom: { xs: "1.5rem", md: "0rem" },
              marginTop: { xs: "-1.5rem", md: "0rem" },
            }}
          >
          </Grid>
          <Grid
            item
            xs={6}
            md={3}
            lg={6}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "flex-end",
                md: "center",

                lg: "flex-end",
              },
            }}
          >
            <Button
              onClick={toggleOrder}
              variant="contained"
              sx={{
                backgroundColor: "#009688",
                color: "white",
                borderRadius: "5px",
                ":hover": {
                  backgroundColor: "#009688",
                },
              }}
            >
              {showOrder ? "close" : "Order Details"}
            </Button>
          </Grid>
        </Grid>
        {showOrder && (
          <Grid
            container
            item
            sx={{
              borderTop: "none",
              padding: "20px",
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  marginRight: "1rem",
                  fontSize: { xs: "16px", md: "20px", fontWeight: "bold" },
                }}
              >
                Customer Name:{" "}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "16px", md: "19px", color: "gray" } }}
              >
                {order?.customer.username}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                marginBottom: "1rem",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  marginRight: "1rem",
                  fontSize: { xs: "16px", md: "20px", fontWeight: "bold" },
                }}
              >
                Phone Number:{" "}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "16px", md: "19px", color: "gray" } }}
              >
                {order?.customer.phone}
              </Typography>
            </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "20px",
                  padding: "20px",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                  {order.images.length === 0 ? (
                          <p
                            style={{
                              height: "150px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              border: "1px solid",
                            }}
                          >
                            No images uploaded
                          </p>
                        ) : order.images.length === 1 ? (
                          <img
                            src={order.images[0]}
                            alt={`Image 1`}
                            style={{ width: "100%", height: "150px" }}
                          />
                        ) : (
                          <Slider {...settings}>
                            {order.images.map((image, index) => (
                              <div key={index}>
                                <img
                                  src={image}
                                  alt={`Image ${index + 1}`}
                                  style={{ width: "100%", height: "150px" }}
                                />
                              </div>
                            ))}
                          </Slider>
                        )}
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid
                      item
                      container
                      sx={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "gray",
                        alignItems: "flex-start",
                      }}
                    >
                      <Grid item xs={12} md={8} variant="body1">
                        <span style={{ color: "" }}>
                          {order.service}
                        </span>
                      </Grid>
                    </Grid>
                    <Typography
                      variant="body2"
                      style={{ marginTop: "1rem", fontSize: { xs: "10px" } }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                        Description:
                      </span>{" "}
                      {order.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            {/* ))} */}

            <Grid
              item
              xs={12}
              container
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Grid item xs={3} md={2} style={{ justifyContent: "center" }}>
                <Typography variant="body1">
                  <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                    State:{""}
                  </span>{" "}
                </Typography>
              </Grid>
              {isSmallScreen ? (
                <Grid
                  item
                  xs={9}
                  md={10}
                  style={{ textAlign: "center", justifyContent: "center" }}
                >
                  <FormControl fullWidth>
                    <Select
                      labelId="order-state-label"
                      id="order-state"
                      value={updatedOrder?.state}
                      onChange={handleStateChange}
                    >
                        {console.log(updatedOrder)}
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="In Progress">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ) : (
                <RadioGroup
                  row
                  aria-label="order-state"
                  name="order-state"
                  value={updatedOrder?.state}
                  onChange={handleStateChange}
                >
                    {console.log(updatedOrder)}
                  <FormControlLabel
                    value="PENDING"
                    control={<Radio />}
                    label="Pending"
                  />
                  <FormControlLabel
                    value="In Progress"
                    control={<Radio />}
                    label="Processing"
                  />
                  <FormControlLabel
                    value="Shipped"
                    control={<Radio />}
                    label="Shipped"
                  />
                  <FormControlLabel
                    value="Delivered"
                    control={<Radio />}
                    label="Delivered"
                  />
                </RadioGroup>
              )}
              {/* </Grid> */}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ServiceOrderComponent;
