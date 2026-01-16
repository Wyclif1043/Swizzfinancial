import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Swal from "sweetalert2";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";


export default function MemberRegistrationDrawer({ open, onClose, refresh }) {

    const [branches, setBranches] = useState([]);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);

    const [administrativeDivision, setAdministrativeDivision] = useState([]);
    const [errors, setErrors] = useState({
        addressEmail: "",
        addressMobileLine: "",
        personalIdentificationNumber: "",
    });


    // ========================
    // MASTER FORM STATE
    // ========================
    const [customer, setCustomer] = useState({
        stationId: "",
        branchId: "",
        type: "",
        serialNumber: 0,
        personalIdentificationNumber: "",
        individualType: 1,
        individualFirstName: "",
        individualLastName: "",
        individualIdentityCardType: 1,
        individualIdentityCardNumber: "",
        individualPayrollNumbers: "",
        individualSalutation: 1,
        individualGender: "",
        individualMaritalStatus: "",
        individualNationality: 1,
        individualBirthDate: "",
        individualEmploymentDesignation: "",
        individualEmploymentTermsOfService: "",
        individualEmploymentDate: "",
        addressAddressLine1: "",
        addressAddressLine2: "",
        addressStreet: "",
        addressPostalCode: "",
        addressCity: "",
        addressEmail: "",
        addressLandLine: "",
        addressMobileLine: "",
        passportImageId: null,
        signatureImageId: null,
        identityCardFrontSideImageId: null,
        identityCardBackSideImageId: null,
        remarks: "",
        recruitedBy: "SYSTEM",
        recordStatus: 1,
        createdBy: "SYSTEM",
        createdDate: "",
        reference1: "",
        bankName: "",
        branchName: "",
    });

    const [nextOfKins, setNextOfKins] = useState([
        {
            salutation: "",
            gender: "",
            relationship: "",
            firstName: "",
            lastName: "",
            identityCardType: 1,
            identityCardNumber: "",
            addressAddressLine1: "",
            addressStreet: "",
            addressPostalCode: "",
            addressCity: "",
            addressEmail: "",
            addressMobileLine: "",
            nominatedPercentage: 0,
            remarks: "",
            createdBy: "SYSTEM",
        },
    ]);



    const update = (key, value) => {
        setCustomer(prev => ({ ...prev, [key]: value }));
    };

    const [step, setStep] = useState(1);
    const next = () => setStep(s => s + 1);
    const back = () => setStep(s => s - 1);


    const updateCustomer = (key, value) => {
        setCustomer(prev => ({ ...prev, [key]: value }));
    };

    const updateNextOfKin = (index, key, value) => {
        const updated = [...nextOfKins];
        updated[index][key] = value;
        setNextOfKins(updated);
    };



    const addNextOfKin = () => {
        if (totalNokPercentage >= 100) {
            Swal.fire(
                "Limit reached",
                "Total nominated percentage is already 100%",
                "warning"
            );
            return;
        }

        setNextOfKins([
            ...nextOfKins,
            {
                salutation: "",
                gender: "",
                relationship: "",
                firstName: "",
                lastName: "",
                identityCardType: 1,
                identityCardNumber: "",
                addressAddressLine1: "",
                addressStreet: "",
                addressPostalCode: "",
                addressCity: "",
                addressEmail: "",
                addressMobileLine: "",
                nominatedPercentage: 0,
                remarks: "",
                createdBy: "SYSTEM",
            },
        ]);
    };


    const removeNextOfKin = (index) => {
        if (nextOfKins.length === 1) return; // prevent removing the last one
        setNextOfKins(prev => prev.filter((_, i) => i !== index));
    };

    const payload = {
        customer,
        nextOfKins,
    };

    console.log(payload);

    // ========================
    // SUBMIT HANDLER
    // ========================
    const handleSubmit = async () => {
        setLoading(true);



        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/customers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) throw new Error("Failed to submit");


            console.log(response);
            const data = await response.json();

            console.log(data);

            if (data.success) {
                Swal.fire("Success", data.message, "success");
                refresh();
            } else {
                Swal.fire("Error", data.message, "error");
            }


            onClose();
        } catch (err) {
            Swal.fire("Error", "Failed to register member", "error");
        } finally {
            setLoading(false);
        }
    };


    const loadStations = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/stations`, {
                headers: { "ngrok-skip-browser-warning": "true" }
            });
            const json = await res.json();
            if (json.success) {
                setStations(json.data);
            }
        } catch (err) {
            console.error("Failed to load stations", err);
        }
    };


    const loadAdministrativeDivision = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/administrative-divisions`, {
                headers: { "ngrok-skip-browser-warning": "true" }
            });
            const json = await res.json();
            if (json.success) {
                setAdministrativeDivision(json.data);
            }
        } catch (err) {
            console.error("Failed to load stations", err);
        }
    };

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

    useEffect(() => {
        loadStations();
        loadAdministrativeDivision();
        fetchBranches();
    }, []);

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // strip prefix
            reader.onerror = reject;
        });

    const handleImageUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        const base64 = await toBase64(file);
        update(key, base64);
    };



    const totalNokPercentage = nextOfKins.reduce(
        (sum, k) => sum + Number(k.nominatedPercentage || 0),
        0
    );


    // ========================
    // UI RENDER
    // ========================
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
                        className="fixed top-3 right-3 w-[85vw] max-w-[1150px] bg-white shadow-2xl z-50 flex flex-col rounded-2xl"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    >

                        {/* HEADER */}
                        <div className="p-4 flex justify-between items-center bg-indigo-700 rounded-2xl m-2">
                            <h2 className="font-bold text-xl text-white">Member Registration</h2>
                            <Button variant="outline" size="sm" onClick={onClose}>
                                Close
                            </Button>
                        </div>

                        <div className="grid grid-cols-12 h-[88vh] overflow-hidden p-3">

                            {/* LEFT STEPS NAVIGATION */}
                            <aside className="col-span-3 bg-gray-200 p-3 rounded-lg">
                                {[
                                    "Personal Details",
                                    "Next of Kin",
                                    "Uploads",
                                ].map((label, index) => (
                                    <Card
                                        key={index}
                                        className={`p-3 mb-2 cursor-pointer border 
                                        ${step === index + 1
                                                ? "bg-indigo-700 border-indigo-500 text-white"
                                                : "hover:bg-gray-100"
                                            }
                                        `}
                                        onClick={() => setStep(index + 1)}
                                    >
                                        <p className="font-medium text-sm">{label}</p>
                                    </Card>
                                ))}
                            </aside>


                            {/* RIGHT CONTENT */}
                            <main className="col-span-9 p-6 overflow-y-auto">

                                {/* STEP 1 – PERSONAL INFO */}
                                {step === 1 && (
                                    <section>
                                        <h3 className="text-lg font-semibold mb-3 bg-indigo-700 text-white p-3 rounded-2xl">Personal Information</h3>


                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


                                            <div>
                                                <Label>Type</Label>
                                                <select
                                                    value={customer.type}
                                                    onChange={(e) => update("type", e.target.value)}
                                                    required
                                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="">Select Member Type</option>
                                                    <option value="1">Individual</option>
                                                    <option value="2">Partnership</option>
                                                    <option value="3">Corporation</option>
                                                    <option value="4">MicroCredit</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label>SurName</Label>
                                                <Input
                                                    value={customer.individualLastName}
                                                    onChange={e => update("individualLastName", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label>Other Name</Label>
                                                <Input
                                                    required
                                                    value={customer.individualFirstName}
                                                    onChange={e => update("individualFirstName", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label>ID / Passport Number</Label>
                                                <Input
                                                    value={customer.individualIdentityCardNumber}
                                                    onChange={e => update("individualIdentityCardNumber", e.target.value)}
                                                />
                                            </div>


                                            <div>
                                                <Label>Date of Birth</Label>
                                                <Input
                                                    type="date"
                                                    value={customer.individualBirthDate}
                                                    onChange={e => update("individualBirthDate", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label>Mobile</Label>
                                                <Input
                                                    placeholder="+2547XXXXXXXX"
                                                    value={customer.addressMobileLine}
                                                    onChange={(e) => {
                                                        update("addressMobileLine", e.target.value);
                                                        setErrors(prev => ({ ...prev, addressMobileLine: "" }));
                                                    }}
                                                    onBlur={() => {
                                                        if (
                                                            customer.addressMobileLine &&
                                                            !/^\+254(7|1)\d{8}$/.test(customer.addressMobileLine)
                                                        ) {
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                addressMobileLine:
                                                                    "Phone must start with +254 and be 12 digits",
                                                            }));
                                                        }
                                                    }}
                                                    className={
                                                        errors.addressMobileLine
                                                            ? "border-red-500 focus-visible:ring-red-500"
                                                            : ""
                                                    }
                                                />

                                                {errors.addressMobileLine && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.addressMobileLine}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label>Landline</Label>
                                                <Input
                                                    value={customer.addressLandLine}
                                                    onChange={(e) => update("addressLandLine", e.target.value)}
                                                />
                                            </div>


                                            <div>
                                                <Label>Email</Label>
                                                <Input
                                                    type="email"
                                                    value={customer.addressEmail}
                                                    onChange={(e) => {
                                                        update("addressEmail", e.target.value);
                                                        setErrors(prev => ({ ...prev, addressEmail: "" }));
                                                    }}
                                                    onBlur={() => {
                                                        if (
                                                            customer.addressEmail &&
                                                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.addressEmail)
                                                        ) {
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                addressEmail: "Enter a valid email address",
                                                            }));
                                                        }
                                                    }}
                                                    className={
                                                        errors.addressEmail
                                                            ? "border-red-500 focus-visible:ring-red-500"
                                                            : ""
                                                    }
                                                />

                                                {errors.addressEmail && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.addressEmail}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Marital Status</Label>
                                                <select
                                                    value={customer.individualMaritalStatus}
                                                    onChange={(e) => update("individualMaritalStatus", e.target.value)}
                                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="">Select Marital Status</option>
                                                    <option value="2">Married</option>
                                                    <option value="1">Single</option>
                                                    <option value="3">Divorced</option>
                                                    <option value="4">Widowed</option>
                                                    <option value="5">Separated</option>
                                                </select>
                                            </div>


                                            <div>
                                                <Label>PIN</Label>
                                                <Input
                                                    placeholder="A123456789B"
                                                    value={customer.personalIdentificationNumber}
                                                    onChange={(e) => {
                                                        update(
                                                            "personalIdentificationNumber",
                                                            e.target.value.toUpperCase()
                                                        );
                                                        setErrors(prev => ({ ...prev, personalIdentificationNumber: "" }));
                                                    }}
                                                    onBlur={() => {
                                                        if (
                                                            customer.personalIdentificationNumber &&
                                                            !/^[A-Z]\d{9}[A-Z]$/.test(
                                                                customer.personalIdentificationNumber
                                                            )
                                                        ) {
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                personalIdentificationNumber:
                                                                    "KRA PIN must be in format A123456789B",
                                                            }));
                                                        }
                                                    }}
                                                    className={
                                                        errors.personalIdentificationNumber
                                                            ? "border-red-500 focus-visible:ring-red-500"
                                                            : ""
                                                    }
                                                />

                                                {errors.personalIdentificationNumber && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.personalIdentificationNumber}
                                                    </p>
                                                )}
                                            </div>


                                            <div>
                                                <Label>Gender</Label>
                                                <select
                                                    value={customer.individualGender}
                                                    onChange={(e) => update("individualGender", e.target.value)}
                                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="">Select gender</option>
                                                    <option value="1">Male</option>
                                                    <option value="2">Female</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label>City</Label>
                                                <Input
                                                    value={customer.addressCity}
                                                    onChange={e => update("addressCity", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label>Postal Code</Label>
                                                <Input
                                                    value={customer.addressPostalCode}
                                                    onChange={e => update("addressPostalCode", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Place Of Birth</Label>
                                                <Input
                                                    value={customer.addressStreet}
                                                    onChange={(e) => update("addressStreet", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Nationality</Label>
                                                <select
                                                    value={customer.individualNationality}
                                                    onChange={(e) => update("individualNationality", e.target.value)}
                                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="">Select Marital Status</option>
                                                    <option value="Kenya">Kenya</option>
                                                    <option value="Ukraine">Ukraine</option>
                                                </select>
                                            </div>

                                            <div>
                                                <Label>Payroll Number</Label>
                                                <Input
                                                    value={customer.individualPayrollNumbers}
                                                    onChange={(e) => update("individualPayrollNumbers", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label>Branch</Label>
                                                <Select
                                                    onValueChange={(value) => update("branchId", value)}
                                                    value={customer.branchId}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select branch" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {branches.map((b) => (
                                                            <SelectItem key={b.Id} value={b.Id}>
                                                                {b.Description}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label>Station</Label>
                                                <Select
                                                    onValueChange={(value) => update("stationId", value)}
                                                    value={customer.stationId}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select station" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {stations.map((s) => (
                                                            <SelectItem key={s.Id} value={s.Id}>
                                                                {s.Description}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label>Designation</Label>
                                                <Input
                                                    value={customer.individualEmploymentDesignation}
                                                    onChange={e => update("individualEmploymentDesignation", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label>Terms of Service</Label>
                                                <select
                                                    value={customer.individualEmploymentTermsOfService}
                                                    onChange={e => update("individualEmploymentTermsOfService", e.target.value)}
                                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="">Select Terms of Service</option>
                                                    <option value="1">Permanent</option>
                                                    <option value="2">Contract</option>
                                                    <option value="3">Casual</option>
                                                    <option value="4">Self-Employed</option>
                                                    <option value="5">Unemployed</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label>Registration Date</Label>
                                                <Input
                                                    type="date"
                                                    value={customer.createdDate}
                                                    onChange={e => update("createdDate", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Bank Account Number</Label>
                                                <Input
                                                    value={customer.reference1}
                                                    onChange={e => update("reference1", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Bank Name</Label>
                                                <select
                                                    value={customer.bankName}
                                                    onChange={e => update("bankName", e.target.value)}
                                                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="">Select Bank</option>
                                                    <option value="KCB">KCB</option>
                                                    <option value="EQUITY">EQUITY</option>
                                                    <option value="Cooperative">Cooperative</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label>Branch Name</Label>
                                                <Input
                                                    value={customer.branchName}
                                                    onChange={e => update("branchName", e.target.value)}
                                                />
                                            </div>

                                        </div>
                                    </section>
                                )}


                                {/* STEP 2 – NEXT OF KIN */}
                                {step === 2 && (
                                    <section>
                                        <h3 className="text-lg font-semibold mb-2 bg-indigo-700 text-white p-3 rounded-2xl">Next of Kin</h3>
                                        <div className="flex justify-end items-center p-2">
                                            <p className={`mt-4 font-semibold ${totalNokPercentage === 100 ? "text-green-600" : "text-red-600"
                                                }`}>
                                                Total Allocation: {totalNokPercentage}% / 100%
                                            </p>

                                        </div>

                                        {nextOfKins.map((nok, index) => (
                                            <div
                                                key={index}
                                                className=" mb-6 p-4 border rounded-lg"
                                            >
                                                {/* REMOVE BUTTON */}
                                                {nextOfKins.length > 1 && (
                                                    <div className="flex justify-between items-center bg-gray-200 rounded-md p-2 px-4 mb-3">
                                                        <h3 className="font-medium">Next of Kin {index + 1}</h3>
                                                        <Button
                                                            onClick={() => removeNextOfKin(index)}
                                                            className="text-sm bg-red-600 hover:bg-red-800 text-red-100 hover:text-red-100"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                                    <div>
                                                        <Label>First Name</Label>
                                                        <Input
                                                            value={nok.firstName}
                                                            onChange={(e) =>
                                                                updateNextOfKin(index, "firstName", e.target.value)
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label>Last Name</Label>
                                                        <Input
                                                            value={nok.lastName}
                                                            onChange={(e) =>
                                                                updateNextOfKin(index, "lastName", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Gender</Label>
                                                        <select
                                                            value={nok.gender}
                                                            onChange={(e) =>
                                                                updateNextOfKin(index, "gender", e.target.value)
                                                            }
                                                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="1">Male</option>
                                                            <option value="2">Female</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <Label>Relationship</Label>
                                                        <select
                                                            value={nok.relationship}
                                                            onChange={(e) =>
                                                                updateNextOfKin(index, "relationship", e.target.value)
                                                            }
                                                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                        >
                                                            <option value="">Select Relationship</option>
                                                            <option value="1">Spouse</option>
                                                            <option value="2">Parent</option>
                                                            <option value="3">Guardian</option>
                                                            <option value="4">Child</option>
                                                            <option value="5">Sibling</option>
                                                            <option value="6">Other</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <Label>Percentage</Label>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            value={nok.nominatedPercentage}
                                                            onChange={(e) => {
                                                                const newValue = Number(e.target.value);

                                                                // total without current row
                                                                const otherTotal = nextOfKins.reduce(
                                                                    (sum, k, i) =>
                                                                        i === index ? sum : sum + Number(k.nominatedPercentage || 0),
                                                                    0
                                                                );

                                                                if (otherTotal + newValue > 100) {
                                                                    Swal.fire({
                                                                        icon: "warning",
                                                                        title: "Invalid Percentage",
                                                                        text: `Total percentage cannot exceed 100%. Remaining: ${100 - otherTotal}%`,
                                                                    });
                                                                    return;
                                                                }

                                                                updateNextOfKin(index, "nominatedPercentage", newValue);
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        ))}


                                        <Button variant="outline" className="bg-indigo-600 text-white" onClick={addNextOfKin}>
                                            + Add Next of Kin
                                        </Button>
                                    </section>
                                )}


                                {/* STEP 6 – UPLOADS */}
                                {step === 3 && (
                                    <section>
                                        <h3 className="text-lg font-semibold mb-3">Uploads</h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>ID Front Image</Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, "identityCardFrontSideImageId")}
                                                />
                                                {customer.identityCardFrontSideImageId && (
                                                    <p className="text-green-600 text-sm mt-1">Uploaded ✓</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label>ID Back Image</Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, "identityCardBackSideImageId")}
                                                />
                                                {customer.identityCardBackSideImageId && (
                                                    <p className="text-green-600 text-sm mt-1">Uploaded ✓</p>
                                                )}
                                            </div>

                                            {/* PASSPORT IMAGE */}
                                            <div>
                                                <Label>Passport Image</Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, "passportImageId")}
                                                />
                                                {customer.passportImageId && (
                                                    <p className="text-green-600 text-sm mt-1">Uploaded ✓</p>
                                                )}
                                            </div>

                                            {/* SIGNATURE IMAGE */}
                                            <div>
                                                <Label>Signature Image</Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, "signatureImageId")}
                                                />
                                                {customer.signatureImageId && (
                                                    <p className="text-green-600 text-sm mt-1">Uploaded ✓</p>
                                                )}
                                            </div>

                                            {/* REMARKS */}
                                            <div className="col-span-2">
                                                <Label>Remarks</Label>
                                                <Input
                                                    value={customer.remarks}
                                                    onChange={(e) => update("remarks", e.target.value)}
                                                />
                                            </div>

                                        </div>
                                    </section>
                                )}

                                {/* NAVIGATION BUTTONS */}
                                <div className="flex justify-between mt-10">
                                    {step > 1 ? (
                                        <Button variant="outline" onClick={back} disabled={loading}>
                                            Back
                                        </Button>

                                    ) : <span></span>}

                                    {step < 3 ? (
                                        <Button
                                            onClick={() => {
                                                if (step === 2 && totalNokPercentage > 100) {
                                                    Swal.fire(
                                                        "Invalid Allocation",
                                                        `Next of Kin percentages cannot exceed 100%. Current: ${totalNokPercentage}%`,
                                                        "error"
                                                    );
                                                    return;
                                                }
                                                next();
                                            }}
                                            disabled={loading}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button onClick={handleSubmit} disabled={loading}>
                                            {loading ? "Submitting..." : "Submit"}
                                        </Button>

                                    )}
                                </div>
                            </main>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
