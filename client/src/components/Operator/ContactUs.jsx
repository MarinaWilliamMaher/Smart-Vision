import { useState, useEffect } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';
function ContactUs({ contactUs }) {
  const { t } = useTranslation();
  const [displayedOrders, setDisplayedOrders] = useState(1);
  const handleShowMore = () => {
    setDisplayedOrders(contactUs?.length);
  };

  return (
    <>
      {contactUs.length > 0 ? (
        <Grid
          container
          className="order-container"
          sx={{ marginBottom: '2rem' }}
        >
          <Grid
            item
            xs={10}
            sm={10}
            md={7}
            sx={{
              margin: 'auto',
              border: '2px solid #ddd',
              borderRadius: '10px',
            }}
          >
            <Grid
              container
              sx={{
                borderBottom: '2px solid #ddd',
                borderStartEndRadius: '10px',
                borderStartStartRadius: '10px',
                padding: '10px 40px',
                backgroundColor: '#f2f2f2',
                alignItems: 'center',
              }}
            >
              <Grid
                item
                xs={6}
                sx={{
                  textAlign: { xs: 'start' },
                  padding: '10px 0px',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '16px', md: '20px' },
                  }}
                >
                  {t('Customers Problems')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'flex-end' },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    marginRight: '1rem',
                    fontSize: { xs: '16px', md: '20px' },
                  }}
                >
                  {t('Total Problems')}:{' '}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: '16px', md: '19px' } }}
                >
                  {contactUs.length}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                borderTop: 'none',
                padding: '20px',
              }}
            >
              {contactUs.slice(0, displayedOrders).map((contact, index) => (
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
                  <Grid container spacing={4}>
                    {contact.picture != null && (
                      <Grid item xs={12} sm={5}>
                        <img
                          src={contact.picture}
                          style={{
                            width: '100%',
                            height: '150px',
                            border1Radius: '5px',
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={7} sm={7}>
                      <Typography
                        variant="body2"
                        style={{ marginTop: '1rem', fontSize: '20px' }}
                      >
                        <span style={{ fontWeight: 'bold' }}>
                          {t('Customer Name')} :
                        </span>{' '}
                        {t(contact?.name)}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ marginTop: '1rem', fontSize: '20px' }}
                      >
                        <span style={{ fontWeight: 'bold' }}>
                          {t('Phone Number')} :
                        </span>{' '}
                        0{t(contact?.phone)}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ marginTop: '1rem', fontSize: '20px' }}
                      >
                        <span style={{ fontWeight: 'bold' }}>
                          {t('Date Placed')}:
                        </span>{' '}
                        {contact?.createdAt
                          .substring(0, 10)
                          .split('-')
                          .reverse()
                          .join('-')}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ marginTop: '1rem', fontSize: '20px' }}
                      >
                        <span style={{ fontWeight: 'bold' }}>
                          {t('Message')}:
                        </span>{' '}
                        {contact.message}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              {contactUs?.length > displayedOrders && (
                <Grid container justifyContent="end">
                  <Typography
                    variant="body2"
                    style={{
                      cursor: 'pointer',
                      fontSize: '19px',
                      textDecoration: 'underline',
                    }}
                    onClick={handleShowMore}
                  >
                    {t('Show All')}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <p
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            width: '65%',
            border: '2px solid',
            margin: 'auto',
            padding: '20px',
            marginBottom: '5rem',
          }}
        >
          {t('there is no problems at this moment')}.
        </p>
      )}
    </>
  );
}

export default ContactUs;
