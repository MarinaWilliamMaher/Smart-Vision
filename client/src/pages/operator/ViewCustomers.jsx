import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../components/shared/Loading";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CustomerCard from "../../components/Operator/CustomerCard";

function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Display, setDisplay] = useState("none");
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/employees/getCustomers");
        console.log("API response:", response.data.customers);
        setCustomers(response.data.customers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error.response.data.message);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center">
      {" "}
      {isLoading ? (
        <Grid item>
          <Loading />
        </Grid>
      ) : customers.length > 0 ? (
        <Grid container xs={12} sm={10} md={10}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              style={{
                marginBottom: "3rem",
              }}
            >
              View All Customers 
            </Typography>
          </Grid>
          <Grid
            container
            spacing={3}
            align="center"
            sx={{ justifyContent: { xs: "center", md: "space-evenly" } }}
          >
            {customers.map((customer, index) => (
              <Grid item key={index}>
                <CustomerCard customer={customer} />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              height: 50,
              transform: "translateZ(0px)",
              flexGrow: 1,
              position: "fixed",
              bottom: 40,
              right: 20,
            }}
          >
            <span
              style={{
                position: "relative",
                right: 75,
                bottom: 5,
                display: Display,
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "12px",
                backgroundColor: "rgba(0, 0, 0,0.6)",
              }}
            >
              {" "}
              Add New Customer
            </span>
            <Link to={"/operator/add-customer"}>
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: "fixed", bottom: 14, right: 16 }}
                icon={<SpeedDialIcon />}
                direction="up"
                open={false}
                onMouseOver={() => setDisplay("inline")}
                onMouseLeave={() => setDisplay("none")}
              ></SpeedDial>
            </Link>
          </Box>
        </Grid>
      ) : (
        <Grid item xs={12} sm={8}>
          <Typography variant="h5" align="center" gutterBottom>
            There's No Customers
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default ViewCustomers;
