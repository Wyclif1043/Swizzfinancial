import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import AddInterAccountBatchDrawer from "./AddInterAccountTransfer";

const API_BASE = "http://88.99.215.90:8600/api/values";

export default function InterAccountTransferBatchIndex() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/FindInterTransferBatches`, {
                headers: { "ngrok-skip-browser-warning": "true" },
            });
            const json = await res.json();
            setBatches(json?.data || []);
        } catch {
            Swal.fire("Error", "Failed to load batches", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">
                    Inter-Account Transfer Batches
                </h1>
                <Button onClick={() => setOpenDrawer(true)}>
                    + New Batch
                </Button>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Batch No</th>
                            <th className="p-2 text-left">Reference</th>
                            <th className="p-2 text-left">Customer</th>
                            <th className="p-2 text-left">Account</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Posted</th>
                            <th className="p-2 text-left">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="7" className="p-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && batches.length === 0 && (
                            <tr>
                                <td colSpan="7" className="p-4 text-center">
                                    No records found
                                </td>
                            </tr>
                        )}

                        {batches.map(b => (
                            <tr key={b.Id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{b.PaddedBatchNumber}</td>
                                <td className="p-2">{b.Reference}</td>
                                <td className="p-2">{b.CustomerAccountCustomerFullName}</td>
                                <td className="p-2">{b.CustomerAccountFullAccountNumber}</td>
                                <td className="p-2">{b.StatusDescription}</td>
                                <td className="p-2">{b.PostedEntries}</td>
                                <td className="p-2">
                                    {new Date(b.CreatedDate).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddInterAccountBatchDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onSuccess={fetchBatches}
            />
        </div>
    );
}
