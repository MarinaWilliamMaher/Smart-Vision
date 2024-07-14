import { useState } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import getTodayDate from '../../utils/dates';
import AddReview from './AddReview';
import Reviews from './Reviews';
import { apiRequest } from '../../utils';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
function OrderComponent({ order, reviews, setReviews }) {
  const language = JSON.parse(window?.localStorage.getItem('language'));
  const { t } = useTranslation();
  console.log(order);
  const [showOrder, setShowOrder] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState(order);
  const [deleteMessage, setDeletemessage] = useState(null);
  const { customer } = useSelector((state) => state.customer);
  const [showAddReviewToProductId, setshowAddReviewToProductId] =
    useState(null);
    const [isExpanded, setIsExpanded] = useState({}); 
  const toggleOrder = () => {
    setShowOrder(!showOrder);
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: '/customers/order',
        data: {
          id: customer._id,
          orderId: orderId,
        },
        token: customer?.token,
      });
      if (response.status === 200) {
        setUpdatedOrder(response.data.order);
        // console.log(response.data);
      } else {
        setDeletemessage(response?.message);
      }
    } catch (error) {
      // console.error("Error cancelling order:", error.response.data.message);
      setDeletemessage(error.response.data.message);
    }
  };

  function addReviewToProduct(productId, showToProductID) {
    if (productId === showToProductID) {
      return true;
    }
    return false;
  }

  function doNothaveReview(productId) {
    // console.log(AllReviews.some((review) => review?.product === productId));
    return !reviews.some((review) => review?.product === productId);
  }

  function getProductReviews(productId) {
    return reviews
      .filter((review) => review?.product === productId)
      .map((review, idx) => (
        <Reviews
          key={idx}
          review={review}
          customerReview={customer}
          setReviews={setReviews}
        />
      ));
  }
 // Function to truncate text
 const truncateText = (text, length) => {
  if (text?.length <= length) {
    return text;
  }
  return text?.substring(0, length) + '...';
};

