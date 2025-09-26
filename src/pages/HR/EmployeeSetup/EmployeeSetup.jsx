import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { MdPerson, MdExpandMore, MdExpandLess } from "react-icons/md";
import { FaUser, FaBuilding, FaUsers, FaCreditCard, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import Employees from "./EmployeeProfile/Employees";
import EmployeeEarnings from "./EmployeeAccounts/EmployeeEarnings/EmployeeEarnings";
import EmployeeAccountSetup from "./EmployeeAccounts/EmployeeAccountSetup";
import EmployeeDeductions from "./EmployeeAccounts/EmployeeDeductions/EmployeeDeductions";

const Branches = () => <div>Branches setup here</div>;
const InsuranceCompanies = () => <div>Insurance setup here</div>;

// Account subcomponents
const PayrollSetup = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Payroll Setup</h2><p>Configure payroll settings and calculations here.</p></div>;
const Earnings = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Benefits Management</h2><p>Manage employee benefits and deductions here.</p></div>;
const SalaryStructure = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Salary Structure</h2><p>Define salary grades and structures here.</p></div>;
const PayrollReports = () => <div className="p-6"><h2 className="text-2xl font-bold mb-4">Payroll Reports</h2><p>View and generate payroll reports here.</p></div>;

function EmployeeSetup() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSublink, setSelectedSublink] = useState(null);

  const [loading, setLoading] = useState(true);
  const [expandedAccounts, setExpandedAccounts] = useState(false);

  const users = [
    {
      id: 1,
      name: "Employees",
      subtitle: "Employee Management",
      icon: FaUser,
    },
    {
      id: 2,
      name: "Accounts",
      subtitle: "Employee Accounts Management",
      icon: FaCreditCard,
      hasSublinks: true,
      sublinks: [
        {
          id: 21,
          name: "Account Setup",
          subtitle: "Configure Employees Account",
          icon: FaMoneyBillWave,
        },
        {
          id: 22,
          name: "Earnings",
          subtitle: "Manage employee's Earnings",
          icon: FaUsers,
        },
        {
          id: 23,
          name: "Employees Deductions",
          subtitle: "Manage employee's deductions",
          icon: FaChartLine,
        },
        {
          id: 24,
          name: "Payroll Reports",
          subtitle: "View payroll reports",
          icon: FaBuilding,
        },
      ],
    },
    {
      id: 3,
      name: "Insurance",
      subtitle: "Insurance Companies",
      icon: FaMoneyBillWave,
    },
  ];

  const user = selectedUser || users[0];

  const handleMainItemClick = (u) => {
    if (u.hasSublinks) {
      // If clicking on Accounts, toggle expansion
      if (u.id === 2) {
        setExpandedAccounts(!expandedAccounts);
        // If not already selected, select it
        if (selectedUser?.id !== u.id) {
          setSelectedUser(u);
          setSelectedSublink(null);
        }
      }
    } else {
      setSelectedUser(u);
      setSelectedSublink(null);
      setExpandedAccounts(false);
    }
  };

  const handleSubLinkClick = (sublink) => {
    setSelectedSublink(sublink);
    const parentUser = users.find(u => u.id === 2);
    setSelectedUser(parentUser);
  };

  const renderContent = () => {
    if (selectedSublink) {
      switch (selectedSublink.name) {
        case "Payroll Setup":
          return <PayrollSetup />;
        case "Earnings":
          return <EmployeeEarnings />;
        case "Employees Deductions":
          return <EmployeeDeductions />;
        case "Payroll Reports":
          return <PayrollReports />;
        default:
          return <EmployeeAccountSetup />;
      }
    }

    // Otherwise render main content
    switch (user.name) {
      case "Employees":
        return <Employees />;
      case "Accounts":
        return <EmployeeAccountSetup />;
      case "Insurance":
        return <InsuranceCompanies />;
      default:
        return <p>Select an option from the sidebar</p>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* LEFT SIDEBAR */}
      <aside className="w-96 border-r bg-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MdPerson className="text-white" /> Employee Setup
          </h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2 bg-gray-200 rounded-xl">
            {users.map((u) => (
              <div key={u.id}>
                {/* Main Item */}
                <Card
                  onClick={() => handleMainItemClick(u)}
                  className={`p-3 cursor-pointer transition-all duration-200 ${
                    user.id === u.id && !selectedSublink
                      ? "bg-indigo-800 text-white shadow-lg"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <u.icon
                        className={`text-lg ${
                          user.id === u.id && !selectedSublink
                            ? "text-white"
                            : "text-indigo-600"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p
                          className={`text-xs ${
                            user.id === u.id && !selectedSublink
                              ? "text-indigo-200"
                              : "text-muted-foreground"
                          }`}
                        >
                          {u.subtitle}
                        </p>
                      </div>
                    </div>
                    {u.hasSublinks && (
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${
                            user.id === u.id && !selectedSublink
                              ? "bg-indigo-600 hover:bg-indigo-600 text-white"
                              : "bg-gray-200 hover:bg-gray-200 text-gray-900"
                          }`}
                        >
                          {u.sublinks?.length || 0}
                        </Badge>
                        {expandedAccounts && u.id === 2 ? (
                          <MdExpandLess
                            className={`text-lg ${
                              user.id === u.id && !selectedSublink
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          />
                        ) : (
                          <MdExpandMore
                            className={`text-lg ${
                              user.id === u.id && !selectedSublink
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Sublinks */}
                {u.hasSublinks && expandedAccounts && u.id === 2 && (
                  <div className="ml-4 mt-2 space-y-1">
                    {u.sublinks.map((sublink) => (
                      <Card
                        key={sublink.id}
                        onClick={() => handleSubLinkClick(sublink)}
                        className={`p-2 cursor-pointer transition-all duration-200 border-l-4 ${
                          selectedSublink?.id === sublink.id
                            ? "bg-indigo-100 border-l-indigo-500 shadow-sm"
                            : "bg-white border-l-gray-200 hover:bg-indigo-50 hover:border-l-indigo-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <sublink.icon
                            className={`text-sm ${
                              selectedSublink?.id === sublink.id
                                ? "text-indigo-600"
                                : "text-gray-500"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-xs font-medium ${
                                selectedSublink?.id === sublink.id
                                  ? "text-indigo-800"
                                  : "text-gray-700"
                              }`}
                            >
                              {sublink.name}
                            </p>
                            <p
                              className={`text-xs ${
                                selectedSublink?.id === sublink.id
                                  ? "text-indigo-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {sublink.subtitle}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default EmployeeSetup;