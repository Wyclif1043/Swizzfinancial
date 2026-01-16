import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FaBuilding,
    FaPlus,
    FaPhone,
    FaEnvelope,
    FaTrash,
    FaChevronDown,
    FaChevronUp,
    FaEllipsisV,
    FaMapMarkerAlt,
} from "react-icons/fa";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";

export default function Branches() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBranch, setExpandedBranch] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [openBranch, setOpenBranch] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/branches`,
                { headers: { "ngrok-skip-browser-warning": "true" } }
            );
            const json = await res.json();
            setBranches(json.data || []);
        } catch (err) {
            console.error("Fetch Branches Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // DELETE /api/branches/{id}
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Delete Branch?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(
                        `${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/branches/${id}`,
                        { headers: { "ngrok-skip-browser-warning": "true" } },
                        { method: "DELETE" }
                    );

                    if (!res.ok) throw new Error("Failed to delete branch");

                    setBranches((prev) => prev.filter((b) => b.Id !== id));

                    Swal.fire("Deleted!", "Branch removed successfully.", "success");
                } catch (error) {
                    Swal.fire("Error", error.message, "error");
                }
            }
        });
    };

    return (
        <div className="bg-white m-8 px-8 py-8 shadow-2xl rounded-lg relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaBuilding className="text-white" /> Branches
                </h2>
                <Button onClick={() => setOpenBranch(true)} className="bg-indigo-600 hover:bg-indigo-700">Add Branch</Button>

            </div>

            {/* Table Header */}
            <div className="bg-gray-200 p-4 rounded-sm">
                <div className="grid grid-cols-12 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
                    <span className="col-span-3">Branch</span>
                    <span className="col-span-3">Email</span>
                    <span className="col-span-2">Phone</span>
                    <span className="col-span-2">Company</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                {/* Loading */}
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
                ) : branches.length > 0 ? (
                    <div className="space-y-2">
                        {branches.map((branch) => (
                            <div key={branch.Id} className="bg-white rounded-lg shadow-lg border">
                                {/* Main Row */}
                                <div className="grid grid-cols-12 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                                    <span className="font-medium text-indigo-700 col-span-3">
                                        {branch.Description}
                                    </span>

                                    <span className="col-span-3 truncate">
                                        <FaEnvelope className="inline mr-1 text-gray-500" />
                                        {branch.AddressEmail}
                                    </span>

                                    <span className="col-span-2 flex items-center gap-2">
                                        <FaPhone className="text-gray-500" />
                                        {branch.AddressMobileLine}
                                    </span>

                                    <span className="col-span-2 text-sm text-gray-600">
                                        {branch.CompanyDescription}
                                    </span>

                                    {/* Expand */}
                                    <span className="col-span-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-gray-700 hover:bg-gray-600 text-white"
                                            onClick={() =>
                                                setExpandedBranch(
                                                    expandedBranch === branch.Id ? null : branch.Id
                                                )
                                            }
                                        >
                                            {expandedBranch === branch.Id ? (
                                                <>
                                                    <FaChevronUp /> Hide Details
                                                </>
                                            ) : (
                                                <>
                                                    <FaChevronDown /> View Details
                                                </>
                                            )}
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
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedBranch(branch);
                                                        setOpenEdit(true);
                                                    }}
                                                >
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(branch.Id)}
                                                >
                                                    <FaTrash className="mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Expanded Section */}
                                {expandedBranch === branch.Id && (
                                    <div className="border-t bg-gray-400 p-4 mx-1 mb-1 rounded-b-lg space-y-4">
                                        {/* Address */}
                                        <div className="bg-white p-4 rounded-lg shadow border">
                                            <div className="bg-gray-200 rounded-xl p-3">
                                                <h3 className="font-bold text-white bg-indigo-700 p-3 rounded-xl mb-2 flex items-center gap-2">
                                                    <FaMapMarkerAlt /> Address
                                                </h3>
                                                <div className="grid grid-cols-2 p-3 bg-gray-50 rounded-xl border-2 gap-3 text-sm text-gray-700">
                                                    <span><b>Line 1:</b> {branch.AddressAddressLine1}</span>
                                                    <span><b>Line 2:</b> {branch.AddressAddressLine2}</span>
                                                    <span><b>Street:</b> {branch.AddressStreet}</span>
                                                    <span><b>Postal Code:</b> {branch.AddressPostalCode}</span>
                                                    <span><b>City:</b> {branch.AddressCity}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Company Info */}
                                        <div className="bg-white p-4 rounded-lg shadow border">
                                            <div className="bg-gray-200 rounded-xl p-3">
                                                <h3 className="font-bold text-white bg-indigo-700 p-3 rounded-xl mb-2">
                                                    Parent Company
                                                </h3>
                                                <div className="grid grid-cols-2 p-3 bg-gray-50 rounded-xl border-2 gap-3 text-sm text-gray-700">
                                                    <span><b>Company:</b> {branch.CompanyDescription}</span>
                                                    <span><b>Email:</b> {branch.CompanyAddressEmail}</span>
                                                    <span><b>City:</b> {branch.CompanyAddressCity}</span>
                                                    <span><b>Street:</b> {branch.CompanyAddressStreet}</span>
                                                </div>
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
                        <p className="font-medium text-gray-400">No Branches Found.</p>
                    </div>
                )}
            </div>

            {/* Drawers */}
            <AddBranch
                open={openBranch}
                onClose={() => setOpenBranch(false)}
                refresh={fetchBranches}
            />

            <EditBranch
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                data={selectedBranch}
                refresh={fetchBranches}
            />
        </div>
    );
}
