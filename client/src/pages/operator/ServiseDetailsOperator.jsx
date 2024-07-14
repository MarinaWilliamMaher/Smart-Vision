import React, { useEffect, useState } from 'react';
import Loading from '../../components/shared/Loading';
import CustomizedOrderDetails from '../../components/shared/CustomizedOrderDetails';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../utils';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
function ServiseDetailsOperator({ socket, setSocket }) {
  const navigate = useNavigate();
  const { employee } = useSelector((state) => state?.employee);
  const { t } = useTranslation();
  const [order, setorder] = useState();
  const [orderNumber, setorderNumber] = useState();
  const [from, setfrom] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { serviceId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    setfrom(from);
    console.log(from);
  }, [location.search]);
  async function getCustomizedOrderDetail() {
    const response = await apiRequest({
      url: `/employees/operator/services/${serviceId}`,
      method: 'GET',
      token: employee?.token,
    });
    if (response?.data?.success) {
      setorder(response?.data?.service[0]);
      const First8IdDigets = response?.data?.service[0]?._id?.substring(0, 8); //to get first 8 diget in _Id
      setorderNumber(First8IdDigets);
      setIsLoading(false);
    } else {
      toast.dismiss();
      toast.error('Failed to get service order details');
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCustomizedOrderDetail();
  }, []);

  async function handleButtonClick(order) {
    const response = await apiRequest({
      method: 'PUT',
      url: '/employees/operator/services',
      data: { orderId: order?._id, newState: 'Delivered' },
      token: employee?.token,
    });
    console.log(response);
    if (response?.data?.success) {
      navigate('/operator/orders/service');
    } else {
      toast.dismiss();
      toast.error('failed to Update state');
    }
  }

  async function handleButtonClickDone(order) {
    const response = await apiRequest({
      method: 'PUT',
      url: '/employees/operator/services',
      data: { orderId: order?._id, newState: 'Done' },
      token: employee?.token,
    });
    console.log(response);
    if (response?.data?.success) {
      navigate('/operator/orders/service');
    } else {
      toast.dismiss();
      toast.error('failed to Update state');
    }
  }
  return (
    <>
      <Toaster />
      {console.log(order)}
      {!isLoading ? (
        <main className="OrderDetailsFactoryMain">
          <div className="flex flex-wrap justify-between my-4">
            <h1>
              {t('orderId')}: <span>{orderNumber}</span>
            </h1>
            {order?.state === 'Shipped' ? (
              <Button
                variant="contained"
                color="primary"
                style={{
                  background:
                    'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  textTransform: 'capitalize',
                  height: 38,
                  padding: '0px 15px',
                  fontSize: '14',
                  fontWeight: '600',
                }}
                onClick={() => handleButtonClick(order)}
              >
                {t('delivered')}
              </Button>
            ) : order.service === 'Assembly service' ||
              order.service === 'Delivery services' ||
              order.service === 'Packing Service' ? (
              <Button
                variant="contained"
                color="primary"
                style={{
                  background:
                    'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  textTransform: 'capitalize',
                  height: 38,
                  padding: '0px 15px',
                  fontSize: '14',
                  fontWeight: '600',
                }}
                onClick={() => handleButtonClickDone(order)}
              >
                {t('done')}
              </Button>
            ) : null}
          </div>
          <CustomizedOrderDetails
            order={order}
            employeeType={'OPERATOR'}
            socket={socket}
            setSocket={setSocket}
            from={from}
          />
        </main>
      ) : (
        <div className="h-screen">
          <Loading />
        </div>
      )}
    </>
  );
}

export default ServiseDetailsOperator;
