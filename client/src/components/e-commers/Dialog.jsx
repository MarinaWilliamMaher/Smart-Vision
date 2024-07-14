import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AlertDialog({ open, onClose, products, msg }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {products ? t("Unavailable Products") : t("Unavailable Time")}
      </DialogTitle>
      <DialogContent>
        <Typography style={{ textTransform: "capitalize" }}>{msg}</Typography>
        {/* {products && (
          <ul>
            {products?.map((product) => (
              <li key={product._id}>{product.name}</li>
            ))}
          </ul>
        )} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("OK")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
