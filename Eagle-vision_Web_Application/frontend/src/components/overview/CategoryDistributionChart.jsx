import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ALERT_CATEGORY_DATA = [
	{ name: "Women Abuse", value: 40 },
	{ name: "Vandalism", value: 25 },
	{ name: "Suspicious Activity", value: 20 },
	{ name: "Emergency", value: 10 },
	{ name: "Other", value: 5 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"];

const CategoryDistributionChart = () => {
	return (
		<motion.div
			className='w-full h-full p-6 relative'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-semibold mb-6 text-zinc-100'>Category Distribution</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={ALERT_CATEGORY_DATA}
							cx={"50%"}
							cy={"45%"}
							innerRadius={75}
							outerRadius={95}
							paddingAngle={3}
							fill='#8884d8'
							dataKey='value'
							labelLine={false}
							stroke="#18181b"
							strokeWidth={2}
						>
							{ALERT_CATEGORY_DATA.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity drop-shadow-sm" />
							))}
						</Pie>
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
						<Legend 
							wrapperStyle={{ color: "#a1a1aa", fontSize: "12px", paddingTop: "20px" }} 
							iconType="circle" 
							iconSize={8}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default CategoryDistributionChart;
