import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { UsersIcon, UserPlus, UserCheck, UserX, AlertCircle, Clock, CheckCircle, BarChart2 } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";

// Mock data for the table

const ContentWithLottie = () => (
  <div className="flex items-center justify-center mb-8 mt-10 space-x-8">
    {/* Lottie Animation */}
    <Player
      autoplay
      loop
      src="DoomCCTV.json"
      className="w-32 h-32"
    />

    
    {/* Content */}
    <div className="flex flex-col items-center text-center">
      <div className="text-3xl font-bold tracking-tight mt-1 mb-2 text-white">
        SentinelIQ
      </div>
      <p className="text-zinc-400 text-lg max-w-2xl mt-1 leading-relaxed">
        Statistical data of cases undertaken and lead are listed out here.
      </p>
    </div>
  </div>
);


const caseStats = {
	totalCases: 120,
	resolvedCases: 85,
	pendingCases: 25,
	underInvestigationCases: 10,
  };
const caseData = [
  {
    officerName: "Duraisingam",
    locality: "Thoothukudi",
    caseType: "Theft",
    description: "Stolen vehicle found in the locality.",
    status: "Resolved",
  },
  {
    officerName: "Prabakaran",
    locality: "Lawspet",
    caseType: "Assault",
    description: "Physical assault case near the market.",
    status: "Investigating",
  },
  {
    officerName: "Rajavelu",
    locality: "Muthailpet",
    caseType: "Fraud",
    description: "Online fraud involving stolen credit card information.",
    status: "Pending",
  },
  {
    officerName: "Balaji Venkatesh",
    locality: "Theni",
    caseType: "Missing Person",
    description: "A person went missing in the local park.",
    status: "Resolved",
  },
];



const UsersPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Case Statistics" />

      <ContentWithLottie/>

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
			<StatCard
				name="Total Cases"
				icon={BarChart2} // Icon for total cases
				value={caseStats.totalCases}
				color="#6366F1"
			/>
			<StatCard
				name="Resolved Cases"
				icon={CheckCircle} // Icon for resolved cases
				value={caseStats.resolvedCases}
				color="#10B981"
			/>
			<StatCard
				name="Pending Cases"
				icon={Clock} // Icon for pending cases
				value={caseStats.pendingCases}
				color="#F59E0B"
			/>
			<StatCard
				name="Under Investigation"
				icon={AlertCircle} // Icon for cases under investigation
				value={caseStats.underInvestigationCases}
				color="#EF4444"
			/>
        </motion.div>

        {/* Surveillance Cases Table */}
        <div className="overflow-x-auto bg-zinc-900 border border-white/5 rounded-xl shadow-sm mt-8">
          <table className="min-w-full text-sm text-left text-zinc-300">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-800/50 border-b border-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Officer Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Locality
                </th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Case Type
                </th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Case Description
                </th>
                <th scope="col" className="px-6 py-4 font-medium tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {caseData.map((caseItem, index) => (
                <tr key={index} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{caseItem.officerName}</td>
                  <td className="px-6 py-4">{caseItem.locality}</td>
                  <td className="px-6 py-4">{caseItem.caseType}</td>
                  <td className="px-6 py-4">{caseItem.description}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                        caseItem.status === "Resolved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : caseItem.status === "Investigating"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* USER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* User Growth Chart */}
          {/* <UserGrowthChart /> */}
          {/* User Activity Heatmap */}
          {/* <UserActivityHeatmap /> */}
          {/* User Demographics Chart */}
          {/* <UserDemographicsChart /> */}
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
