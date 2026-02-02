import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "flowbite-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function LoanRegisterFullDetails() {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [guarantors, setGuarantors] = useState([]);
  const [loadingGuarantors, setLoadingGuarantors] = useState(false);

  // Loan Calculator State
  const [calculator, setCalculator] = useState({
    principal: 0,
    rate: 0,
    termMonths: 0,
    monthlyPayment: 0,
  });

  // ================== FETCH LOANS ==================
  useEffect(() => {
    fetch("http://88.99.215.90:8600/api/Loaning/getallloans", {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((r) => r.json())
      .then((d) => setLoans(Array.isArray(d) ? d : d.Data || []))
      .catch(() => Swal.fire("Error", "Failed to load loans", "error"));
  }, []);

  // ================== FETCH GUARANTORS ==================
  useEffect(() => {
    if (!selectedLoan) return;
    setLoadingGuarantors(true);
    fetch(
      `http://88.99.215.90:8600/api/GuarantorManagement/GetLoanGuarantors/${selectedLoan.Id}`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    )
      .then((res) => res.json())
      .then((data) => setGuarantors(Array.isArray(data) ? data : data.Data || []))
      .catch(() => Swal.fire("Error", "Failed to load guarantors", "error"))
      .finally(() => setLoadingGuarantors(false));
  }, [selectedLoan]);

  // ================== FILTER LOANS ==================
  const filtered = useMemo(() => {
    if (!search) return loans;
    const s = search.toLowerCase();
    return loans.filter((l) =>
      `${l.CustomerIndividualFirstName} ${l.CustomerIndividualLastName} ${l.CustomerIndividualIdentityCardNumber} ${l.PaddedCaseNumber} ${l.LoanProductDescription}`
        .toLowerCase()
        .includes(s)
    );
  }, [loans, search]);

  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const fmt = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ================== CSV & PDF EXPORT ==================
  const exportCSV = () => {
    const headers = [
      "CaseNo","Member","ID","Product","Applied","Balance","Rate","TermMonths",
      "StatusDescription","Guarantor Name","Amount Guaranteed","Committed Shares",
    ];
    let csv = headers.join(",") + "\n";

    filtered.forEach((l) => {
      const loanGuarantors = l.LoanGuarantorDTO?.length
        ? l.LoanGuarantorDTO
        : [{ CustomerIndividualFirstName: "", CustomerIndividualLastName: "", AmountGuaranteed: "", CommittedShares: "" }];
      loanGuarantors.forEach((g) => {
        const row = [
          l.PaddedCaseNumber,
          `${l.CustomerIndividualFirstName} ${l.CustomerIndividualLastName}`,
          l.CustomerIndividualIdentityCardNumber,
          l.LoanProductDescription,
          fmt(l.AmountApplied),
          fmt(l.LoanProductLoanBalance),
          l.LoanInterestAnnualPercentageRate,
          l.LoanRegistrationTermInMonths,
          l.StatusDescription,
          `${g.CustomerIndividualFirstName} ${g.CustomerIndividualLastName}`,
          fmt(g.AmountGuaranteed),
          fmt(g.CommittedShares),
        ];
        csv += row.join(",") + "\n";
      });
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loan-register.csv";
    a.click();
  };

  const exportPDF = (loanData = filtered) => {
    const doc = new jsPDF();
    const tableData = [];

    loanData.forEach((l) => {
      const loanGuarantors = l.LoanGuarantorDTO?.length
        ? l.LoanGuarantorDTO
        : [{ CustomerIndividualFirstName: "", CustomerIndividualLastName: "", AmountGuaranteed: "", CommittedShares: "" }];
      loanGuarantors.forEach((g) => {
        tableData.push([
          l.PaddedCaseNumber,
          `${l.CustomerIndividualFirstName} ${l.CustomerIndividualLastName}`,
          l.CustomerIndividualIdentityCardNumber,
          l.LoanProductDescription,
          fmt(l.AmountApplied),
          fmt(l.TotalLoansBalance),
          l.LoanInterestAnnualPercentageRate,
          l.LoanRegistrationTermInMonths,
          l.StatusDescription,
          `${g.CustomerIndividualFirstName} ${g.CustomerIndividualLastName}`,
          fmt(g.AmountGuaranteed),
          fmt(g.CommittedShares),
        ]);
      });
    });

    doc.autoTable({
      head: [["CaseNo","Member","ID","Product","Applied","Balance","Rate","Term","Status","Guarantor","Amount Guaranteed","Committed Shares"]],
      body: tableData,
      startY: 10,
    });

    doc.save("loan-register.pdf");
  };

  const exportLoanPDF = (loan) => {
    if (!loan) return;
    exportPDF([loan]);
  };

  // ================== LOAN CALCULATOR ==================
  const calculateLoan = ({ principal, rate, termMonths }) => {
    const r = rate / 12 / 100;
    const n = termMonths;
    if (!r) return principal / n || 0;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const handleCalcChange = (field, value) => {
    const updated = { ...calculator, [field]: Number(value) };
    updated.monthlyPayment = calculateLoan(updated);
    setCalculator(updated);
  };

  const exportCalculatorPDF = () => {
    const doc = new jsPDF();
    doc.text("Loan Calculator Results", 10, 10);
    doc.autoTable({
      head: [["Principal", "Rate (%)", "Term (Months)", "Monthly Payment"]],
      body: [[
        fmt(calculator.principal),
        calculator.rate,
        calculator.termMonths,
        fmt(calculator.monthlyPayment)
      ]],
      startY: 20,
    });
    doc.save("loan-calculator.pdf");
  };

  const exportCalculatorCSV = () => {
    const headers = ["Principal", "Rate (%)", "Term (Months)", "Monthly Payment"];
    const row = [calculator.principal, calculator.rate, calculator.termMonths, calculator.monthlyPayment];
    const csv = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loan-calculator.csv";
    a.click();
  };

  // ================== REPAYMENT SCHEDULE ==================
  const generateRepaymentSchedule = (principal, annualRate, termMonths) => {
    const schedule = [];
    const r = annualRate / 12 / 100;
    const n = termMonths;
    const monthlyPayment = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let balance = principal;

    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principalPayment = monthlyPayment - interest;
      balance -= principalPayment;

      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest,
        balance: balance > 0 ? balance : 0,
      });
    }

    return schedule;
  };

  const exportSchedulePDF = (loan) => {
    if (!loan) return;
    const schedule = generateRepaymentSchedule(
      loan.AmountApplied,
      loan.LoanInterestAnnualPercentageRate,
      loan.LoanRegistrationTermInMonths
    );

    const doc = new jsPDF();
    doc.text(`Repayment Schedule - ${loan.PaddedCaseNumber}`, 10, 10);

    const body = schedule.map(s => [s.month, fmt(s.payment), fmt(s.principal), fmt(s.interest), fmt(s.balance)]);

    doc.autoTable({ head: [["Month","Payment","Principal","Interest","Balance"]], body, startY: 20 });
    doc.save(`${loan.PaddedCaseNumber}-repayment-schedule.pdf`);
  };

  const exportScheduleCSV = (loan) => {
    if (!loan) return;
    const schedule = generateRepaymentSchedule(
      loan.AmountApplied,
      loan.LoanInterestAnnualPercentageRate,
      loan.LoanRegistrationTermInMonths
    );

    const headers = ["Month","Payment","Principal","Interest","Balance"];
    const rows = schedule.map(s => [s.month, s.payment, s.principal, s.interest, s.balance]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${loan.PaddedCaseNumber}-repayment-schedule.csv`;
    a.click();
  };

  // ================== RENDER ==================
  return (
    <div className="min-h-screen bg-gray-50 py-4 m-5 rounded-lg">
      {/* HEADER */}
      <div className="bg-indigo-800 rounded-xl shadow p-4 max-w-6xl m-4">
        <h1 className="text-2xl font-bold text-gray-50">Loan Register</h1>
        <p className="text-gray-200">All loans with full details</p>
      </div>

      {/* SEARCH + EXPORT */}
      <div className="bg-gray-200 rounded-lg m-4 p-4 max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member | ID | case | product"
            className="w-full md:w-1/2 p-3 border rounded"
          />
          <div className="flex gap-2">
            <Button onClick={exportCSV} size="sm">Export CSV</Button>
            <Button onClick={() => exportPDF()} size="sm" color="gray">Export PDF</Button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-2">Case</th>
                <th className="p-2">Member</th>
                <th className="p-2">ID</th>
                <th className="p-2">Product</th>
                <th className="p-2 text-right">Applied</th>
                <th className="p-2 text-right">Balance</th>
                <th className="p-2">Rate %</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr
                  key={l.Id}
                  onClick={() => { setSelectedLoan(l); setOpenDrawer(true); }}
                  className={`cursor-pointer ${i % 2 ? "bg-indigo-50" : ""} hover:bg-indigo-200`}
                >
                  <td className="p-2">{l.PaddedCaseNumber}</td>
                  <td className="p-2">{l.CustomerIndividualFirstName} {l.CustomerIndividualLastName}</td>
                  <td className="p-2">{l.CustomerIndividualIdentityCardNumber}</td>
                  <td className="p-2">{l.LoanProductDescription}</td>
                  <td className="p-2 text-right">{fmt(l.AmountApplied)}</td>
                  <td className="p-2 text-right">{fmt(l.LoanProductLoanBalance)}</td>
                  <td className="p-2">{l.LoanInterestAnnualPercentageRate}</td>
                  <td className="p-2">{l.StatusDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE DRAWER */}
      <AnimatePresence>
        {openDrawer && selectedLoan && (
          <>
            <motion.div
              className="fixed inset-0 bg-black z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenDrawer(false)}
            />

            <motion.div
              className="fixed top-5 right-5 w-[90vw] max-w-[600px] h-[94vh] bg-white shadow-2xl z-50 flex flex-col rounded-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="p-4 bg-indigo-700 text-white flex justify-between items-center m-4 rounded-2xl">
                <h2 className="font-bold text-lg">Loan Case Details</h2>
                <div className="flex gap-2">
                  <Button size="sm" color="light" onClick={() => exportLoanPDF(selectedLoan)}>Export PDF</Button>
                  <Button size="sm" className="bg-indigo-500" onClick={() => setOpenDrawer(false)}>Close</Button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-gray-200 m-4 rounded-2xl">
                <Collapsible title="Member Details" isOpen={expandedSections.member} toggle={() => toggleSection("member")}>
                  <KV k="Name" v={`${selectedLoan.CustomerIndividualFirstName} ${selectedLoan.CustomerIndividualLastName}`} />
                  <KV k="ID" v={selectedLoan.CustomerIndividualIdentityCardNumber} />
                  <KV k="Email" v={selectedLoan.CustomerAddressEmail} />
                  <KV k="Mobile" v={selectedLoan.CustomerAddressMobileLine} />
                  <KV k="Status" v={selectedLoan.StatusDescription} />
                </Collapsible>

                <Collapsible title="Loan Case" isOpen={expandedSections.loan} toggle={() => toggleSection("loan")}>
                  <KV k="Product" v={selectedLoan.LoanProductDescription} />
                  <KV k="Amount Applied" v={fmt(selectedLoan.AmountApplied)} />
                  <KV k="Balance" v={fmt(selectedLoan.TotalLoansBalance)} />
                  <KV k="Rate %" v={selectedLoan.LoanInterestAnnualPercentageRate} />
                  <KV k="Term (Months)" v={selectedLoan.LoanRegistrationTermInMonths} />
                  <KV k="Calculation Mode" v={selectedLoan.LoanInterestCalculationModeDescription} />
                  <KV k="Loan Purpose" v={selectedLoan.LoanPurposeDescription} />
                  <KV k="Remarks" v={selectedLoan.Remarks} />
                </Collapsible>

                <Collapsible title="Guarantors" isOpen={expandedSections.guarantors} toggle={() => toggleSection("guarantors")}>
                  {loadingGuarantors ? (
                    <div>Loading guarantors...</div>
                  ) : guarantors.length > 0 ? (
                    guarantors.map((g, i) => (
                      <div key={i} className="border p-2 rounded my-1">
                        <KV k="Name" v={`${g.CustomerIndividualFirstName} ${g.CustomerIndividualLastName}`} />
                        <KV k="Amount Guaranteed" v={fmt(g.AmountGuaranteed)} />
                        <KV k="Committed Shares" v={fmt(g.CommittedShares)} />
                      </div>
                    ))
                  ) : (
                    <div>No guarantors registered</div>
                  )}
                </Collapsible>

                <Collapsible title="Operational Details" isOpen={expandedSections.operational} toggle={() => toggleSection("operational")}>
                  <KV k="Status" v={selectedLoan.StatusDescription} />
                  <KV k="Created" v={new Date(selectedLoan.CreatedDate).toLocaleString()} />
                  <KV k="Disbursed By" v={selectedLoan.DisbursedBy} />
                  <KV k="Disbursed Date" v={selectedLoan.DisbursedDate ? new Date(selectedLoan.DisbursedDate).toLocaleString() : "—"} />
                </Collapsible>

                <Collapsible title="Loan Calculator" isOpen={expandedSections.calculator} toggle={() => toggleSection("calculator")}>
                  <KV k="Principal" v={<input type="number" value={calculator.principal} onChange={(e) => handleCalcChange("principal", e.target.value)} className="border rounded p-1 w-full" />} />
                  <KV k="Rate (%)" v={<input type="number" value={calculator.rate} onChange={(e) => handleCalcChange("rate", e.target.value)} className="border rounded p-1 w-full" />} />
                  <KV k="Term (Months)" v={<input type="number" value={calculator.termMonths} onChange={(e) => handleCalcChange("termMonths", e.target.value)} className="border rounded p-1 w-full" />} />
                  <KV k="Monthly Payment" v={fmt(calculator.monthlyPayment)} />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={exportCalculatorPDF}>Download PDF</Button>
                    <Button size="sm" color="gray" onClick={exportCalculatorCSV}>Download CSV</Button>
                  </div>
                </Collapsible>

                <Collapsible title="Repayment Schedule" isOpen={expandedSections.schedule} toggle={() => toggleSection("schedule")}>
                  <div className="flex gap-2 mb-2">
                    <Button size="sm" onClick={() => exportSchedulePDF(selectedLoan)}>Download PDF</Button>
                    <Button size="sm" color="gray" onClick={() => exportScheduleCSV(selectedLoan)}>Download CSV</Button>
                  </div>
                  <div className="overflow-auto max-h-64">
                    <table className="min-w-full text-sm border">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="p-1">Month</th>
                          <th className="p-1">Payment</th>
                          <th className="p-1">Principal</th>
                          <th className="p-1">Interest</th>
                          <th className="p-1">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateRepaymentSchedule(selectedLoan.AmountApplied, selectedLoan.LoanInterestAnnualPercentageRate, selectedLoan.LoanRegistrationTermInMonths).map((s, i) => (
                          <tr key={i} className={i % 2 ? "bg-gray-100" : ""}>
                            <td className="p-1">{s.month}</td>
                            <td className="p-1">{fmt(s.payment)}</td>
                            <td className="p-1">{fmt(s.principal)}</td>
                            <td className="p-1">{fmt(s.interest)}</td>
                            <td className="p-1">{fmt(s.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Collapsible>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ================== Collapsible & KV ==================
const Collapsible = ({ title, children, isOpen, toggle }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <div className="flex justify-between items-center cursor-pointer" onClick={toggle}>
      <h3 className="font-semibold">{title}</h3>
      <span>{isOpen ? "▲" : "▼"}</span>
    </div>
    {isOpen && <div className="mt-2 grid grid-cols-2 gap-2 text-sm">{children}</div>}
  </div>
);

const KV = ({ k, v }) => (
  <>
    <div className="text-slate-500">{k}</div>
    <div className="font-medium">{v ?? "—"}</div>
  </>
);
