// import React from "react";

// export default function MemberAccountsTab({ accounts = [] }) {
//     if (accounts.length === 0) {
//         return <p className="text-sm text-gray-500">No accounts available</p>;
//     }

//     return (
//         <div className="overflow-x-auto border rounded-lg">
//             <table className="w-full text-sm">
//                 <thead className="bg-gray-200">
//                     <tr>
//                         <th className="p-2 text-left">Account No</th>
//                         <th className="p-2 text-left">Product</th>
//                         <th className="p-2 text-left">Balance</th>
//                         <th className="p-2 text-left">Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {accounts.map((acc, i) => (
//                         <tr key={i} className="border-t">
//                             <td className="p-2">{acc.FullAccountNumber}</td>
//                             <td className="p-2">{acc.CustomerAccountTypeTargetProductDescription}</td>
//                             <td className="p-2">{acc.AvailableBalance}</td>
//                             <td className="p-2">{acc.RecordStatusDescription}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }




import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MemberAccountsTab({ accounts = [] }) {
    const [search, setSearch] = useState("");

    /* ================= SEARCH FILTER ================= */
    const filteredAccounts = useMemo(() => {
        const term = search.toLowerCase();
        return accounts.filter((acc) =>
            acc.FullAccountNumber?.toLowerCase().includes(term) ||
            acc.CustomerAccountTypeTargetProductDescription?.toLowerCase().includes(term) ||
            acc.RecordStatusDescription?.toLowerCase().includes(term)
        );
    }, [search, accounts]);

    /* ================= PDF EXPORT ================= */
    const handleDownloadPDF = () => {
        const doc = new jsPDF("p", "mm", "a4");

        doc.setFontSize(16);
        doc.text("Member Accounts", 14, 15);

        doc.setFontSize(10);
        doc.text(
            `Generated on: ${new Date().toLocaleDateString()}`,
            14,
            22
        );

        autoTable(doc, {
            startY: 30,
            head: [["Account No", "Product", "Balance", "Status"]],
            body: filteredAccounts.map((acc) => [
                acc.FullAccountNumber,
                acc.CustomerAccountTypeTargetProductDescription,
                acc.BookBalance,
                acc.RecordStatusDescription,
            ]),
            theme: "striped",
            headStyles: {
                fillColor: [55, 65, 81], // gray-700
                textColor: 255,
            },
            styles: {
                fontSize: 10,
            },
            columnStyles: {
                2: { halign: "right" }, // balance right aligned
            },
        });

        doc.save("Member_Accounts.pdf");
    };

    if (accounts.length === 0) {
        return <p className="text-sm text-gray-500">No accounts available</p>;
    }

    return (
        <div className="border rounded-lg bg-gray-200 p-4">
            {/* ================= TOP BAR ================= */}
            <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by account no, product or status"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:max-w-xs px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                />

                <button
                    onClick={handleDownloadPDF}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
                >
                    Download PDF
                </button>
            </div>

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm">
                    <thead className="bg-gray-700 text-white">
                        <tr>
                            <th className="p-2 text-left">Account No</th>
                            <th className="p-2 text-left">Product</th>
                            <th className="p-2 text-right">Balance</th>
                            <th className="p-2 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody className="bg-gray-50">
                        {filteredAccounts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="p-4 text-center text-gray-500"
                                >
                                    No matching records
                                </td>
                            </tr>
                        ) : (
                            filteredAccounts.map((acc, i) => (
                                <tr key={i} className="border-t hover:bg-gray-100">
                                    <td className="p-2">{acc.FullAccountNumber}</td>
                                    <td className="p-2">
                                        {acc.CustomerAccountTypeTargetProductDescription}
                                    </td>
                                    <td className="p-2 text-right">
                                        {Number(acc.BookBalance).toLocaleString()}
                                    </td>
                                    <td className="p-2">
                                        {acc.RecordStatusDescription}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
