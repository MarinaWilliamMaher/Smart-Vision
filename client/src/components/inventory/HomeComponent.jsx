import { useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Language/translate';
import { apiRequest } from '../../utils';
import { useSelector } from 'react-redux';

const ExpandMore = ({ expand, ...other }) => <IconButton {...other} />;

function HomeComponent({ Allproducts }) {
  // const [displayedOrders, setDisplayedOrders] = useState(1);
  const language = JSON.parse(window?.localStorage.getItem('language'));
  const { t } = useTranslation();
  const { employee } = useSelector((state) => state?.employee);
  const [products, setProducts] = useState(Allproducts);
  const [expandedStates, setExpandedStates] = useState({});

  const handleExpandClick = (orderId) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [orderId]: !prevStates[orderId],
    }));
  };

  const handleDelete = async (productId) => {
    try {
      const response = await apiRequest({
        url: '/products/',
        method: 'DELETE',
        data: { productId },
        token: employee?.token,
      });
      if (response?.data?.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        toast.dismiss();
        toast.success(response?.data?.message);
      } else {
        toast.dismiss();
        toast.error('Failed to delete product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="presenter-products-container"
    >
      {products?.length > 0 ? (
        <Grid item xs={12} sm={10} md={10}>
          <Grid
            container
            spacing={3}
            className="presenter-products"
            align="center"
            justifyContent="center"
          >
            {products.map((product, index) => (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <Card
                  sx={{ maxWidth: 300 }}
                  style={{ backgroundColor: '#eaf4f4' }}
                >
                  <CardHeader />
                  <CardContent
                    style={{
                      marginTop: '-20px',
                      fontWeight: 'bold',
                      fontSize: '18px',
                    }}
                  >
                    {t('name')}:{' '}
                    {language === 'en' ? product.name : product?.ARName}
                  </CardContent>
                  <CardContent style={{ marginTop: '-20px' }}>
                    {t('quantity')}: {product?.quantity}
                  </CardContent>
                  <CardActions
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <IconButton style={{ marginTop: '-20px' }}>
                      <Link to={`/inventory/update/product/${product._id}`}>
                        <EditIcon />
                      </Link>
                    </IconButton>
                    <ExpandMore
                      expand={expandedStates[product._id]}
                      onClick={() => handleExpandClick(product._id)}
                      aria-expanded={expandedStates[product._id]}
                      aria-label="show more"
                      style={{
                        marginLeft: i18n?.language === 'ar' ? 0 : 'auto',
                        marginTop: '-20px',
                      }}
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse
                    in={expandedStates[product?._id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <CardContent sx={{ marginTop: '-20px' }}>
                      <Typography
                        variant="body2"
                        style={{ marginBottom: '5px', fontSize: '15px' }}
                      >
                        {t('Category')}: {t(product.category)}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ marginBottom: '5px', fontSize: '15px' }}
                      >
                        {t('Color')}:{' '}
                        {product?.colors?.map((color) => {
                          return <span>{t(color)} , </span>
                        }) }
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ marginBottom: '5px', fontSize: '15px' }}
                      >
                        {language === 'en'
                          ? product?.description
                          : product?.ARDescription}
                      </Typography>
                      <Typography
                        variant="body2"
                        onClick={() => handleDelete(product?._id)}
                      >
                        <DeleteIcon style={{ color: '#495057' }} />
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            width: '45%',
            border: '2px solid #a8a8a8',
            paddingBlock: '20px',
            marginTop: '2rem',
            borderRadius: '10px',
            color: '#a8a8a8',
          }}
        >
          <p style={{ marginBottom: '12px' }}>{t('thereIsNoProducts')}</p>
          <Link to="/inventory/add/product">
            <Button variant="contained" color="primary">
              {t('add')} {t('products')}
            </Button>
          </Link>
        </div>
      )}
    </Grid>
  );
}
export default HomeComponent;
