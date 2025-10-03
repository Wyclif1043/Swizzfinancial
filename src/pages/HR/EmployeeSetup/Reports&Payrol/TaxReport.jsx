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
import { getAnnualTaxReport } from "../../../../apis/employeesapi/ReportsApi";

export default function AnnualTaxReport() {
  const reportRef = useRef(null);
  const [reportData, setReportData] = useState(null);
  const [employeeId, setEmployeeId] = useState("1001");
  const [year, setYear] = useState("2025");
  const [loading, setLoading] = useState(false);

 const fetchTaxReport = async () => {
  setLoading(true);
  try {
    const response = await getAnnualTaxReport(employeeId, year);
    console.log("Tax Report Response:", response);
    if (response.success && response.data.length > 0) {
      const report = response.data.find(r => 
        r.EmployeeId.toString() === employeeId && 
        r.TaxYear.toString() === year
      ) || response.data[0];
      setReportData(report);
    }
  } catch (err) {
    console.error("Error fetching tax report:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTaxReport();
  }, []);

  if (!reportData) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading tax report...</p>
    </div>;
  }

  const totalDeductions = 
    reportData.TotalPAYE + 
    reportData.TotalNSSF + 
    reportData.TotalSHIF + 
    reportData.TotalHousingLevy + 
    reportData.TotalOtherDeductions;

  const deductionsBreakdown = [
    { description: "PAYE (Pay As You Earn)", amount: reportData.TotalPAYE },
    { description: "NSSF (National Social Security Fund)", amount: reportData.TotalNSSF },
    { description: "SHIF (Social Health Insurance Fund)", amount: reportData.TotalSHIF },
    { description: "Housing Levy", amount: reportData.TotalHousingLevy },
    { description: "Other Deductions", amount: reportData.TotalOtherDeductions },
  ];

  const getReportHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Annual Tax Report ${reportData.TaxYear}</title>
        <style>
          @page { size: A4; margin: 0.5in; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
          }
          .report-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 32px;
            border: 1px solid #e5e7eb;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 3px solid #1e40af;
          }
          .title {
            text-align: center;
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin: 24px 0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
            background: #f9fafb;
            padding: 16px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          .summary-box {
            background: linear-gradient(to right, #1e40af, #3b82f6);
            color: white;
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }
          .summary-item:last-child { border-bottom: none; }
          .summary-label { font-size: 14px; opacity: 0.9; }
          .summary-amount { font-size: 18px; font-weight: 700; }
          .deductions-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            border: 1px solid #d1d5db;
          }
          .deductions-table th {
            background: #1e40af;
            color: white;
            padding: 12px;
            text-align: left;
          }
          .deductions-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .deductions-table tfoot td {
            background: #eff6ff;
            font-weight: 700;
            border-top: 2px solid #1e40af;
          }
          .net-pay-box {
            background: #10b981;
            color: white;
            padding: 24px;
            border-radius: 8px;
            text-align: center;
            margin: 24px 0;
          }
          .net-pay-label { font-size: 16px; opacity: 0.9; }
          .net-pay-amount { font-size: 42px; font-weight: 700; margin-top: 8px; }
          .footer {
            background: #f9fafb;
            padding: 16px;
            font-size: 12px;
            color: #6b7280;
            margin-top: 24px;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div>
              <h1 style="margin:0;font-size:20px;color:#4b5563;">SWIZZSOFT SYSTEM</h1>
              <p style="margin:4px 0;font-size:12px;color:#6b7280;">Swift.Secure.Soft.Solution</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0;font-size:14px;color:#6b7280;">Tax ID: 452429916</p>
              <p style="margin:4px 0;font-size:12px;color:#9ca3af;">Generated: ${new Date(reportData.GeneratedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <h2 class="title">ANNUAL TAX REPORT ${reportData.TaxYear}</h2>

          <div class="info-grid">
            <div class="info-row">
              <span style="color:#6b7280;">Employee Name:</span>
              <span style="font-weight:600;">${reportData.EmployeeName || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span style="color:#6b7280;">Employee ID:</span>
              <span style="font-weight:600;">${reportData.EmployeeId}</span>
            </div>
            <div class="info-row">
              <span style="color:#6b7280;">KRA PIN:</span>
              <span style="font-weight:600;">${reportData.KRAPinNumber || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span style="color:#6b7280;">Tax Year:</span>
              <span style="font-weight:600;">${reportData.TaxYear}</span>
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-item">
              <span class="summary-label">Total Gross Income</span>
              <span class="summary-amount">Ksh ${reportData.TotalGross.toLocaleString('en-KE', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Deductions</span>
              <span class="summary-amount">Ksh ${totalDeductions.toLocaleString('en-KE', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Net Pay</span>
              <span class="summary-amount">Ksh ${reportData.TotalNet.toLocaleString('en-KE', {minimumFractionDigits: 2})}</span>
            </div>
          </div>

          <h3 style="font-size:18px;font-weight:600;margin:24px 0 12px;">Deductions Breakdown</h3>
          <table class="deductions-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align:right;">Amount (Ksh)</th>
              </tr>
            </thead>
            <tbody>
              ${deductionsBreakdown.map(d => `
                <tr>
                  <td>${d.description}</td>
                  <td style="text-align:right;font-weight:600;">${d.amount.toLocaleString('en-KE', {minimumFractionDigits: 2})}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td>Total Deductions</td>
                <td style="text-align:right;">${totalDeductions.toLocaleString('en-KE', {minimumFractionDigits: 2})}</td>
              </tr>
            </tfoot>
          </table>

          <div class="footer">
            <p style="font-weight:600;margin:0 0 8px;">Important Information:</p>
            <ul style="margin:4px 0;padding-left:20px;">
              <li>This report summarizes your annual tax deductions for the year ${reportData.TaxYear}</li>
              <li>Please retain this document for your tax filing purposes</li>
              <li>For queries, contact HR department within 10 working days</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
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
      pdf.save(`Tax_Report_${reportData.EmployeeId}_${reportData.TaxYear}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    }
  };

  const handleExportWord = () => {
    const htmlContent = getReportHTML();
    const blob = new Blob(["\ufeff" + htmlContent], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tax_Report_${reportData.EmployeeId}_${reportData.TaxYear}.doc`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    let csv = "\ufeff";
    csv += "SWIZZSOFT SYSTEM - ANNUAL TAX REPORT\n";
    csv += `Tax Year: ${reportData.TaxYear}\n`;
    csv += `Employee: ${reportData.EmployeeName || 'N/A'} (${reportData.EmployeeId})\n`;
    csv += `KRA PIN: ${reportData.KRAPinNumber || 'N/A'}\n\n`;
    csv += "SUMMARY\n";
    csv += "Description,Amount\n";
    csv += `"Total Gross Income",${reportData.TotalGross.toFixed(2)}\n`;
    csv += `"Total Deductions",${totalDeductions.toFixed(2)}\n`;
    csv += `"Total Net Pay",${reportData.TotalNet.toFixed(2)}\n\n`;
    csv += "DEDUCTIONS BREAKDOWN\n";
    csv += "Description,Amount\n";
    deductionsBreakdown.forEach((d) => {
      csv += `"${d.description}",${d.amount.toFixed(2)}\n`;
    });
    csv += `"Total Deductions",${totalDeductions.toFixed(2)}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tax_Report_${reportData.EmployeeId}_${reportData.TaxYear}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const htmlContent = getReportHTML();
    if (!printWindow) return;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const handleShare = async () => {
    try {
      const element = reportRef.current;
      if (!element) return;
      const dataUrl = await toPng(element);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");

      if (navigator.canShare && navigator.canShare({
        files: [new File([pdfBlob], "Tax_Report.pdf", { type: "application/pdf" })],
      })) {
        await navigator.share({
          title: "Annual Tax Report",
          text: "Here is your annual tax report",
          files: [new File([pdfBlob], "Tax_Report.pdf", { type: "application/pdf" })],
        });
        return;
      }
      saveAs(pdfBlob, `Tax_Report_${reportData.EmployeeId}_${reportData.TaxYear}.pdf`);
    } catch (err) {
      console.error("Error sharing:", err);
      alert("Sharing failed. The PDF has been downloaded instead.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; background: white !important; }
          .no-print { display: none !important; }
          .print-container { 
            box-shadow: none !important; 
            border: none !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          @page { margin: 0.5in; size: A4; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print flex justify-between items-center px-6 py-4 bg-white shadow sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-800">Annual Tax Report {reportData.TaxYear}</h1>
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
      <div className="flex justify-center px-4 py-6">
        <div
          ref={reportRef}
          className="print-container w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-gray-200"
        >
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading tax report...</div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-blue-800 rounded-lg flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-600">SWIZZSOFT SYSTEM</h1>
                    <p className="text-sm text-gray-600">Swift.Secure.Soft.Solution</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> +254 712345678
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> info@swizzsoft.com
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Nairobi, Kenya</p>
                  <p className="text-xs text-gray-500 mt-1">Tax ID: 452429916</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Generated: {new Date(reportData.GeneratedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                ANNUAL TAX REPORT {reportData.TaxYear}
              </h2>

              {/* Employee Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee Name:</span>
                    <span className="font-semibold">{reportData.EmployeeName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee ID:</span>
                    <span className="font-semibold">{reportData.EmployeeId}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">KRA PIN:</span>
                    <span className="font-semibold">{reportData.KRAPinNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Year:</span>
                    <span className="font-semibold">{reportData.TaxYear}</span>
                  </div>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-lg mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm opacity-90">Total Gross Income</p>
                    <p className="text-2xl font-bold mt-1">
                      Ksh {reportData.TotalGross.toLocaleString('en-KE', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Total Deductions</p>
                    <p className="text-2xl font-bold mt-1">
                      Ksh {totalDeductions.toLocaleString('en-KE', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Total Net Pay</p>
                    <p className="text-2xl font-bold mt-1">
                      Ksh {reportData.TotalNet.toLocaleString('en-KE', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Deductions Breakdown</h3>
              <div className="border border-gray-300 rounded shadow-sm mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-800 text-white">
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-right">Amount (Ksh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deductionsBreakdown.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-3 text-sm text-gray-700">{item.description}</td>
                        <td className="p-3 text-right text-sm font-semibold text-gray-800">
                          {item.amount.toLocaleString('en-KE', {minimumFractionDigits: 2})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-blue-50">
                    <tr className="border-t-2 border-blue-800">
                      <td className="p-3 font-bold text-gray-800">Total Deductions</td>
                      <td className="p-3 text-right font-bold text-blue-800">
                        {totalDeductions.toLocaleString('en-KE', {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Net Pay */}
              <div className="bg-gradient-to-r from-green-800 to-green-600 text-white p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Annual Net Pay</p>
                    <p className="text-4xl font-bold mt-1">
                      Ksh {reportData.TotalNet.toLocaleString('en-KE', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <Calendar className="w-16 h-16 opacity-50" />
                </div>
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 p-4 rounded text-xs text-gray-600">
                <p className="font-semibold mb-1">Important Information:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This report summarizes your annual tax deductions for the year {reportData.TaxYear}</li>
                  <li>Please retain this document for your tax filing purposes</li>
                  <li>For queries or discrepancies, contact HR department within 10 working days</li>
                  <li>This is a computer-generated report and does not require a signature</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter Card */}
      <div className="no-print fixed top-1/2 right-2 transform -translate-y-1/2 bg-white shadow-lg border rounded-lg w-52 p-6 z-50">
        <h3 className="font-semibold text-gray-700 mb-4">Filter Report</h3>

        <label className="text-sm text-gray-600">Employee ID</label>
        <input
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mb-4"
          placeholder="Enter Employee ID"
        />

        <label className="text-sm text-gray-600">Tax Year</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mb-4"
        >
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>

        <button
          onClick={fetchTaxReport}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? "Loading..." : "Fetch Report"}
        </button>
      </div>
    </div>
  );
}