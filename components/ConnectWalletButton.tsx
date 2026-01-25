"use client";

import { Button } from "@/components/ui/button";

export default function ConnectWalletButton() {
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected wallet:", accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return <Button onClick={connectWallet}>Connect Wallet</Button>;
}
