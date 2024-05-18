import React, { useState } from "react";
import Web3 from "web3";
import thirdwebIcon from "./2pmp.png";
import { Account } from './account'
import { WalletOptions } from './wallet-options'
import { useAccount, useConnect, useDisconnect, useSignMessage, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem'

const web3 = new Web3("wss://twilight-wispy-emerald.scroll-testnet.quiknode.pro/1e2ef8ff2af8f6ea6078ed30f1a11e481176b126/");

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

export function App() {
  const account = useAccount()
  const [data, setData] = useState("");
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");


  const { signMessage } = useSignMessage()
  const { sendTransactionAsync } = useSendTransaction()

  const handleSignAndSubmit = async () => {
    if (!account.isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      // Sign the message with the inference data
      const message = JSON.stringify({ user: account.address, data });
      await signMessage({ message });

      // Create and send the transaction
      const transaction = {
        to: '0x598834561996735b28b59ae1d5740b9f9a9baf12',
        value: parseEther('0.0001'),
      };

      const txResponse = await sendTransactionAsync(transaction);

      // Serialize the transaction details to avoid BigInt serialization issues
      console.log(txResponse)

      // Send the signed message and transaction details to your API
      const response = await fetch('http://47.236.156.45:6700/v1/model/predict/20', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, txResponse }),
      });

      const result = await response.json();
      console.log(result);
      setMessage(`Inference result: ${result.inferenceResult}`);
      alert(`Inference result: ${result.inferenceResult}`);
    } catch (error) {
      console.error('Failed to sign or submit transaction', error);
      setMessage('Failed to sign or submit transaction.');
      alert('Failed to sign or submit transaction.');
    }
  };

  const handleSubmit = async () => {
    if (!signature) {
      alert("Please sign the transaction first.");
      return;
    }
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, signature }),
      });
      const result = await response.json();
      setMessage(`Inference result: ${result.inferenceResult}`);
      alert(`Inference result: ${result.inferenceResult}`);
    } catch (error) {
      console.error("Failed to submit data", error);
      setMessage("Failed to submit data.");
      alert("Failed to submit data.");
    }
  };

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />
        <div className="flex justify-center mb-10">
          <ConnectWallet />
        </div>
        <div>
          <textarea
            placeholder="Enter inference data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          ></textarea>
      <div className="flex justify-center mt-4">
        <button 
          onClick={handleSignAndSubmit} 
          className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          Sign Transaction and Submit Data
        </button>
      </div>
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center md:mb-10">
      <img
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />
      <h1 className="text-2xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-100 mt-10">
        2PM.Network
        <span className="text-zinc-300 inline-block mx-1"> - </span>
        <span className="inline-block -skew-x-6 text-violet-500"> logistic Regression Demo</span>
      </h1>
      <p className="text-zinc-300 text-base">Get Started with 2PM.Network</p>
    </header>
  );
}

export default App;
