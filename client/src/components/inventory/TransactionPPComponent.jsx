import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../utils';
import {
  Grid,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { t } from 'i18next';

function TransactionPPComponent() {
  const [transactions, setTransactions] = useState([]);
  const { employee } = useSelector((state) => state.employee);
  const [products, setProducts] = useState([{ product: '', quantity: '' }]);
  const newProductNameRef = useRef(null);
  const newProductQuantityRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    products: [],
    newProductName: '',
    newProductQuantity: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/products/`);
        setAllProducts(response.data.products);
        console.log(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const selectedProductsData = orderDetails.products.map(
      (selectedProduct) => {
        const product = allProducts.find(
          (product) => product.name === selectedProduct.product
        );
        return {
          _id: product?._id,
          productName: product?.name,
          productARName: product?.ARName,
          quantity: selectedProduct.quantity,
        };
      }
    );
    setProducts(selectedProductsData);
    setTransactions(selectedProductsData);
  }, [allProducts, orderDetails.products]);

  const addProduct = () => {
    const { newProductName, newProductQuantity } = orderDetails;
    if (newProductName && newProductQuantity) {
      const existingProductIndex = orderDetails.products.findIndex(
        (product) => product.materialName === newProductName
      );
      if (existingProductIndex !== -1) {
        const updatedProducts = [...orderDetails.products];
        updatedProducts[existingProductIndex].quantity +=
          parseInt(newProductQuantity);
        setOrderDetails({
          ...orderDetails,
          products: updatedProducts,
          newProductName: '',
          newProductQuantity: '',
        });
      } else {
        setOrderDetails({
          ...orderDetails,
          products: [
            ...orderDetails.products,
            {
              product: newProductName,
              quantity: parseInt(newProductQuantity),
            },
          ],
          newProductName: '',
          newProductQuantity: '',
        });
      }
      newProductNameRef.current.value = '';
      newProductQuantityRef.current.value = '';
      newProductNameRef.current.blur();
      newProductQuantityRef.current.blur();
    }
  };

  const handleTransaction = async (method) => {
    const hasNullQuantity = products.some(
      (product) => product.quantity === null || product.quantity === ''
    );
    if (hasNullQuantity) {
      toast.error(t('fillAllQuantities'));
      return;
    }
    try {
      const managerId = employee._id;
      console.log(transactions);
      const response = await apiRequest({
        method: 'put',
        url: '/products/transaction',
        data: {
          managerId,
          products: products,
          method,
        },
      });
      if (response.data.success) {
        toast.success(t('Successful Transaction'));
        setTransactions([]);
        setOrderDetails({
          products: [],
          newProductName: '',
          newProductQuantity: '',
        });
      } else {
        toast.error(t('FailedTryAgain'));
      }
    } catch (error) {
      console.error('Error making transaction:', error);
      toast.error(t('FailedTryAgain'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (orderDetails.newProductName.trim() !== '') {
        addProduct();
      }
    }
  };

  const removeProduct = (index) => {
    const products = [...orderDetails.products];
    products.splice(index, 1);
    setOrderDetails({ ...orderDetails, products });
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="presenter-products-container"
      spacing={2}
    >
      {console.log(products)}
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
      <Grid item xs={12}>
        <Typography
          variant="h5"
          style={{
            padding: '20px 0px',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          {t('products')}:
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <Autocomplete
          options={allProducts}
          getOptionLabel={(option) => option.name}
          id="combo-box-demo"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t('name')}
              type="text"
              name="newProductName"
              inputRef={newProductNameRef}
              value={orderDetails.newProductName}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                orderDetails.newProductName.trim() !== '' &&
                newProductQuantityRef.current.focus()
              }
            />
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setOrderDetails({
                ...orderDetails,
                newProductName: newValue.name,
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          type="number"
          placeholder={t('quantity')}
          name="newProductQuantity"
          inputRef={newProductQuantityRef}
          value={orderDetails.newProductQuantity}
          onChange={handleChange}
          onKeyDown={handleQuantityKeyDown}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <Button fullWidth onClick={addProduct} style={{ marginTop: '10px' }}>
          {t('add')}
        </Button>
      </Grid>
      {orderDetails.products.length > 0 && (
        <Grid item xs={12}>
          <List
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              paddingTop: '0px',
            }}
          >
            {orderDetails.products.map((product, index) => (
              <ListItem key={index} style={{ paddingBottom: '0px' }}>
                <ListItemText primary={product.product} />
                <ListItemText secondary={product.quantity} />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeProduct(index)}
                >
                  <DeleteForeverIcon
                    sx={{ fontSize: '32px' }}
                    style={{ marginRight: '3vw' }}
                  />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          style={{
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleTransaction('Export')}
            style={{ backgroundColor: '#edede9', color: 'black' }}
          >
            {t('export')}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTransaction('Import')}
            style={{
              marginInline: '70px',
              backgroundColor: '#edede9',
              color: 'black',
            }}
          >
            {t('import')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TransactionPPComponent;
