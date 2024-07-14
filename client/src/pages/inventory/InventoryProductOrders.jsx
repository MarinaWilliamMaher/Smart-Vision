import { useEffect, useState } from 'react';
import Loading from '../../components/shared/Loading';
import ProductOrder from '../../components/inventory/ProductOrder';
import { apiRequest } from '../../utils';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const InventoryProductOrders = () => {
  const { t } = useTranslation();
  const { employee } = useSelector((state) => state?.employee);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setorders] = useState([]);

  useEffect(() => {
    async function fetchOrderHistory() {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: '/employees/inventory/products',
          token: employee?.token,
        });
        if (response?.data?.success) {
          setorders(response.data.orders.reverse());
          setIsLoading(false);
          console.log(response?.data?.orders);
        } else {
          toast.dismiss();
          toast.error('Failed to get orders');
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          'Error fetching order history:',
          error?.response?.data?.message
        );
        setIsLoading(false);
      }
    }

    fetchOrderHistory();
  }, []);

  return (
    <div>
      <Toaster />
      {isLoading ? (
        <div className="mt-40">
          <Loading />
        </div>
      ) : (
        <div>
          {orders?.length ? (
            <>
              {orders?.map((order, index) => (
                <ProductOrder key={index} order={order} setOrders={setorders} />
              ))}
            </>
          ) : (
            <Typography
              variant="body1"
              style={{
                padding: '20px',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '25px',
                width: '80vw',
                marginTop: '5rem ',
                marginInline: 'auto',
              }}
            >
              {t('noRequestsAtTheMoment')}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryProductOrders;
