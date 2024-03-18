import React, { useEffect, useState, useContext } from "react";
import { getTransactions } from "../../Api/transactions";
import Transaction from "./Transaction";
import FallbackLoading from "../loader/FallbackLoading";
import { AuthContext } from "../../context/ContextProvider";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const Transactions = () => {
  const { wallet } = useContext(AuthContext);
  const [transactions, setTransactions] = useState(null);
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        if (!res.error) {
          const updatedTransactions = res.map((transaction) => {
            const dateTime = new Date(transaction.createdAt);
            const date = dateTime.toLocaleDateString();
            const time = dateTime.toLocaleTimeString();
            return { ...transaction, date, time };
          });
          setTransactions(updatedTransactions);
          console.log(updatedTransactions);
          console.log("I updated the transaction");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching Transactions: ", error);
      }
    };
    fetchTransactions();
  }, []);
  return (
    <div>
      <div className=" dark:bg-gray-900 dark:text-black text-gray-600 h-screen flex pt-[70px] overflow-hidden text-sm">
        <div className="flex-grow overflow-hidden h-full flex flex-col">
          <div className="flex-grow bg-green-500 flex overflow-x-hidden">
            <div className="flex-grow  dark:bg-gray-900 overflow-y-auto">
              <div className="sm:px-7 sm:pt-7 px-4 p-2 flex flex-col w-full border-b border-gray-200  dark:bg-gray-900 dark:text-black dark:border-gray-800 sticky top-0">
                <div className="flex w-full items-center">
                  <div className="flex items-center text-3xl  text-white">
                    {userData && (
                      <div className="flex items-center">
                        <img
                          src={`${BASE_URL}/${userData.imageUrl}`}
                          className="w-12 h-12 mr-4 rounded-full"
                          alt="profile"
                          style={{ borderRadius: "50%" }}
                        />
                        <span>{userData.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-auto sm:flex hidden items-center justify-end">
                    <div className="text-right">
                      <div className="text-xs text-gray-400 dark:text-gray-400">
                        Account balance:
                      </div>
                      <div className="text-white text-lg dark:text-black">
                        {wallet}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:p-7 p-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        S.No.
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        Method
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        To Whom
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">
                        Source
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">
                        Destination
                      </th>
                      <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">
                        Seats
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        Amount
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden sm:table-cell">
                        Date
                      </th>
                    </tr>
                    {transactions &&
                      transactions.map((transaction, index) => (
                        <Transaction
                          key={index}
                          serialNumber={index + 1}
                          method="Card"
                          toWhom={transaction.driverName}
                          from={transaction.source}
                          to={transaction.destination}
                          seats={transaction.seats}
                          amount={transaction.amountPaid}
                          date={transaction.date}
                          time={transaction.time}
                          rideCancelled={transaction.rideCancelled}
                        />
                      ))}
                  </thead>
                </table>
                {loading && <FallbackLoading />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
