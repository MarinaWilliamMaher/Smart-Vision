import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleMultipleFilesUpload, setOptionsForTranslate } from '../../utils';
import Loading from '../shared/Loading';
import { TextField, Button, Grid } from '@mui/material';
import { apiRequest } from '../../utils';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Checkbox from '@mui/material/Checkbox';
import { SetCustomer } from '../../redux/CustomerSlice';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
import { useTranslation } from 'react-i18next';
import i18n from '../../../Language/translate';
import axios from 'axios';
import { useEffect } from 'react';
function BookingServiceForm({ socket, setSocket }) {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [images, setImages] = useState([{}]);
  const service = state ? state.service : null;
  const { customer } = useSelector((state) => state.customer);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    ServiceName: service?.title,
    phoneNumber: customer?.phone,
    address: customer?.address,
    description: '',
    images: [{}],
    measuring: false,
  });

  useEffect(() => {
    if (service?.title === "Measuring Service") {
      setFormData((prevData) => ({
        ...prevData,
        measuring: true,
      }));
    }
  }, [service]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      measuring: e.target.checked,
    }));
  };

  const isMeasuringService = service?.title === 'Measuring Service';
  const showCheckbox = !['Delivery services', 'Packing Service'].includes(service?.title);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const translationRes = await axios.request(
        setOptionsForTranslate([formData.description])
      );
      // console.log(translationRes.data);
      const ARdescription = translationRes?.data[0]?.translations[0]?.text;
      const ENdescription = translationRes?.data[0]?.translations[1]?.text;
      console.log(ARdescription, ENdescription);

      const uploadedImages =
        images.length > 0 && (await handleMultipleFilesUpload(images));
      console.log('Uploaded Image URL:', uploadedImages);
      console.log(formData);
      if (uploadedImages) {
        const response = await apiRequest({
          method: 'POST',
          url: '/customers/service',
          data: {
            id: customer._id,
            service: service.title,
            description: ENdescription,
            ARDescription: ARdescription,
            images: uploadedImages,
            phone: formData.phoneNumber,
            address: formData.address,
            measuring: formData.measuring,
          },
          token: customer?.token,
        });
        if (response?.data?.success) {
          const newData = {
            token: localStorage?.getItem('token'),
            ...response.data?.customer,
          };
          dispatch(SetCustomer(newData));
          setFormSubmitted(true);
          socket?.emit('setService', {
            user: customer,
            type: 'addService',
            serviceOrder: response?.data.serviceOrder,
          });
          console.log(response.data);
        } else {
          console.error(response?.message);
        }
      } else {
        const response = await apiRequest({
          method: 'POST',
          url: '/customers/service',
          data: {
            id: customer._id,
            service: service.title,
            description: ENdescription,
            ARDescription: ARdescription,
            phone: formData.phoneNumber,
            address: formData.address,
            measuring: formData.measuring,
          },
          token: customer?.token,
        });
        if (response?.data?.success) {
          const newData = {
            token: localStorage?.getItem('token'),
            ...response.data?.customer,
          };
          dispatch(SetCustomer(newData));
          setFormSubmitted(true);
          socket?.emit('setService', {
            user: customer,
            type: 'addService',
            serviceOrder: response?.data.serviceOrder,
          });
          console.log(response.data);
        } else {
          console.error(response?.message);
        }
      }
    } catch (error) {
      console.error('Failed to submit the form:', error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {customer?._id ? (
        <div>
          {/* {console.log(socket)} */}
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              paddingBottom: '20px',
            }}
          >
            {t('If You Need To Book This Service Fill This Form')} .
          </h2>
          {loading && <Loading />}
          {!formSubmitted && !loading && (
            <form onSubmit={handleSubmit} className="Form">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('Service Name')}
                    variant="outlined"
                    name="ServiceName"
                    value={t(service.title)}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('Phone Number')}
                    variant="outlined"
                    name="phoneNumber"
                    type="tel"
                    value={t(formData.phoneNumber)}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('Address')}
                    variant="outlined"
                    name="address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('Description')}
                    variant="outlined"
                    name="description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </Grid>
              {/* Need Measuring ?  <Checkbox {...label} /> */}
              <Grid container>
                <Grid item xs={12}>
                  <div className="p-2 w-full" style={{ marginTop: '15px' }}>
                    <div className="relative flex justify-items-center gap-2">
                      <label
                        htmlFor="images"
                        className="leading-7 text-sm text-gray-600 mt-1"
                        style={{
                          fontSize: '20px',
                          order: i18n.language === 'ar' ? '2' : '1',
                        }}
                      >
                        {' '}
                        {i18n.language === 'ar' ? (
                          <>
                            {t('uploadFile')}
                            <CloudUploadIcon className="mr-2" />
                          </>
                        ) : (
                          <>
                            <CloudUploadIcon className="mr-2" />
                            {t('uploadFile')}
                          </>
                        )}
                      </label>
                      <input
                        type="file"
                        id="images"
                        name="images"
                        className="uploadBtn file:hidden text-gray-700  w-1/4"
                        style={{
                          backgroundColor: '#3c6e71',
                          color: 'white',
                          order: i18n.language === 'ar' ? '1' : '2',
                        }}
                        onChange={(e) => {
                          setImages(e.target.files);
                        }}
                        multiple
                      />
                    </div>
                  </div>
                </Grid>
                {showCheckbox && (
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginTop: '20px',
                      marginLeft: '10px',
                      fontSize: '20px',
                    }}
                  >
                    {t('Need Measuring ?')}
                    <Checkbox
                      checked={formData.measuring}
                      onChange={handleCheckboxChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                      style={{ color: '#3c6e71' }}
                      disabled={isMeasuringService}
                    />
                  </Grid>
                )}
              </Grid>

              <div
                className="w-full flex justify-center"
                style={{ marginTop: '20px' }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  className="checkoutButton"
                  style={{
                    width: '100%',
                    backgroundColor: '#3c6e71',
                    color: 'white',
                  }}
                >
                  {t('Submit')}
                </Button>
              </div>
            </form>
          )}
          {formSubmitted && (
            <div>
              <p className="text-green-500 mt-3">
                {t('Thank you! We will get in touch with you in a few days')}.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full ">
          <div className="m-auto text-center">
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                paddingBottom: '20px',
              }}
            >
              {t('For booking this service, you need to log in first')}.
            </h2>
            <Link
              to="/login"
              className="btn btn-secondary text-xl font-bold text-white"
            >
              {t('Log in')}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingServiceForm;
