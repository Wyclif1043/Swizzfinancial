import { createEmployee } from "../../../../apis/employeesapi/CreateEmployee";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { getBankCodes } from "../../../../apis/employeesapi/GetBankCode";
import { getBranches } from "../../../../apis/employeesapi/GetBranches";
import { getBankBranches } from "../../../../apis/employeesapi/GetBankBranches";
import Swal from "sweetalert2";

const OnboardEmployeeModal = ({ isOpen, onClose, onEmployeeCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    employeenumber: "",
    branch: "",
    designation: "",
    startDate: "",
    endDate: "",
    jobGroup: "",
    disabled: false,
    nssfNumber: "",
    shaNumber: "",
    krapin: "",
    accountNumber: "",
    bankCode: "",
    branchCode: "",
  });

  const [branches, setBranches] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankBranches, setBankBranches] = useState([]);
  const [loading, setLoading] = useState({
    branches: false,
    banks: false,
    bankBranches: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numericFields = ["employeenumber", "bankCode", "branchCode"];

    let newValue = type === "checkbox" ? checked : value;

    if (numericFields.includes(name)) {
      newValue = value ? Number(value) : "";
    }

    if (name === "bankCode") {
      setFormData({
        ...formData,
        [name]: newValue,
        branchCode: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchInitialData = async () => {
      setLoading({ ...loading, branches: true, banks: true });

      try {
        const [branchesData, banksData] = await Promise.all([
          getBranches(),
          getBankCodes(),
        ]);

        console.log("Branches data:", branchesData);
        console.log("Banks data:", banksData);

        setBranches(Array.isArray(branchesData?.data) ? branchesData.data : []);
        setBanks(Array.isArray(banksData?.data) ? banksData.data : []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setBranches([]);
        setBanks([]);
      } finally {
        setLoading({ ...loading, branches: false, banks: false });
      }
    };

    fetchInitialData();
  }, [isOpen]);

  useEffect(() => {
    if (!formData.bankCode) {
      setBankBranches([]);
      return;
    }

    const fetchBankBranches = async () => {
      setLoading((prev) => ({ ...prev, bankBranches: true }));
      try {
        const response = await getBankBranches(); // fetch ALL branches
        const allBranches = response || []; // ensure fallback to []

        // ✅ Filter by selected bankCode
        const filtered = allBranches.filter(
          (branch) => Number(branch.BankCode) === Number(formData.bankCode)
        );

        setBankBranches(filtered);
      } catch (error) {
        console.error("Error filtering bank branches:", error);
        setBankBranches([]);
      } finally {
        setLoading((prev) => ({ ...prev, bankBranches: false }));
      }
    };

    fetchBankBranches();
  }, [formData.bankCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.branch) {
      Swal.fire("Validation Error", "Please select a branch", "error");
      return;
    }

    try {
      const selectedBranch = branches.find(
        (b) => (b.Code || b.id) === formData.branch
      );

      const branchName = selectedBranch
        ? selectedBranch.Name ||
          selectedBranch.name ||
          selectedBranch.BranchName
        : formData.branch;

      const payload = {
        EmployeeNumber: Number(formData.employeenumber),
        Name: formData.name,
        Branch: "",
        Designation: formData.designation,
        StartDate: formData.startDate,
        EndDate: formData.endDate || null,
        JobGroup: formData.jobGroup,
        Disabled: formData.disabled,
        NSSFNumber: formData.nssfNumber,
        SHANumber: formData.shaNumber,
        KRAPIN: formData.krapin,
        AccountNumber: formData.accountNumber,
        BankCode: formData.bankCode ? Number(formData.bankCode) : null,
        BranchCode: formData.branchCode ? Number(formData.branchCode) : null,
      };

      console.log("Submitting payload:", payload);
      console.log("Selected branch object:", selectedBranch);

      await createEmployee(payload);

      Swal.fire("Success", "Employee created successfully!", "success");

      if (onEmployeeCreated) {
        onEmployeeCreated(formData);
      }

      // Reset form
      setFormData({
        name: "",
        employeenumber: "",
        branch: "",
        designation: "",
        startDate: "",
        endDate: "",
        jobGroup: "",
        disabled: false,
        nssfNumber: "",
        shaNumber: "",
        krapin: "",
        accountNumber: "",
        bankCode: "",
        branchCode: "",
      });

      onClose();
    } catch (error) {
      console.error("Error creating employee:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      Swal.fire("Error", `Failed to create employee: ${errorMessage}`, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[950px] max-h-[90vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="bg-indigo-800 p-4 rounded-xl mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaUser className="text-3xl text-white" />
            <h2 className="text-2xl font-bold text-white">
              Onboard New Employee
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-lg font-semibold"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Employee Number *
                </label>
                <input
                  type="text"
                  name="employeenumber"
                  value={formData.employeenumber}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="Enter employee number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Branch *
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading.branches}
                  required
                >
                  <option value="">
                    {loading.branches
                      ? "Loading branches..."
                      : "-- Select Branch --"}
                  </option>
                  {branches.map((branch) => (
                    <option key={branch.BranchName} value={branch.BranchName}>
                      {branch.Name || branch.BranchName}
                    </option>
                  ))}
                </select>

                {branches.length === 0 && !loading.branches && (
                  <p className="text-xs text-red-500 mt-1">
                    No branches available
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter designation"
                />
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Job Group
                </label>
                <input
                  type="text"
                  name="jobGroup"
                  value={formData.jobGroup}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter job group"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Government Information Section */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Government Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  NSSF Number
                </label>
                <input
                  type="text"
                  name="nssfNumber"
                  value={formData.nssfNumber}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter NSSF number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  SHA Number
                </label>
                <input
                  type="text"
                  name="shaNumber"
                  value={formData.shaNumber}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter SHA number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  KRA PIN
                </label>
                <input
                  type="text"
                  name="krapin"
                  value={formData.krapin}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter KRA PIN"
                />
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Banking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Bank
                </label>
                <select
                  name="bankCode"
                  value={formData.bankCode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading.banks}
                >
                  <option value="">
                    {loading.banks ? "Loading banks..." : "-- Select Bank --"}
                  </option>
                  {banks.map((bank) => (
                    <option
                      key={bank.Code || bank.id}
                      value={bank.Code || bank.id}
                    >
                      {bank.Name || bank.name || bank.BankName}
                    </option>
                  ))}
                </select>
                {banks.length === 0 && !loading.banks && (
                  <p className="text-xs text-red-500 mt-1">
                    No banks available
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Bank Branch
                </label>
                <select
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading.bankBranches || !formData.bankCode}
                  required
                >
                  <option value="">
                    {loading.bankBranches
                      ? "Loading branches..."
                      : !formData.bankCode
                      ? "Select bank first"
                      : "-- Select Branch --"}
                  </option>
                  {bankBranches.map((branch) => (
                    <option key={branch.Code} value={branch.Code}>
                      {branch.BranchName}
                    </option>
                  ))}
                </select>
                {formData.bankCode &&
                  bankBranches.length === 0 &&
                  !loading.bankBranches && (
                    <p className="text-xs text-red-500 mt-1">
                      No branches found for this bank
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Employee Status Section */}
          <div className="col-span-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Employee Status
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="disabled"
                  checked={formData.disabled}
                  onChange={handleChange}
                  className="rounded focus:ring-2 focus:ring-indigo-500"
                />
                Employee Disabled
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-span-3 flex justify-end space-x-4 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              disabled={
                loading.branches || loading.banks || loading.bankBranches
              }
            >
              {loading.branches || loading.banks || loading.bankBranches
                ? "Loading..."
                : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardEmployeeModal;
