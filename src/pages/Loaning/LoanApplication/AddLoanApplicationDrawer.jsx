import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Swal from "sweetalert2";

export default function AddLoanApplicationDrawer({ open, onClose }) {
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [loanProducts, setLoanProducts] = useState([]);
    const [loanProductSearch, setLoanProductSearch] = useState("");
    const [loanSectors, setLoanSectors] = useState([]);
    const [loanSubSectors, setLoanSubSectors] = useState([]);



    const [form, setForm] = useState({
        // CUSTOMER
        CustomerId: "",
        CustomerPersonalIdentificationNumber: "",
        CustomerIndividualIdentityCardNumber: "",
        CustomerIndividualPayrollNumbers: "",
        CustomerFullName: "",
        CustomerAddressMobileLine: "",
        CustomerAddressEmail: "",

        // LOAN PRODUCT (AUTO-FILLED)
        LoanProductId: "",
        LoanProductDescription: "",
        LoanRegistrationTermInMonths: 0,
        LoanInterestAnnualPercentageRate: 0,
        LoanInterestChargeModeDescription: "",
        LoanInterestCalculationModeDescription: "",
        LoanRegistrationLoanProductCategoryDescription: "",
        LoanRegistrationMaximumAmount: 0,
        LoanRegistrationMinimumInterestAmount: 0,
        LoanRegistrationInvestmentsMultiplier: 0,
        LoanRegistrationStandingOrderTriggerDescription: "",
        LoanRegistrationMinimumGuarantors: 0,
        LoanRegistrationMaximumGuarantees: 0,
        LoanRegistrationAllowSelfGuarantee: false,

        // USER INPUT
        LoanPurposeDescription: "",
        Remarks: "",
        AmountApplied: 0,
        Reference: "",

        // SALARY
        LoanRegistrationNetIncome: 0,
        LoanRegistrationTotalAllowance: 0,
        LoanRegistrationTotalDeduction: 0,
        LoanRegistrationTotalIncome: 0,

        //Sector
        SectorCode: "",
        SubSectorCode: ""

    });

    const [guarantors, setGuarantors] = useState([
        {
            CustomerId: "",
            AmountGuaranteed: 0,
            PersonalIdentificationNumber: "",
            IndividualIdentityCardNumber: "",
            IndividualPayrollNumbers: "",
            AddressEmail: "",
            AddressMobileLine: "",
            FullName: "",
            Remarks: "",
        },
    ]);


    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_LOANING_URL}/api/Loansetups/GetLoanproducts`, {
            headers: { "ngrok-skip-browser-warning": "true" },
        })
            .then(res => res.json())
            .then(data => {
                if (data.Success) {
                    setLoanProducts(data.Data || []);
                }
            })
            .catch(() => {
                Swal.fire("Error", "Failed to load loan products", "error");
            });
    }, []);



    useEffect(() => {
        fetch("http://88.99.215.90:8600/api/Loansetups/GetAllloanSector", {
            headers: { "ngrok-skip-browser-warning": "true" },
        })
            .then(res => res.json())
            .then(data => setLoanSectors(data || []))
            .catch(() => {
                Swal.fire("Error", "Failed to load loan sectors", "error");
            });
    }, []);




    useEffect(() => {
        fetch("http://88.99.215.90:8600/api/Loansetups/GetAllLoanSubSector", {
            headers: { "ngrok-skip-browser-warning": "true" },
        })
            .then(res => res.json())
            .then(data => setLoanSubSectors(data || []))
            .catch(() => {
                Swal.fire("Error", "Failed to load loan sub sectors", "error");
            });
    }, []);



    const filteredSubSectors = loanSubSectors.filter(
        s => s.SectorCode === form.SectorCode
    );



    /* ================= FETCH CUSTOMERS ================= */

    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/customers`, {
            headers: { "ngrok-skip-browser-warning": "true" }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCustomers(data.data || []);
                }
            })
            .catch(() => {
                Swal.fire("Error", "Failed to load customers", "error");
            });
    }, []);

    const update = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };




    /* ================= CUSTOMER SELECT ================= */
    const handleCustomerSelect = (value) => {
        setSearchValue(value);

        const selected = customers.find(c =>
            `${c.IndividualFirstName} | ${c.IdentificationNumber} | ${c.IndividualPayrollNumbers}` === value
        );

        if (!selected) return;

        setForm({
            // CUSTOMER
            CustomerId: selected.Id,
            CustomerFullName: selected.IndividualFirstName + " " + selected.IndividualLastName || "",
            CustomerIndividualIdentityCardNumber: selected.IndividualIdentityCardNumber || "",
            CustomerIndividualPayrollNumbers: selected.IndividualPayrollNumbers || "",
            CustomerPersonalIdentificationNumber: selected.PersonalIdentificationNumber || "",
            CustomerAddressMobileLine: selected.AddressMobileLine || "",
            CustomerAddressEmail: selected.AddressEmail || "",
            LoanProductDescription: "",
            Reference: "",

            // LOAN PRODUCT (AUTO-FILLED)
            LoanProductId: "",
            LoanProductDescription: "",
            LoanRegistrationTermInMonths: 0,
            LoanInterestAnnualPercentageRate: 0,
            LoanInterestChargeModeDescription: "",
            LoanInterestCalculationModeDescription: "",
            LoanRegistrationLoanProductCategoryDescription: "",
            LoanRegistrationMaximumAmount: 0,
            LoanRegistrationMinimumInterestAmount: 0,
            LoanRegistrationInvestmentsMultiplier: 0,
            LoanRegistrationStandingOrderTriggerDescription: "",
            LoanRegistrationMinimumGuarantors: 0,
            LoanRegistrationMaximumGuarantees: 0,
            LoanRegistrationAllowSelfGuarantee: false,

            // USER INPUT
            LoanPurposeDescription: "",
            Remarks: "",
            AmountApplied: 0,

            // SALARY
            LoanRegistrationNetIncome: 0,
            LoanRegistrationTotalAllowance: 0,
            LoanRegistrationTotalDeduction: 0,
            LoanRegistrationTotalIncome: 0,

            //SECTOR
            SectorCode: "",
            SubSectorCode: ""
        });
    };



    const handleLoanProductSelect = (value) => {
        setLoanProductSearch(value);

        const selected = loanProducts.find(p =>
            `${p.PaddedCode} | ${p.Description}` === value
        );

        if (!selected) return;

        setForm(prev => ({
            ...prev,

            LoanProductId: selected.Id,
            LoanProductDescription: selected.Description,
            LoanRegistrationTermInMonths: selected.LoanRegistrationTermInMonths,
            LoanInterestAnnualPercentageRate: selected.LoanInterestAnnualPercentageRate,
            LoanInterestChargeModeDescription: selected.LoanInterestChargeModeDescription,
            LoanInterestCalculationModeDescription: selected.LoanInterestCalculationModeDescription,
            LoanRegistrationLoanProductCategoryDescription:
                selected.LoanRegistrationLoanProductCategoryDescription,
            LoanRegistrationMaximumAmount: selected.LoanRegistrationMaximumAmount,
            LoanRegistrationMinimumInterestAmount: selected.LoanRegistrationMinimumInterestAmount,
            LoanRegistrationInvestmentsMultiplier: selected.LoanRegistrationInvestmentsMultiplier,
            LoanRegistrationStandingOrderTriggerDescription:
                selected.LoanRegistrationStandingOrderTriggerDescription,
            LoanRegistrationMinimumGuarantors:
                selected.LoanRegistrationMinimumGuarantors,
            LoanRegistrationMaximumGuarantees:
                selected.LoanRegistrationMaximumGuarantees,
            LoanRegistrationAllowSelfGuarantee:
                selected.LoanRegistrationAllowSelfGuarantee,
        }));
    };



    const updateGuarantor = (index, key, value) => {
        const copy = [...guarantors];
        copy[index][key] = value;
        setGuarantors(copy);
    };

    const addGuarantor = () => {
        setGuarantors(prev => [
            ...prev,
            {
                searchValue: "",
                AmountGuaranteed: 0,
                PersonalIdentificationNumber: "",
                IndividualIdentityCardNumber: "",
                IndividualPayrollNumbers: "",
                AddressEmail: "",
                AddressMobileLine: "",
                FullName: "",
                Remarks: "",
            },
        ]);
    };


    const removeGuarantor = (index) => {
        if (guarantors.length === 1) return;
        setGuarantors(prev => prev.filter((_, i) => i !== index));
    };


    const handleGuarantorSelect = (index, value) => {
        const selected = customers.find(c =>
            `${c.IndividualFirstName} | ${c.IdentificationNumber} | ${c.IndividualPayrollNumbers}` === value
        );

        if (!selected) {
            updateGuarantor(index, "searchValue", value);
            return;
        }

        const copy = [...guarantors];
        copy[index] = {
            ...copy[index],
            searchValue: value,
            FullName: selected.IndividualFirstName + " " + selected.IndividualLastName || "",
            IndividualIdentityCardNumber: selected.IndividualIdentityCardNumber || "",
            IndividualPayrollNumbers: selected.IndividualPayrollNumbers || "",
            PersonalIdentificationNumber: selected.PersonalIdentificationNumber || "",
            AddressMobileLine: selected.AddressMobileLine || "",
            AddressEmail: selected.AddressEmail || "",
            CustomerId: selected.Id
        };

        setGuarantors(copy);
    };


    // if (selected.IdentificationNumber === form.CustomerIndividualIdentityCardNumber) {
    //     Swal.fire("Warning", "Applicant cannot be a guarantor", "warning");
    //     return;
    // }




    const payload = {
        ...form,
        Guarantors: guarantors,
    };

    console.log(payload);
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_LOANING_URL}/api/Loaning/LoanApplication`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(payload),
                }
            );



            const data = await response.json();



            console.log(data);
            if (data.success || data.Success) {
                Swal.fire(data.message, data.Data, "success");
                // Swal.fire({
                //     icon: "success",
                //     title: data.message,
                //     text: data.Data,
                // });

            } else {
                Swal.fire(data.message, data.Data, "error");
            }

            // if (!response.ok || !data.Id) {
            //     throw new Error("Failed to submit loan application");
            // }



            //Swal.fire("Success", "Loan application submitted successfully", "success");
            onClose();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        const net = Number(form.LoanRegistrationNetIncome) || 0;
        const allowance = Number(form.LoanRegistrationTotalAllowance) || 0;
        const deduction = Number(form.LoanRegistrationTotalDeduction) || 0;

        const totalIncome = net + allowance - deduction;

        setForm(prev => ({
            ...prev,
            LoanRegistrationTotalIncome: totalIncome,
        }));
    }, [
        form.LoanRegistrationNetIncome,
        form.LoanRegistrationTotalAllowance,
        form.LoanRegistrationTotalDeduction,
    ]);



    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        className="fixed inset-0 bg-black z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* DRAWER */}
                    <motion.div
                        className="fixed top-3 right-3 w-[85vw] max-w-[900px] bg-white shadow-2xl z-50 rounded-2xl flex flex-col"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    >
                        {/* HEADER */}
                        <div className="p-4 flex justify-between items-center bg-indigo-700 rounded-2xl m-2">
                            <h2 className="font-bold text-xl text-white">
                                Loan Application
                            </h2>
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>

                        {/* CONTENT */}
                        <div className="p-6 overflow-y-auto h-[88vh]">

                            <div className="bg-gray-200 rounded-lg p-3">
                                {/* CUSTOMER DETAILS */}
                                <Card className="p-4 mb-6">
                                    <h3 className="font-semibold mb-4">Applicant Details</h3>

                                    {/* SEARCHABLE DATALIST */}
                                    <div className="mb-4">
                                        <Label>Select Customer</Label>
                                        <Input
                                            list="customers"
                                            placeholder="Search by name, ID or payroll"
                                            value={searchValue}
                                            onChange={(e) => handleCustomerSelect(e.target.value)}
                                        />
                                        <datalist id="customers">
                                            {customers.map(c => (
                                                <option
                                                    key={c.Id}
                                                    value={`${c.IndividualFirstName} | ${c.IdentificationNumber} | ${c.IndividualPayrollNumbers}`}
                                                />
                                            ))}
                                        </datalist>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input label="Full Name" placeholder="Full Name" value={form.CustomerFullName} readOnly />
                                        <Input label="ID Number" placeholder="ID Number" value={form.CustomerIndividualIdentityCardNumber} readOnly />
                                        <Input label="Payroll Number" placeholder="Payroll Number" value={form.CustomerIndividualPayrollNumbers} readOnly />
                                        <Input label="KRA PIN" placeholder="KRA PIN" value={form.CustomerPersonalIdentificationNumber} readOnly />
                                        <Input label="Mobile" placeholder="Mobile" value={form.CustomerAddressMobileLine} readOnly />
                                        <Input label="Email" placeholder="Email" value={form.CustomerAddressEmail} readOnly />
                                    </div>
                                </Card>


                                {/* LOAN DETAILS */}
                                <Card className="p-4 mb-6">
                                    <h3 className="font-semibold mb-4">Loan Details</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                        <div className="md:col-span-4">
                                            <Label>Select Loan Product</Label>
                                            <Input
                                                list="loan-products"
                                                placeholder="Search loan product"
                                                value={loanProductSearch}
                                                onChange={(e) => handleLoanProductSelect(e.target.value)}
                                            />
                                            <datalist id="loan-products">
                                                {loanProducts.map(p => (
                                                    <option
                                                        key={p.Id}
                                                        value={`${p.PaddedCode} | ${p.Description}`}
                                                    />
                                                ))}
                                            </datalist>
                                        </div>

                                        <div>
                                            <Label>Loan Product</Label>
                                            <Input
                                                value={form.LoanProductDescription}
                                                onChange={e => update("LoanProductDescription", e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <Label>Purpose</Label>
                                            <Input
                                                value={form.LoanPurposeDescription}
                                                onChange={e => update("LoanPurposeDescription", e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <Label>Amount Applied</Label>
                                            <Input
                                                type="number"
                                                value={form.AmountApplied}
                                                onChange={e => update("AmountApplied", Number(e.target.value))}
                                            />
                                        </div>

                                        <div>
                                            <Label>Loan Term (Months)</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationTermInMonths}
                                                onChange={e =>
                                                    update("LoanRegistrationTermInMonths", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Interest Rate (%)</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanInterestAnnualPercentageRate}
                                                onChange={e =>
                                                    update("LoanInterestAnnualPercentageRate", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Interest Charge Mode</Label>
                                            <Input
                                                value={form.LoanInterestChargeModeDescription}
                                                onChange={e =>
                                                    update("LoanInterestChargeModeDescription", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Interest Calculation</Label>
                                            <Input
                                                value={form.LoanInterestCalculationModeDescription}
                                                onChange={e =>
                                                    update("LoanInterestCalculationModeDescription", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Loan Category</Label>
                                            <Input
                                                value={form.LoanRegistrationLoanProductCategoryDescription}
                                                onChange={e =>
                                                    update("LoanRegistrationLoanProductCategoryDescription", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Maximum Amount</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationMaximumAmount}
                                                onChange={e =>
                                                    update("LoanRegistrationMaximumAmount", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Minimum Interest Amount</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationMinimumInterestAmount}
                                                onChange={e =>
                                                    update("LoanRegistrationMinimumInterestAmount", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Investments Multiplier</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationInvestmentsMultiplier}
                                                onChange={e =>
                                                    update("LoanRegistrationInvestmentsMultiplier", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Standing Order Trigger</Label>
                                            <Input
                                                value={form.LoanRegistrationStandingOrderTriggerDescription}
                                                onChange={e =>
                                                    update("LoanRegistrationStandingOrderTriggerDescription", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Min Guarantors</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationMinimumGuarantors}
                                                onChange={e =>
                                                    update("LoanRegistrationMinimumGuarantors", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Max Guarantees</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationMaximumGuarantees}
                                                onChange={e =>
                                                    update("LoanRegistrationMaximumGuarantees", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Allow Self Guarantee</Label>
                                            <Input
                                                value={form.LoanRegistrationAllowSelfGuarantee ? "Yes" : "No"}
                                                readOnly
                                            />
                                        </div>

                                        <div className="md:col-span-4">
                                            <Label>Remarks</Label>
                                            <Input
                                                value={form.Remarks}
                                                onChange={e => update("Remarks", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Card>



                                {/* Loan Sector */}
                                <Card className="p-4 mb-6">
                                    <h3 className="font-semibold mb-4">Loan Sector</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* SECTOR */}
                                        <div>
                                            <Label>Loan Sector</Label>
                                            <select
                                                className="w-full border rounded-md p-2"
                                                value={form.SectorCode}
                                                onChange={(e) => {
                                                    update("SectorCode", e.target.value);
                                                    update("SubSectorCode", ""); // reset subsector
                                                }}
                                            >
                                                <option value="">Select Sector</option>
                                                {loanSectors.map(sector => (
                                                    <option key={sector.Id} value={sector.SectorCode}>
                                                        {sector.SectorCode} - {sector.SectorName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* SUB SECTOR */}
                                        <div>
                                            <Label>Loan Sub Sector</Label>
                                            <select
                                                className="w-full border rounded-md p-2"
                                                value={form.SubSectorCode}
                                                onChange={(e) =>
                                                    update("SubSectorCode", e.target.value)
                                                }
                                                disabled={!form.SectorCode}
                                            >
                                                <option value="">Select Sub Sector</option>
                                                {(filteredSubSectors.length
                                                    ? filteredSubSectors
                                                    : loanSubSectors
                                                ).map(sub => (
                                                    <option key={sub.Id} value={sub.SubSectorCode}>
                                                        {sub.SubSectorCode} - {sub.SubSectorName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </Card>





                                {/* SALARY DETAILS */}
                                <Card className="p-4 mb-6">
                                    <h3 className="font-semibold mb-4">Salary Details</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <Label>Net Income</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationNetIncome}
                                                onChange={e =>
                                                    update("LoanRegistrationNetIncome", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Total Allowance</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationTotalAllowance}
                                                onChange={e =>
                                                    update("LoanRegistrationTotalAllowance", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Total Deduction</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationTotalDeduction}
                                                onChange={e =>
                                                    update("LoanRegistrationTotalDeduction", Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Total Income</Label>
                                            <Input
                                                type="number"
                                                value={form.LoanRegistrationTotalIncome}
                                                readOnly
                                                className="bg-gray-100 cursor-not-allowed font-semibold"
                                            />
                                        </div>

                                    </div>
                                </Card>












                                {/* GUARANTORS */}
                                <Card className="p-4">
                                    <h3 className="font-semibold mb-4">Guarantors</h3>

                                    {guarantors.map((g, index) => (

                                        <div key={index} className="border rounded-lg p-4 mb-4">



                                            <div className="flex justify-between mb-2">
                                                <h4 className="font-medium">
                                                    Guarantor {index + 1}
                                                </h4>

                                                {guarantors.length > 1 && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-red-600 text-white"
                                                        onClick={() => removeGuarantor(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                {/* SEARCH GUARANTOR */}
                                                <div className="md:col-span-3">
                                                    <Label>Select Guarantor</Label>
                                                    <Input
                                                        list={`guarantors-${index}`}
                                                        placeholder="Search by name, ID or payroll"
                                                        value={g.searchValue}
                                                        onChange={(e) =>
                                                            handleGuarantorSelect(index, e.target.value)
                                                        }
                                                    />
                                                    <datalist id={`guarantors-${index}`}>
                                                        {customers.map(c => (
                                                            <option
                                                                key={c.Id}
                                                                value={`${c.IndividualFirstName} | ${c.IdentificationNumber} | ${c.IndividualPayrollNumbers}`}
                                                            />
                                                        ))}
                                                    </datalist>
                                                </div>
                                                <div>
                                                    <Label>Full Name</Label>
                                                    <Input
                                                        placeholder="Full Name"
                                                        value={g.FullName}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <Label>ID Numbe</Label>
                                                    <Input
                                                        placeholder="ID Number"
                                                        value={g.IndividualIdentityCardNumber}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Payroll Number</Label>
                                                    <Input
                                                        placeholder="Payroll Number"
                                                        value={g.IndividualPayrollNumbers}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Mobile</Label>
                                                    <Input
                                                        placeholder="Mobile"
                                                        value={g.AddressMobileLine}
                                                        readOnly
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Email</Label>
                                                    <Input
                                                        placeholder="Email"
                                                        value={g.AddressEmail}
                                                        readOnly
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Amount</Label>
                                                    <Input
                                                        placeholder="Amount Guaranteed"
                                                        type="number"
                                                        value={g.AmountGuaranteed}
                                                        onChange={e =>
                                                            updateGuarantor(index, "AmountGuaranteed", Number(e.target.value))
                                                        }
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    ))}

                                    <Button variant="outline" onClick={addGuarantor}>
                                        + Add Guarantor
                                    </Button>
                                </Card>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex justify-end mt-8">
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Submitting..." : "Submit Loan Application"}
                                </Button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}







