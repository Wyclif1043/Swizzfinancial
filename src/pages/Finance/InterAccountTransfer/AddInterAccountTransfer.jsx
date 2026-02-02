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
  customerId: "",
  customerAccountId: "",
  accountName: "",
  description: "",
  principal: "",
  interest: "",
  availableBalance: 0,
};

export default function AddInterAccountTransfer({ open, onClose, onSuccess }) {
  const [lines, setLines] = useState([{ ...EMPTY_LINE }]);
  const [customers, setCustomers] = useState([]);

  const [selectedSourceMemberId, setSelectedSourceMemberId] = useState("");
  const [sourceAccounts, setSourceAccounts] = useState([]);
  const [selectedSourceAccountId, setSelectedSourceAccountId] = useState("");

  const [banks, setBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPrincipal = useMemo(
    () => lines.reduce((sum, l) => sum + Number(l.principal || 0), 0),
    [lines]
  );
  const totalInterest = useMemo(
    () => lines.reduce((sum, l) => sum + Number(l.interest || 0), 0),
    [lines]
  );

  // Fetch members
  useEffect(() => {
    fetch("http://88.99.215.90:8600/api/values/GetMembersWithDetails", {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then(res => res.json())
      .then(data => {
        if (data.Success) setCustomers(data.Data.Members || []);
      })
      .catch(() => Swal.fire("Error", "Failed to load members", "error"));
  }, []);

  // Fetch banks
  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_FIN_URL}/api/values/getBankWithLinkages`)
      .then(res => res.json())
      .then(data => setBanks(data.Data || []));
  }, []);

  // Update branches whenever selected bank changes
  useEffect(() => {
    if (!selectedBankId) {
      setBranches([]);
      setSelectedBranchId("");
      return;
    }
    const bank = banks.find(b => b.Id === selectedBankId);
    setBranches(bank?.Branches || []); // assuming API returns branches per bank
    setSelectedBranchId(""); // reset branch on bank change
  }, [selectedBankId, banks]);

  const addLine = () => setLines(p => [...p, { ...EMPTY_LINE }]);
  const removeLine = (i) => setLines(p => p.filter((_, idx) => idx !== i));
  const updateLine = (i, patch) => setLines(p => p.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const onSourceMemberSelect = (memberId) => {
    setSelectedSourceMemberId(memberId);
    const member = customers.find(c => c.Customer.Id === memberId);
    setSourceAccounts(member?.Accounts || []);
    setSelectedSourceAccountId("");
  };

  const onEntryMemberSelect = (lineIndex, memberId) => {
    const member = customers.find(c => c.Customer.Id === memberId);
    updateLine(lineIndex, {
      customerId: memberId,
      customerAccountId: "",
      accountName: "",
      availableBalance: 0,
      memberAccounts: member?.Accounts || [],
    });
  };

  const onEntryAccountSelect = (lineIndex, accountId) => {
    const line = lines[lineIndex];
    const account = (line.memberAccounts || []).find(a => a.Id === accountId);
    if (!account) return;
    updateLine(lineIndex, {
      customerAccountId: account.Id,
      accountName: account.AccountName,
      availableBalance: account.AvailableBalance,
    });
  };

  const postBatch = async () => {
    if (!selectedSourceAccountId || !selectedBankId || !selectedBranchId) {
      Swal.fire("Error", "Please select source account, bank, and branch", "error");
      return;
    }

    if (lines.some(l => !l.principal || !l.customerAccountId || !l.customerId)) {
      Swal.fire("Error", "All batch lines must have member, account, and principal", "error");
      return;
    }

    const payload = {
      branchId: selectedBranchId,
      bankAccountId: selectedBankId,
      sourceAccountId: selectedSourceAccountId,
      reference: reference || `REF-${Math.floor(Math.random() * 9999)}`,
      interAccountBatchEntries: lines.map(l => ({
        customerId: l.customerId,
        customerAccountId: l.customerAccountId,
        principal: Number(l.principal),
        interest: Number(l.interest || 0),
        primaryDescription: l.description || "Transfer",
        secondaryDescription: "",
        reference: `REF-${Math.floor(Math.random() * 9999)}`,
        createdBy: "system.user",
      })),
    };

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_FIN_URL}/api/values/InterAccountBatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", "Batch posted successfully", "success");
        setLines([{ ...EMPTY_LINE }]);
        setReference("");
        setSelectedSourceMemberId("");
        setSelectedSourceAccountId("");
        setSelectedBankId("");
        setSelectedBranchId("");
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
            {/* HEADER */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Source Member</Label>
                <Select value={selectedSourceMemberId} onValueChange={onSourceMemberSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(m => (
                      <SelectItem key={m.Customer.Id} value={m.Customer.Id}>
                        {m.Customer.IndividualFirstName} {m.Customer.IndividualLastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Source Account</Label>
                <Select value={selectedSourceAccountId} onValueChange={setSelectedSourceAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceAccounts.map(a => (
                      <SelectItem key={a.Id} value={a.Id}>
                        {a.AccountName} | Balance: {a.AvailableBalance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Bank</Label>
                <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map(b => (
                      <SelectItem key={b.Id} value={b.Id}>
                        {b.BankName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Branch</Label>
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b.Id} value={b.Id}>
                        {b.Description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Reference</Label>
                <Input value={reference} onChange={e => setReference(e.target.value)} />
              </div>
            </div>

            {/* LINES */}
            <div className="border rounded">
              <div className="grid grid-cols-12 bg-gray-600 text-white p-2 text-xs font-semibold uppercase">
                <div className="col-span-3">Member</div>
                <div className="col-span-3">Account</div>
                <div className="col-span-2">Principal</div>
                <div className="col-span-2">Interest</div>
                <div className="col-span-2 text-right"></div>
              </div>

              {lines.map((l, i) => (
                <div key={i} className="grid grid-cols-12 border-b p-2 bg-gray-50">
                  <div className="col-span-3">
                    <Select value={l.customerId || ""} onValueChange={v => onEntryMemberSelect(i, v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(m => (
                          <SelectItem key={m.Customer.Id} value={m.Customer.Id}>
                            {m.Customer.IndividualFirstName} {m.Customer.IndividualLastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-3">
                    <Select value={l.customerAccountId || ""} onValueChange={v => onEntryAccountSelect(i, v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {(l.memberAccounts || []).map(a => (
                          <SelectItem key={a.Id} value={a.Id}>
                            {a.AccountName} | Balance: {a.AvailableBalance}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Input type="number" placeholder="Principal" value={l.principal} onChange={e => updateLine(i, { principal: e.target.value })} />
                  </div>

                  <div className="col-span-2">
                    <Input type="number" placeholder="Interest" value={l.interest} onChange={e => updateLine(i, { interest: e.target.value })} />
                  </div>

                  <div className="col-span-2 text-right">
                    {lines.length > 1 && (
                      <Button size="icon" variant="ghost" onClick={() => removeLine(i)}>
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="p-2 text-right font-semibold">
                Total Principal: {totalPrincipal.toLocaleString()} | Total Interest: {totalInterest.toLocaleString()}
              </div>
            </div>

            <Button variant="outline" onClick={addLine} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Line
            </Button>

            <div className="flex justify-end gap-2">
              <Button onClick={postBatch} className="bg-indigo-700 text-white">{loading ? "Posting..." : "Post Batch"}</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
