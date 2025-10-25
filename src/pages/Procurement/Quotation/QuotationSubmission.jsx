import React, { useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

export default function QuotationSubmission() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        Id: "",
        RFQId: "",
        VendorId: "",
        VendorName: "",
        QuotedPrice: "",
        Currency: "",
        DeliveryDate: "",
        Notes: "",
        CreatedDate: new Date().toISOString(),
        QuotationNumber: "",
        Discount: "",
        TaxAmount: "",
        ShippingCost: "",
        PaymentTerms: "",
        WarrantyInfo: "",
        ContactPerson: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_PRO_URL}/api/rfq/SubmitQuotation`,
                formData
            );
            alert("Quotation submitted successfully!");
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to submit quotation");
        }
    };

    const steps = [
        "Vendor Info",
        "Quotation Details",
        "Additional Info",
        "Overview",
    ];

    return (
        <div className="flex justify-center m-8">
            <div className="flex bg-white rounded-xl shadow-lg w-full overflow-hidden">
                {/* Sidebar Steps */}
                <div className="bg-indigo-800 p-8">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-8 pb-4 border-b-2">
                        Submit Quotation
                    </h2>
                    <div className="space-y-8">
                        {steps.map((label, index) => (
                            <div key={index} className="flex items-center">
                                <div
                                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 ${step > index + 1
                                        ? "bg-indigo-500 text-white border-indigo-500"
                                        : step === index + 1
                                            ? "border-gray-100 text-gray-100"
                                            : "border-gray-100 text-gray-100"
                                        }`}
                                >
                                    {step > index + 1 ? <FaCheckCircle size={14} /> : index + 1}
                                </div>
                                <span
                                    className={`ml-3 text-sm ${step === index + 1
                                        ? "text-gray-100 font-medium"
                                        : "text-gray-100"
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="flex-1 p-10">
                    {step === 1 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-gray-700">
                                Vendor Information
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <input
                                    name="VendorId"
                                    onChange={handleChange}
                                    placeholder="Vendor ID"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="VendorName"
                                    onChange={handleChange}
                                    placeholder="Vendor Name"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="ContactPerson"
                                    onChange={handleChange}
                                    placeholder="Contact Person"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="RFQId"
                                    onChange={handleChange}
                                    placeholder="RFQ ID"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-gray-700">
                                Quotation Details
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <input
                                    name="QuotedPrice"
                                    type="number"
                                    onChange={handleChange}
                                    placeholder="Quoted Price"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="Currency"
                                    onChange={handleChange}
                                    placeholder="Currency (e.g., USD)"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="DeliveryDate"
                                    type="date"
                                    onChange={handleChange}
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="QuotationNumber"
                                    onChange={handleChange}
                                    placeholder="Quotation Number"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-gray-700">
                                Additional Information
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <input
                                    name="Discount"
                                    type="number"
                                    onChange={handleChange}
                                    placeholder="Discount"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="TaxAmount"
                                    type="number"
                                    onChange={handleChange}
                                    placeholder="Tax Amount"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="ShippingCost"
                                    type="number"
                                    onChange={handleChange}
                                    placeholder="Shipping Cost"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="PaymentTerms"
                                    onChange={handleChange}
                                    placeholder="Payment Terms"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <input
                                    name="WarrantyInfo"
                                    onChange={handleChange}
                                    placeholder="Warranty Info"
                                    className="border rounded-lg p-3 focus:ring-2 focus:ring-teal-400"
                                />
                                <textarea
                                    name="Notes"
                                    onChange={handleChange}
                                    placeholder="Additional Notes"
                                    className="border rounded-lg p-3 col-span-2 focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        </div>
                    )}


                    {step === 4 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-gray-700">
                                Quotation Overview
                            </h3>
                            <div className="bg-gray-200 rounded-xl p-4">
                                <div className="bg-white border border-gray-300 shadow-sm rounded-lg p-8 max-w-3xl mx-auto">
                                    <div className="flex justify-between mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-indigo-700 mb-1">Quotation</h2>
                                            <p className="text-sm text-gray-500">Quotation No: {formData.QuotationNumber || "—"}</p>
                                            <p className="text-sm text-gray-500">Date: {new Date(formData.CreatedDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-700">{formData.VendorName || "Vendor Name"}</p>
                                            <p className="text-gray-500">{formData.ContactPerson || "Contact Person"}</p>
                                            <p className="text-gray-500">Vendor ID: {formData.VendorId || "—"}</p>
                                        </div>
                                    </div>

                                    <hr className="mb-6 border-gray-300" />

                                    <div className="space-y-3 text-gray-700">
                                        <div className="flex justify-between">
                                            <span>RFQ ID:</span>
                                            <span className="font-medium">{formData.RFQId || "—"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Quoted Price:</span>
                                            <span className="font-medium">
                                                {formData.Currency || "USD"} {formData.QuotedPrice || "0.00"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Discount:</span>
                                            <span className="font-medium">{formData.Discount || "0"}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax Amount:</span>
                                            <span className="font-medium">
                                                {formData.Currency || "USD"} {formData.TaxAmount || "0.00"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping Cost:</span>
                                            <span className="font-medium">
                                                {formData.Currency || "USD"} {formData.ShippingCost || "0.00"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total:</span>
                                            <span className="font-bold text-green-700">
                                                {formData.Currency || "USD"}{" "}
                                                {(
                                                    (parseFloat(formData.QuotedPrice || 0) +
                                                        parseFloat(formData.TaxAmount || 0) +
                                                        parseFloat(formData.ShippingCost || 0)) -
                                                    parseFloat(formData.Discount || 0)
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Delivery Date:</span>
                                            <span className="font-medium">
                                                {formData.DeliveryDate
                                                    ? new Date(formData.DeliveryDate).toLocaleDateString()
                                                    : "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment Terms:</span>
                                            <span className="font-medium">{formData.PaymentTerms || "—"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Warranty Info:</span>
                                            <span className="font-medium">{formData.WarrantyInfo || "—"}</span>
                                        </div>
                                    </div>

                                    <hr className="my-6 border-gray-300" />

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1 font-semibold">Notes:</p>
                                        <p className="text-sm text-gray-700 italic whitespace-pre-line">
                                            {formData.Notes || "No additional notes provided."}
                                        </p>
                                    </div>

                                    <div className="text-center mt-10 text-sm text-gray-500 italic">
                                        — End of Quotation —
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Buttons */}
                    <div className="flex justify-between mt-10">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                disabled
                                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                            >
                                Back
                            </button>
                        )}

                        {step < 4 ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                            >
                                Submit Quotation
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
