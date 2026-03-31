import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, LogOut, Copy, CheckCheck, ExternalLink, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useMetaMask } from "../../hooks/useMetaMask";

const MetaMaskFoxIcon = () => (
  <svg viewBox="0 0 318.6 318.6" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" d="M274.1 35.5l-99.5 73.9L193 65.8z"/>
    <path fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z"/>
    <path fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5zm111.3 0l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5l33.9 16.5-4.7-39.3z"/>
    <path fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round" d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3zm-105 0l31.5 14.9-.2-9.3 2.5-22.1z"/>
    <path fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round" d="M138.8 193.5l-28.2-8.3 19.9-9.1zm40.9 0l8.3-17.4 20 9.1z"/>
    <path fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round" d="M106.8 247.4l4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"/>
    <path fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round" d="M87.8 162.1l23.6 46-.8-22.9zm120.3 23.1l-1 22.9 23.7-46zm-64-20.6l-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0l-2.7 18 1.2 45 6.7-34.1z"/>
    <path fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69 14.7l29.2 22.8 4.7-3.3-6.6-34.1-28.3 8.3z"/>
    <path fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round" d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"/>
    <path fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round" d="M178 230.9l-4.8-3.3h-27.7l-4.7 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"/>
    <path fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round" d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"/>
    <path fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round" d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z"/>
  </svg>
);

const ConnectWallet = ({ compact = false }) => {
  const {
    account,
    shortAddress,
    chainName,
    balance,
    isConnecting,
    isConnected,
    isMetaMaskInstalled,
    error,
    connect,
    disconnect,
  } = useMetaMask();

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openEtherscan = () => {
    if (account) {
      window.open(`https://etherscan.io/address/${account}`, "_blank");
    }
  };

  // ─── Compact mode (for Sidebar) ───────────────────────────────────────────
  if (compact) {
    return (
      <div className="px-2 py-2">
        {isConnected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-indigo-500/30 bg-indigo-950/40 overflow-hidden"
          >
            {/* Header row */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-indigo-900/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-indigo-300">{shortAddress}</span>
              </div>
              {expanded ? (
                <ChevronUp size={12} className="text-indigo-400" />
              ) : (
                <ChevronDown size={12} className="text-indigo-400" />
              )}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 pb-3 space-y-2"
                >
                  {balance && (
                    <p className="text-xs text-zinc-400">
                      Balance:{" "}
                      <span className="text-white font-semibold">{balance} ETH</span>
                    </p>
                  )}
                  {chainName && (
                    <p className="text-xs text-zinc-400">
                      Network:{" "}
                      <span className="text-indigo-300">{chainName}</span>
                    </p>
                  )}
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={copyAddress}
                      title="Copy address"
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors text-xs text-zinc-300"
                    >
                      {copied ? <CheckCheck size={11} className="text-green-400" /> : <Copy size={11} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={openEtherscan}
                      title="View on Etherscan"
                      className="p-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors text-zinc-300"
                    >
                      <ExternalLink size={11} />
                    </button>
                    <button
                      onClick={disconnect}
                      title="Disconnect"
                      className="p-1 rounded bg-red-900/50 hover:bg-red-800/50 transition-colors text-red-400"
                    >
                      <LogOut size={11} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={connect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/40"
          >
            {isConnecting ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <MetaMaskFoxIcon />
                {isMetaMaskInstalled ? "Connect Wallet" : "Install MetaMask"}
              </>
            )}
          </motion.button>
        )}
        {error && (
          <p className="mt-1.5 text-[10px] text-red-400 text-center leading-tight">{error}</p>
        )}
      </div>
    );
  }

  // ─── Full mode (for Settings page / standalone) ───────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur p-6"
    >
      {/* Title */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Wallet size={20} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Blockchain Wallet</h3>
          <p className="text-xs text-gray-400">Connect your MetaMask to interact on-chain</p>
        </div>

        {/* Status pill */}
        <div className="ml-auto">
          {isConnected ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Disconnected
            </span>
          )}
        </div>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          {/* Address card */}
          <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-lg px-4 py-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Wallet Address</p>
              <p className="font-mono text-sm text-gray-200 break-all">{account}</p>
            </div>
            <div className="flex gap-2 ml-3 flex-shrink-0">
              <button
                onClick={copyAddress}
                className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors text-zinc-300"
                title="Copy address"
              >
                {copied ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              <button
                onClick={openEtherscan}
                className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors text-zinc-300"
                title="View on Etherscan"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Balance</p>
              <p className="text-lg font-bold text-white">
                {balance ?? "—"} <span className="text-sm font-normal text-gray-400">ETH</span>
              </p>
            </div>
            <div className="bg-black/20 border border-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Network</p>
              <p className="text-sm font-semibold text-indigo-300">{chainName ?? "Unknown"}</p>
            </div>
          </div>

          {/* Disconnect */}
          <button
            onClick={disconnect}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <LogOut size={14} />
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* MetaMask button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={connect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-900/30"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting to MetaMask...
              </>
            ) : (
              <>
                <MetaMaskFoxIcon />
                {isMetaMaskInstalled ? "Connect with MetaMask" : "Install MetaMask"}
              </>
            )}
          </motion.button>

          {!isMetaMaskInstalled && (
            <p className="text-center text-xs text-gray-400">
              MetaMask extension not detected.{" "}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline"
              >
                Click here to install
              </a>
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Info note */}
          <p className="text-center text-xs text-gray-500">
            Your wallet is never stored — connection is local to your browser.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ConnectWallet;
