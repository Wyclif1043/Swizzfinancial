import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MdPerson,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import {
  FaUsers,
  FaCreditCard,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";

import EmployeeEarnings from "./EmployeeAccounts/EmployeeEarnings/EmployeeEarnings";
import EmployeeAccountSetup from "./EmployeeAccounts/EmployeeAccountSetup";
import EmployeeDeductions from "./EmployeeAccounts/EmployeeDeductions/EmployeeDeductions";


function AccountsSetup() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSublink, setSelectedSublink] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});

  const users = [
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
      ],
    },
  ];

  const user = selectedUser || users[0];

  const handleMainItemClick = (u) => {
    if (u.hasSublinks) {
      setExpandedMenus((prev) => ({
        ...prev,
        [u.id]: !prev[u.id],
      }));
      if (selectedUser?.id !== u.id) {
        setSelectedUser(u);
        setSelectedSublink(null);
      }
    } else {
      setSelectedUser(u);
      setSelectedSublink(null);
    }
  };

  const handleSubLinkClick = (sublink, parentUser) => {
    setSelectedSublink(sublink);
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
        default:
          return <EmployeeAccountSetup />;
      }
    }

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
            <MdPerson className="text-white" /> Account Setup
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
                        {expandedMenus[u.id] ? (
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
                {u.hasSublinks && expandedMenus[u.id] && (
                  <div className="ml-4 mt-2 space-y-1">
                    {u.sublinks.map((sublink) => (
                      <Card
                        key={sublink.id}
                        onClick={() => handleSubLinkClick(sublink, u)}
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
        <div className="h-full">{renderContent()}</div>
      </main>
    </div>
  );
}

export default AccountsSetup;
