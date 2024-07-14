import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from '../../components/shared/Loading';
import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ProductOrderComponent from '../../components/Operator/ProductOrderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/NotificationSlice';
import { t } from 'i18next';
import { apiRequest } from '../../utils';
import toast, { Toaster } from 'react-hot-toast';

const ViewProductOrders = ({ socket, setSocket }) => {
  const [productOrders, setProductOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { notification } = useSelector((state) => state?.notification);
  const { employee } = useSelector((state) => state?.employee);
  const dispatch = useDispatch();
  const [ordersNotification, setOrdersNotification] = useState([]);
  const [updatedState1, setUpdatedState1] = useState('');

  useEffect(() => {
    async function fetchOrderHistory() {
      // setIsLoading(true);
      try {
        const response = await apiRequest({
          url: '/employees/operator/orders',
          method: 'GET',
          token: employee?.token,
        });
        if (response?.data?.success) {
          const sortedOrders = response.data.orders
            .filter(
              (order) =>
                !(order.state === 'CANCELED' || order.state === 'Delivered')
            )
            .sort((a, b) => b.orderNumber - a.orderNumber);
          setProductOrders(sortedOrders);
          setIsLoading(false);
        } else {
          toast.dismiss();
          toast.error('Failed to get all order');
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          'Error fetching order history:',
          error.response.data.message
        );
      }
    }

    fetchOrderHistory();
  }, [notification, updatedState1]);

  const onUpdatedState1 = (newState) => {
    setUpdatedState1(newState);
  };

  useEffect(() => {
    const filteredOrders = productOrders.filter((order) => {
      const searchString = searchTerm.toLowerCase();
      const customerName =
        `${order?.customerData?.firstName} ${order.customerData.lastName}`.toLowerCase();
      const orderNumber = order?.orderNumber.toString().toLowerCase();
      const customerPhone =
        `0${order?.customerData?.phoneNumber}`.toLowerCase();
      const orderState = order?.state?.toLowerCase();
      return (
        customerName.includes(searchString) ||
        orderNumber.includes(searchString) ||
        customerPhone.includes(searchString) ||
        orderState.includes(searchString)
      );
    });
    setFilteredOrders(filteredOrders);
  }, [productOrders, searchTerm]);

  useEffect(() => {
    socket?.on('notifications', (data) => {
      dispatch(setNotification([...notification, data]));
    });
  }, [socket]);

  useEffect(() => {
    setOrdersNotification(
      notification.filter((notify) => notify.type === 'addOrder')
    );
  }, [notification]);

  return (
    <div>
      <Toaster />
      <Typography variant="h4" align="center" gutterBottom>
        {t('productOrders')}
      </Typography>
      <Grid
        sx={{
          margin: 'auto',
          marginBottom: '2rem',
          marginTop: '2rem',
          marginLeft: { xs: 'auto' },
          width: { xs: '90vw', sm: '500px' },
        }}
      >
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          placeholder={` ${t('EnterYourSearch')}`}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchTerm && (
                  <IconButton
                    edge="end"
                    aria-label="clear search"
                    onClick={(e) => setSearchTerm('')}
                  >
                    <ClearIcon color="action" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            style: { backgroundColor: 'white', borderRadius: '5px' },
          }}
        />
      </Grid>
      {isLoading ? (
        <div className="h-60">
          <Loading />
        </div>
      ) : (
        <ul>
          {ordersNotification?.length >= 1 && (
            <li>
              {ordersNotification?.map((notify, idx) => {
                let order = notify.order;
                return (
                  <ProductOrderComponent
                    key={idx}
                    order={order}
                    setUpdatedState1={setUpdatedState1}
                    isNew="true"
                  />
                );
              })}
            </li>
          )}
          <li>
            {productOrders.length === 0 ? (
              <p
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '25px',
                  width: '65%',
                  border: '2px solid',
                  margin: 'auto',
                  padding: '20px',
                  color: '#a8a8a8',
                }}
              >
                {t('noRequestsAtTheMoment')}
              </p>
            ) : filteredOrders.length > 0 ? (
              filteredOrders?.map((order, index) => (
                <ProductOrderComponent
                  key={order?._id}
                  order1={order}
                  onUpdatedState1={onUpdatedState1}
                />
              ))
            ) : (
              <p
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '25px',
                  width: '65%',
                  margin: 'auto',
                  padding: '20px',
                  color: '#a8a8a8',
                }}
              >
                {t('noResultsFound')}
              </p>
            )}
          </li>
        </ul>
      )}
    </div>
  );
};

export default ViewProductOrders;
