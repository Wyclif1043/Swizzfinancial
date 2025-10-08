import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import Base_Url from "../../../../apis/BaseApi";

export default function EditContributionDrawer({ open, onClose, onSuccess, contribution }) {
  const [formData, setFormData] = useState({
    Id: "",
    ContributionRate: "",
    ContributionAmount: "",
  });
  const [loading, setLoading] = useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (contribution) {
      setFormData({
        Id: contribution.Id,
        ContributionRate: contribution.ContributionRate,
        ContributionAmount: contribution.ContributionAmount,
      });
    }
  }, [contribution]);

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await Base_Url.put(`/sha-rates/update/${formData.Id}`,formData);
      if (res.status !== 200) throw new Error("Failed to update contribution");

      Swal.fire("Success", "Contribution updated successfully!", "success");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update contribution.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && contribution && (
        <>
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-5 right-5 w-[480px] bg-white shadow-xl z-50 flex flex-col rounded-2xl p-3"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 rounded-2xl m-2">
              <h2 className="font-bold text-lg text-white">Edit Contribution</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            <div className="p-3 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Contribution Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.ContributionRate}
                    onChange={(e) =>
                      setFormData({ ...formData, ContributionRate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Contribution Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.ContributionAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, ContributionAmount: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "Update Contribution"}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
