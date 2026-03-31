import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import DangerZone from "../components/settings/DangerZone";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";
import ConnectWallet from "../components/common/ConnectWallet";
import SettingSection from "../components/settings/SettingSection";
import { Wallet } from "lucide-react";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-[#0a0a0a] text-zinc-100'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<Notifications />
				<Security />
				<ConnectedAccounts />

				{/* Blockchain Wallet Section */}
				<SettingSection icon={Wallet} title="Blockchain Wallet">
					<ConnectWallet />
				</SettingSection>

			</main>
		</div>
	);
};
export default SettingsPage;
