import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";


import Invcategory from "./pages/Inventory/Category/Invcategory";
import InvUom from "./pages/Inventory/UnitOfMeasure/InvUom";
import Invitem from "./pages/Inventory/Items/Invitem";
import InvJournal from "./pages/Inventory/Journals/InvJournal";
import InvTransactions from "./pages/Inventory/Transcations/InvTransactions";
import ChartOfAccounts from "./pages/Finance/COA/ChartsOfAccount";


//import Home from "./pages/Home";
//import Channel from "./pages/Channel";


import Settings from "./pages/Settings";
import Leaves from "./pages/HR/Leave";
import Login from "./pages/Auth/Login";
import Procureone from "./pages/Procurement/procureone";
import Procuretwo from "./pages/Procurement/procuretwo";
import HR from "./pages/HR/HR";
import Employees from "./pages/HR/Employees";
import Departments from "./pages/HR/Departments";
import Procument from "./pages/Procurement/Procument";
import Finance from "./pages/Finance/Finance";
import GeneralLedger from "./pages/Finance/GeneralLedger";

import InvLocation from "./pages/Inventory/locations/InvLocation";
import InventoryDashboard from "./pages/Inventory/InventoryDashboard.jsx";
import ProVendors from "./pages/Procurement/Vendors/ProVendors.jsx";
import ProRequisitions from "./pages/Procurement/Requisitions/ProRequisitions.jsx";
import PurchaseOrder from "./pages/Procurement/PurchaseOrder/PurchaseOrder.jsx";
import BankLinkages from "./pages/Finance/Setup/Bank/BankLinkages.jsx";
import AccountConfiguration from "./pages/Finance/Setup/AccountConfiguration/AccountConfiguration.jsx";
import PayrollSetup from "./pages/HR/PayrollSetup/PayrollSetup.jsx";
import StatutorySetup from "./pages/HR/Statutory setup/StatutorySetup.jsx";
import StoreRequisitions from "./pages/Procurement/StoreRequisitions/StoreRequisitions.jsx";
import SalesCreditMemo from "./pages/Finance/AccountsReceivable/SalesCreditMemo/SalesCreditMemo.jsx";
import Setup from "./pages/Finance/Setup/Setup.jsx";
import AccountPayable from "./pages/Finance/AccountPayable/AccountPayable.jsx";
import AccountsReceivable from "./pages/Finance/AccountsReceivable/AccountsReceivable.jsx";
import PaymentVoucher from "./pages/Finance/PaymentVoucher/PaymentVoucher.jsx";
import RequestForQuotation from "./pages/Procurement/RFQ/RequestForQuotation.jsx";
import ProjectsWithBudgets from "./pages/Procurement/ProjectsWithBudgets/ProjectsWithBudgets.jsx";
import QuotationSubmission from "./pages/Procurement/Quotation/QuotationSubmission.jsx";
import Quotations from "./pages/Procurement/Quotation/Quotations.jsx";
import BidAnalysis from "./pages/Procurement/Biding/BidAnalysis.jsx";
import PostingJournal from "./pages/Finance/postjournal/postingJournal.jsx";
import SalesInvoice from "./pages/Finance/AccountsReceivable/Salesinvoice/salesInvoice.jsx";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login route WITHOUT Layout */}
        <Route path="/login" element={<Login />} />

        {/* All other routes WITH Layout */}
        <Route path="/" element={<Layout />}>
          {/* HR */}
          <Route path="Human Resource" element={<HR />} />
          <Route path="HR/payrollsetup" element={<PayrollSetup />} />
          <Route path="HR/statutorysetup" element={<StatutorySetup />} />
          <Route path="department" element={<Departments />} />
          <Route path="leave" element={<Leaves />} />

          {/* Procurement */}
          <Route path="/Procurement" element={<Procument />} />
          <Route path="/Procurement/Vendors" element={<ProVendors />} />
          <Route path="/Procurement/requisitions" element={<ProRequisitions />} />
          <Route path="Procurement/StoreRequisitions" element={<StoreRequisitions />} />
          <Route path="/Procurement/PurchaseOrder" element={<PurchaseOrder />} />
          <Route path="/Procurement/SubmitQuotation" element={<QuotationSubmission />} />
          <Route path="/Procurement/Quotation" element={<Quotations />} />
          <Route path="/Procurement/RFQ" element={<RequestForQuotation />} />
          <Route path="/Procurement/ProjectsWithBudgets" element={<ProjectsWithBudgets />} />
          <Route path="/Procurement/Biding" element={<BidAnalysis />} />

          {/* Finance */}
          {/* <Route path="Finance" element={<Finance />} />
          <Route path="Finance/ChartsOfAccount" element={<ChartOfAccounts />} />
          <Route path="Finance/PostingJournal" element={<PostingJournal />} />
          <Route path="Finance/BanksSetup" element={<BankLinkages />} />
          <Route path="Finance/AccountConfiguration" element={<AccountConfiguration />} />
          <Route path="Finance/salesInvoice" element={<SalesInvoice />} />
          <Route path="Finance/salesCreditMemo" element={<SalesCreditMemo />} />
          <Route path="Finance/Setup" element={<Setup />} />
          <Route path="Finance/PaymentVoucher" element={<PaymentVoucher />} />
          <Route path="Finance/GeneralLedger" element={<GeneralLedger />} />
          <Route path="GeneralLedger/reports" element={<h1>GL Reports</h1>} />
          <Route path="GeneralLedger/settings" element={<h1>GL Settings</h1>} />

          <Route path="Finance/AccountsPayable" element={<AccountPayable />} />
          <Route path="Finance/AccountsReceivable" element={<AccountsReceivable />} />
          <Route path="AccountsPayable/reports" element={<h1>AP Reports</h1>} />
          <Route path="AccountsPayable/settings" element={<h1>AP Settings</h1>} />
          <Route path="AccountsReceivable" element={<h1>Accounts Receivable</h1>} />
          <Route path="BudgetingForecasting" element={<h1>Budgeting & Forecasting</h1>} />
          <Route path="BankReconciliation" element={<h1>Bank Reconciliation</h1>} />
          <Route path="FinancialReporting" element={<h1>Financial Reporting</h1>} /> */}

          {/* Inventory */}
          <Route path="Inventory" element={<h1>Inventory</h1>} />
          <Route path="Inventory/Inventory" element={<InventoryDashboard />} />
          <Route path="Inventory/invcategories" element={<Invcategory />} />
          <Route path="Inventory/Invlocations" element={<InvLocation />} />
          <Route path="Inventory/invUnitOfMeasure" element={<InvUom />} />
          <Route path="Inventory/InvItems" element={<Invitem />} />
          <Route path="Inventory/InvJournals" element={<InvJournal />} />
          <Route path="Inventory/InvTransactions" element={<InvTransactions />} />
          <Route path="Inventory/StockReceipts" element={<h1>Stock Receipts</h1>} />
          <Route path="Inventory/StockIssues" element={<h1>Stock Issues</h1>} />
          <Route path="Inventory/TransfersbetweenWarehouses" element={<h1>Transfers between Warehouses</h1>} />
          <Route path="Inventory/StockAdjustments" element={<h1>Stock Adjustments</h1>} />
          <Route path="Inventory/StockReportingAndAlerts" element={<h1>Stock Reporting & Alerts</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}
