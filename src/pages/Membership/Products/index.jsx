import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FaWallet,
    FaPlus,
    FaChevronDown,
    FaChevronUp,
    FaEllipsisV,
    FaTrash,
    FaPercentage,
    FaBalanceScale,
    FaLink,
} from "react-icons/fa";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";
import AddProducts from "./AddProducts";
import LinkProductDrawer from "./LinkProductDrawer";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);


    const [openDrawer, setOpenDrawer] = useState(false);

    //linkage product
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/savings-products`,
                { headers: { "ngrok-skip-browser-warning": "true" } }
            );

            const json = await res.json();
            setProducts(json.data || []);
        } catch (err) {
            console.error("Fetch Savings Products Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Delete Product?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // NOTE: Your API does not include delete, adjust accordingly
                    Swal.fire("Error", "Delete API not provided.", "error");
                } catch (error) {
                    Swal.fire("Error", error.message, "error");
                }
            }
        });
    };



    const openLInkageDrawer = (p) => {
        setSelectedProduct(p);
        setDrawerOpen(true);
    };

    return (
        <div className="bg-white m-8 px-8 py-8 shadow-2xl rounded-lg relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaWallet className="text-white" /> Savings Products
                </h2>
                <Button
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                    onClick={() => setOpenDrawer(true)}
                >
                    <FaPlus /> Add Product
                </Button>
            </div>

            {/* Table Header */}
            <div className="bg-gray-200 p-4 rounded-sm">
                <div className="grid grid-cols-14 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
                    <span className="col-span-3">Description</span>
                    <span className="col-span-2">Code</span>
                    <span className="col-span-3">COA</span>
                    <span className="col-span-2">APY</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="space-y-2 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="grid grid-cols-12 gap-2 bg-gray-50 p-6 rounded">
                                {Array.from({ length: 12 }).map((_, j) => (
                                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="space-y-2">
                        {products.map((p) => (
                            <div key={p.Id} className="bg-white rounded-lg shadow-lg border">
                                {/* Main Row */}
                                <div className="grid grid-cols-14 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                                    <span className="font-medium text-indigo-700 col-span-3">
                                        {p.Description}
                                    </span>

                                    <span className="col-span-2">{p.PaddedCode}</span>

                                    <span className="col-span-3">
                                        {p.ChartOfAccountName}
                                    </span>

                                    <span className="col-span-2 flex gap-1 items-center">
                                        {p.AnnualPercentageYield}%
                                    </span>

                                    {/* Expand Button */}
                                    <span className="col-span-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-gray-700 hover:bg-gray-600 text-white"
                                            onClick={() =>
                                                setExpanded(expanded === p.Id ? null : p.Id)
                                            }
                                        >
                                            {expanded === p.Id ? (
                                                <>
                                                    <FaChevronUp /> Hide
                                                </>
                                            ) : (
                                                <>
                                                    <FaChevronDown /> Details
                                                </>
                                            )}
                                        </Button>
                                    </span>

                                    {/* LINK BUTTON */}
                                    <span className="col-span-2 flex justify-center">
                                        <Button
                                            size="sm"
                                            className="bg-indigo-600 text-white col-span-1"
                                            onClick={() => openLInkageDrawer(p)}
                                        >
                                            <FaLink /> Link
                                        </Button>
                                    </span>
                                    {/* Actions */}
                                    <div className="col-span-1 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <FaEllipsisV className="h-4 w-4 text-gray-600" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-32">
                                                <DropdownMenuItem>Edit</DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(p.Id)}
                                                >
                                                    <FaTrash className="mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Expanded Section */}
                                {expanded === p.Id && (
                                    <div className="border-t bg-gray-400 p-4 mx-1 mb-1 rounded-b-lg space-y-4">

                                        {/* Basic Details */}
                                        <div className="bg-white p-4 rounded-lg shadow border">
                                            <h3 className="font-bold text-white bg-indigo-700 p-3 rounded-xl mb-2 flex items-center gap-2">
                                                Product Details
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border text-sm">
                                                <span><b>Max Deposit:</b> {p.MaximumAllowedDeposit}</span>
                                                <span><b>Max Withdrawal:</b> {p.MaximumAllowedWithdrawal}</span>
                                                <span><b>Min Balance:</b> {p.MinimumBalance}</span>
                                                <span><b>Operating Balance:</b> {p.OperatingBalance}</span>
                                                <span><b>Notice Amount:</b> {p.WithdrawalNoticeAmount}</span>
                                                <span><b>Notice Period:</b> {p.WithdrawalNoticePeriod} days</span>
                                                <span><b>Interval:</b> {p.WithdrawalInterval} days</span>
                                            </div>
                                        </div>

                                        {/* Account Mapping */}
                                        <div className="bg-white p-4 rounded-lg shadow border">
                                            <h3 className="font-bold text-white bg-indigo-700 p-3 rounded-xl mb-2 flex items-center gap-2">
                                                Chart of Accounts
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border text-sm">
                                                <span><b>Account Code:</b> {p.ChartOfAccountAccountCode}</span>
                                                <span><b>Account Name:</b> {p.ChartOfAccountAccountName}</span>
                                                <span><b>Full COA:</b> {p.ChartOfAccountName}</span>
                                                <span><b>Type:</b> {p.ChartOfAccountAccountType}</span>
                                            </div>
                                        </div>

                                        {/* Settings */}
                                        <div className="bg-white p-4 rounded-lg shadow border">
                                            <h3 className="font-bold text-white bg-indigo-700 p-3 rounded-xl mb-2 flex items-center gap-2">
                                                Settings
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border text-sm">
                                                <span><b>Default:</b> {p.IsDefault ? "Yes" : "No"}</span>
                                                <span><b>Mandatory:</b> {p.IsMandatory ? "Yes" : "No"}</span>
                                                <span><b>Locked:</b> {p.IsLocked ? "Yes" : "No"}</span>
                                                <span><b>Auto Fee:</b> {p.AutomateLedgerFeeCalculation ? "On" : "Off"}</span>
                                                <span><b>Throttle OTC:</b> {p.ThrottleOverTheCounterWithdrawals ? "Yes" : "No"}</span>
                                                <span><b>Charge Type:</b> {p.ChargeTypeDescription}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-center mt-4">
                        <img src={NotFoundImage} alt="Not Found" className="mx-auto w-42" />
                        <p className="font-medium text-gray-400">No Savings Products Found.</p>
                    </div>
                )}
            </div>
            {/* ADD PRODUCT DRAWER*/}
            <AddProducts
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                refresh={fetchProducts}
            />
            {/* Linkage Drawer */}
            <LinkProductDrawer
                open={drawerOpen}
                product={selectedProduct}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
}
