import React, { useState } from 'react';
import DeleteAccount from '../../components/e-commers/DeleteAcount';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../redux/CustomerSlice';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { apiRequest } from '../../utils';
import { Alert, Snackbar } from '@mui/material';
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import i18n from "../../../Language/translate";
//to Tranition the message from the end of the page
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteAccountPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const { customer } = useSelector((state) => state.customer);
  const [showMessage, setShowMessage] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  //to delete the customer from the redux and navigate the user to landing page
  const handleCancelMessage = () => {
    setShowMessage(false);
    dispatch(Logout());
    navigate('/');
  };

  const handleDelete = async (password) => {
    try {
      await apiRequest({
        method: 'delete',
        url: `/customers/delete-acount/${customer._id}`,
        data: { password },
        token: customer?.token,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response?.status === 200) {
          setShowMessage(true);
          localStorage.clear();
        } else if (response?.message === 'Invalid password') {
          console.log('first');
          setError('Invalid password.');
          handleOpenSnackbar();
        }
      });
    } catch (error) {
      setError(error.response.data.message);
      handleOpenSnackbar();
    }
  };

  return (
    <div className="delete-account-page">
      <DeleteAccount onDelete={handleDelete} error={error} />
      <div
        className="account-deleted-message"
        style={{ fontSize: '20px', marginLeft: '20px', marginBottom: '20px' }}
      >
        <Dialog
          open={showMessage}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCancelMessage}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle sx={{ fontSize: '25px', fontWeight: 'bold' }}>
            {t("Your account is deleted")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {t("Your Smart Vision account has now been deleted")}.
              <br />
              {t("We are sad to see you leave, and hope you will come back in the future")}.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelMessage}>{t("cancel")}</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeleteAccountPage;
