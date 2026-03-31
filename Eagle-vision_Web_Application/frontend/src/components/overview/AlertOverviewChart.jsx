import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { motion } from "framer-motion";

const alertData = [
	{ name: "Jul", alerts: 120 },
	{ name: "Aug", alerts: 100 },
	{ name: "Sep", alerts: 150 },
	{ name: "Oct", alerts: 130 },
	{ name: "Nov", alerts: 180 },
	{ name: "Dec", alerts: 210 },
	{ name: "Jan", alerts: 200 },
	{ name: "Feb", alerts: 190 },
	{ name: "Mar", alerts: 220 },
	{ name: "Apr", alerts: 210 },
	{ name: "May", alerts: 230 },
	{ name: "Jun", alerts: 250 },
];

const AlertOverviewChart = () => {
	return (
		<motion.div
			className='w-full h-full p-6 relative'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.1 }}
		>
			<h2 className='text-lg font-semibold mb-6 text-zinc-100'>Alert Overview</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<AreaChart data={alertData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
						<defs>
							<linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
								<stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.05)' vertical={false} />
						<XAxis dataKey={"name"} stroke='#52525b' tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
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
						/>
						<Area
							type='monotone'
							dataKey='alerts'
							stroke='#818cf8'
							strokeWidth={3}
							fillOpacity={1}
							fill="url(#colorAlerts)"
							activeDot={{ r: 6, strokeWidth: 2, stroke: '#18181b', fill: '#c7d2fe' }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default AlertOverviewChart;
