import { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import getTodayDate, { AddDaysToDate } from "../../utils/dates";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import i18n from "../../../Language/translate";

function ServiceHistory({ orderServiceHistory, cancelService }) {
  const { t } = useTranslation();
  const [displayedOrders, setDisplayedOrders] = useState(1);
  const [timeOutToCancel, settimeOutToCancel] = useState();
  const handleShowMore = () => {
    setDisplayedOrders(orderServiceHistory?.length);
  };
  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <>
      {orderServiceHistory.length > 0 ? (
        <Grid
          container
          className="order-container"
          sx={{ marginBottom: "2rem" }}
        >
          <Grid
            item
            xs={10}
            sm={10}
            md={7}
            sx={{
              margin: "auto",
              border: "2px solid #ddd",
              borderRadius: "10px",
            }}
          >
            <Grid
              container
              sx={{
                borderBottom: "2px solid #ddd",
                borderStartEndRadius: "10px",
                borderStartStartRadius: "10px",
                padding: "10px 40px",
                backgroundColor: "#f2f2f2",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={6}
                // md={4}
                // lg={3}
                sx={{
                  textAlign: { xs: "start" },
                  padding: "10px 0px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    // fontWeight: "bold",
                    fontSize: { xs: "16px", md: "20px" },
                  }}
                >
                  {t("Service History")}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                // md={4}
                // lg={3}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-end" },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    marginRight: "1rem",
                    fontSize: { xs: "16px", md: "20px" },
                  }}
                >
                  {t("Total Orders")}:{" "}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "16px", md: "19px" } }}
                >
                  {orderServiceHistory.length}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                borderTop: "none",
                padding: "20px",
              }}
            >
              {orderServiceHistory
                .slice(0, displayedOrders)
                .map((historyEntry, index) => (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    sx={{
                      border: "2px solid #ddd",
                      borderRadius: "5px",
                      marginBottom: "20px",
                      padding: "20px",
                    }}
                  >
                    <Grid container spacing={4}>
                      {historyEntry?.images?.length > 0 &&
                        (historyEntry.images.length === 1 ? (
                          <Grid item xs={12} sm={5}>
                            <img
                              src={historyEntry.images[0]}
                              alt={`Image 1`}
                              style={{ width: "100%", height: "150px" }}
                            />
                          </Grid>
                        ) : (
                          <Grid item xs={12} sm={5}>
                            <Slider {...settings}>
                              {historyEntry?.images?.map((image, index) => (
                                <div key={index}>
                                  <img
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    style={{ width: "100%", height: "150px" }}
                                  />
                                </div>
                              ))}
                            </Slider>
                          </Grid>
                        ))}

                      <Grid item xs={12} md={7} sm={7}>
                        <Typography
                          variant="body2"
                          style={{ marginTop: "1rem", fontSize: "20px" }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {t("Service Name")} :
                          </span>{" "}
                          {t(historyEntry?.service)}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ marginTop: "1rem", fontSize: "20px" }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {t("Date Placed")}:
                          </span>{" "}
                          {historyEntry?.createdAt
                            .substring(0, 10)
                            .split("-")
                            .reverse()
                            .join("-")}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ marginTop: "1rem", fontSize: "20px" }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {t("Description")}:
                          </span>{" "}
                          {i18n.language === "ar"
                            ? historyEntry?.ARDescription
                            : historyEntry?.description}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textAlign: "center",
                          // backgroundColor:"red",
                          // paddingTop:"0"
                        }}
                      >
                        <Typography
                          variant="body2"
                          // xs={6}
                          style={{ fontSize: "16px", paddingTop: "0" }}
                        >
                          <span style={{ color: "#222", fontWeight: "bold" }}>
                            {t("State")}:
                          </span>{" "}
                          {t(historyEntry?.state?.toLowerCase())}
                        </Typography>
                        {historyEntry.state === "PENDING" &&
                          AddDaysToDate(historyEntry?.createdAt, 3) >=
                            getTodayDate() && (
                            <Button
                              onClick={() => cancelService(historyEntry?._id)}
                              variant="contained"
                              color="error"
                              xs={4}
                              sx={{
                                backgroundColor: "#009688",
                                color: "white",
                                borderRadius: "5px",
                                // paddingTop:"0",
                                ":hover": {
                                  backgroundColor: "#008688",
                                },
                              }}
                            >
                              {t("cancel")}
                            </Button>
                          )}
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              {orderServiceHistory?.length > displayedOrders && (
                <Grid container justifyContent="end">
                  <Typography
                    variant="body2"
                    style={{
                      cursor: "pointer",
                      fontSize: "19px",
                      textDecoration: "underline",
                    }}
                    onClick={handleShowMore}
                  >
                    {t("Show All")}
                  </Typography>
                </Grid>
              )}
            </Grid>

            {/* )} */}
          </Grid>
        </Grid>
      ) : (
        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
            width: "65%",
            border: "2px solid",
            margin: "auto",
            padding: "20px",
            marginBottom: "5rem",
          }}
        >
          {t("Your service history is empty")}.
        </p>
      )}
    </>
  );
}

export default ServiceHistory;
