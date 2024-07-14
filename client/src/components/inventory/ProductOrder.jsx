import { useEffect, useState } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../utils';
import toast, { Toaster } from 'react-hot-toast';
import { t } from 'i18next';

function ProductOrder({ order, setOrders }) {
  const language = JSON.parse(window?.localStorage.getItem('language'));
  const { employee } = useSelector((state) => state.employee);
  const [showOrder, setShowOrder] = useState(false);
  const [products, setProducts] = useState([{ product: '', quantity: '' }]);

  useEffect(() => {
    //console.log(productData);
    const formattedProducts = order?.products?.map((product) => ({
      productName: product?.product?.name,
      quantity: product?.quantity,
    }));

    setProducts(formattedProducts);
  }, []);

  const handleTransaction = async () => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/employees/inventory/shipped/${order._id}`,
        data: {
          managerId: employee?._id,
          products: products,
        },
        token: employee?.token,
      });
      if (response?.data?.success) {
        toast.success(t('productExportedSuccessfully'));
        order.state = 'Shipped';
        setOrders((prevOrders) => {
          return prevOrders.filter((item) => item._id !== order._id);
        });
      } else {
        //console.log(response.data.message);
        toast.error('Failed to change order state');
      }
    } catch (error) {
      // console.error('Error updating order status:', error);
      // console.error('Error making transaction:', error);
      toast.error(t('noEnoughQuantityInInventory'));
    }
  };

  if (order.state === 'Shipped') {
    return null;
  }

  return (
    <Grid container className="order-container" sx={{ marginBottom: '2rem' }}>
      {/* <Toaster
        toastOptions={{
          style: {
            duration: 3000,
            border: '1px solid #6A5ACD',
            backgroundColor: '#6A5ACD',
            padding: '16px',
            color: 'white',
            fontWeight: 'Bold',
            marginTop: '65px',
            textAlign: 'center',
          },
        }}
      /> */}
      <Grid
        item
        xs={11}
        sm={8}
        md={7}
        sx={{ margin: 'auto', border: '2px solid #ddd', borderRadius: '10px' }}
      >
        <Grid
          container
          sx={{
            borderBottom: showOrder ? '2px solid #ddd' : 'none',
            borderStartEndRadius: '10px',
            borderStartStartRadius: '10px',
            padding: '20px',
            backgroundColor: '#f2f2f2',
            alignItems: 'center',
          }}
        >
          <Grid
            item
            xs={6}
            md={4}
            lg={4}
            sx={{ marginBottom: { xs: '1.3rem', md: '0rem' } }}
          >
            <Typography variant="body1">{t('datePlaced')}</Typography>
            <Typography variant="body2">
              {order.createdAt.substring(0, 10).split('-').reverse().join('-')}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            lg={4}
            sx={{
              textAlign: { md: 'center' },
              marginBottom: { xs: '2.1rem', lg: '0rem', md: '0rem' },
              display: 'flex',
              justifyContent: {
                xs: 'flex-end',
                md: 'center',
              },
            }}
          >
            <Typography variant="body1">
              {t('totalProducts')}: {order?.products.length}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            lg={4}
            sx={{
              display: 'flex',
              justifyContent: {
                md: 'flex-end',
                lg: 'flex-end',
              },
              marginTop: { lg: '0rem' },
              marginRight: { xs: '20px', md: '0rem', lg: '0rem' },
            }}
          >
            <Button
              onClick={() => setShowOrder(!showOrder)}
              variant="contained"
              sx={{
                backgroundColor: '#009688',
                color: 'white',
                borderRadius: '5px',
                ':hover': {
                  backgroundColor: '#009688',
                },
              }}
            >
              {showOrder ? t('close') : t('details')}
            </Button>
          </Grid>
        </Grid>
        {showOrder && (
          <Grid
            container
            item
            sx={{
              borderTop: 'none',
              padding: '20px',
            }}
          >
            {order?.products?.map((product, index) => (
              <Grid
                key={index}
                item
                xs={12}
                sx={{
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  padding: '20px',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid
                      item
                      container
                      sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'gray',
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                        variant="body1"
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'center', md: 'flex-start' },
                          color: 'black',
                          marginBottom: '1rem',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontSize: { xs: '16px', md: '20px' } }}
                        >
                          {language === 'en'
                            ? product?.product?.name
                            : product?.product?.ARName}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        variant="body1"
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'center', md: 'flex-end' },
                          marginBottom: '1rem',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: {
                              xs: '16px',
                              md: '20px',
                              color: 'black',
                            },
                          }}
                        >
                          {t('quantity')}:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            marginInline: '5px',
                            fontSize: {
                              xs: '16px',
                              md: '22px',
                              color: 'black',
                            },
                          }}
                        >
                          {product?.quantity}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
            <Grid item sm={8} xs={6}>
              <Button
                onClick={() => handleTransaction()}
                variant="contained"
                sx={{
                  backgroundColor: '#009688',
                  color: 'white',
                  borderRadius: '7px',
                  ':hover': {
                    backgroundColor: '#009688',
                  },
                }}
              >
                {t('export')}
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ProductOrder;
