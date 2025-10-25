

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FaFileInvoiceDollar,
    FaChevronDown,
    FaChevronUp,
    FaEllipsisV,
    FaCalendarAlt,
    FaUserTie,
    FaMoneyBillWave,
    FaTruck,
    FaClipboardList,
    FaFileSignature,
    FaWarehouse,
} from "react-icons/fa";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";

export default function Quotations() {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedQuotation, setExpandedQuotation] = useState(null);

    const fetchQuotations = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_APP_PRO_URL}/api/rfq/GetSuppliersQuotations`,
                { headers: { "ngrok-skip-browser-warning": "true" } }
            );
            const data = await res.json();
            setQuotations(data?.Data || []);
        } catch (error) {
            console.error("Failed to load quotations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    // Example delete or edit placeholder
    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Quotation?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted!", "Quotation has been deleted.", "success");
            }
        });
    };

    return (
        <div className="bg-white m-8 px-8 py-8 shadow-2xl rounded-lg relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaFileInvoiceDollar className="text-white" /> Supplier Quotations
                </h2>
                <Button
                    onClick={fetchQuotations}
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                >
                    Refresh
                </Button>
            </div>

            {/* Table Header */}
            <div className="bg-gray-200 p-4 rounded-sm">
                <div className="grid grid-cols-12 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
                    <span className="col-span-2">Vendor</span>
                    <span className="col-span-1">RFQ ID</span>
                    <span className="col-span-2">Quotation #</span>
                    <span className="col-span-2">Quoted Price</span>
                    <span className="col-span-2">Delivery Date</span>
                    <span className="col-span-1">Currency</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="space-y-2 animate-pulse">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-12 gap-2 bg-gray-50 p-6 rounded">
                                {Array.from({ length: 12 }).map((__, j) => (
                                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : quotations.length > 0 ? (
                    <div className="space-y-2">
                        {quotations.map((q) => (
                            <div
                                key={q.Id}
                                className="bg-white rounded-lg shadow-lg border"
                            >
                                {/* Main Row */}
                                <div className="grid grid-cols-12 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                                    <span className="font-medium text-indigo-700 col-span-2 flex items-center gap-2">
                                        {q.VendorName}
                                    </span>
                                    <span className="col-span-1">{q.RFQId}</span>
                                    <span className="col-span-2 flex items-center gap-2">
                                        {q.QuotationNumber}
                                    </span>
                                    <span className="col-span-2 text-green-700 font-semibold flex items-center gap-2">
                                        {q.Currency} {q.QuotedPrice.toLocaleString()}
                                    </span>
                                    <span className="col-span-2 flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-500" />
                                        {new Date(q.DeliveryDate).toLocaleDateString()}
                                    </span>
                                    <span className="col-span-1 uppercase">{q.Currency}</span>

                                    {/* Expand Button */}
                                    <div className="col-span-2 flex justify-end">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-gray-700 hover:bg-gray-600 text-white"
                                            onClick={() =>
                                                setExpandedQuotation(
                                                    expandedQuotation === q.Id ? null : q.Id
                                                )
                                            }
                                        >
                                            {expandedQuotation === q.Id ? (
                                                <>
                                                    <FaChevronUp /> Hide Details
                                                </>
                                            ) : (
                                                <>
                                                    <FaChevronDown /> View Details
                                                </>
                                            )}
                                        </Button>

                                        {/* Dropdown Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <FaEllipsisV className="h-4 w-4 text-gray-600" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-32">
                                                <DropdownMenuItem onClick={() => handleDelete(q.Id)}>
                                                    🗑️ Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedQuotation === q.Id && (
                                    <div className="border-t bg-gray-100 p-4 rounded-b-lg">
                                        <div className="grid grid-cols-2 gap-6 text-gray-700">
                                            <div className="space-y-2">
                                                <p className="flex items-center gap-2 bg-gray-200 rounded-2xl p-3">
                                                    <FaClipboardList className="text-gray-600" />
                                                    <strong>Discount:</strong> {q.Discount || 0}
                                                </p>
                                                <p className="flex items-center gap-2 bg-gray-200 rounded-2xl p-3">
                                                    <FaWarehouse className="text-gray-600" />
                                                    <strong>Shipping Cost:</strong> {q.ShippingCost}
                                                </p>
                                                <p className="flex items-center gap-2 bg-gray-200 rounded-2xl p-3">
                                                    <FaMoneyBillWave className="text-gray-600" />
                                                    <strong>Tax Amount:</strong> {q.TaxAmount}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="flex items-center gap-2 bg-gray-200 rounded-2xl p-3">
                                                    <FaTruck className="text-gray-600" />
                                                    <strong>Payment Terms:</strong> {q.PaymentTerms}
                                                </p>
                                                <p className="flex items-center gap-2 bg-gray-200 rounded-2xl p-3">
                                                    <FaClipboardList className="text-gray-600" />
                                                    <strong>Warranty Info:</strong> {q.WarrantyInfo}
                                                </p>
                                                <p className="flex items-center gap-2 bg-gray-200 rounded-2xl p-3">
                                                    <FaUserTie className="text-gray-600" />
                                                    <strong>Contact Person:</strong> {q.ContactPerson}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-sm font-semibold text-gray-600">Notes:</p>
                                            <p className="text-gray-700 italic">{q.Notes || "No notes provided."}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-center mt-4">
                        <img
                            src={NotFoundImage}
                            alt="Not Found"
                            className="mx-auto w-42 h-auto"
                        />
                        <p className="font-medium text-gray-400">No Quotations Found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

