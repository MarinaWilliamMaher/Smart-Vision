import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/shared/Loading';
import Table from 'react-bootstrap/Table';
import getTodayDate from '../../utils/dates';

function TransactionsTable() {
  const todayDate = getTodayDate();
  const [allTransactions, setallTransactions] = useState(null);
  const [filteredTransactions, setfilteredTransactions] = useState(null);
  const [transactionType, settransactionType] = useState('All');
  const [startDate, setstartDate] = useState('');
  const [endtDate, setendDate] = useState('');
  const [foundTransactions, setfoundTransactions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log(allTransactions);
  async function getTransactions() {
    try {
      await axios
        .get(`/accounts/`)
        .then((res) => {
          setallTransactions(res?.data?.transaction);
          setfilteredTransactions(res?.data?.transaction);
          res?.data?.transaction?.length > 0 && setfoundTransactions(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    const filtered = allTransactions?.filter((transaction) => {
      const isTransactionTypeMatch =
        transactionType === 'All' ||
        transaction.transaction === transactionType;

      if (startDate && endtDate) {
        const isDateRangeMatch =
          transaction?.createdAt?.substring(0, 10) >= startDate &&
          transaction?.createdAt?.substring(0, 10) <= endtDate;
        return isTransactionTypeMatch && isDateRangeMatch;
      }
      return isTransactionTypeMatch;
    });
    filtered?.length > 0
      ? setfoundTransactions(true)
      : setfoundTransactions(false);
    setfilteredTransactions(filtered);
  }, [transactionType, startDate, endtDate]);
  return (
    <>
      {!isLoading ? (
        <main className="materialTransactionsMain">
          <h2>Transactions</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat necessitatibus expedita repudiandae vero dignissimos delectus quae, vitae quia laudantium, dolorum culpa facere vel modi quod accusantium aliquam. Quos, facilis laborum!
          Necessitatibus a aperiam, alias eum asperiores ipsam molestias quas nisi assumenda ab ut nam saepe esse molestiae neque, facere porro, soluta modi facilis? Omnis reprehenderit aperiam iste sequi, harum perferendis?
          Iure ipsum laboriosam facere fuga cum sit illum soluta esse dolorum perferendis similique provident voluptatem, et doloribus officia ullam fugit doloremque dolor, iste autem natus deleniti eum commodi. Sed, modi.
          Minima, quo reprehenderit? Aliquid accusantium ipsam vero accusamus. Eligendi quisquam ipsam ipsum repudiandae eos, odio quidem itaque, temporibus cumque, ducimus exercitationem impedit rerum iusto fuga et repellendus saepe numquam quod?
          Doloribus placeat eius veniam harum aperiam pariatur totam deleniti sed. Consequuntur qui cum error perferendis corporis inventore accusantium ipsa a repellendus reiciendis earum laudantium, at eaque maxime odio vitae? Doloremque?</p>
          <div className="materialTransactionsFilterNavbar">
            <div className="materialTransactionsFilterNavbarItem">
              <label htmlFor="transactionType">Transaction Type:</label>
              <select
                name="transactionType"
                id="transactionType"
                onChange={(e) => settransactionType(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Export">Export</option>
                <option value="Import">Import</option>
              </select>
            </div>
            <div className="materialTransactionsFilterNavbarItem">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                className="materilaTransactionSelectTransactionType"
                max={todayDate}
                value={startDate}
                onChange={(e) => setstartDate(e.target.value)}
              />
            </div>
            <div className="materialTransactionsFilterNavbarItem">
              <label htmlFor="endtDate">End Date:</label>
              <input
                type="date"
                id="endtDate"
                value={endtDate}
                max={todayDate}
                onChange={(e) => setendDate(e.target.value)}
              />
            </div>
            <div className="materialTransactionsFilterNavbarbuttons">
              <button
                type="submit"
                className="text-xl bg-slate-700 hover:bg-slate-800 text-white py-1 px-2 rounded-xl "
                onClick={() => {
                  settransactionType('All');
                  setendDate(todayDate);
                  setstartDate(todayDate);
                }}
              >
                <span className="flex mb-1">Today</span>
              </button>
              <button
                type="submit"
                className="text-xl ml-3 bg-slate-700 hover:bg-slate-800 text-white py-1 px-2 rounded-xl "
                onClick={() => {
                  settransactionType('All');
                  setendDate('');
                  setstartDate('');
                }}
              >
                <span className="flex mb-1">Clear</span>
              </button>
            </div>
          </div>
          <div className="materialTransactionsTableDiv">
            <Table striped bordered hover responsive>
              <thead className="materialTransactionsTableHead">
                <tr>
                  <th>Date</th>
                  <th>Details</th>
                  <th>Export</th>
                  <th>Import</th>
                </tr>
              </thead>
              <tbody className="materialTransactionsTableBody">
                {filteredTransactions?.map((transaction,idx) => {
                  const isExport = transaction?.transaction === 'Export';
                  const day = transaction?.createdAt?.substring(8, 10);
                  const month = transaction?.createdAt?.substring(0, 10);
                  const year = transaction?.createdAt?.substring(0, 4);
                  return (
                    <tr key={idx}>
                      <td className="text-nowrap">
                        {`${day}` }
                      </td>
                      <td>{transaction?.name}</td>
                      {/* <td>{isExport ? element?.quantity : ''}</td>
                        <td>{!isExport ? element?.quantity : ''}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {!foundTransactions && (
            <div className="materialTransactionsNotfound">
              <p className="m-auto">No transaction found.</p>
            </div>
          )}
        </main>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default TransactionsTable;
