import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, colorClass }) => {
	return (
		<div className={`w-full rounded-2xl bg-[#1e2330] p-4 border ${colorClass} shadow-lg relative overflow-hidden`}>
			<div className='relative z-10 w-full h-full rounded-xl bg-[#252a3a] border border-white/5 p-5 flex flex-col justify-between min-h-[140px]'>
				<div className='flex items-start text-sm font-semibold text-zinc-400/90 leading-snug'>
          <Icon size={14} className='mr-2 mt-0.5 opacity-70' />
					<span className="max-w-[120px]">{name.split(' ').length > 2 ? <span>{name.split(' ').slice(0, -1).join(' ')}<br/>{name.split(' ').slice(-1)}</span> : name}</span>
				</div>
				<p className='mt-2 text-4xl font-extrabold tracking-tight text-white drop-shadow-sm'>{value}</p>
			</div>
		</div>
	);
};
export default StatCard;
