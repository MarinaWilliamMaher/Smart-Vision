import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import InputColor from '../Presenter/InputColor';
import { apiRequest, setOptionsForTranslate } from '../../utils';
import { useSelector } from 'react-redux';
const Allcategorys = ['sofa', 'chair', 'bed', 'table'];
const AddProductForm = () => {
  const { t } = useTranslation();
  const { employee } = useSelector((state) => state?.employee);
  const [productData, setProductData] = useState({
    name: '',
    quantity: '',
    description: '',
    category: '',
    colors: [],
  });
  const [colors, setColors] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'quantity' && value < 0) {
      value = 0;
    }

    setProductData({ ...productData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!colors?.length) {
      handleOpenSnackbar();
    } else {
      productData.colors = colors;
      try {
        const translationRes = await axios.request(
          setOptionsForTranslate([productData.name, productData.description])
        );
        //console.log(translationRes?.data);
        const ARName = translationRes?.data[0]?.translations[0]?.text;
        const ENname = translationRes?.data[0]?.translations[1]?.text;
        const ARDescription = translationRes?.data[1]?.translations[0]?.text;
        const ENdescription = translationRes?.data[1]?.translations[1]?.text;
        console.log(ARName, ENname, ARDescription, ENdescription);
        const response = await apiRequest({
          url: '/products/',
          method: 'POST',
          data: {
            ...productData,
            name: ENname,
            ARName: ARName,
            description: ENdescription,
            ARDescription: ARDescription,
          },
          token: employee?.token,
        });
        if (response?.data?.success) {
          setProductData({
            name: '',
            quantity: '',
            description: '',
            category: '',
            colors: [],
          });
          setColors([]);
          toast.dismiss();
          toast.success(t('addSuccessfully'));
          console.log(response);
        } else {
          toast.dismiss();
          toast.error(t('FailedToAddProduct'));
        }
      } catch (error) {
        console.error('Error adding product:', error);
        toast.error(t('FailedToAddProduct'));
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="w-4/5 m-auto py-7 max-w-4xl">
        <Toaster
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
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <label className="mb-2" htmlFor="name">
              {t('productName')} *
            </label>
            <TextField
              fullWidth
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label className="mb-2" htmlFor="Category">
              {t('Category')} *
            </label>
            <Select
              fullWidth
              id="Category"
              name="category"
              onChange={handleChange}
              required
              value={productData.category}
            >
              {Allcategorys.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <label className="mb-2" htmlFor="Quantity">
              {t('quantity')} *
            </label>
            <TextField
              fullWidth
              id="Quantity"
              variant="outlined"
              name="quantity"
              type="number"
              value={productData.quantity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label className="mb-2">{t('Color')} *</label>
            <InputColor colors={colors} setColors={setColors} />
          </Grid>
          <Grid item xs={12}>
            <label className="mb-2" htmlFor="description">
              {t('description')} *
            </label>
            <TextField
              fullWidth
              id="description"
              name="description"
              multiline
              rows={3}
              value={productData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid container style={{ marginTop: '20px' }}>
            <Grid item xs={12} style={{ display: 'flex' }}>
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: '#edede9',
                  color: 'black',
                  margin: 'auto',
                  fontSize: '20px',
                }}
              >
                {t('add')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%', direction: 'ltr' }}
        >
          {t('includeAtLeastOneColor')}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProductForm;
