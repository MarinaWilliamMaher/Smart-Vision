import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiRequest } from '../../utils';
import Loading from '../../components/shared/Loading';
import {
  Grid,
  Typography,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreIcon from '@mui/icons-material/More';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Language/translate';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const ExpandMore = ({ expand, ...other }) => <IconButton {...other} />;

const FactorView = () => {
  const { t } = useTranslation();
  const { employee } = useSelector((state) => state?.employee);
  const [customizationOrders, setCustomizationOrders] = useState([]);
  const [expandedStates, setExpandedStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomizationOrders = async () => {
      try {
        const response = await apiRequest({
          url: '/employees/factory/',
          method: 'GET',
          token: employee?.token,
        });
        if (response?.data?.success) {
          setCustomizationOrders(response?.data?.customizationOrdersDetails);
          console.log(response?.data);
          setIsLoading(false);
        } else {
          toast.dismiss();
          toast.error('Faild to get customization orders');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchCustomizationOrders();
  }, []);
  const handleExpandClick = (orderId) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [orderId]: !prevStates[orderId],
    }));
  };

  const filteredOrders = customizationOrders.filter(
    (order) => order.state !== 'COMPLETED'
  );

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
          <Loading />{' '}
        </Grid>
      ) : customizationOrders.length > 0 ? (
        <Grid item xs={12} sm={10} md={10}>
          <Typography variant="h4" align="center" gutterBottom>
            {t('Factor Orders')}
          </Typography>
          <Grid
            container
            spacing={3}
            className="presenter-products"
            align="center"
            justifyContent="center"
          >
            {customizationOrders.map((order, index) => (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <Card sx={{ maxWidth: 300 }}>
                  <CardHeader
                    title={t(order.service)}
                    style={{ marginTop: '10px' }}
                  />
                  <CardContent style={{ marginTop: '-20px' }}>
                    {`${t('date')}: ${order.createdAt
                      .substring(0, 10)
                      .split('-')
                      .reverse()
                      .join('-')}`}
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton style={{ marginTop: '-30px' }}>
                      <Link to={`/factory/order-details/${order._id}`}>
                        <MoreIcon />
                      </Link>
                      {/* details */}
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
                        {i18n.language==="ar"?order.ARDescription:order.description}
                      </Typography>
                      <Typography variant="body2" style={{ fontSize: '15px' }}>
                        {t('State')}: {t(order?.state?.toLowerCase())}
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <div className="flex h-96 text-center">
          <p className="m-auto text-2xl font-bold text-gray-500">
            {t('Currently, there are no orders placed')}.
          </p>
        </div>
      )}
    </Grid>
  );
};

export default FactorView;
