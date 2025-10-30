// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { FaChevronDown, FaChevronUp, FaBuilding, FaPlus } from "react-icons/fa";
// import Swal from "sweetalert2";
// import NotFoundImage from "/assets/scopefinding.png";
// //import AddRequestForQuotation from "./AddRequestForQuotation";
// import AddRFQ from "./AddRFQ";

// export default function RequestForQuotation() {
//   const [rfqs, setRfqs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [addDrawerOpen, setAddDrawerOpen] = useState(false);

//   // ✅ Fetch RFQs exactly as per structure
//   const fetchRFQs = async () => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_APP_PRO_URL}/api/rfq/GetRFQs`, {
//         headers: { "ngrok-skip-browser-warning": "true" },
//       });
//       const data = await res.json();

//       if (data.Success && Array.isArray(data.Data)) {
//         setRfqs(data.Data);
//       } else {
//         setRfqs([]);
//       }
//     } catch (error) {
//       console.error("Error fetching RFQs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRFQs();
//   }, []);

//   return (
//     <div className="bg-white m-8 px-8 py-8 rounded-lg">
//       <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
//         <h2 className="text-xl font-bold text-white flex items-center gap-2">
//           <FaBuilding className="text-white" /> Request For Quotation
//         </h2>
//         <Button
//           className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
//           onClick={() => setAddDrawerOpen(true)}
//         >
//           <FaPlus /> Add Request For Quotation
//         </Button>
//       </div>
//       {/* HEADER */}
//       <div className="bg-gray-200 p-4 rounded-sm">
//         <div className="grid grid-cols-12 gap-5 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
//           <span className="col-span-1">RFQ Number</span>
//           <span className="col-span-1">Vendor</span>
//           <span className="col-span-1">Priority</span>
//           <span className="col-span-1">Department</span>
//           <span className="col-span-1">Requested By</span>
//           <span className="col-span-1">Budget</span>
//           <span className="col-span-1">Delivery Date</span>
//           <span className="col-span-1">Status</span>
//           <span className="col-span-2 text-right">Actions</span>
//         </div>

//         {/* LOADING SKELETON */}
//         {loading ? (
//           <div className="space-y-2 animate-pulse">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="grid grid-cols-12 gap-3 bg-gray-50 py-4 px-6 rounded"
//               >
//                 {Array.from({ length: 9 }).map((__, j) => (
//                   <div key={j} className="h-4 bg-gray-200 rounded"></div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         ) : rfqs.length > 0 ? (
//           <div className="space-y-2">
//             {rfqs.map((rfq) => (
//               <div key={rfq.Id} className="bg-white rounded-lg shadow-lg border">
//                 {/* ROW */}
//                 <div className="grid grid-cols-12 gap-3 items-center py-4 px-6 hover:shadow-xl transition-all">
//                   <span className="font-medium text-indigo-700 col-span-1">
//                     {rfq.RFQNumber}
//                   </span>
//                   <span className="flex items-center gap-2 col-span-1">
//                     <FaBuilding className="text-gray-500" />
//                     {rfq.VendorName || "—"}
//                   </span>
//                   <span className="text-sm font-semibold col-span-1">
//                     {rfq.Priority}
//                   </span>
//                   <span className="col-span-1">{rfq.Department}</span>
//                   <span className="col-span-1">{rfq.RequestedBy}</span>
//                   <span className="font-semibold col-span-2">
//                     {rfq.EstimatedBudget
//                       ? `KES ${rfq.EstimatedBudget.toLocaleString()}`
//                       : "—"}
//                   </span>
//                   <span className="col-span-1">
//                     {new Date(rfq.ExpectedDeliveryDate).toLocaleDateString()}
//                   </span>
//                   <span
//                     className={`text-sm w-24v  rounded-2xl text-center flex items-center justify-center p-1 text-white ${rfq.Status === "Open"
//                       ? "bg-green-600"
//                       : rfq.Status === "Closed"
//                         ? "bg-gray-500"
//                         : "bg-yellow-500"
//                       }`}
//                   >
//                     {rfq.Status}
//                   </span>

//                   {/* ACTIONS */}
//                   <div className="flex gap-2 justify-end col-span-3">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="bg-indigo-700 text-white hover:bg-indigo-600 hover:text-white"
//                     >Convert To PO</Button>

//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white"
//                       onClick={() =>
//                         setExpandedRow(expandedRow === rfq.Id ? null : rfq.Id)
//                       }
//                     >
//                       {expandedRow === rfq.Id ? (
//                         <>
//                           <FaChevronUp /> Hide Lines
//                         </>
//                       ) : (
//                         <>
//                           <FaChevronDown /> View Lines
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>

