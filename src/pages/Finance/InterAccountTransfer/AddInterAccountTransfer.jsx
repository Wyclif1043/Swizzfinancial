import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

const API_BASE = "http://88.99.215.90:8600/api";

export default function AddInterAccountBatchDrawer({ open, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const [branches, setBranches] = useState([]);
    const [branchDisplay, setBranchDisplay] = useState("");

    const [accounts, setAccounts] = useState([]);
    const [accountDisplay, setAccountDisplay] = useState("");

    const [postingPeriods, setPostingPeriods] = useState([]);
    const [postingPeriodDisplay, setPostingPeriodDisplay] = useState("");

    const [formData, setFormData] = useState({
        branchId: "",
        customerAccountId: "",
        postingPeriodId: "",
        reference: "",
        availableBalance: 0,
        startDate: "",
        endDate: "",
        wireTransferAuthOption: 1,
        interAccountBatchEntries: [],
    });

    useEffect(() => {
        if (!open) return;

        const loadLookups = async () => {
            try {
                const [branchesRes, periodsRes, accountsRes] = await Promise.all([
                    fetch(`${API_BASE}/values/branches`),
                    fetch(`${API_BASE}/loaning/GetPostingPeriods`),
                    fetch(`${API_BASE}/values/customeraccounts`)
                ]);

                setBranches((await branchesRes.json()).Data || []);
                setPostingPeriods(await periodsRes.json());
                setAccounts(await accountsRes.json());
            } catch {
                Swal.fire("Error", "Failed to load lookups", "error");
            }
        };

        loadLookups();
    }, [open]);

    const handleChange = (field, value) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(
                `${API_BASE}/values/InterAccountTransferBatch`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!res.ok) throw new Error("Failed to create batch");

            Swal.fire("Success", "Batch created successfully", "success");
            onSuccess?.();
            onClose();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed top-5 right-3 w-[720px] bg-white shadow-xl z-50 rounded-2xl p-4"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                    >
                        <div className="flex justify-between items-center bg-indigo-600 p-4 rounded-xl mb-4">
                            <h2 className="text-white font-bold">
                                New Inter-Account Batch
                            </h2>
                            <Button size="sm" variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>

                        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                            {/* Branch */}
                            <div>
                                <Label>Branch</Label>
                                <Input
                                    list="branches"
                                    value={branchDisplay}
                                    onChange={(e) => {
                                        setBranchDisplay(e.target.value);
                                        const b = branches.find(x => x.Description === e.target.value);
                                        if (b) handleChange("branchId", b.Id);
                                    }}
                                    required
                                />
                                <datalist id="branches">
                                    {branches.map(b => (
                                        <option key={b.Id} value={b.Description} />
                                    ))}
                                </datalist>
                            </div>

                            {/* Account */}
                            <div>
                                <Label>Customer Account</Label>
                                <Input
                                    list="accounts"
                                    value={accountDisplay}
                                    onChange={(e) => {
                                        setAccountDisplay(e.target.value);
                                        const a = accounts.find(x => x.FullAccountNumber === e.target.value);
                                        if (a) handleChange("customerAccountId", a.Id);
                                    }}
                                    required
                                />
                                <datalist id="accounts">
                                    {accounts.map(a => (
                                        <option key={a.Id} value={a.FullAccountNumber} />
                                    ))}
                                </datalist>
                            </div>

                            {/* Posting Period */}
                            <div>
                                <Label>Posting Period</Label>
                                <Input
                                    list="periods"
                                    value={postingPeriodDisplay}
                                    onChange={(e) => {
                                        setPostingPeriodDisplay(e.target.value);
                                        const p = postingPeriods.find(x => x.Description === e.target.value);
                                        if (p) handleChange("postingPeriodId", p.Id);
                                    }}
                                    required
                                />
                                <datalist id="periods">
                                    {postingPeriods.map(p => (
                                        <option key={p.Id} value={p.Description} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <Label>Reference</Label>
                                <Input
                                    value={formData.reference}
                                    onChange={e => handleChange("reference", e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="col-span-2 bg-indigo-600"
                            >
                                {loading ? "Saving..." : "Create Batch"}
                            </Button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
