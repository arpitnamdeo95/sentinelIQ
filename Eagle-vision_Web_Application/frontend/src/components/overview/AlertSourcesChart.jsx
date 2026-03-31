import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#84cc16"];

const ALERT_SOURCES_DATA = [
	{ name: "CCTV Cameras", value: 240 },
	{ name: "Patrol Reports", value: 180 },
	{ name: "Citizen Reports", value: 120 },
	{ name: "Social Media", value: 60 },
];

const AlertSourcesChart = () => {
	return (
		<motion.div
			className='w-full h-full p-6 relative'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-lg font-semibold mb-6 text-zinc-100'>Alert Sources</h2>

			<div className='h-80'>
				<ResponsiveContainer>
					<BarChart data={ALERT_SOURCES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
						<CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' vertical={false} />
						<XAxis dataKey='name' stroke='#52525b' tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
						<YAxis stroke='#52525b' tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(24, 24, 27, 0.9)",
								backdropFilter: "blur(8px)",
								borderColor: "rgba(255,255,255,0.05)",
								borderRadius: "12px",
								color: "#fff",
								boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
								padding: "12px 16px"
							}}
							itemStyle={{ color: "#e4e4e7", fontWeight: 600 }}
							labelStyle={{ color: "#a1a1aa", marginBottom: "8px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}
							cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
						/>
						<Legend wrapperStyle={{ color: "#a1a1aa", fontSize: "12px", paddingTop: "10px" }} iconType="circle" iconSize={8} />
						<Bar dataKey={"value"} fill='#6366f1' radius={[6, 6, 0, 0]} animationDuration={1000}>
							{ALERT_SOURCES_DATA.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default AlertSourcesChart;
