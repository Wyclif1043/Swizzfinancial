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
import AddCompanies from "./AddCompanies";
import EditCompanies from "./EditCompanies";

export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCompany, setExpandedCompany] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);




    useEffect(() => {
        fetchCompanies();
    }, []);


    const fetchCompanies = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/companies`, {
                headers: { "ngrok-skip-browser-warning": "true" },
            }
            );
            const json = await res.json();
            setCompanies(json.data || []);
        } catch (err) {
            console.error("Fetch Companies Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Delete Company?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const res = await fetch(`${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/companies/${id}`, {
                        method: "DELETE",
                    });

                    if (!res.ok) {
                        throw new Error("Failed to delete company");
                    }

                    // Remove deleted company from UI
                    setCompanies((prev) => prev.filter((c) => c.Id !== id));

                    Swal.fire("Deleted!", "Company removed successfully.", "success");
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
                    <FaBuilding className="text-white" /> Companies
                </h2>
                <Button
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                    onClick={() => setOpenDrawer(true)}
                >
                    <FaPlus /> Add Company
                </Button>
            </div>

            {/* Table Header */}
            <div className="bg-gray-200 p-4 rounded-sm">
                <div className="grid grid-cols-12 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
                    <span className="col-span-3">Company</span>
                    <span className="col-span-3">Email</span>
                    <span className="col-span-2">Phone</span>
                    <span className="col-span-2">Created</span>
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
                ) : companies.length > 0 ? (
                    <div className="space-y-2">
                        {companies.map((company) => (
                            <div
                                key={company.Id}
                                className="bg-white rounded-lg shadow-lg border"
                            >
                                {/* Main Row */}
                                <div className="grid grid-cols-12 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                                    <span className="font-medium text-indigo-700 col-span-3">
                                        {company.Description}
                                    </span>

                                    <span className="col-span-3 truncate">
                                        <FaEnvelope className="inline mr-1 text-gray-500" />
                                        {company.AddressEmail}
                                    </span>

                                    <span className="col-span-2 flex items-center gap-2">
                                        <FaPhone className="text-gray-500" />
                                        {company.AddressMobileLine}
                                    </span>

                                    <span className="col-span-2 text-sm text-gray-600">
                                        {new Date(company.CreatedDate).toLocaleDateString()}
                                    </span>

                                    {/* Expand Button */}
                                    <span className=" col-span-1">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="bg-gray-700 hover:bg-gray-600 text-white"
                                            onClick={() =>
                                                setExpandedCompany(
                                                    expandedCompany === company.Id ? null : company.Id
                                                )
                                            }
                                        >
                                            {expandedCompany === company.Id ? (
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
                                                        setSelectedCompany(company);
                                                        setOpenEdit(true);
                                                    }}
                                                >
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDelete(company.Id)}
                                                >
                                                    <FaTrash className="mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>



                                {/* Expanded Section */}
                                {expandedCompany === company.Id && (
                                    <div className="border-t bg-gray-400 p-4 mx-1 mb-1 rounded-b-lg space-y-4">
                                        {/* Address */}
                                        <div className="bg-white p-4 rounded-lg shadow border">
                                            <div className="bg-gray-200 rounded-xl p-3">
                                                <h3 className="font-bold text-white bg-indigo-700 p-3 rounded-xl mb-2 flex items-center gap-2">
                                                    <FaMapMarkerAlt /> Address
                                                </h3>
                                                <div className="grid grid-cols-2 p-3 bg-gray-50 rounded-xl border-2 gap-3 text-sm text-gray-700">
                                                    <span><b>Line 1:</b> {company.AddressAddressLine1}</span>
                                                    <span><b>Line 2:</b> {company.AddressAddressLine2}</span>
                                                    <span><b>Street:</b> {company.AddressStreet}</span>
                                                    <span><b>Postal Code:</b> {company.AddressPostalCode}</span>
                                                    <span><b>City:</b> {company.AddressCity}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Extra System Info */}
                                        <div className="bg-white p-4 rounded-lg shadow border">
                                            <div className="bg-gray-200 rounded-xl p-3">
                                                <h3 className="font-bold text-white bg-indigo-700 p-3 rounded-xl mb-2 flex items-center gap-2">
                                                    System Settings
                                                </h3>
                                                <div className="grid grid-cols-2 p-3 bg-gray-50 rounded-xl border-2 gap-3 text-sm text-gray-700">
                                                    <span><b>Registration No:</b> {company.RegistrationNumber}</span>
                                                    <span><b>PIN:</b> {company.PersonalIdentificationNumber}</span>
                                                    <span><b>2FA:</b> {company.EnforceTwoFactorAuthentication ? "Enabled" : "Disabled"}</span>
                                                    <span><b>Biometrics:</b> {company.EnforceBiometricsForCashWithdrawal ? "Required" : "No"}</span>
                                                    <span><b>System Lock:</b> {company.EnforceSystemLock ? "Yes" : "No"}</span>
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
                        <p className="font-medium text-gray-400">No Companies Found.</p>
                    </div>
                )}
            </div>
            <AddCompanies
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                refresh={fetchCompanies}
            />
            <EditCompanies
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                data={selectedCompany}
                refresh={fetchCompanies}
            />

        </div>
    );
}
