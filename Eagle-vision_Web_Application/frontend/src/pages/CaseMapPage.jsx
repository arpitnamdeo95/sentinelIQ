import React, { useEffect, useState } from "react";
import { FiLink, FiCpu, FiHash, FiClock, FiShield } from "react-icons/fi";

const BlockchainDiagram = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const generateRandomWalletAddress = () => {
    const characters = "0123456789abcdef";
    let address = "0x";
    for (let i = 0; i < 40; i++) {
      address += characters[Math.floor(Math.random() * characters.length)];
    }
    return address;
  };

  useEffect(() => {
    let previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const dummyBlocks = Array.from({ length: 8 }, (_, i) => {
      const currentHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const block = {
        id: i + 1,
        name: `Block ${i === 0 ? "Genesis" : `#${i + 94382}`}`,
        hash: currentHash,
        previousHash: previousHash,
        timestamp: new Date(Date.now() - (7 - i) * 600000).toISOString(),
        nonce: Math.floor(Math.random() * 1000000),
        merkleRoot: "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
        walletAddress: generateRandomWalletAddress(),
        txCount: Math.floor(Math.random() * 5) + 1
      };
      previousHash = currentHash;
      return block;
    });
    setBlocks(dummyBlocks);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-10 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Immutable Incident Ledger</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            All detected vulnerabilities and alerts are cryptographicallly sealed onto the blockchain. View the real-time topological flow of secured nodes below.
          </p>
        </header>

        <div className="flex flex-wrap justify-center items-center gap-y-12">
          {blocks.map((block, index) => (
            <React.Fragment key={block.id}>
              {/* Block Card */}
              <div 
                className="group relative w-full sm:w-auto bg-[#18181b] border border-white/5 hover:border-indigo-500/50 rounded-2xl p-6 shadow-sm hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 cursor-pointer transform hover:-translate-y-2 z-10 shrink-0"
                onClick={() => setSelectedBlock(block)}
                style={{ minWidth: "280px", maxWidth: "320px" }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiCpu className="w-20 h-20 text-indigo-500" />
                </div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1 block">Status: Verified</span>
                    <h3 className="text-2xl font-bold text-white">{block.name}</h3>
                  </div>
                  <div className="bg-zinc-900 border border-white/5 rounded-lg px-3 py-1 text-xs font-mono text-zinc-400">
                    {block.txCount} TXs
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><FiHash /> Block Hash</p>
                    <p className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded p-2 truncate" title={block.hash}>
                      {block.hash}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><FiLink /> Prev Hash</p>
                    <p className="font-mono text-xs text-zinc-400 bg-zinc-900/50 border border-zinc-800/50 rounded p-2 truncate" title={block.previousHash}>
                      {block.previousHash}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                  <span className="text-xs text-zinc-500 font-mono"><FiClock className="inline mr-1"/> {new Date(block.timestamp).toLocaleTimeString()}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20 font-medium flex items-center gap-1"><FiShield /> SEALED</span>
                </div>
              </div>

              {/* Connecting Line / Arrow */}
              {index < blocks.length - 1 && (
                <div className="hidden sm:flex flex-col items-center justify-center px-2 md:px-4 z-0 text-zinc-600">
                  <div className="w-8 md:w-16 h-[2px] bg-gradient-to-r from-indigo-500/20 via-indigo-400/50 to-indigo-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/50 border-[3px] border-[#0a0a0a] absolute"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181b] border border-white/10 p-0 rounded-2xl shadow-2xl max-w-2xl w-full relative text-white overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-indigo-900/50 to-transparent p-6 sm:p-8 border-b border-white/5 flex justify-between items-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none -mt-32 -mr-32"></div>
              <div>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30 mb-3 inline-block">Cryptographic Detail</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">{selectedBlock.name}</h2>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-full transition-all focus:outline-none"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2"><FiHash /> Block Hash</p>
                  <p className="font-mono text-sm text-indigo-300 break-all bg-[#0a0a0a] border border-white/5 rounded-lg p-4 shadow-inner">{selectedBlock.hash}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2"><FiLink /> Parent Hash</p>
                  <p className="font-mono text-sm text-zinc-400 break-all bg-[#0a0a0a]/50 border border-white/5 rounded-lg p-4 shadow-inner">{selectedBlock.previousHash}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2"><FiCpu /> Merkle Root</p>
                  <p className="font-mono text-sm text-amber-200/80 break-all bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 shadow-inner">{selectedBlock.merkleRoot}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">Network Info</p>
                  <ul className="space-y-3 bg-[#0a0a0a] border border-white/5 rounded-lg p-5">
                    <li className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                      <span className="text-zinc-400 text-sm">Timestamp</span>
                      <span className="text-white text-sm font-mono">{new Date(selectedBlock.timestamp).toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-zinc-800/50 py-3">
                      <span className="text-zinc-400 text-sm">Nonce</span>
                      <span className="text-emerald-400 text-sm font-mono tracking-widest">{selectedBlock.nonce}</span>
                    </li>
                    <li className="flex justify-between items-center pt-3">
                      <span className="text-zinc-400 text-sm">Validating Wallet</span>
                      <span className="text-white text-xs font-mono bg-zinc-800 rounded px-2 py-1 max-w-[140px] truncate" title={selectedBlock.walletAddress}>{selectedBlock.walletAddress}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainDiagram;