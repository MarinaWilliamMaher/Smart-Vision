import React, { useEffect, useState } from "react";
import CustomizedOrderDetails from "../../components/shared/CustomizedOrderDetails";
import axios from "axios";
import Loading from "../../components/shared/Loading";
import "./StyleSheets/OrderDetailsFactory.css";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../utils";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";

function OrderDetailsFactory() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { employee } = useSelector((state) => state?.employee);
  const [order, setorder] = useState();
  const [orderNumber, setorderNumber] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { orderId } = useParams();

  async function getCustomizedOrderDetail() {
    const response = await apiRequest({
      method: "GET",
      url: `/employees/operator/services/${orderId}`,
      token: employee?.token,
    });
    console.log(response);
    if (response?.data?.success) {
      setorder(response?.data?.service[0]);
      const First8IdDigets = response?.data?.service[0]?._id?.substring(0, 8); //to get first 8 diget in _Id
      setorderNumber(First8IdDigets);
      setIsLoading(false);
    } else if (response) {
      toast.dismiss();
      toast.error("Faild to get customization orders");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCustomizedOrderDetail();
  }, []);

  async function handleButtonClick(order) {
    const response = await apiRequest({
      method: "PUT",
      url: "/employees/factory/",
      data: { orderId: order?._id },
      token: employee?.token,
    });
    console.log(response);
    if (response?.data?.success) {
      navigate("/factory/view");
    } else {
      toast.dismiss();
      toast.error("failed to Update state");
    }
  }

  return (
    <>
      <Toaster />
      {!isLoading ? (
        <main className="OrderDetailsFactoryMain">
          <div className="flex flex-wrap justify-between my-4">
            <h1>
              {t("orderId")}: <span>{orderNumber}</span>
            </h1>
            <Button
              variant="contained"
              color="primary"
              style={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                textTransform: "capitalize",
                height: 38,
                padding: "0px 15px",
                fontSize: "14",
                fontWeight: "600",
              }}
              onClick={() => handleButtonClick(order)}
            >
              {t("shipped")}
            </Button>
          </div>
          <CustomizedOrderDetails order={order} employeeType={"FACTORY"} />
        </main>
      ) : (
        <div className="h-screen">
          <Loading />
        </div>
      )}
    </>
  );
}

export default OrderDetailsFactory;
