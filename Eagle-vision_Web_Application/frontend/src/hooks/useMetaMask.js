import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";

const CHAIN_NAMES = {
  "0x1": "Ethereum Mainnet",
  "0x5": "Goerli Testnet",
  "0xaa36a7": "Sepolia Testnet",
  "0x89": "Polygon Mainnet",
  "0x13881": "Polygon Mumbai",
  "0xa86a": "Avalanche C-Chain",
  "0x38": "BNB Smart Chain",
};

export const useMetaMask = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const chainName = CHAIN_NAMES[chainId] || (chainId ? `Chain ${chainId}` : null);

  // Check if MetaMask is installed
  useEffect(() => {
    setIsMetaMaskInstalled(
      typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isMetaMask
    );
  }, []);

  const fetchBalance = useCallback(async (address) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const rawBalance = await provider.getBalance(address);
      // Convert from Wei to ETH, show 4 decimal places
      const eth = Number(rawBalance) / 1e18;
      setBalance(eth.toFixed(4));
    } catch {
      setBalance(null);
    }
  }, []);

  // Auto-reconnect if previously connected
  useEffect(() => {
    if (!isMetaMaskInstalled) return;

    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const chain = await window.ethereum.request({ method: "eth_chainId" });
          setChainId(chain);
          fetchBalance(accounts[0]);
        }
      } catch {
        // silent
      }
    };
    checkConnection();
  }, [isMetaMaskInstalled, fetchBalance]);

  // Listen for account/chain changes
  useEffect(() => {
    if (!isMetaMaskInstalled) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setBalance(null);
        setChainId(null);
      } else {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      }
    };

    const handleChainChanged = (chain) => {
      setChainId(chain);
      if (account) fetchBalance(account);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [isMetaMaskInstalled, account, fetchBalance]);

  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      setAccount(accounts[0]);
      setChainId(chain);
      fetchBalance(accounts[0]);
    } catch (err) {
      if (err.code === 4001) {
        setError("Connection rejected. Please approve the request in MetaMask.");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, fetchBalance]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setError(null);
  }, []);

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  return {
    account,
    shortAddress,
    chainId,
    chainName,
    balance,
    isConnecting,
    isConnected: !!account,
    isMetaMaskInstalled,
    error,
    connect,
    disconnect,
  };
};
