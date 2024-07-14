import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/shared/Loading";
import { Button, FormControlLabel, Switch } from "@mui/material";
import TransactionComponent from "../../components/inventory/TransactionComponent";
const TransactionHistory = () => {
  const [transactiontHistory, setTransactionHistory] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderHistory() {
      try {
        const response = await axios.get(`/employees/material-transactions`);
        setTransactionHistory(response.data.transactions);
        setIsLoading(false);
        console.log(response.data.transactions);
      } catch (error) {
        console.error(
          "Error fetching order history:",
          error.response.data.message
        );
      }
    }

    fetchOrderHistory();
  }, []);

  const toggleHistory = () => {
    setShowOrderHistory((prevShowOrderHistory) => !prevShowOrderHistory);
  };
  return (
    <div>
      {/* <h1>Order History</h1> */}
      <FormControlLabel
        labelPlacement="start"
        label="Material Transaction History"
        control={
          <Switch
            checked={showOrderHistory}
            onChange={toggleHistory}
            color="primary"
          />
        }
        sx={{ marginBottom: "1rem", marginLeft: "5%" }}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <ul>
          {showOrderHistory ? (
            <li>
              {transactiontHistory.length > 0 ? (
                transactiontHistory?.map((transaction, index) => (
                  <TransactionComponent key={index} transaction={transaction} />
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    width: "65%",
                    border: "2px solid",
                    margin: "auto",
                    padding: "20px",
                    marginBottom: "5rem",
                  }}
                >
                  Your order history is empty.
                </p>
              )}
            </li>
          ) : (
            <li>
              {/* <ServiceHistory /> */}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;
