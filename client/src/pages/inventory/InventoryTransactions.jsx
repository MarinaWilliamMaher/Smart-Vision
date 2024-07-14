import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../../components/shared/Loading";
import Table from "react-bootstrap/Table";
import "./StyleSheets/InventoryMaterialTransactions.css";
import getTodayDate from "../../utils/dates";
import { t } from "i18next";
import { apiRequest } from "../../utils";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function InventoryTransactions() {
  const language = JSON.parse(window?.localStorage.getItem("language"));
  const todayDate = getTodayDate();
  const { employee } = useSelector((state) => state?.employee);
  const [allTransactions, setallTransactions] = useState(null);
  const [filteredTransactions, setfilteredTransactions] = useState(null);
  const [transactionMethod, settransactionMethod] = useState("All");
  const [type, setType] = useState("Materials");
  const [startDate, setstartDate] = useState("");
  const [endtDate, setendDate] = useState("");
  const [foundTransactions, setfoundTransactions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  //console.log(allTransactions);
  useEffect(() => {
    async function fetchOrderHistory() {
      try {
        const res = await apiRequest({
          url: "/employees/inventory/transaction",
          method: "GET",
          token: employee?.token,
        });
        if (res?.data?.success) {
          setallTransactions(res?.data?.transactions);
          setfilteredTransactions(res?.data?.transactions);
          res?.data?.transactions?.length > 0 && setfoundTransactions(true);
          setIsLoading(false);
        } else {
          toast.error("Failed to get transactions");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchOrderHistory();
  }, []);

  useEffect(() => {
    const filtered = allTransactions?.filter((transaction) => {
      console.log(transaction);
      const isTransactionTypeMatch =
        transactionMethod === "All" ||
        transaction.transaction === transactionMethod;

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
  }, [transactionMethod, startDate, endtDate]);

  //console.log(foundTransactions);

  return (
    <>
      {!isLoading ? (
        <main className="materialTransactionsMain">
          <div
            className="materialTransactionsFilterNavbarItem mt-4"
            style={{ marginBottom: "1.5rem" }}
          >
            <label htmlFor="transactionType">{t("selectType")}:</label>
            <select
              name="transactionType"
              id="transactionType"
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value={"Products"}>{t("products")}</option>
              <option value={"Materials"}>{t("materials")}</option>
            </select>
          </div>
          <h2 className="mb-2">{t(type.toLowerCase())}</h2>
          <div className="materialTransactionsFilterNavbar">
            <div className="materialTransactionsFilterNavbarItem ">
              <label htmlFor="transactionMethod">{t("transactionType")}:</label>
              <select
                name="transactionMethod"
                id="transactionMethod"
                onChange={(e) => settransactionMethod(e.target.value)}
              >
                <option value="All">{t("all")}</option>
                <option value="Export">{t("export")}</option>
                <option value="Import">{t("import")}</option>
              </select>
            </div>
            <div className="materialTransactionsFilterNavbarItem">
              <label htmlFor="startDate">{t("startDate")}:</label>
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
              <label htmlFor="endtDate">{t("endDate")}:</label>
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
                  settransactionMethod("All");
                  setendDate(todayDate);
                  setstartDate(todayDate);
                }}
              >
                <span className="flex mb-1">{t("today")}</span>
              </button>
              <button
                type="submit"
                className="text-xl mx-3 bg-slate-700 hover:bg-slate-800 text-white py-1 px-2 rounded-xl "
                onClick={() => {
                  settransactionMethod("All");
                  setendDate("");
                  setstartDate("");
                }}
              >
                <span className="flex mb-1">{t("clear")}</span>
              </button>
            </div>
          </div>
          <div className="materialTransactionsTableDiv">
            <Table striped bordered hover responsive>
              <thead className="materialTransactionsTableHead">
                <tr>
                  <th>{t("date")}</th>
                  <th>{t("name")}</th>
                  <th>{t("export")}</th>
                  <th>{t("import")}</th>
                </tr>
              </thead>
              <tbody className="materialTransactionsTableBody">
                {filteredTransactions?.map((transaction) => {
                  let transactionType;
                  {
                    type === "Materials"
                      ? (transactionType = transaction?.materials)
                      : (transactionType = transaction?.products);
                  }
                  const isExport = transaction?.transaction === "Export";
                  return transactionType?.map((element, idx) => {
                    {
                      console.log(element);
                    }
                    return (
                      <tr key={idx}>
                        <td className="text-nowrap">
                          {transaction?.createdAt?.substring(0, 10)}
                        </td>
                        <td>
                          {element?.materialName
                            ? language === "en"
                              ? element?.materialName
                              : element?.materialARName
                            : language === "en"
                            ? element?.productName
                            : element?.productARName}
                        </td>
                        <td>{isExport ? element?.quantity : ""}</td>
                        <td>{!isExport ? element?.quantity : ""}</td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </Table>
          </div>
          {!foundTransactions && (
            <div className="materialTransactionsNotfound">
              <p className="m-auto">{t("noTransactionFound")}</p>
            </div>
          )}
        </main>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default InventoryTransactions;
