import { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";

function TransactionComponent({ transaction }) {
  const [showOrder, setShowOrder] = useState(false);

  const toggleOrder = () => {
    setShowOrder(!showOrder);
  };
  const calculateTotalMaterials = () => {
    let totalItems = 0;
    transaction?.materials.map((material) => {
      // console.log(product.quantity);
      totalItems += material?.quantity || 1;
    });
    return totalItems;
  };
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const date = new Date(transaction?.createdAt);
    const formatted = date.toLocaleDateString();
    setFormattedDate(formatted);
  }, [transaction?.createdAt]);
  return (
    <Grid container className="order-container" sx={{ marginBottom: "2rem" }}>
      <Grid
        item
        xs={11}
        sm={8}
        md={7}
        sx={{ margin: "auto", border: "2px solid #ddd", borderRadius: "10px" }}
      >
        <Grid
          container
          sx={{
            borderBottom: showOrder ? "2px solid #ddd" : "none",
            borderStartEndRadius: "10px",
            borderStartStartRadius: "10px",
            padding: "20px",
            backgroundColor: "#f2f2f2",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={6}
            md={4}
            lg={3}
            sx={{ marginBottom: { xs: "1.5rem", md: "0rem" } }}
          >
            <Typography variant="body1">Date Placed</Typography>
            <Typography variant="body2">
              {transaction.createdAt
                .substring(0, 10)
                .split("-")
                .reverse()
                .join("-")}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            md={4}
            lg={3}
            sx={{
              textAlign: { xs: "end", md: "center" },
              marginBottom: { xs: "1.5rem", md: "0rem" },
            }}
          >
            <Typography variant="body1">Transaction Type</Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: { xs: "end", md: "center" } }}
            >
              {transaction?.transaction}
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            md={4}
            lg={3}
            sx={{ textAlign: { xs: "start", md: "center" } }}
          >
            <Typography variant="body1">
              Total {transaction?.transaction} Materials
            </Typography>
            <Typography variant="body2">{calculateTotalMaterials()}</Typography>
          </Grid>
          <Grid
            item
            xs={4}
            md={4}
            lg={3}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "flex-end",
                md: "flex-start",
                lg: "flex-end",
              },
              marginTop: { md: "1.7rem", lg: "0rem" },
            }}
          >
            <Button
              onClick={toggleOrder}
              variant="contained"
              sx={{
                backgroundColor: "#009688",
                color: "white",
                borderRadius: "5px",
                ":hover": {
                  backgroundColor: "#009688",
                },
              }}
            >
              {showOrder ? "close" : "Details"}
            </Button>
          </Grid>
        </Grid>
        {showOrder && (
          <Grid
            container
            item
            sx={{
              borderTop: "none",
              padding: "20px",
            }}
          >
            {/* {console.log(order)} */}
            {transaction?.materials?.map((material, index) => (
              <Grid
                key={index}
                item
                xs={12}
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "20px",
                  padding: "20px",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid
                      item
                      container
                      sx={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                        variant="body1"
                        sx={{
                          display: "flex",
                          justifyContent: {xs:"center",md:"flex-start"},
                          color: "black",
                          marginBottom: "1rem",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: {
                              xs: "16px",
                              md: "20px",
                              color: "black",
                            },
                          }}
                        >
                          Material Name:{" "}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: { xs: "16px", md: "20px" } }}
                        >
                          {material?.material?.name}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        variant="body1"
                        sx={{
                          display: "flex",
                          justifyContent: {xs:"center",md:"flex-end"},
                          marginBottom: "1rem",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: {
                              xs: "16px",
                              md: "20px",
                              color: "black",
                            },
                          }}
                        >
                          {transaction?.transaction} Quantity: {"   "}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: { xs: "16px", md: "22px" ,color:"black"} }}
                        >
                          {material?.quantity}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={12}
                        variant="body1"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: { md: "auto" },
                        }}
                      >
                        <Typography variant="body1" sx={{}}>
                          Remaining Quantity :{" "}
                        </Typography>
                        <Typography
                          variant="body2"
                          // sx={{ fontSize: { xs: "16px", md: "19px" } }}
                        >
                          {material?.material?.quantity}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            ></Grid>
            <Grid
              xs={12}
              item
              sx={{ display: "flex", justifyContent: "flex-end", color: "red" }}
            >
              {" "}
              <Typography xs={12}>{}</Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default TransactionComponent;