// Function to handle the toggling of the description
const handleToggle = (index) => {
  setIsExpanded((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};
  return (
    <Grid container className="order-container" sx={{ marginBottom: '2rem' }}>
      <Grid
        item
        xs={11}
        sm={9}
        md={9}
        lg={7}
        sx={{ margin: 'auto', border: '2px solid #ddd', borderRadius: '10px' }}
      >
        <Grid
          container
          sx={{
            borderBottom: showOrder ? '2px solid #ddd' : 'none',
            borderStartEndRadius: '10px',
            borderStartStartRadius: '10px',
            padding: '20px 30px',
            backgroundColor: '#f2f2f2',
            alignItems: 'center',
          }}
        >
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={3}
            sx={{
              marginBottom: { xs: '1.5rem', md: '0rem' },
              textAlign: {
                xs: 'start',
                // md: "start",
              },
            }}
          >
            <Typography variant="body1">{t('Date Placed')}</Typography>
            <Typography variant="body2">
              {order?.createdAt.substring(0, 10).split('-').reverse().join('-')}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={3}
            sx={{
              textAlign: { xs: 'end', sm: 'center' },
              marginBottom: { xs: '1.5rem', md: '0rem' },
              // marginTop: { xs: '-1.5rem', md: '0rem' },
              // backgroundColor:"red"
            }}
          >
            <Typography variant="body1">{t('Order Number')}</Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: { xs: 'end', sm: 'center' } }}
            >
              {updatedOrder?.orderNumber}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={3}
            sx={{
              textAlign: { xs: 'start', sm: 'end', md: 'center' },
              marginBottom: { xs: '0rem', sm: '1.5rem', md: '0rem' },
            }}
          >
            <Typography variant="body1">{t('Total Amount')}</Typography>
            <Typography variant="body2">{order?.totalPrice}</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sm={12}
            md={3}
            lg={3}
            sx={{
              display: 'flex',
              justifyContent: {
                xs: 'flex-end',
                // md: "end",
              },
            }}
          >
            <Button
              onClick={toggleOrder}
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
              {showOrder ? t('close') : t('Details')}
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
            {/* {console.log(order)} */}
            {order?.products.map((product, index) => (
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
                  <Grid item xs={12} md={4}>
                    <img
                      src={product?.product?.images[0]}
                      alt={product?.product?.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        borderRadius: '5px',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid
                      item
                      container
                      sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'gray',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Grid item xs={12} md={8} variant="body1">
                        <span style={{ color: '' }}>
                          {console.log(product?.product)}
                          {language === 'en'
                            ? product?.product?.name
                            : product?.product?.ARName}
                        </span>
                      </Grid>
                      <Grid
                        item
                        variant="body1"
                        xs={12}
                        md={4}
                        sx={{
                          marginTop: { xs: '1rem', md: '0rem' },
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: { md: 'end' },
                        }}
                      >
                        <span>
                          {product?.product?.price} {t('EGP')}
                        </span>
                      </Grid>
                    </Grid>
                    <Typography
                      variant="body2"
                      style={{ marginTop: '1rem', fontSize: { xs: '10px' } }}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                        {t('Description')}:
                      </span>{' '}
                      {isExpanded[index]
                        ? language === 'en'
                          ? product?.product?.description
                          : product?.product?.ARDescription
                        : truncateText(
                            language === 'en'
                              ? product?.product?.description
                              : product?.product?.ARDescription,
                            170
                          )}
                      {(
                        (language === 'en'
                          ? product?.product?.description
                          : product?.product?.ARDescription
                        )?.length > 170) && (
                        <span
                          onClick={() => handleToggle(index)}
                          style={{ color: 'blue', cursor: 'pointer' }}
                          onMouseOver={(e) =>
                            (e.target.style.textDecoration = 'underline')
                          }
                          onMouseOut={(e) =>
                            (e.target.style.textDecoration = 'none')
                          }
                        >
                          {isExpanded[index] ? t(' show less') : t(' read more')}
                        </span>
                      )}
                    </Typography>
                    <div
                      style={{
                        marginTop: '1rem',
                        fontSize: { xs: '10px' },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                          {t('Quantity')}:
                        </span>{' '}
                        <span style={{ fontSize: '18px' }}>
                          {product?.quantity}
                        </span>
                      </div>{' '}
                      {order?.state?.toLowerCase() === 'delivered' &&
                      doNothaveReview(product?.product?._id) ? (
                        showAddReviewToProductId === product?.product?._id ? (
                          <button
                            type="submit"
                            className=" buttonForReview bg-red-500 hover:bg-red-600 "
                            onClick={() => setshowAddReviewToProductId(null)}
                          >
                            {t('cancel')}
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className=" buttonForReview bg-slate-700 hover:bg-slate-800 fs-6 "
                            onClick={() =>
                              setshowAddReviewToProductId(product?.product?._id)
                            }
                          >
                            {t('Add Review')}
                          </button>
                        )
                      ) : null}
                    </div>
                  </Grid>
                </Grid>
                {product?.product?.reviews &&
                  getProductReviews(product?.product?._id)}
                {doNothaveReview(product?.product?._id)
                  ? addReviewToProduct(
                      product?.product?._id,
                      showAddReviewToProductId
                    ) && (
                      <AddReview
                        productId={showAddReviewToProductId}
                        setReviews={setReviews}
                      />
                    )
                  : null}
              </Grid>
            ))}

            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1" xs={6}>
                <span style={{ fontWeight: 'bold' }}>{t('State')}: </span>{' '}
                {t(updatedOrder?.state?.toLowerCase())}
              </Typography>
              <Typography variant="body1" xs={6}>
                {updatedOrder.state === 'PENDING' &&
                order?.cancelOrderExpiresAt?.substring(0, 10) >=
                  getTodayDate() ? ( //to check if can cancel order
                  <Button
                    onClick={() => {
                      // console.log(order?._id);
                      cancelOrder(order?._id);
                    }}
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
                    {t('Cancel Order')}
                  </Button>
                ) : null}
              </Typography>
            </Grid>
            <Grid
              xs={12}
              item
              sx={{ display: 'flex', justifyContent: 'flex-end', color: 'red' }}
            >
              {' '}
              <Typography xs={12}>{deleteMessage}</Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default OrderComponent;
