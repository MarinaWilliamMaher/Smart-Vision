import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/shared/Loading';
import Table from 'react-bootstrap/Table';
import getTodayDate from '../../utils/dates';
import { Link } from 'react-router-dom';
import { t } from 'i18next';
import { apiRequest } from '../../utils';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

function ProductOrderHistory() {
  const { employee } = useSelector((state) => state?.employee);
  const todayDate = getTodayDate();
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState('orders');
  const [filteredData, setFilteredData] = useState([]);
  const [orderState, setOrderState] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await apiRequest({
          url: `/employees/operator/${dataType}`,
          method: 'GET',
          token: employee?.token,
        });
        if (res?.data?.success) {
          setData(res?.data[dataType]);
        } else {
          toast.dismiss();
          toast.error(`Failed to get ${dataType} history`);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Error fetching ${dataType} history:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dataType]);

  useEffect(() => {
    if (data) {
      let filtered = data.filter((item) =>
        orderState === 'All'
          ? true
          : item.state.toLowerCase() === orderState.toLowerCase()
      );
      if (startDate && endDate) {
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.createdAt.substring(0, 10));
          const start = new Date(startDate);
          const end = new Date(endDate);
          return itemDate >= start && itemDate <= end;
        });
      }
      // Sort filtered data by createdAt
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFilteredData(filtered);
    }
  }, [data, orderState, startDate, endDate]);
  console.log(filteredData);

  return (
    <>
      {!isLoading ? (
        <main className="materialTransactionsMain">
          <h2 style={{ marginBottom: '1rem' }}>{t('history')}</h2>
          <div className="materialTransactionsFilterNavbar">
            <div className="materialTransactionsFilterNavbarItem">
              <label htmlFor="HistoryType">{t('historyType')}:</label>
              <select
                value={dataType}
                id="HistoryType"
                onChange={(e) => setDataType(e.target.value)}
              >
                <option value="orders">{t('Products')}</option>
                <option value="services">{t('Services')}</option>
              </select>
            </div>
            <div className="materialTransactionsFilterNavbarItem">
              <label htmlFor="transactionType">{t('state')}:</label>
              <select
                name="transactionType"
                id="transactionType"
                onChange={(e) => setOrderState(e.target.value)}
                value={orderState}
              >
                <option value="All">{t('All')}</option>
                <option value="Pending">{t('Pending')}</option>
                <option value="Confirmed">{t('Confirmed')}</option>
                <option value="Shipped">{t('Shipped')}</option>
                <option value="Delivered">{t('Delivered')}</option>
                <option value="Canceled">{t('Canceled')}</option>
              </select>
            </div>
            <div className="materialTransactionsFilterNavbarItem">
              <label htmlFor="startDate">{t('startDate')}:</label>
              <input
                type="date"
                id="startDate"
                className="materilaTransactionSelectTransactionType"
                max={todayDate}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="materialTransactionsFilterNavbarItem">
              <label htmlFor="endDate">{t('endDate')}:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                max={todayDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="materialTransactionsFilterNavbarbuttons">
              <button
                type="submit"
                className="text-xl bg-slate-700 hover:bg-slate-800 text-white py-1 px-2 rounded-xl "
                onClick={() => {
                  setOrderState('All');
                  setEndDate(todayDate);
                  setStartDate(todayDate);
                }}
              >
                <span className="flex mb-1">{t('today')}</span>
              </button>
              <button
                type="submit"
                className="text-xl mx-3 bg-slate-700 hover:bg-slate-800 text-white py-1 px-2 rounded-xl "
                onClick={() => {
                  setOrderState('All');
                  setEndDate('');
                  setStartDate('');
                }}
              >
                <span className="flex mb-1">{t('clear')}</span>
              </button>
            </div>
          </div>
          <div className="materialTransactionsTableDiv">
            <Table striped bordered hover responsive>
              <thead className="materialTransactionsTableHead">
                <tr>
                  <th>{t('date')}</th>
                  <th className="text-nowrap w-52">
                    {dataType === 'orders' ? t('orderNumber') : t('Services')}
                  </th>
                  <th>{t('state')}</th>
                  <th className="text-nowrap w-52">{t('customerName')}</th>
                  <th className="text-nowrap w-52">
                    {dataType === 'orders' ? t('Total Price') : t('Engineer')}
                  </th>
                  <th className="text-nowrap w-52">{t('details')}</th>
                </tr>
              </thead>
              <tbody className="materialTransactionsTableBody">
                {filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-nowrap">
                      {item.createdAt?.substring(0, 10)}
                    </td>
                    <td>
                      {dataType === 'orders' ? item.orderNumber : item.service}
                    </td>
                    <td>{t(item.state.toLowerCase())}</td>
                    <td>
                      {dataType === 'orders'
                        ? item.customerData?.firstName +
                          ' ' +
                          item.customerData?.lastName
                        : item.customer?.username || 'Unknown'}{' '}
                    </td>
                    <td>
                      {dataType === 'orders'
                        ? item?.totalPrice
                        : item?.assignedEngineer?.username}
                    </td>
                    <td>
                      {dataType === 'orders' ? (
                        <>
                          <Link to={`/operator/order-details/${item._id}`}>
                            <button style={{ textDecoration: 'underline' }}>
                              {t('details')}
                            </button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/operator/servise-details/${item._id}?from=Servishistory`}
                          >
                            <button style={{ textDecoration: 'underline' }}>
                              {t('details')}
                            </button>
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {!filteredData.length && (
            <div className="materialTransactionsNotfound">
              <p className="m-auto">No {dataType} found.</p>
            </div>
          )}
        </main>
      ) : (
        <div className="h-96">
          <Loading />
        </div>
      )}
    </>
  );
}

export default ProductOrderHistory;
