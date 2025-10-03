import React, { useRef, useState, useEffect } from "react";
import {
  Building2,
  Phone,
  Mail,
  Calendar,
  Share2,
  Printer,
} from "lucide-react";
import html2canvas from "html2canvas";
import { FaFilePdf, FaFileWord, FaFileExcel } from "react-icons/fa";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import NotFoundImage from "/assets/scopefinding.png";
import { getEmployeePayslips } from "../../../../apis/employeesapi/ReportsApi";

export default function Payslip() {
  const payslipRef = useRef(null);
  const [employeeInfo, setEmployeeInfo] = useState({});

  // Filter states
  const [memberId, setMemberId] = useState("");
  const [year, setYear] = useState();
  const [month, setMonth] = useState("");

  // Payslip data
  const [earnings, setEarnings] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate API call
  const fetchPayslip = async () => {
    setLoading(true);
    try {
      const res = await getEmployeePayslips();
      console.log("Fetched payslip data:", res.data);

      const response = res.data;

      if (response.success && response.data.length > 0) {
        const payslip = response.data[0];

        const earningsData = [
          { description: "Basic Salary", amount: payslip.BasicSalary },
          { description: "House Allowance", amount: payslip.HouseAllowance },
          {
            description: "Transport Allowance",
            amount: payslip.TransportAllowance,
          },
          { description: "Other Allowances", amount: payslip.OtherAllowances },
          { description: "Gross Pay", amount: payslip.GrossPay },
        ];

        const deductionsData = [
          { description: "PAYE", amount: payslip.PAYE },
          { description: "NHIF", amount: payslip.NHIF },
          { description: "NSSF", amount: payslip.NSSF },
          { description: "Housing Levy", amount: payslip.HousingLevy },
          { description: "Other Deductions", amount: payslip.OtherDeductions },
          { description: "Total Deductions", amount: payslip.TotalDeductions },
        ];

        setEarnings(earningsData);
        setDeductions(deductionsData);

        setEmployeeInfo({
          name: payslip.EmployeeName || "N/A",
          id: payslip.EmployeeId || "N/A",
          designation: payslip.Designation || "N/A",
          branch: payslip.Branch || "N/A",
          department: payslip.Department || "N/A",
          bankName: payslip.BankName || "N/A",
          bankAccount: payslip.BankAccount || "N/A",
          salaryCycle: payslip.SalaryCycleName || "N/A",
          createdat: payslip.CreatedAt
            ? payslip.CreatedAt.split("T")[0]
            : "N/A",
          netPay: payslip.NetPay || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching payslip:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslip();
  }, []);

  const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = deductions.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const netPay = totalEarnings - totalDeductions;

  // Get the styled HTML content (string) — used for Word/Print window fallback
  const getPayslipHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payslip ${month} ${year}</title>
        <style>
          @page {
            size: A4;
            margin: 0.5in;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
          }
          .payslip-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 32px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          
          /* Header */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 3px solid #166534;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-box {
            width: 64px;
            height: 64px;
            background: #312e81;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .logo-icon {
            width: 40px;
            height: 40px;
            color: white;
          }
          .company-info h1 {
            font-size: 20px;
            font-weight: 700;
            color: #4b5563;
            margin: 0 0 4px 0;
          }
          .company-info p {
            font-size: 12px;
            color: #6b7280;
            margin: 2px 0;
          }
          .header-right {
            text-align: right;
          }
          .header-right p {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }
          .header-right .tax-id {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 4px;
          }
          
          /* Title */
          .title {
            text-align: center;
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin: 24px 0;
          }
          
          /* Details Grid */
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-bottom: 24px;
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
          }
          .details-section h3 {
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 12px 0;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 4px;
            font-size: 14px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin: 8px 0;
          }
          .detail-label {
            color: #6b7280;
          }
          .detail-value {
            font-weight: 600;
            color: #1f2937;
          }
          
          /* Tables Grid */
          .tables-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          .table-container {
            border: 1px solid #d1d5db;
            border-radius: 4px;
            overflow: hidden;
          }
          .table-header {
            background: #166534;
            color: white;
            padding: 12px;
            font-weight: 600;
            font-size: 14px;
          }
          .table-header-red {
            background: #b91c1c;
            color: white;
            padding: 12px;
            font-weight: 600;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          tbody tr {
            border-bottom: 1px solid #e5e7eb;
          }
          td {
            padding: 12px;
            font-size: 14px;
          }
          .amount-cell {
            text-align: right;
            font-weight: 600;
            color: #1f2937;
          }
          .total-row {
            background: #f0fdf4;
            border-top: 2px solid #166534;
          }
          .total-row-red {
            background: #fef2f2;
            border-top: 2px solid #b91c1c;
          }
          .total-label {
            font-weight: 700;
            color: #1f2937;
          }
          .total-amount {
            text-align: right;
            font-weight: 700;
            color: #166534;
          }
          .total-amount-red {
            text-align: right;
            font-weight: 700;
            color: #b91c1c;
          }
          
          /* Net Pay */
          .net-pay {
            background: linear-gradient(to right, #166534, #16a34a);
            color: white;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .net-pay-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 4px;
          }
          .net-pay-amount {
            font-size: 36px;
            font-weight: 700;
          }
          .calendar-icon {
            width: 64px;
            height: 64px;
            opacity: 0.5;
          }
          
          /* Footer */
          .footer {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            font-size: 12px;
            color: #6b7280;
          }
          .footer p {
            font-weight: 600;
            margin: 0 0 8px 0;
          }
          .footer ul {
            margin: 4px 0;
            padding-left: 20px;
          }
          .footer li {
            margin: 4px 0;
          }
          
          @media print {
            body {
              padding: 0;
            }
            .payslip-container {
              border: none;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="payslip-container">
          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <div class="logo-box">
                <svg class="logo-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 21h18v-2H3v2zM21 8H3v10h18V8zm-2 8H5v-6h14v6z"/>
                </svg>
              </div>
              <div class="company-info">
                <h1>SWIZZSOFT SYSTEM</h1>
                <p>Swift.Secure.Soft.Solution</p>
                <p>📞 +1-15893 Halls 711</p>
                <p>✉️ info@icompanyframez.com</p>
              </div>
            </div>
            <div class="header-right">
              <p>Morris, North Dakota 58639</p>
              <p class="tax-id">Tax ID: 452429916</p>
            </div>
          </div>

          <!-- Title -->
          <h2 class="title">PAYSLIP: ${month} ${year}</h2>

          <!-- Employee Details -->
          <div class="details-grid">
            <div class="details-section">
              <h3>Employee Details</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">John Andrews</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Employee ID:</span>
                <span class="detail-value">${memberId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Position:</span>
                <span class="detail-value">Site Supervisor</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Department:</span>
                <span class="detail-value">Construction</span>
              </div>
            </div>
            <div class="details-section">
              <h3>Payment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Pay Period:</span>
                <span class="detail-value">${month} ${year}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pay Date:</span>
                <span class="detail-value">30-${month}-${year}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">Bank Transfer</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank Account:</span>
                <span class="detail-value">****9244</span>
              </div>
            </div>
          </div>

          <!-- Earnings & Deductions -->
          <div class="tables-grid">
            <div class="table-container">
              <div class="table-header">Earnings</div>
              <table>
                <tbody>
                  ${earnings
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td class="amount-cell">$${item.amount.toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
                <tfoot>
                  <tr class="total-row">
                    <td class="total-label">Total Earnings</td>
                    <td class="total-amount">$${totalEarnings.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="table-container">
              <div class="table-header-red">Deductions</div>
              <table>
                <tbody>
                  ${deductions
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td class="amount-cell">$${item.amount.toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
                <tfoot>
                  <tr class="total-row-red">
                    <td class="total-label">Total Deductions</td>
                    <td class="total-amount-red">$${totalDeductions.toFixed(
                      2
                    )}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Net Pay -->
          <div class="net-pay">
            <div>
              <div class="net-pay-label">Net Pay</div>
              <div class="net-pay-amount">$${netPay.toFixed(2)}</div>
            </div>
            <svg class="calendar-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
            </svg>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Important Notes:</p>
            <ul>
              <li>This is a computer-generated payslip and does not require a signature</li>
              <li>Please verify all details and report any discrepancies to HR within 5 working days</li>
              <li>Keep this payslip for your records and tax purposes</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // EXPORT: PDF using html2canvas + jsPDF (captures the on-screen container - preserves style)
  const handleExportPDF = async () => {
    if (!payslipRef.current) return;
    try {
      // increase scale for better resolution
      const canvas = await html2canvas(payslipRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // calculate image dims to fill A4 while preserving aspect
      const imgProps = { width: canvas.width, height: canvas.height };
      const imgRatio = imgProps.width / imgProps.height;
      let imgPDFWidth = pdfWidth;
      let imgPDFHeight = pdfWidth / imgRatio;
      if (imgPDFHeight > pdfHeight) {
        imgPDFHeight = pdfHeight;
        imgPDFWidth = pdfHeight * imgRatio;
      }

      const x = (pdfWidth - imgPDFWidth) / 2;
      const y = (pdfHeight - imgPDFHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgPDFWidth, imgPDFHeight);
      pdf.save(`Payslip_${memberId}_${month}_${year}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      // fallback to print window
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(getPayslipHTML());
        printWindow.document.close();
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => printWindow.close(), 200);
        }, 250);
      }
    }
  };

  // EXPORT: Word (basic HTML -> .doc approach)
  const handleExportWord = () => {
    const htmlContent = getPayslipHTML();
    const blob = new Blob(["\ufeff" + htmlContent], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payslip_${memberId}_${month}_${year}.doc`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // EXPORT: Excel/CSV (tabular)
  const handleExportExcel = () => {
    let csv = "\ufeff"; // UTF-8 BOM for Excel-friendly CSV
    csv += "SWIZZSOFT SYSTEM - PAYSLIP\n";
    csv += `Period: ${month} ${year}\n`;
    csv += `Employee: John Andrews (${memberId})\n\n`;

    csv += "EARNINGS\n";
    csv += "Description,Amount\n";
    earnings.forEach((e) => {
      csv += `"${e.description}",${e.amount.toFixed(2)}\n`;
    });
    csv += `"Total Earnings",${totalEarnings.toFixed(2)}\n\n`;

    csv += "DEDUCTIONS\n";
    csv += "Description,Amount\n";
    deductions.forEach((d) => {
      csv += `"${d.description}",${d.amount.toFixed(2)}\n`;
    });
    csv += `"Total Deductions",${totalDeductions.toFixed(2)}\n\n`;

    csv += `"NET PAY",${netPay.toFixed(2)}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payslip_${memberId}_${month}_${year}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // PRINT (opens print-ready HTML in new window)
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const htmlContent = getPayslipHTML();

    if (!printWindow) return;
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // do not auto-close so user can review print dialog; closing sometimes blocks printing on some browsers
    }, 250);
  };

  // SHARE (navigator.share if available, else copy to clipboard fallback)
  const handleShare = async () => {
    try {
      const element = payslipRef.current;
      if (!element) return;

      // Generate image
      const dataUrl = await toPng(element);

      // Convert image → PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");

      // Try native share
      if (
        navigator.canShare &&
        navigator.canShare({
          files: [
            new File([pdfBlob], "Payslip.pdf", { type: "application/pdf" }),
          ],
        })
      ) {
        await navigator.share({
          title: "Payslip",
          text: "Here is your payslip",
          files: [
            new File([pdfBlob], "Payslip.pdf", { type: "application/pdf" }),
          ],
        });
        return;
      }

      // Fallback: WhatsApp Web
      const whatsappUrl = `https://wa.me/?text=Here%20is%20your%20payslip.%20(PDF%20attached%20separately)`;
      window.open(whatsappUrl, "_blank");

      // Fallback: Email
      window.location.href = `mailto:?subject=Payslip&body=Here is your payslip (PDF attached separately).`;

      // Always save locally as final fallback
      saveAs(pdfBlob, `Payslip.pdf`);
    } catch (err) {
      console.error("Error sharing:", err);
      alert("Sharing failed. Please download the PDF instead.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{`
        @media print {
          body { 
            margin: 0; 
            padding: 0;
            background: white !important;
          }
          .no-print { display: none !important; }
          .print-container { 
            box-shadow: none !important; 
            border: none !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          .print-wrapper {
            background: white !important;
            padding: 0 !important;
          }
          @page {
            margin: 0.5in;
            size: A4;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print flex justify-between items-center px-6 py-4 bg-white shadow sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-800">Payslip Viewer</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Export as PDF"
          >
            <FaFilePdf className="w-5 h-5 text-red-600" />
          </button>
          <button
            onClick={handleExportWord}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Export as Word"
          >
            <FaFileWord className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={handleExportExcel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Export as Excel/CSV"
          >
            <FaFileExcel className="w-5 h-5 text-green-600" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Print"
          >
            <Printer className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Document container */}
      <div className="print-wrapper flex justify-center px-4 py-6">
        <div
          ref={payslipRef}
          className="print-container w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-gray-200"
        >
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading payslip...
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-indigo-800 rounded-lg flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-600">
                      SWIZZSOFT SYSTEM
                    </h1>
                    <p className="text-sm text-gray-600">
                      Swift.Secure.Soft.Solution
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> +254 712345678
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> info@swizzsoft.com
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {`${employeeInfo.branch}, 58639`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tax ID: 452429916
                  </p>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                PAYSLIP:{" "}
                {`${employeeInfo.salaryCycle} PAYSLIP`}
              </h2>

              {/* Employee Info & Pay Period */}
              <div className="grid grid-cols-2 gap-8 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                    Employee Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold">{employeeInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee ID:</span>
                      <span className="font-semibold">{employeeInfo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-semibold">
                        {employeeInfo.designation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-semibold">
                        {employeeInfo.department || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                    Payment Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pay Period:</span>
                      <span className="font-semibold">
                        {employeeInfo.salaryCycle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pay Date:</span>
                      <span className="font-semibold">
                        {new Date(employeeInfo.createdat).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-semibold">Bank Transfer</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Account:</span>
                      <span className="font-semibold">{`${employeeInfo.bankAccount}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Earnings */}
                <div className="border border-gray-300 rounded shadow-sm">
                  <div className="bg-green-700 text-white p-3">
                    <h3 className="font-semibold">Earnings</h3>
                  </div>
                  <table className="w-full">
                    <tbody>
                      {earnings.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="p-3 text-sm text-gray-700">
                            {item.description}
                          </td>
                          <td className="p-3 text-right text-sm font-semibold text-gray-800">
                            Ksh. {item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-green-50">
                      <tr className="border-t-2 border-green-700">
                        <td className="p-3 font-bold text-gray-800">
                          Total Earnings
                        </td>
                        <td className="p-3 text-right font-bold text-green-700">
                          Ksh. {totalEarnings.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Deductions */}
                <div className="border border-gray-300 rounded shadow-sm">
                  <div className="bg-red-700 text-white p-3">
                    <h3 className="font-semibold">Deductions</h3>
                  </div>
                  <table className="w-full">
                    <tbody>
                      {deductions.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="p-3 text-sm text-gray-700">
                            {item.description}
                          </td>
                          <td className="p-3 text-right text-sm font-semibold text-gray-800">
                            Ksh. {item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-red-50">
                      <tr className="border-t-2 border-red-700">
                        <td className="p-3 font-bold text-gray-800">
                          Total Deductions
                        </td>
                        <td className="p-3 text-right font-bold text-red-700">
                          Ksh. {totalDeductions.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Net Pay */}
              <div className="bg-gradient-to-r from-green-800 to-green-600 text-white p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Net Pay</p>
                    <p className="text-4xl font-bold mt-1">
                      Ksh. {netPay.toFixed(2)}
                    </p>
                  </div>
                  <Calendar className="w-16 h-16 opacity-50" />
                </div>
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 p-4 rounded text-xs text-gray-600">
                <p className="font-semibold mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    This is a computer-generated payslip and does not require a
                    signature
                  </li>
                  <li>
                    Please verify all details and report any discrepancies to HR
                    within 5 working days
                  </li>
                  <li>Keep this payslip for your records and tax purposes</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Filter Card */}
      <div className="no-print fixed top-1/2 right-2 transform -translate-y-1/2 bg-white shadow-lg border rounded-lg w-52 p-6 z-50">
        <h3 className="font-semibold text-gray-700 mb-4">Filter Payslip</h3>

        <label className="text-sm text-gray-600">Member ID</label>
        <input
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mb-4"
          placeholder="Enter Member ID"
        />

        <label className="text-sm text-gray-600">Year</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mb-4"
        >
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
        </select>

        <label className="text-sm text-gray-600">Month</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mb-4"
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <button
          onClick={fetchPayslip}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
        >
          {loading ? "Loading..." : "Fetch Payslip"}
        </button>
      </div>
    </div>
  );
}