//                 {/* EXPANDED SECTION */}
//                 {expandedRow === rfq.Id && (
//                   <div className="bg-gray-100 px-6 py-4 border-t">
//                     <h4 className="font-semibold mb-2">Line Items</h4>

//                     {/* LINES TABLE */}
//                     <div className="bg-gray-300 p-2 rounded-lg">
//                       <div className="grid grid-cols-8 gap-4 font-semibold bg-gray-700 text-white py-2 px-4 rounded">
//                         <span>#</span>
//                         <span>Item Code</span>
//                         <span>Description</span>
//                         <span>Qty</span>
//                         <span>Unit</span>
//                         <span>Unit Price (Est.)</span>
//                         <span>Total (Est.)</span>
//                         <span>Notes</span>
//                       </div>

//                       {rfq.Lines && rfq.Lines.length > 0 ? (
//                         rfq.Lines.map((line, i) => (
//                           <div
//                             key={line.Id}
//                             className="grid grid-cols-8 gap-4 py-2 px-4 border-b-2 border-gray-50 last:border-0"
//                           >
//                             <span>{i + 1}</span>
//                             <span>{line.ItemCode}</span>
//                             <span>{line.ItemDescription}</span>
//                             <span>{line.Quantity}</span>
//                             <span>{line.UnitOfMeasure}</span>
//                             <span>
//                               KES {line.EstimatedUnitPrice.toLocaleString()}
//                             </span>
//                             <span className="font-medium">
//                               KES {line.EstimatedTotal.toLocaleString()}
//                             </span>
//                             <span>{line.Notes}</span>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-center py-2 text-gray-600">
//                           No Line Items found.
//                         </p>
//                       )}
//                     </div>

//                     {/* ADDITIONAL DETAILS */}
//                     <div className="mt-4 text-sm text-gray-600 space-y-1">
//                       <p>
//                         <strong>Created Date:</strong>{" "}
//                         {new Date(rfq.CreatedDate).toLocaleString()}
//                       </p>
//                       <p>
//                         <strong>Delivery Location:</strong>{" "}
//                         {rfq.DeliveryLocation}
//                       </p>
//                       <p>
//                         <strong>Additional Notes:</strong>{" "}
//                         {rfq.AdditionalNotes}
//                       </p>
//                       {rfq.VendorIds && rfq.VendorIds.length > 0 && (
//                         <p>
//                           <strong>Vendor IDs:</strong>{" "}
//                           {rfq.VendorIds.join(", ")}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-gray-500 text-center mt-4">
//             <img
//               src={NotFoundImage}
//               alt="Not Found"
//               className="mx-auto w-42 h-auto"
//             />
//             <p className="font-medium text-gray-400">
//               No Request for Quotations found.
//             </p>
//           </div>
//         )}
//       </div>
//       <AddRFQ
//         open={addDrawerOpen}
//         onClose={() => setAddDrawerOpen(false)}
//       />
//     </div>
//   );
// }





































import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaChevronDown, FaChevronUp, FaBuilding, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";
import AddRFQ from "./AddRFQ";

