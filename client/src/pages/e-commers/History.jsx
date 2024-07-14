import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OrderComponent from "../../components/e-commers/OrderComponent";
import ServiceHistory from "../../components/e-commers/serviceHistory";
import Loading from "../../components/shared/Loading";
import { Alert, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import i18n from "../../../Language/translate";
import { apiRequest } from "../../utils";
const History = () => {
  const { t } = useTranslation();
  const { customer } = useSelector((state) => state.customer);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderServiceHistory, setOrderServiceHistory] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [AllReviews, setAllReviews] = useState([]);

  const setupReviews = (orderHistory) => {
    const reviewSet = new Set();

    orderHistory?.forEach((order) => {
      order?.products?.forEach((product) => {
        product?.product?.reviews?.forEach((review) => {
          reviewSet.add(JSON.stringify(review));
        });
      });
    });

    const uniqueReviews = Array.from(reviewSet).map((review) =>
      JSON.parse(review)
    );

    setAllReviews(uniqueReviews);
  };

  //console.log(AllReviews)
  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  async function fetchData(dataType) {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/customers/${dataType}/${customer._id}`
      );
      if (dataType === "order") {
        setOrderHistory(response.data.history.reverse());
        setupReviews(response?.data?.history);
      } else {
        setOrderServiceHistory(response.data.history.reverse());
      }
      setIsLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching history:", error.response.data.message);
    }
  }

  const cancelService = async (serviceId) => {
    try {
      const response = await apiRequest({
        method:"DELETE",
        url:"/customers/service",
        data: { id: customer._id, serviceId:serviceId },
        token:customer?.token
      })
      if (response?.data?.success) {
        setOrderServiceHistory((prevOrderServiceHistory) =>
          prevOrderServiceHistory.map((entry) =>
            entry._id === serviceId ? { ...entry, state: "CANCELED" } : entry
          )
        );
      } else {
        setError(response?.data?.message);
        handleOpenSnackbar();
      }
    } catch (error) {
      console.error("Error cancelling service:", error.response.data.message);
    }
  };

  useEffect(() => {
    fetchData(showOrderHistory ? "order" : "service");
  }, [showOrderHistory]);

  return (
    <div>
      <div
        className="materialTransactionsFilterNavbarItem"
        style={{
          marginBottom: "2rem",
          marginRight: i18n.language === "ar" ? "4rem" : "0rem",
          marginLeft: i18n.language === "en" ? "4rem" : "0rem",
        }}
      >
        <label htmlFor="transactionType">{t("Select History Type")}:</label>
        <select
          name="transactionType"
          id="transactionType"
          onChange={(e) => setShowOrderHistory(e.target.value === "Orders")}
        >
          <option value="Orders">{t("Products")}</option>
          <option value="Services">{t("Services")}</option>
        </select>
      </div>
      {isLoading ? ( // Display loading indicator while isLoading is true
        <Loading />
      ) : (
        <ul>
          <li>
            {showOrderHistory ? (
              orderHistory.length > 0 ? (
                orderHistory.map((order, index) => (
                  <OrderComponent
                    key={index}
                    order={order}
                    reviews={AllReviews}
                    setReviews={setAllReviews}
                  />
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    width: "65%",
                    border: "2px solid",
                    margin: "auto",
                    padding: "20px",
                    marginBottom: "5rem",
                  }}
                >
                  {t("Your product history is empty")}
                </p>
              )
            ) : orderServiceHistory.length > 0 ? (
              <ServiceHistory
                orderServiceHistory={orderServiceHistory}
                cancelService={cancelService}
              />
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                  width: "65%",
                  border: "2px solid",
                  margin: "auto",
                  padding: "20px",
                  marginBottom: "5rem",
                }}
              >
                {t("Your services history is empty")}
              </p>
            )}
          </li>
        </ul>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default History;
