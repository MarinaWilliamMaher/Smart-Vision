import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import Accordion from 'react-bootstrap/Accordion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/shared/Loading';
import { t } from 'i18next';
import { apiRequest } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const ProductOrderDetails = () => {
  const { employee } = useSelector((state) => state?.employee);
  const { orderId } = useParams();
  const [order, setorder] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCustomizedOrderDetail() {
      const response = await apiRequest({
        url: `/employees/operator/orders/${orderId}`,
        method: 'GET',
        token: employee?.token,
      });
      if (response?.data?.success) {
        setorder(response?.data?.order);
        console.log(response?.data.order);
        setIsLoading(false);
      } else {
        toast.dismiss();
        toast.error('Failed to get order details');
        //setIsLoading(false);
      }
    }
    getCustomizedOrderDetail();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96">
        <Loading />
      </div>
    );
  }
  return (
    <div
      style={{
        maxWidth: '1250px',
        margin: 'auto',
        padding: '0px 10px',
        marginBottom: '2rem',
        marginTop: '2rem',
      }}
    >
      <Toaster />
      <h1
        style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '1.5rem' }}
      >
        {t('Order Number')}: <span>{order.orderNumber}</span>
      </h1>
      <Accordion
        defaultActiveKey={['0', '1']}
        alwaysOpen
        className="CustomizedOrderAccordion"
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t('details')}</Accordion.Header>
          <Accordion.Body>
            <p style={{ marginBottom: '0.5rem' }}>
              <span>{t('date')}:</span> {order?.updatedAt?.substring(0, 10)}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <span>{t('Total Price')}:</span> {order?.totalPrice}
            </p>
            <p>
              <span>{t('state')}:</span> {order?.state.toLowerCase()}
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t('Products')}</Accordion.Header>
          <Accordion.Body>
            {order?.products.map((product) => (
              <div
                key={product._id}
                style={{
                  marginBottom: '1rem',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '1rem',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={product?.product?.images[0]}
                      alt={product?.product?.name}
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={9}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          marginBottom: '1.2rem',
                        }}
                      >
                        <Typography
                          variant="h6"
                          gutterBottom
                          style={{
                            fontSize: '20px',
                            textTransform: 'capitalize',
                          }}
                        >
                          {product?.product?.name}
                        </Typography>
                      </Grid>
                      <Grid container xs={12}>
                        <Grid item xs={6}>
                          <Typography gutterBottom>
                            <span style={{ fontSize: '20px' }}>
                              {t('quantity')}:
                            </span>{' '}
                            {product?.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography gutterBottom>
                            <span style={{ fontSize: '20px' }}>
                              {t('Price')}:
                            </span>{' '}
                            {product?.product?.price} {t('EGP')}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography gutterBottom>
                          <span style={{ fontSize: '20px' }}>
                            {t('description')}:
                          </span>{' '}
                          {product?.product?.description}
                        </Typography>
                      </Grid>
                      {/* Add more product information here */}
                    </div>
                    {/* Add additional product information or actions here */}
                  </Grid>
                </Grid>
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>customer Data</Accordion.Header>
          <Accordion.Body>
            <p style={{ marginBottom: '0.5rem' }}>
              <span>{t('name')}: </span>{' '}
              {order?.customerData?.firstName +
                ' ' +
                order?.customerData?.lastName}
            </p>
            <>
              <p style={{ marginBottom: '0.5rem' }}>
                <span>{t('phone')}:</span> 0{order?.customerData?.phoneNumber}
              </p>
              <p>
                <span>{t('address')}:</span> {order?.customerData?.address}
              </p>
            </>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ProductOrderDetails;