export default function RequestForQuotation() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [convertingId, setConvertingId] = useState(null); // ✅ track conversion state

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

  // ✅ Convert RFQ to Purchase Order
  const handleConvertToPO = async (rfq) => {
    if (!rfq || !rfq.Lines || rfq.Lines.length === 0) {
      Swal.fire("No Line Items", "This RFQ has no lines to convert.", "warning");
      return;
    }

    setConvertingId(rfq.Id);

    // Map RFQ lines into the API format
    const poData = {
      PurchaseOrderId: rfq.Id,
      PONumber: rfq.RFQNumber,
      SupplierId: rfq.VendorId || 0,
      SupplierName: rfq.VendorName,
      OrderDate: new Date().toISOString(),
      ExpectedDeliveryDate: rfq.ExpectedDeliveryDate,
      Currency: "KES",
      Status: "Open",
      TotalAmount: rfq.EstimatedBudget || 0,
      Projectcode: rfq.ProjectCode || "",
      ProjectId: rfq.ProjectId || 0,
      ProjectDescription: rfq.ProjectDescription || "",
      CreatedBy: "018bf26c-bef7-425f-bc0f-1c7a31f0d474",
      Lines: rfq.Lines.map((line, i) => ({
        POLineId: 0,
        PurchaseOrderId: 0,
        LineNumber: i + 1,
        ItemId: line.ItemId || crypto.randomUUID(),
        ItemDescription: line.ItemDescription,
        QuantityOrdered: line.Quantity,
        UnitPrice: line.EstimatedUnitPrice,
        BudgetLine: line.BudgetLine || 0,
        Budgetdescription: line.BudgetDescription || "",
        ReceivedQuantity: 0,
      })),
    };

    try {
      const response = await fetch(
        `https://a55d38b503e3.ngrok-free.app/api/rfq/CreatePurchaseOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(poData),
        }
      );

      if (!response.ok) throw new Error("Failed to create purchase order");
      const result = await response.json();

      Swal.fire({
        icon: "success",
        title: "PO Created",
        text: `Purchase Order ${result.PONumber || "successfully created!"}`,
      });

      fetchRFQs();
    } catch (error) {
      console.error("Error creating PO:", error);
      Swal.fire("Error", "Failed to convert RFQ to Purchase Order.", "error");
    } finally {
      setConvertingId(null);
    }
  };

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

      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-13 gap-3 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span className="col-span-1">RFQ #</span>
          <span className="col-span-1">Vendor</span>
          <span className="col-span-1">Priority</span>
          <span className="col-span-2">Department</span>
          <span className="col-span-2">Budget</span>
          <span className="col-span-2 text-sm">Delivery Date</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1">Actions</span>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 bg-gray-50 py-4 px-6 rounded">
                {Array.from({ length: 12 }).map((__, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        ) : rfqs.length > 0 ? (
          <div className="space-y-2">
            {rfqs.map((rfq) => (
              <div key={rfq.Id} className="bg-white rounded-lg shadow-lg border">
                <div className="grid grid-cols-15 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                  <span className="col-span-1 font-medium text-sm text-indigo-700">{rfq.RFQNumber}</span>
                  <span className="col-span-1 flex items-center text-sm gap-2">
                    {rfq.VendorName || "—"}
                  </span>
                  <span className="col-span-1 text-sm font-semibold">{rfq.Priority}</span>
                  <span className="col-span-2 text-sm">{rfq.Department}</span>
                  <span className="col-span-2 font-semibold text-sm">
                    {rfq.EstimatedBudget
                      ? `KES ${rfq.EstimatedBudget.toLocaleString()}`
                      : "—"}
                  </span>
                  <span className="col-span-2 text-sm">
                    {new Date(rfq.ExpectedDeliveryDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`col-span-2 text-sm rounded-2xl text-center py-1 px-1 text-white ${rfq.Status === "Open"
                      ? "bg-green-600"
                      : rfq.Status === "Closed"
                        ? "bg-gray-500"
                        : "bg-yellow-500"
                      }`}
                  >
                    {rfq.Status}
                  </span>

                  <div className="col-span-2 flex gap-2 ">
                    {/* <Button
                      size="sm"
                      disabled={convertingId === rfq.Id}
                      onClick={() => handleConvertToPO(rfq)}
                      className={`${convertingId === rfq.Id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-700 hover:bg-indigo-600"
                        } text-white`}
                    >
                      {convertingId === rfq.Id ? "Converting..." : "Convert To PO"}
                    </Button> */}

                    <Button
                      size="sm"
                      disabled={
                        convertingId === rfq.Id ||
                        rfq.Status === "ConvertedToPO" ||
                        rfq.Status === "Open"
                      }
                      onClick={() => handleConvertToPO(rfq)}
                      className={`text-white ${convertingId === rfq.Id
                        ? "bg-gray-400 cursor-not-allowed"
                        : rfq.Status === "ConvertedToPO" || rfq.Status === "Open"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-700 hover:bg-indigo-600"
                        }`}
                    >
                      {rfq.Status === "ConvertedToPO"
                        ? "Already Converted"
                        : rfq.Status === "Open"
                          ? "Awaiting Approval"
                          : convertingId === rfq.Id
                            ? "Converting..."
                            : "Convert To PO"}
                    </Button>



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
                      <p>
                        <strong>Requested By:</strong>{" "}
                        {rfq.RequestedBy}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-4">
            <img src={NotFoundImage} alt="Not Found" className="mx-auto w-42 h-auto" />
            <p className="font-medium text-gray-400">
              No Request for Quotations found.
            </p>
          </div>
        )}
      </div>

      <AddRFQ open={addDrawerOpen} onClose={() => setAddDrawerOpen(false)} />
    </div>
  );
}
