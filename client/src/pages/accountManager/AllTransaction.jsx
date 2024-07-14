import axios from 'axios';
import React, { useEffect } from 'react';
import TransactionsTable from '../../components/accountManager/TransactionsTable';

function AllTransaction() {
  async function getEmployee() {
    await axios
      .get(`/accounts/`)
      .then((res) => {
        console.log(res?.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    getEmployee();
    // setIsLoading(false);
  }, []);
  return (
    <main>
      <TransactionsTable />
    </main>
  );
}

export default AllTransaction;
