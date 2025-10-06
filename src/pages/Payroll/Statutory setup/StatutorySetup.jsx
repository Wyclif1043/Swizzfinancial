// import React, { useState } from "react";
// import {
//   Card,
// } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { MdPayments } from "react-icons/md";
// import HouseLevy from "./HouseLevy/HouseLevy";
// import ShaContributions from "./SHA/ShaContributions";
// import NssfContributions from "./NSSF/NssfContributions";
// import PayeTaxBands from "./PAYE/TaxBand/PayeTaxBands";
// import PayePersonalReliefs from "./PAYE/Personal Relief/PayePersonalReliefs";

// // TODO: Replace with your actual components


// export default function StatutorySetup() {
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Later you can fetch real totals from APIs like we did in PayrollSetup
//   const users = [
//     { id: 1, name: "Social Health Authority (SHA)", total: 0, subtitle: "National Health Authority Setup" },
//     { id: 2, name: "NSSF", total: 0, subtitle: "National Social Security Fund Setup" },
//     { id: 3, name: "PAYE-Tax Band", total: 0, subtitle: "Pay As You Earn Tax Band Setup" },
//     { id: 4, name: "PAYE-Personal Relief", total: 0, subtitle: "Pay As You Earn Personal Relief Setup" },
//     { id: 5, name: "Housing Levy", total: 0, subtitle: "National Housing Levy Setup" },
//   ];

//   const user = selectedItem || users[0];

//   const renderContent = () => {
//     switch (user.name) {
//       case "Social Health Authority (SHA)":
//         return <ShaContributions/>;
//       case "NSSF":
//         return <NssfContributions/>;
//       case "PAYE-Tax Band":
//         return <PayeTaxBands/>;
//       case "PAYE-Personal Relief":
//         return <PayePersonalReliefs/>;  
//       case "Housing Levy":
//         return <HouseLevy />;
//       default:
//         return <p>Select a statutory option from the sidebar</p>;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-slate-50">
//       {/* LEFT SIDEBAR */}
//       <aside className="w-88 border-r bg-white p-4 flex flex-col">
//         <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
//           <h2 className="text-xl font-bold text-white flex items-center gap-2">
//             <MdPayments className="text-white" /> Statutory Setup
//           </h2>
//         </div>

//         <ScrollArea className="flex-1">
//           <div className="space-y-2 p-2 bg-gray-200 rounded-xl">
//             {users.map((u) => (
//               <Card
//                 key={u.id}
//                 onClick={() => setSelectedItem(u)}
//                 className={`p-3 cursor-pointer ${user.id === u.id ? "bg-indigo-800 text-white" : ""}`}
//               >
//                 <div className="flex justify-between items-center">
//                   <p className="text-sm font-medium">{u.name}</p>
//                   <Badge
//                     className={`bg-gray-200 hover:bg-gray-200 text-gray-900 ${
//                       user.id === u.id ? "bg-indigo-600 hover:bg-indigo-600 text-white" : ""
//                     }`}
//                   >
//                     Total {u.total}
//                   </Badge>
//                 </div>
//                 <p
//                   className={`text-xs ${
//                     user.id === u.id ? "text-white" : "text-muted-foreground"
//                   }`}
//                 >
//                   {u.subtitle}
//                 </p>
//               </Card>
//             ))}
//           </div>
//         </ScrollArea>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 overflow-y-auto">{renderContent()}</main>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MdPayments } from "react-icons/md";

import HouseLevy from "./HouseLevy/HouseLevy";
import ShaContributions from "./SHA/ShaContributions";
import NssfContributions from "./NSSF/NssfContributions";
import PayeTaxBands from "./PAYE/TaxBand/PayeTaxBands";
import PayePersonalReliefs from "./PAYE/Personal Relief/PayePersonalReliefs";

export default function StatutorySetup() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [totals, setTotals] = useState({
    sha: 0,
    nssf: 0,
    taxbands: 0,
    reliefs: 0,
    houselevy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [
          levyRes,
          nssfRes,
          reliefRes,
          taxbandRes,
          shaRes,
        ] = await Promise.all([
          fetch("https://c0653ed6d9de.ngrok-free.app/api/housing-levy-contributions", {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
          fetch("https://c0653ed6d9de.ngrok-free.app/api/nssf-contributions", {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
          fetch("https://c0653ed6d9de.ngrok-free.app/api/paye-reliefs", {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
          fetch("https://c0653ed6d9de.ngrok-free.app/api/paye-taxbands", {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
          fetch("https://c0653ed6d9de.ngrok-free.app/api/sha-contributions", {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
        ]);

        const levyData = await levyRes.json();
        const nssfData = await nssfRes.json();
        const reliefData = await reliefRes.json();
        const taxbandData = await taxbandRes.json();
        const shaData = await shaRes.json();

        setTotals({
          houselevy: levyData?.data?.length || 0,
          nssf: nssfData?.data?.length || 0,
          reliefs: reliefData?.data?.length || 0,
          taxbands: taxbandData?.data?.length || 0,
          sha: shaData?.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching statutory totals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  const users = [
    { id: 1, name: "Social Health Authority (SHA)", total: totals.sha, subtitle: "National Health Authority Setup" },
    { id: 2, name: "NSSF", total: totals.nssf, subtitle: "National Social Security Fund Setup" },
    { id: 3, name: "PAYE-Tax Band", total: totals.taxbands, subtitle: "Pay As You Earn Tax Band Setup" },
    { id: 4, name: "PAYE-Personal Relief", total: totals.reliefs, subtitle: "Pay As You Earn Personal Relief Setup" },
    { id: 5, name: "Housing Levy", total: totals.houselevy, subtitle: "National Housing Levy Setup" },
  ];

  const user = selectedItem || users[0];

  const renderContent = () => {
    switch (user.name) {
      case "Social Health Authority (SHA)":
        return <ShaContributions />;
      case "NSSF":
        return <NssfContributions />;
      case "PAYE-Tax Band":
        return <PayeTaxBands />;
      case "PAYE-Personal Relief":
        return <PayePersonalReliefs />;
      case "Housing Levy":
        return <HouseLevy />;
      default:
        return <p>Select a statutory option from the sidebar</p>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* LEFT SIDEBAR */}
      <aside className="w-88 border-r bg-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MdPayments className="text-white" /> Statutory Setup
          </h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2 bg-gray-200 rounded-xl">
            {users.map((u) => (
              <Card
                key={u.id}
                onClick={() => setSelectedItem(u)}
                className={`p-3 cursor-pointer ${user.id === u.id ? "bg-indigo-800 text-white" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">{u.name}</p>
                  <Badge
                    className={`bg-gray-200 hover:bg-gray-200 text-gray-900 ${
                      user.id === u.id ? "bg-indigo-600 hover:bg-indigo-600 text-white" : ""
                    }`}
                  >
                    Total {loading ? "..." : u.total}
                  </Badge>
                </div>
                <p
                  className={`text-xs ${
                    user.id === u.id ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {u.subtitle}
                </p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}
