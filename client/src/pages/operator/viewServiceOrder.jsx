import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRequest } from '../../utils';
import Loading from '../../components/shared/Loading';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Grid,
  Typography,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreIcon from '@mui/icons-material/More';
import { Link, useNavigate } from 'react-router-dom';
import { setNotification } from '../../redux/NotificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18next';
import i18n from '../../../Language/translate';
import toast, { Toaster } from 'react-hot-toast';
const ExpandMore = ({ expand, ...other }) => <IconButton {...other} />;

const ViewServiceOrders = ({ socket, setSoket }) => {
  const [expandedStates, setExpandedStates] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [productOrders, setProductOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceType, setServiceType] = useState('All');
  const { notification } = useSelector((state) => state?.notification);
  const { employee } = useSelector((state) => state?.employee);
  const [serviceNotifications, setServiceNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrderHistory() {
      try {
        const response = await apiRequest({
          url: '/employees/operator/services',
          method: 'GET',
          token: employee?.token,
        });
        if (response?.data?.success) {
          const sortedOrders = response?.data?.services
            .filter(
              (order) =>
                !(order.state === 'Delivered' || order.state === 'Done')
            )
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
          setProductOrders(sortedOrders);
          // setProductOrders(response.data.services);
          setIsLoading(false);
          console.log(response?.data?.services);
        } else {
          toast.dismiss();
          toast.error('Failed to get all services orders');
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
  }, [notification]);

  useEffect(() => {
    socket?.on('notifications', (data) => {
      console.log(data);
      //let number = getNumberOfNotifications(notification);
      dispatch(setNotification([...notification, data]));
    });
  }, [socket]);

  const handleExpandClick = (orderId) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [orderId]: !prevStates[orderId],
    }));
  };

  useEffect(() => {
    const newServiceOrders = notification.filter(
      (notify) => notify.type === 'addService'
    );
    setServiceNotifications(
      newServiceOrders.map((notify) => notify.serviceOrder)
    );
  }, [notification]);

  const filteredOrders = productOrders.filter((order) => {
    const searchString = searchTerm.toLowerCase();
    const customerName = `${order?.customer?.username}`.toLowerCase();
    const customerPhone = `0${order?.customer?.phone}`.toLowerCase();
    const orderState = order?.state.toLowerCase();

    // Filter based on search term and selected service type
    return (
      (serviceType === 'All' ||
        order.service.toLowerCase() === serviceType.toLowerCase()) &&
      (customerName.includes(searchString) ||
        customerPhone.includes(searchString) ||
        orderState.includes(searchString))
    );
  });

  // Handler function to update selected service type
  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
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
          <div className="h-96">
            <Loading />
          </div>
        </Grid>
      ) : productOrders.length > 0 ? (
        <Grid item xs={12} sm={10} md={10}>
          {serviceNotifications.length >= 1 && (
            <div className="">
              <Typography variant="h4" align="center" gutterBottom>
                {i18n.language === 'en' && t('new')} {t('serviceOrders')}{' '}
                {i18n.language === 'ar' && t('new')}
              </Typography>
              <Grid
                container
                spacing={3}
                className="presenter-products"
                align="center"
                justifyContent="center"
              >
                {serviceNotifications.map((order, index) => (
                  <Grid key={index} item xs={12} md={6} lg={4}>
                    <Card sx={{ maxWidth: 300 }}>
                      <CardHeader
                        title={t(order.service)}
                        style={{ marginTop: '10px' }}
                      />
                      <CardContent
                        style={{ marginTop: '-20px' }}
                        onClick={() => {
                          navigate(`/operator/servise-details/${order?._id}`);
                        }}
                      >
                        <div className="">
                          <p>{order?.customer?.username}</p>
                        </div>
                        {`Date: ${order.createdAt
                          .substring(0, 10)
                          .split('-')
                          .reverse()
                          .join('-')}`}
                        <Typography
                          variant="body2"
                          style={{ fontSize: '15px' }}
                        >
                          {t('state')}: {t(order?.state?.toLowerCase())}
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton style={{ marginTop: '-30px' }}>
                          <Link to={`/operator/servise-details/${order._id}`}>
                            <MoreIcon />
                          </Link>
                        </IconButton>
                        <ExpandMore
                          expand={expandedStates[order._id]}
                          onClick={() => handleExpandClick(order._id)}
                          aria-expanded={expandedStates[order._id]}
                          aria-label="show more"
                          style={{ marginLeft: 'auto', marginTop: '-30px' }}
                        >
                          <ExpandMoreIcon />
                        </ExpandMore>
                      </CardActions>
                      <Collapse
                        in={expandedStates[order._id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <CardContent sx={{ marginTop: '-20px' }}>
                          <Typography
                            variant="body2"
                            style={{ marginBottom: '5px', fontSize: '15px' }}
                          >
                            {i18n.language === 'ar'
                              ? order?.ARDescription
                              : order?.description}
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{ fontSize: '15px' }}
                          >
                            {t('state')}: {t(order?.state?.toLowerCase())}
                          </Typography>
                        </CardContent>
                      </Collapse>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
          <Typography variant="h4" align="center" gutterBottom>
            {t('serviceOrders')}
          </Typography>
          <Grid
            sx={{
              margin: 'auto',
              marginBottom: '2rem',
              maxWidth: { xs: '90vw', sm: '500px' },
              display: 'flex',
              gap: '1rem',
            }}
          >
            <TextField
              select
              label="Service Type"
              value={serviceType}
              onChange={handleServiceTypeChange}
              variant="outlined"
              style={{ minWidth: '150px' }}
            >
              <MenuItem value="All">{t('all')}</MenuItem>
              <MenuItem value="Delivery services">{t('Delivery')}</MenuItem>
              <MenuItem value="Packing Service"> {t('Packing')}</MenuItem>
              <MenuItem value="Customization Service">
                {t('Customization')}
              </MenuItem>
              <MenuItem value="Assembly service">{t('Assembly')} </MenuItem>
              <MenuItem value="Measuring Service">{t('Measuring')} </MenuItem>
            </TextField>
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
          <Grid
            container
            spacing={3}
            className="presenter-products"
            align="center"
            justifyContent="center"
          >
            {filteredOrders.length ? (
              filteredOrders.map((order, index) => (
                <Grid key={index} item xs={12} md={6} lg={4}>
                  <Card sx={{ maxWidth: 300 }}>
                    <CardHeader
                      title={t(order.service)}
                      style={{ marginTop: '10px' }}
                    />
                    <CardContent
                      style={{ marginTop: '-20px' }}
                      onClick={() => {
                        navigate(`/operator/servise-details/${order?._id}`);
                      }}
                    >
                      <div className="">
                        <p>{order?.customer?.username}</p>
                      </div>
                      {`${t('date')}:  ${order.createdAt
                        .substring(0, 10)
                        .split('-')
                        .reverse()
                        .join('-')}`}
                      <Typography variant="body2" style={{ fontSize: '15px' }}>
                        {t('state')}: {t(order?.state?.toLowerCase())}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton style={{ marginTop: '-30px' }}>
                        <Link to={`/operator/servise-details/${order._id}`}>
                          <MoreIcon />
                        </Link>
                      </IconButton>
                      <ExpandMore
                        expand={expandedStates[order._id]}
                        onClick={() => handleExpandClick(order._id)}
                        aria-expanded={expandedStates[order._id]}
                        aria-label="show more"
                        style={{
                          marginLeft: i18n.language === 'en' ? 'auto' : '0',
                          marginRight: i18n.language === 'ar' ? 'auto' : '0',
                          marginTop: '-30px',
                        }}
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </CardActions>
                    <Collapse
                      in={expandedStates[order._id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <CardContent sx={{ marginTop: '-20px' }}>
                        <Typography
                          variant="body2"
                          style={{ marginBottom: '5px', fontSize: '15px' }}
                        >
                          {i18n.language === 'ar'
                            ? order?.ARDescription
                            : order?.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ fontSize: '15px' }}
                        >
                          {t('state')}: {t(order?.state?.toLowerCase())}
                        </Typography>
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
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
                  marginTop: '3rem',
                }}
              >
                {t('noResultsFound')}
              </p>
            )}
          </Grid>
        </Grid>
      ) : (
        <div>
          <p
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '25px',
              width: '100%',
              border: '2px solid',
              margin: 'auto',
              padding: '20px',
              color: '#a8a8a8',
              marginTop: '4rem',
            }}
          >
            {t('noRequestsAtTheMoment')}
          </p>
        </div>
      )}
    </Grid>
  );
};

export default ViewServiceOrders;
