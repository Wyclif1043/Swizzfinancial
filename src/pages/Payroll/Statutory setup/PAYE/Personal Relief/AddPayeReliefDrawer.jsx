import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import Base_Url from "../../../../../apis/BaseApi";

export default function AddPayeReliefDrawer({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    taxYear: "",
    monthlyRelief: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await Base_Url.post("/paye-reliefs",{taxYear: Number(formData.taxYear),monthlyRelief: Number(formData.monthlyRelief)});
      

      if (res.status !== 200) throw new Error("Failed to create personal relief");

      Swal.fire("Success!", "Personal relief added successfully.", "success");
      setFormData({ taxYear: "", monthlyRelief: "" });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="fixed top-5 right-5 w-[480px] bg-white shadow-xl z-50 flex flex-col rounded-2xl p-3"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-indigo-600 rounded-2xl m-2">
              <h2 className="font-bold text-lg text-white">
                Add Personal Relief
              </h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            {/* Form */}
            <div className="p-3 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tax Year</Label>
                  <Input
                    type="number"
                    name="taxYear"
                    value={formData.taxYear}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Monthly Relief</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="monthlyRelief"
                    value={formData.monthlyRelief}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? "Saving..." : "Save Relief"}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
