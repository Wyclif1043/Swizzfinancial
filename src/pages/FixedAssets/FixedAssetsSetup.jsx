import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";
import fixedassetsApi from "../../apis/fixedAssets/fixedassetsConfig";
import { FaMapLocationDot } from "react-icons/fa6";
import AddFixedAssets from "./AddFixedAssets";
import withReactContent from "sweetalert2-react-content";
import {
  FaLaptop,
  FaHashtag,
  FaBarcode,
  FaCalendarAlt,
  FaSitemap,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaUser,
  FaCoins,
  FaCalculator,
  FaHourglassStart,
  FaHourglassEnd,
  FaPercentage,
  FaCalendarPlus,
} from "react-icons/fa";

export default function FixedAssetsSetup() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fixedassetsApi.get("/fixedasset");
      setAssets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
      Swal.fire("Error", "Failed to fetch assets.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fixedassetsApi.delete(`/fixedasset/${id}`);
          if (res.status !== 200) throw new Error("Failed to delete asset");

          Swal.fire("Deleted!", "Asset has been deleted.", "success");
          fetchAssets();
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Failed to delete asset.", "error");
        }
      }
    });
  };

  const MySwal = withReactContent(Swal);

  const handleMoreInfo = (asset) => {
  MySwal.fire({
    title: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          height: "10px"
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
          }}
        >
          <FaLaptop color="white" size={20} />
        </div>
        <div style={{ textAlign: "left" }}>
          <strong style={{ fontSize: "1.3rem", color: "#0f172a", letterSpacing: "-0.02em" }}>
            Asset Details
          </strong>
          <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "2px" }}>
            {asset.AssetName}
          </div>
        </div>
      </div>
    ),
    html: (
      <div style={{ padding: "0 8px" }}>
        {/* Status Badge */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: asset.IsInactive ? "#fef2f2" : "#ecfdf5",
              border: `1.5px solid ${asset.IsInactive ? "#fecaca" : "#a7f3d0"}`,
              borderRadius: "100px",
              fontSize: "13px",
              fontWeight: "600",
              color: asset.IsInactive ? "#dc2626" : "#059669",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                background: asset.IsInactive ? "#ef4444" : "#10b981",
                borderRadius: "50%",
                boxShadow: `0 0 8px ${asset.IsInactive ? "#ef4444" : "#10b981"}80`,
              }}
            />
            {asset.IsInactive ? "Inactive" : "Active"}
          </span>
        </div>

        {/* Two Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            textAlign: "left",
            fontSize: "13px",
            color: "#334155",
          }}
        >
          {/* Left Column - General Info */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
                paddingBottom: "10px",
                borderBottom: "2px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaInfoCircle color="white" size={14} />
              </div>
              <strong style={{ fontSize: "13px", color: "#1e293b" }}>
                General Info
              </strong>
            </div>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaHashtag color="#4f46e5" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>No:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.No}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaBarcode color="#4f46e5" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Serial:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.SerialNo}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaSitemap color="#4f46e5" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Category:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.FASubClassDescription}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaLayerGroup color="#4f46e5" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Group:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.FAGroup}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaMapMarkerAlt color="#4f46e5" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Location:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.LocationDescription}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0" }}>
              <FaUser color="#4f46e5" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Employee:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.ResponsibleEmployee || "N/A"}
              </span>
            </p>
          </div>

          {/* Right Column - Financial Info */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "14px",
                paddingBottom: "10px",
                borderBottom: "2px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCoins color="white" size={14} />
              </div>
              <strong style={{ fontSize: "13px", color: "#1e293b" }}>
                Financial Info
              </strong>
            </div>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaCoins color="#10b981" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Value:</span>
              <span style={{ color: "#0f172a", fontWeight: "700", marginLeft: "auto" }}>
                KES {asset.BookValue?.toLocaleString() || "N/A"}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaCalculator color="#10b981" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Method:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.DepreciationMethod}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaHourglassStart color="#10b981" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Start:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {new Date(asset.DepreciationStartDate).toLocaleDateString()}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaCalendarAlt color="#10b981" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Years:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.NoOfDepreciationYears}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <FaHourglassEnd color="#10b981" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>End:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {new Date(asset.DepreciationEndingDate).toLocaleDateString()}
              </span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0" }}>
              <FaPercentage color="#10b981" size={14} />
              <span style={{ color: "#64748b", fontWeight: "600" }}>Rate:</span>
              <span style={{ color: "#0f172a", fontWeight: "600", marginLeft: "auto" }}>
                {asset.ReducingBalancePercentage}%
              </span>
            </p>
          </div>
        </div>
      </div>
    ),
    footer: (
      <div
        style={{
          fontSize: "12px",
          color: "#64748b",
          textAlign: "center",
          background: "#f8fafc",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <FaCalendarPlus color="#f59e0b" size={14} />
          <span style={{ fontWeight: "600", color: "#0f172a" }}>Created:</span>
          <span>{new Date(asset.CreatedDate).toLocaleDateString()}</span>
          <span style={{ margin: "0 4px", color: "#cbd5e1" }}>•</span>
          <FaUser color="#f59e0b" size={12} />
          <span>{asset.CreatedBy}</span>
        </div>
      </div>
    ),
    width: 650,
    background: "#fff",
    confirmButtonText: "Close",
    confirmButtonColor: "#4f46e5",
    showClass: {
      popup: "animate__animated animate__fadeInUp animate__faster",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown animate__faster",
    },
    customClass: {
      popup: "rounded-2xl shadow-2xl",
      confirmButton: "rounded-xl font-semibold px-6 py-2.5 hover:shadow-lg transition-all",
    },
  });
};

  return (
    <div className="bg-white m-8 px-8 py-8 shadow-2xl rounded-lg relative">
      <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaMapLocationDot className="text-white" /> Fixed Assets
        </h2>
        <Button
          onClick={() => setAddDrawerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaMapLocationDot /> Add Asset
        </Button>
      </div>

      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-8 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span>No</span>
          <span>Serial Number</span>
          <span>Asset Name</span>
          <span>Created Date</span>
          <span>FASubClass</span>
          <span>Location</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-8 gap-4 bg-gray-50 p-6 rounded"
              >
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        ) : assets.length > 0 ? (
          <div className="space-y-2">
            {assets.map((asset) => (
              <div
                key={asset.Id}
                className="grid grid-cols-8 gap-4 items-center bg-white py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all border"
              >
                <span className="font-medium text-indigo-700">{asset.No}</span>
                <span className="font-medium">{asset.SerialNo}</span>
                <span className="font-medium">{asset.AssetName}</span>
                <span>{new Date(asset.CreatedDate).toLocaleDateString()}</span>
                <span>{asset.FASubClassDescription}</span>
                <span>{asset.LocationDescription}</span>

                <div className="col-span-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleMoreInfo(asset)}
                  >
                    <FaInfoCircle /> More Info
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => Swal.fire("Edit feature coming soon")}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-white"
                    onClick={() => handleDelete(asset.Id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </div>
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
            <p className="font-medium text-gray-400">No assets found.</p>
          </div>
        )}
      </div>

      <AddFixedAssets
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        onSuccess={fetchAssets}
      />
    </div>
  );
}
