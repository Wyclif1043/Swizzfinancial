

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccountDrawer from "./AccountDrawer";
import AddAccountDrawer from "./AddAccountDrawer";
import NotFoundImage from "/assets/scopefinding.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Accounts");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const [loading, setLoading] = useState(true); // ✅ Loading state

  const itemsPerPage = 10;
  const tableContainerRef = useRef(null);

  const categories = [
    "All Accounts",
    ...Array.from(new Set(accounts.map((acc) => acc.TypeDescription).filter(Boolean))),
  ];

  const fetchAccounts = () => {
    setLoading(true); // ✅ start loading
    fetch(`${import.meta.env.VITE_APP_FIN_URL}/api/values/GetGeneralLeadgersBalances`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.Success) {
          setAccounts(data.Data);
          setFilteredAccounts(data.Data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); // ✅ end loading
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    let results = accounts;

    if (selectedCategory !== "All Accounts") {
      results = results.filter((acc) => acc.TypeDescription === selectedCategory);
    }



    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      results = results.filter(
        (acc) =>
          acc.Description?.toLowerCase().includes(search) ||
          acc.Name?.toLowerCase().includes(search) ||
          String(acc.Code).includes(search)
      );
    }

    setFilteredAccounts([...results]);
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, accounts]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedData = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowClick = (acc) => {
    setActiveRowId(acc.Id);
    setSelectedAccount(acc);
    setDrawerOpen(true);
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const title = `Chart of Accounts - ${selectedCategory}`;
    const date = new Date().toLocaleString();

    doc.setFontSize(14);
    doc.text(title, 14, 15);

    doc.setFontSize(9);
    doc.text(`Generated on: ${date}`, 14, 22);

    const tableData = filteredAccounts.map((acc) => [
      new Date(acc.CreatedDate).toLocaleDateString(),
      acc.Code,
      acc.Description,
      acc.TypeDescription,
      acc.Balance.toLocaleString("en-US", {
        style: "currency",
        currency: "KES",
      }),
    ]);

    autoTable(doc, {
      startY: 28,
      head: [["Date", "Code", "Description", "Type", "Balance"]],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo
        textColor: 255,
      },
      columnStyles: {
        4: { halign: "right" },
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save(`Chart_of_Accounts_${selectedCategory}.pdf`);
  };



  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r p-4">
        <h3 className="font-bold text-white mb-4 bg-indigo-700 px-4 py-3 rounded-lg">
          Account Types
        </h3>
        <div className="space-y-3 overflow-y-auto h-[calc(100vh-100px)] bg-gray-200 p-3 rounded-lg">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-300 rounded animate-pulse"
              />
            ))
            : categories.map((cat) => (
              <Card
                key={cat}
                className={`cursor-pointer border ${selectedCategory === cat
                  ? "bg-blue-700 shadow-md"
                  : "hover:shadow-sm"
                  }`}
                onClick={() => setSelectedCategory(cat)}
              >
                <CardContent className="p-3">
                  <p
                    className={`font-bold ${selectedCategory === cat ? "text-gray-100" : "text-gray-800"
                      }`}
                  >
                    {cat}
                  </p>
                  <p
                    className={`text-xs ${selectedCategory === cat ? "text-gray-100" : "text-gray-500"
                      }`}
                  >
                    {cat === "All Accounts"
                      ? accounts.length
                      : accounts.filter((acc) => acc.TypeDescription === cat).length}{" "}
                    accounts
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b">
          <h2 className="text-lg font-bold">{selectedCategory}</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            )}

            <Button
              className="bg-red-600 text-white hover:text-white hover:bg-red-400"
              variant="outline"
              onClick={handlePrintPDF}
            >
              PDF
            </Button>



            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setAddDrawerOpen(true)}
            >
              Add Chart Of Account
            </Button>
          </div>

        </div>

        {/* Account table */}
        <div
          ref={tableContainerRef}
          className="flex-1 overflow-y-auto p-8 bg-gray-200 relative z-0"
        >
          {/* Table Header */}
          <div className="flex font-semibold text-gray-200 text-sm px-4 py-2 bg-indigo-700 rounded-md">
            <div className="w-28">Date</div>
            <div className="w-24">Code</div>
            <div className="flex-1">Description</div>
            <div className="w-40">Type</div>
            <div className="w-32 text-right">Balance</div>
          </div>

          {/* Table Rows */}
          <div className="mt-3 space-y-3">
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center rounded-lg px-4 py-3 bg-gray-300 animate-pulse"
                >
                  <div className="w-28 h-4 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded mx-2"></div>
                  <div className="flex-1 h-4 bg-gray-200 rounded mx-2"></div>
                  <div className="w-40 h-4 bg-gray-200 rounded mx-2"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded ml-2"></div>
                </div>
              ))
              : paginatedData.map((acc) => (
                <div
                  key={acc.Id}
                  onClick={() => handleRowClick(acc)}
                  className={`flex items-center rounded-lg px-4 py-3 shadow-md cursor-pointer transition-all ${activeRowId === acc.Id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white hover:shadow-lg hover:scale-[1.04] hover:bg-blue-500 hover:text-white"
                    }`}
                >
                  <div className="w-28">
                    {new Date(acc.CreatedDate).toLocaleDateString()}
                  </div>
                  <div className="w-24">{acc.Code}</div>
                  <div className="flex-1 break-words">{acc.Description}</div>
                  <div className="w-40">{acc.TypeDescription}</div>
                  <div
                    className={`w-32 text-right font-semibold text-xs ${acc.Balance >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {acc.Balance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "ksh",
                    })}
                  </div>
                </div>
              ))}
          </div>

          {/* Empty state */}
          {!loading && filteredAccounts.length === 0 && (
            <div className="text-gray-500 text-center mt-4">
              <img
                src={NotFoundImage}
                alt="Not Found"
                className="mx-auto w-42 h-auto"
              />
              <p className="font-medium text-gray-400"> No accounts found for {selectedCategory}.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && filteredAccounts.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-4 px-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>

              <p className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </p>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Drawers */}
        <AccountDrawer
          account={selectedAccount}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setActiveRowId(null);
          }}
        />
        <AddAccountDrawer
          open={addDrawerOpen}
          onClose={() => setAddDrawerOpen(false)}
          onSuccess={() => fetchAccounts()}
        />
      </div>
    </div>
  );
}
