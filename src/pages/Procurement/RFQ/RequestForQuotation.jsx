import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronDown, FaChevronUp, FaBuilding, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";
//import AddRequestForQuotation from "./AddRequestForQuotation";
import AddRFQ from "./AddRFQ";

export default function RequestForQuotation() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  // ✅ Fetch RFQs exactly as per structure
  const fetchRFQs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_PRO_URL}/api/rfq/GetRFQs`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();

      if (data.Success && Array.isArray(data.Data)) {
        setRfqs(data.Data);
      } else {
        setRfqs([]);
      }
    } catch (error) {
      console.error("Error fetching RFQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, []);

  return (
    <div className="bg-white m-8 px-8 py-8 rounded-lg">
      <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaBuilding className="text-white" /> Request For Quotation
        </h2>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          onClick={() => setAddDrawerOpen(true)}
        >
          <FaPlus /> Add Request For Quotation
        </Button>
      </div>
      {/* HEADER */}
      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-9 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span className="col-span-1">RFQ Number</span>
          <span className="col-span-1">Vendor</span>
          <span className="col-span-1">Priority</span>
          <span className="col-span-1">Department</span>
          <span className="col-span-1">Requested By</span>
          <span className="col-span-1">Budget</span>
          <span className="col-span-1">Delivery Date</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-9 gap-2 bg-gray-50 py-4 px-6 rounded"
              >
                {Array.from({ length: 9 }).map((__, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        ) : rfqs.length > 0 ? (
          <div className="space-y-2">
            {rfqs.map((rfq) => (
              <div key={rfq.Id} className="bg-white rounded-lg shadow-lg border">
                {/* ROW */}
                <div className="grid grid-cols-9 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                  <span className="font-medium text-indigo-700 col-span-1">
                    {rfq.RFQNumber}
                  </span>
                  <span className="flex items-center gap-2 col-span-1">
                    <FaBuilding className="text-gray-500" />
                    {rfq.VendorName || "—"}
                  </span>
                  <span className="text-sm font-semibold col-span-1">
                    {rfq.Priority}
                  </span>
                  <span className="col-span-1">{rfq.Department}</span>
                  <span className="col-span-1">{rfq.RequestedBy}</span>
                  <span className="font-semibold col-span-1">
                    {rfq.EstimatedBudget
                      ? `KES ${rfq.EstimatedBudget.toLocaleString()}`
                      : "—"}
                  </span>
                  <span className="col-span-1">
                    {new Date(rfq.ExpectedDeliveryDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-sm w-24 rounded-2xl text-center flex items-center justify-center p-1 text-white ${rfq.Status === "Open"
                      ? "bg-green-600"
                      : rfq.Status === "Closed"
                        ? "bg-gray-500"
                        : "bg-yellow-500"
                      }`}
                  >
                    {rfq.Status}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex gap-2 justify-end col-span-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white"
                      onClick={() =>
                        setExpandedRow(expandedRow === rfq.Id ? null : rfq.Id)
                      }
                    >
                      {expandedRow === rfq.Id ? (
                        <>
                          <FaChevronUp /> Hide Lines
                        </>
                      ) : (
                        <>
                          <FaChevronDown /> View Lines
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* EXPANDED SECTION */}
                {expandedRow === rfq.Id && (
                  <div className="bg-gray-100 px-6 py-4 border-t">
                    <h4 className="font-semibold mb-2">Line Items</h4>

                    {/* LINES TABLE */}
                    <div className="bg-gray-300 p-2 rounded-lg">
                      <div className="grid grid-cols-8 gap-4 font-semibold bg-gray-700 text-white py-2 px-4 rounded">
                        <span>#</span>
                        <span>Item Code</span>
                        <span>Description</span>
                        <span>Qty</span>
                        <span>Unit</span>
                        <span>Unit Price (Est.)</span>
                        <span>Total (Est.)</span>
                        <span>Notes</span>
                      </div>

                      {rfq.Lines && rfq.Lines.length > 0 ? (
                        rfq.Lines.map((line, i) => (
                          <div
                            key={line.Id}
                            className="grid grid-cols-8 gap-4 py-2 px-4 border-b-2 border-gray-50 last:border-0"
                          >
                            <span>{i + 1}</span>
                            <span>{line.ItemCode}</span>
                            <span>{line.ItemDescription}</span>
                            <span>{line.Quantity}</span>
                            <span>{line.UnitOfMeasure}</span>
                            <span>
                              KES {line.EstimatedUnitPrice.toLocaleString()}
                            </span>
                            <span className="font-medium">
                              KES {line.EstimatedTotal.toLocaleString()}
                            </span>
                            <span>{line.Notes}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-2 text-gray-600">
                          No Line Items found.
                        </p>
                      )}
                    </div>

                    {/* ADDITIONAL DETAILS */}
                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Created Date:</strong>{" "}
                        {new Date(rfq.CreatedDate).toLocaleString()}
                      </p>
                      <p>
                        <strong>Delivery Location:</strong>{" "}
                        {rfq.DeliveryLocation}
                      </p>
                      <p>
                        <strong>Additional Notes:</strong>{" "}
                        {rfq.AdditionalNotes}
                      </p>
                      {rfq.VendorIds && rfq.VendorIds.length > 0 && (
                        <p>
                          <strong>Vendor IDs:</strong>{" "}
                          {rfq.VendorIds.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-4">
            <img
              src={NotFoundImage}
              alt="Not Found"
              className="mx-auto w-42 h-auto"
            />
            <p className="font-medium text-gray-400">
              No Request for Quotations found.
            </p>
          </div>
        )}
      </div>
      <AddRFQ
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
      />
    </div>
  );
}
