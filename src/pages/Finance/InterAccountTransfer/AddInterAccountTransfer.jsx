import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { Trash2, Plus, AlertTriangle } from "lucide-react";

const EMPTY_LINE = {
    customerAccountId: "",
    customerId: "",
    accountName: "",
    description: "",
    amount: "",
    availableBalance: 0,
};

// Safe fetch helper
const safeFetchArray = async (url) => {
    try {
        const res = await fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } });
        const data = await res.json();
        const arr = data.Data || data.data || [];
        return Array.isArray(arr) ? arr : [];
    } catch (err) {
        console.error("API fetch failed:", url, err);
        return [];
    }
};

export default function AddInterAccountTransfer({ open, onClose, onSuccess }) {
    const [lines, setLines] = useState([{ ...EMPTY_LINE }]);
    const [members, setMembers] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [customerAccount, setCustomerAccount] = useState([]);
    const [banks, setBanks] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBankId, setSelectedBankId] = useState("");
    const [branchId, setBranchId] = useState("");
    const [loading, setLoading] = useState(false);
    const [reference, setReference] = useState("");
    const [memberModalOpen, setMemberModalOpen] = useState(false);

    const totalAmount = useMemo(
        () => lines.reduce((sum, l) => sum + Number(l.amount || 0), 0),
        [lines]
    );

    const activeCustomerAccounts = useMemo(
        () => customerAccount.filter(a => a.StatusDescription !== "Inactive"),
        [customerAccount]
    );

    // Load lookups on mount
    useEffect(() => {
        safeFetchArray(`${import.meta.env.VITE_APP_FIN_URL}/api/values/GetChartOfAccount`);
        safeFetchArray(`${import.meta.env.VITE_APP_FIN_URL}/api/values/branches`).then(setBranches);
        safeFetchArray(`${import.meta.env.VITE_APP_FIN_URL}/api/values/getBankWithLinkages`).then(setBanks);
        safeFetchArray(`${import.meta.env.VITE_APP_MEMBERSHIP_URL}/api/customers`).then(setMembers);
    }, []);

    // Load customer accounts when a member is selected
    useEffect(() => {
        if (!selectedMemberId) {
            setCustomerAccount([]);
            return;
        }
        safeFetchArray(
            `${import.meta.env.VITE_APP_FIN_URL}/api/values/CustomerAccount/by-customer?customerId=${selectedMemberId}`
        ).then(setCustomerAccount);
    }, [selectedMemberId]);

    const addLine = () => setLines(p => [...p, { ...EMPTY_LINE }]);
    const removeLine = (i) => setLines(p => p.filter((_, idx) => idx !== i));
    const updateLine = (i, patch) => setLines(p => p.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

    const onMemberSelect = (memberId) => {
        setSelectedMemberId(memberId);
    };

    const onBankSelect = (bankId) => {
        const bank = banks.find(b => b.Id === bankId);
        if (!bank) return;
        setSelectedBankId(bank.Id);
        setBankId(bank.BankId);
        setBranchId(bank.BranchId);
    };

    const postBatch = async () => {
        if (!branchId || !selectedBankId) {
            Swal.fire("Error", "Branch and Bank are required", "error");
            return;
        }
        if (lines.some(l => !l.amount || !l.customerAccountId || !l.customerId)) {
            Swal.fire("Error", "All batch lines must have account, customer, and amount", "error");
            return;
        }

        const payload = {
            branchId,
            bankAccountId: selectedBankId,
            reference: reference || "AUTO-BATCH",
            receipts: lines.map(l => ({
                totalValue: Number(l.amount),
                customerAccount: { id: l.customerAccountId },
                customerDTO: { id: l.customerId },
            })),
        };

        setLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_APP_FIN_URL}/api/values/CustomerReceipt`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
                    body: JSON.stringify(payload),
                }
            );
            const data = await res.json();

            if (data.success) {
                Swal.fire("Success", "Batch posted successfully", "success");
                setLines([{ ...EMPTY_LINE }]);
                setReference("");
                setSelectedMemberId("");
                if (onSuccess) onSuccess(data);
            } else {
                Swal.fire("Error", data.message || "Failed to post batch", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Network error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-auto"
                >
                    <div className="p-6 flex justify-between items-center border-b">
                        <h2 className="text-xl font-bold">Add Inter-Account Transfer Batch</h2>
                        <Button variant="ghost" onClick={() => onClose(false)}>Close</Button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Member</Label>
                                <Select value={selectedMemberId} onValueChange={onMemberSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.length === 0 ? (
                                            <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                No members available
                                            </div>
                                        ) : members.map(m => (
                                            <SelectItem key={m.Id} value={m.Id}>
                                                {m.IndividualFirstName} {m.IndividualLastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Bank</Label>
                                <Select value={selectedBankId} onValueChange={onBankSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {banks.map(b => (
                                            <SelectItem key={b.Id} value={b.Id}>
                                                {b.BankName} | {b.BankBranchName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Branch</Label>
                                <Select value={branchId} onValueChange={setBranchId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map(b => (
                                            <SelectItem key={b.Id} value={b.Id}>{b.Description}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Reference</Label>
                                <Input value={reference} onChange={e => setReference(e.target.value)} />
                            </div>
                        </div>

                        {/* Batch Lines */}
                        <div className="border rounded">
                            <div className="grid grid-cols-12 bg-gray-600 text-white p-2 text-xs font-semibold uppercase">
                                <div className="col-span-3">Account</div>
                                <div className="col-span-3">Description</div>
                                <div className="col-span-3">Amount</div>
                                <div className="col-span-3 text-right"></div>
                            </div>

                            {lines.map((l, i) => (
                                <div key={i} className="grid grid-cols-12 border-b p-2 bg-gray-50">
                                    <div className="col-span-3">
                                        <Select
                                            value={l.customerAccountId}
                                            onValueChange={v => {
                                                const [customerAccountId, customerId, accountName] = v.split("|");
                                                const selectedAccount = customerAccount.find(a => a.Id === customerAccountId);
                                                const balance = selectedAccount?.AvailableBalance || 0;
                                                updateLine(i, { customerAccountId, customerId, accountName, availableBalance: balance });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {activeCustomerAccounts.length === 0 ? (
                                                    <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                        No active accounts
                                                    </div>
                                                ) : activeCustomerAccounts.map(a => (
                                                    <SelectItem
                                                        key={a.Id}
                                                        value={`${a.Id}|${a.CustomerId}|${a.CustomerAccountTypeTargetProductDescription}`}
                                                    >
                                                        {a.CustomerAccountTypeTargetProductDescription}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-3">
                                        <Input
                                            placeholder="Description"
                                            value={l.description}
                                            onChange={e => updateLine(i, { description: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            placeholder="Amount"
                                            value={l.amount}
                                            onChange={e => updateLine(i, { amount: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-3 text-right">
                                        {lines.length > 1 && (
                                            <Button size="icon" variant="ghost" onClick={() => removeLine(i)}>
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="p-2 text-right font-semibold">
                                Total: {totalAmount.toLocaleString()}
                            </div>
                        </div>

                        <Button variant="outline" onClick={addLine} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add Line
                        </Button>

                        <div className="flex justify-end gap-2">
                            <Button onClick={postBatch} className="bg-indigo-700 text-white">
                                {loading ? "Posting..." : "Post Batch"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
