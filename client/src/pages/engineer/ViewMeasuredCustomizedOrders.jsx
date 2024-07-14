import React, { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../Presenter/StyleSheets/PresenterProductsView.css";
import { apiRequest } from "../../utils";
import Loading from "../../components/shared/Loading";
import { setNotification } from "../../redux/NotificationSlice";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";

function ViewMeasuredCutomizedOrders({ socket, setSocket }) {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [newAssignOrders, setNewAssignOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { employee } = useSelector((state) => state.employee);
  const { notification } = useSelector((state) => state?.notification);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest({
          method: "GET",
          url: `/employees/engineer/${employee._id}`,
          token: employee?.token,
        });
        console.log(response.data.services);
        if (response?.data?.success) {
          //console.log('API response:', response.data);
          const filteredRequests = response.data.services.filter(
            (request) => request.date
          );

          setRequests(filteredRequests);
          setIsLoading(false);
        } else {
          toast.dismiss();
          toast.error(response?.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error.response);
      }
    };

    fetchProducts();
  }, [notification]);
  useEffect(() => {
    socket?.on("notifications", (data) => {
      //console.log(data);
      //let number = getNumberOfNotifications(notification);
      dispatch(setNotification([...notification, data]));
    });
  }, [socket]);
  useEffect(() => {
    setNewAssignOrders(
      notification.filter(
        (notify) =>
          notify.type === "assignEngineerToCustomizationOrder" &&
          notify.serviceOrder?.date
      )
    );
  }, [notification]);
  // console.log(requests);
  const handleButtonClick = async (order) => {
    try {
      const response = await apiRequest({
        method: "PUT",
        url: "employees/engineer/services",
        data: {
          orderId: order._id,
          newState: "Done",
        },
        token: employee?.token,
      });
      if (response?.data?.success) {
        // Remove the order from the list
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== order._id)
        );
        toast.success(t("Request successful!"));
      } else {
        // toast.error(response?.data?.message || t('Request failed!'));
      }
    } catch (error) {
      console.error("Error making API request:", error);
    }
  };
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="presenter-products-container"
    >
      <Toaster />
      {isLoading ? (
        <Grid item>
          <Loading />
        </Grid>
      ) : requests.length > 0 ? (
        <>
          {/* New Services */}
          <Grid className="w-full flex flex-col justify-center items-center ">
            {newAssignOrders?.length >= 1 && (
              <Grid item xs={12} sm={10} md={10}>
                <Typography variant="h4" align="center" gutterBottom>
                  {t("newServiceRequestsMeasuring")}
                </Typography>
                <Grid
                  container
                  spacing={3}
                  className="presenter-products"
                  align="center"
                  justifyContent="center"
                >
                  {newAssignOrders.map((request, index) => (
                    <Grid key={index} item xs={12} md={6} lg={4}>
                      <div className={`presenter-product-card`}>
                        <Typography
                          variant="body2"
                          align="center"
                          gutterBottom
                          className="presenter-product-info"
                        >
                          {t("Service")}: {t(request.service)}
                        </Typography>
                        <Typography
                          variant="body2"
                          align="center"
                          gutterBottom
                          className="presenter-product-info"
                        >
                          {t("customerName")}:{" "}
                          {request.serviceOrder.customer?.username}
                        </Typography>
                        <Typography
                          variant="body2"
                          align="center"
                          gutterBottom
                          className="presenter-product-description"
                        >
                          {t("customerNumber")}:{" 0"}
                          {request.serviceOrder.customer?.phone}
                        </Typography>
                        <Typography>
                          <Link
                            to={`/engineer/order-details/${request.serviceOrder?._id}`}
                          >
                            <Button
                              variant="text"
                              sx={{
                                textDecoration: "underline",
                                textTransform: "capitalize",
                                fontSize: "19px",
                                padding: 0,
                                "&:hover": {
                                  backgroundColor: "white",
                                  color: "black",
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {t("serviceDetails")}
                            </Button>
                          </Link>
                        </Typography>
                        <Typography
                          variant="body3"
                          align="center"
                          gutterBottom
                          className="presenter-product-description"
                        >
                          {t("day")}: {request.serviceOrder?.date?.day}
                          <span style={{ marginInline: "1.5rem" }}>
                            {t("hour")}: {request.serviceOrder?.date?.time}
                          </span>
                        </Typography>
                        <div className="button-container">
                          {" "}
                          {request?.service === "Customization Service" ? (
                            <Link
                              to={`/engineer/send-order/${request?._id}`}
                              className="link-style"
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                className="add-to-store-button"
                                style={{
                                  background:
                                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                  textTransform: "capitalize",
                                  height: 38,
                                  padding: "0px 15px",
                                }}
                              >
                                {t("sendOrderToFactory")}
                              </Button>
                            </Link>
                          ) : (
                            <div>
                              <Button
                                variant="contained"
                                color="primary"
                                // className="add-to-store-button"
                                style={{
                                  background:
                                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                  textTransform: "capitalize",
                                  height: 38,
                                  padding: "0px 15px",
                                }}
                                onClick={() => handleButtonClick(request)}
                              >
                                {t("done")}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
          {/* Old Services */}
          <Grid item xs={12} sm={10} md={10}>
            <Typography variant="h4" align="center" gutterBottom>
              {t("serviceRequestsMeasuring")}
            </Typography>
            <Grid
              container
              spacing={3}
              className="presenter-products"
              align="center"
              justifyContent="center"
            >
              {requests.map((request, index) => (
                <Grid key={index} item xs={12} md={6} lg={4}>
                  <div className={`presenter-product-card`}>
                    <Typography
                      variant="body2"
                      align="center"
                      gutterBottom
                      className="presenter-product-info"
                    >
                      {t("Service")}: {t(request.service)}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      gutterBottom
                      className="presenter-product-info"
                    >
                      {t("customerName")}: {request.customer?.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      gutterBottom
                      className="presenter-product-description"
                    >
                      {t("customerNumber")}:{" 0"}
                      {request.customer?.phone}
                    </Typography>
                    <Typography>
                      <Link to={`/engineer/order-details/${request?._id}`}>
                        <Button
                          variant="text"
                          sx={{
                            textDecoration: "underline",
                            textTransform: "capitalize",
                            fontSize: "19px",
                            padding: 0,
                            "&:hover": {
                              backgroundColor: "white",
                              color: "black",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {t("serviceDetails")}
                        </Button>
                      </Link>
                    </Typography>
                    <Typography
                      variant="body3"
                      align="center"
                      gutterBottom
                      className="presenter-product-description"
                    >
                      {t("day")}: {request?.date?.day}
                      <span style={{ marginInline: "1.5rem" }}>
                        {t("hour")}: {request?.date?.time}
                      </span>
                    </Typography>
                    <div className="button-container">
                      {" "}
                      {request?.service === "Customization Service" ? (
                        <Link
                          to={`/engineer/send-order/${request?._id}`}
                          className="link-style"
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            className="add-to-store-button"
                            style={{
                              background:
                                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                              textTransform: "capitalize",
                              height: 38,
                              padding: "0px 15px",
                            }}
                          >
                            {t("sendOrderToFactory")}
                          </Button>
                        </Link>
                      ) : (
                        <div>
                          <Button
                            variant="contained"
                            color="primary"
                            // className="add-to-store-button"
                            style={{
                              background:
                                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                              textTransform: "capitalize",
                              height: 38,
                              padding: "0px 15px",
                            }}
                            onClick={() => handleButtonClick(request)}
                          >
                            {t("done")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid item xs={12} sm={8}>
          <Typography variant="h5" align="center" gutterBottom>
            <div className="text-gray-400 mt-20">
              {t("noRequestsAtTheMoment")}
            </div>
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default ViewMeasuredCutomizedOrders;
