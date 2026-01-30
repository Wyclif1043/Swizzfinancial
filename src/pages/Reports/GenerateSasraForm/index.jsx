import React, { useState } from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa";

const sasraReports = [
    {
        id: 1,
        name: "SASRA Form 2 - Liquidity",
        api: "GenerateSasraForm2LiquidityPdf",
    },
    {
        id: 2,
        name: "SASRA Form 5 - Investment",
        api: "GenerateSasraForm5InvestmentPdf",
    },
    {
        id: 3,
        name: "SASRA Form 6",
        api: "GenerateSasraForm6Pdf",
    },
    {
        id: 4,
        name: "SASRA Form 7 - Income Statement",
        api: "GenerateSasraForm7IncomeStatementPdf",
    },
];

export default function GenerateSasraForm() {
    const [startDate, setStartDate] = useState("2026-01-20");
    const [endDate, setEndDate] = useState("2026-01-20");
    const [loadingId, setLoadingId] = useState(null);

    const downloadPdf = async (report) => {
        if (!startDate || !endDate) {
            alert("Please select start and end dates");
            return;
        }


        try {
            setLoadingId(report.id);

            const url = `http://88.99.215.90:8600/api/values/${report.api}?startDate=${startDate}&endDate=${endDate}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to generate PDF");

            const blob = await res.blob();
            const fileUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = `${report.name.replace(/\s+/g, "_")}_${startDate}_${endDate}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error(error);
            alert("Failed to download PDF");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen m-8 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
                <h2 className="text-xl font-semibold text-white">
                    SASRA Reports
                </h2>
            </div>

            {/* Date Filters */}
            <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-300 rounded-2xl p-4">
                {sasraReports.map((report) => (
                    <div
                        key={report.id}
                        className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-4"
                    >
                        <div className="flex justify-center mb-4">
                            <FaFilePdf className="text-red-600 text-4xl" />
                        </div>

                        <div className="text-center mb-4">
                            <p className="font-medium text-sm">{report.name}</p>
                        </div>

                        <button
                            onClick={() => downloadPdf(report)}
                            disabled={loadingId === report.id}
                            className={`flex items-center justify-center gap-2 w-full text-white text-sm font-medium py-2 rounded-lg transition
                                ${loadingId === report.id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            <FaDownload />
                            {loadingId === report.id ? "Generating..." : "Download PDF"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
