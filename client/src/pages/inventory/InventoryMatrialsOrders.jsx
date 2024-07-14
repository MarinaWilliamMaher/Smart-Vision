import { useEffect, useState } from 'react';
import Loading from '../../components/shared/Loading';
import MaterialOrder from '../../components/inventory/MaterialOrder';
import { apiRequest } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/NotificationSlice';
import { Typography } from '@mui/material';
import { t } from 'i18next';
import toast, { Toaster } from 'react-hot-toast';

const InventoryMatrialsOrders = ({ socket, setSocket }) => {
  const { employee } = useSelector((state) => state?.employee);
  const [isLoading, setIsLoading] = useState(true);
  const [matrials, setMatrials] = useState([]);
  const { notification } = useSelector((state) => state?.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchOrderHistory() {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: '/employees/inventory/materials',
          token: employee?.token,
        });
        if (response?.data?.success) {
          const filteredMaterials = response.data.materialOrders
            .filter((order) => order.state !== 'SHIPPED')
            .reverse();
          setMatrials(filteredMaterials);
          console.log(filteredMaterials);
          setIsLoading(false);
        } else {
          toast.dismiss();
          toast.error('Failed to get materials');
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          'Error fetching order history:',
          error?.response?.data?.message
        );
        toast.dismiss();
        toast.error('Error fetching order history');
        setIsLoading(false);
      }
    }

    fetchOrderHistory();
  }, [employee?.token]);

  useEffect(() => {
    socket?.on('notifications', (data) => {
      dispatch(setNotification([...notification, data]));
    });
  }, [socket, notification, dispatch]);

  return (
    <div>
      <Toaster />
      {isLoading ? (
        <div className="mt-40">
          <Loading />
        </div>
      ) : (
        <div>
          {matrials?.length ? (
            <>
              {matrials?.map((matrial, index) => (
                <MaterialOrder
                  key={index}
                  matrial={matrial}
                  setMaterialls={setMatrials}
                />
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

export default InventoryMatrialsOrders;
