"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NotFoundImage from "/assets/scopefinding.png";

export default function AccountDrawer({ account, open, onClose }) {
  const [transactions, setTransactions] = useState([]);


  console.log(account);

  // Fetch transactions based on selected account
  useEffect(() => {
    if (!account?.Id) return;

    console.log(account.Id)

    fetch(
      `${import.meta.env.VITE_APP_FIN_URL}/api/values/GeneralLedgerTransactions?chartOfAccountId=${account.Id}`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.PageCollection) setTransactions(data.PageCollection);
      })
      .catch((err) => console.error(err));
  }, [account]);

  // Calculate totals
  const totalDebit = transactions.reduce((sum, t) => sum + t.Debit, 0);
  const totalCredit = transactions.reduce((sum, t) => sum + t.Credit, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-5 right-5 rounded-xl w-180 bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="font-bold text-lg">
                {account?.Description || "Account Details"}
              </h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* 🔹 Compact Account Overview Card */}
              {account && (
                <Card className="rounded-2xl shadow-lg bg-indigo-600 text-white p-4 space-y-6">
                  {/* Card & Balance Section */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Fake Card Preview */}
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl p-6 w-100 text-white shadow-inner ">
                      <div className="mb-6 flex justify-between">
                        <div className="w-12 h-8 bg-indigo-400 px-2 rounded-md flex items-center justify-center"> 
                        </div>
                        <div>Code {account.Code || "XXXX"}</div>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm">Balance amount</p>
                        <p className="text-3xl font-bold">
                          {account.Balance.toLocaleString("en-US", {
                            style: "currency",
                            currency: "Ksh",
                          })}
                        </p>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-400">Debit</p>
                          <p className="font-semibold">
                            {totalDebit.toLocaleString("en-US", {
                              style: "currency",
                              currency: "Ksh",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Credit</p>
                          <p className="font-semibold">
                            {totalCredit.toLocaleString("en-US", {
                              style: "currency",
                              currency: "Ksh",
                            })}
                          </p>
                        </div>
                      </div>  
                    </div>




                    

                    {/* Available Amount */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <p className="text-gray-100 text-sm">Description</p>
                        <p className="text-3xl font-bold">
                          {account.Description}
                        </p>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-100">Category</p>
                          <p className="font-semibold">
                            {account.CategoryDescription}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </Card>
              )}


              {/* Transactions Table */}
              <div className="mt-4 ">
                <h3 className="font-semibold mb-2">Transactions</h3>
                <Table className="text-center bg-indigo-700">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center text-gray-50">Date</TableHead>
                      <TableHead className="text-center text-gray-50">Description</TableHead>
                      <TableHead className="text-center text-gray-50">Debit</TableHead>
                      <TableHead className="text-center text-gray-50">Credit</TableHead>
                      <TableHead className="text-center text-gray-50">Balance</TableHead>
                      <TableHead className="text-center text-gray-50">Bal Account</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length > 0 ? (
                      transactions.map((tx, i) => (
                        <TableRow
                          key={tx.Id}
                          className={i % 2 === 0 ? "bg-indigo-100" : "bg-white"}
                        >
                          <TableCell>
                            {new Date(
                              tx.JournalValueDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {tx.JournalPrimaryDescription}
                          </TableCell>
                          <TableCell>{tx.Debit.toLocaleString()}</TableCell>
                          <TableCell>{tx.Credit.toLocaleString()}</TableCell>
                          <TableCell>
                            {tx.RunningBalance.toLocaleString()}
                          </TableCell>
                          
                          <TableCell>
                            {tx.ContraGLAccountDescription}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-2 text-gray-500 bg-gray-200 w-full"
                        >           
                          <div className="text-gray-500 text-center mt-4">
                            <img
                              src={NotFoundImage}
                              alt="Not Found"
                              className="mx-auto w-42 h-auto"
                            />
                            <p className="font-medium text-gray-400"> No transactions found. </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}





