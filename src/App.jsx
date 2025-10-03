import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";


import Invcategory from "./pages/Inventory/Category/Invcategory";
import InvUom from "./pages/Inventory/UnitOfMeasure/InvUom";
import Invitem from "./pages/Inventory/Items/Invitem";
import InvJournal from "./pages/Inventory/Journals/InvJournal";
import InvTransactions from "./pages/Inventory/Transcations/InvTransactions";
import ChartOfAccounts from "./pages/Finance/COA/ChartsOfAccount";
import PostingJournal from "./pages/Finance/POST/postingJournal";


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


import FixedAssetsSetup from "./pages/FixedAssets/FixedAssetsSetup.jsx";
import FixCategory from "./pages/FixedAssets/Category/fixCategory.jsx";
import Location from "./pages/FixedAssets/Location/Location.jsx";
import FixUnitOfMeasure from "./pages/FixedAssets/UnitOfMeasure/fixUnitOfMeasure.jsx";

import InvLocation from "./pages/Inventory/locations/InvLocation";
import InventoryDashboard from "./pages/Inventory/InventoryDashboard.jsx";
import ProVendors from "./pages/Procurement/Vendors/ProVendors.jsx";
import ProRequisitions from "./pages/Procurement/Requisitions/ProRequisitions.jsx";
import PurchaseOrder from "./pages/Procurement/PurchaseOrder/PurchaseOrder.jsx";
import BankLinkages from "./pages/Finance/Setup/Bank/BankLinkages.jsx";
import AccountConfiguration from "./pages/Finance/Setup/AccountConfiguration/AccountConfiguration.jsx";
import PurchaseInvoices from "./pages/Finance/PurchaseInvoice/PurchaseInvoices.jsx";
import PurchaseCreditMemo from "./pages/Finance/PurchaseCreditMemo/PurchaseCreditMemo.jsx";
import PayrollSetup from "./pages/HR/PayrollSetup/PayrollSetup.jsx";
import StatutorySetup from "./pages/HR/Statutory setup/StatutorySetup.jsx";
import StoreRequisitions from "./pages/Procurement/StoreRequisitions/StoreRequisitions.jsx";
import EmployeeSetup from "./pages/HR/EmployeeSetup/EmployeeSetup.jsx";


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
          <Route path="HR/payrollsetup" element={<PayrollSetup/>} />
          <Route path="HR/statutorysetup" element={<StatutorySetup/>} />
          <Route path="HR/Employees" element={<EmployeeSetup/>} />
          <Route path="department" element={<Departments/>} />
          <Route path="leave" element={<Leaves />} />

          {/* FixedAssets */}
          <Route path="/FixedAssets" element={<FixedAssetsSetup />} />
          <Route path="/FixedAssets/Category" element={<FixCategory/>} />
          <Route path="/FixedAssets/Location" element={<Location/>} />
          <Route path="FixedAssets/FixedAssetCard" element={<FixedAssetsSetup/>} />

          {/* Procurement */}
          <Route path="/Procurement" element={<Procument/>} />
          <Route path="/Procurement/Vendors" element={<ProVendors/>} />
          <Route path="/Procurement/requisitions" element={<ProRequisitions/>} />
          <Route path="Procurement/StoreRequisitions" element={<StoreRequisitions/>} />
          <Route path="/Procurement/PurchaseOrder" element={<PurchaseOrder/>} />

          {/* Finance */}
          <Route path="Finance" element={<Finance/>} />
          <Route path="Finance/ChartsOfAccount" element={<ChartOfAccounts/>} />
          <Route path="Finance/PostingJournal" element={<PostingJournal/>} />
          <Route path="Finance/BanksSetup" element={<BankLinkages/>} />
          <Route path="Finance/AccountConfiguration" element={<AccountConfiguration/>} />
          <Route path="Finance/PurchaseInvoices" element={<PurchaseInvoices/>} />
          <Route path="Finance/PurchaseCreditMemo" element={<PurchaseCreditMemo/>} />
          <Route path="Finance/GeneralLedger" element={<GeneralLedger/>} />
          <Route path="GeneralLedger/reports" element={<h1>GL Reports</h1>} />
          <Route path="GeneralLedger/settings" element={<h1>GL Settings</h1>} />

          <Route path="AccountsPayable" element={<h1>Accounts Payable</h1>} />
          <Route path="AccountsPayable/reports" element={<h1>AP Reports</h1>} />
          <Route path="AccountsPayable/settings" element={<h1>AP Settings</h1>} />
          <Route path="AccountsReceivable" element={<h1>Accounts Receivable</h1>} />
          <Route path="BudgetingForecasting" element={<h1>Budgeting & Forecasting</h1>} />
          <Route path="BankReconciliation" element={<h1>Bank Reconciliation</h1>} />
          <Route path="FinancialReporting" element={<h1>Financial Reporting</h1>} />

          {/* Inventory */}
          <Route path="Inventory" element={<h1>Inventory</h1>} />
          <Route path="Inventory/Inventory" element={<InventoryDashboard/>} />
          <Route path="Inventory/invcategories" element={<Invcategory/>} />
          <Route path="Inventory/Invlocations" element={<InvLocation/>} />
          <Route path="Inventory/invUnitOfMeasure" element={<InvUom/>} />
          <Route path="Inventory/InvItems" element={<Invitem/>} />
          <Route path="Inventory/InvJournals" element={<InvJournal/>} />
          <Route path="Inventory/InvTransactions" element={<InvTransactions/>} />
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
