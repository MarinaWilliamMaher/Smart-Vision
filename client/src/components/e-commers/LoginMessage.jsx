import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@mui/material';
import { t } from "i18next";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LoginMessage({ showLoginMessage, setshowLoginMessage }) {
  const navigate = useNavigate();
  return (
    <Dialog
      open={showLoginMessage}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setshowLoginMessage(false)}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ fontSize: '25px', fontWeight: 'bold' }}>
        {t("Hello there!")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t("Ready to unlock a world of convenience and savings?")}
          <br />
          {t("Log in to your account to browse, shop, and enjoy personalized perks tailored just for you.")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setshowLoginMessage(false)}
          sx={{ marginRight: 'auto' }}
        >
          {t("Cancel")}
        </Button>
        <Button onClick={() => navigate('/login')}>{t("Login")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginMessage;
