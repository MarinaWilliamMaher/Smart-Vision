import React from "react";
import { Grid } from "@mui/material";
import TransactionMComponent from "../../components/inventory/TransactionMComponent";
import TransactionPPComponent from "../../components/inventory/TransactionPPComponent";

function TransactionsPage() {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="presenter-products-container"
    >
        <Grid item xs={12} sm={10} md={10}>
          <Grid
            container
            spacing={3}
            className="presenter-products"
            align="center"
            justifyContent="center"
          >
            <TransactionMComponent />
          </Grid>
          <hr></hr>
          <Grid
            container
            spacing={3}
            className="presenter-products"
            align="center"
            justifyContent="center"
            style={{ marginTop: "10px" }}
          >
            <TransactionPPComponent/>
          </Grid>
        </Grid>
    </Grid>
  );
}

export default TransactionsPage;
