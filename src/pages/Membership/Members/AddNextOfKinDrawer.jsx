import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AddNextOfKinDrawer({ open, onClose, customerId, refresh }) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        Salutation: 1,
        Gender: 1,
        Relationship: 1,
        FirstName: "",
        LastName: "",
        IdentityCardType: 1,
        IdentityCardNumber: "",
        AddressAddressLine1: "",
        AddressCity: "",
        AddressMobileLine: "",
        NominatedPercentage: "",
        Remarks: "",
    });

    const update = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        if (!form.FirstName || !form.LastName) {
            Swal.fire("Error", "First name and last name are required", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/nextofkins`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        CustomerId: customerId,
                        ...form,
                        NominatedPercentage: Number(form.NominatedPercentage),
                        CreatedBy: "admin",
                    }),
                }
            );

            if (!response.ok) throw new Error("Failed to add next of kin");

            console.log(response);
            const data = await response.json();

            console.log(data);

            Swal.fire("Success!", "Next of Kin added successfully", "success");
            refresh?.();
            onClose();

            // Reset form
            setForm({
                Salutation: 1,
                Gender: 1,
                Relationship: 1,
                FirstName: "",
                LastName: "",
                IdentityCardType: 1,
                IdentityCardNumber: "",
                AddressAddressLine1: "",
                AddressCity: "",
                AddressMobileLine: "",
                NominatedPercentage: "",
                Remarks: "",
            });
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setLoading(false);
        }
    };


    console.log(form);
    
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="fixed top-3 right-3 w-[80vw] max-w-[520px] bg-white shadow-2xl z-50 flex flex-col rounded-2xl"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="p-4 flex justify-between items-center bg-indigo-700 rounded-2xl m-2">
                            <h2 className="font-bold text-xl text-white">
                                Add Next of Kin
                            </h2>
                            <Button variant="outline" size="sm" onClick={onClose}>
                                Close
                            </Button>
                        </div>

                        {/* Form */}
                        <div className="p-5 overflow-y-auto h-[65vh] bg-gray-50 rounded-xl m-3">
                            <div className="grid grid-cols-1 gap-4">

                                <div>
                                    <Label>First Name</Label>
                                    <Input
                                        value={form.FirstName}
                                        onChange={(e) => update("FirstName", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Last Name</Label>
                                    <Input
                                        value={form.LastName}
                                        onChange={(e) => update("LastName", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Mobile Number</Label>
                                    <Input
                                        value={form.AddressMobileLine}
                                        onChange={(e) =>
                                            update("AddressMobileLine", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>ID Number</Label>
                                    <Input
                                        value={form.IdentityCardNumber}
                                        onChange={(e) =>
                                            update("IdentityCardNumber", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>Address</Label>
                                    <Input
                                        value={form.AddressAddressLine1}
                                        onChange={(e) =>
                                            update("AddressAddressLine1", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>City</Label>
                                    <Input
                                        value={form.AddressCity}
                                        onChange={(e) =>
                                            update("AddressCity", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>Nominated Percentage (%)</Label>
                                    <Input
                                        type="number"
                                        value={form.NominatedPercentage}
                                        onChange={(e) =>
                                            update("NominatedPercentage", e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <Label>Remarks</Label>
                                    <Input
                                        value={form.Remarks}
                                        onChange={(e) => update("Remarks", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end mt-8">
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Submitting..." : "Submit"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
