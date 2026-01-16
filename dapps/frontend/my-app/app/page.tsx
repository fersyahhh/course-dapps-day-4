"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useChainId,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { toast } from "sonner";
import Header from "./components/Header";
import CardConnected from "./components/CardConnected";
import CardValue from "./components/CardValue";
import CardUpdateValue from "./components/CardUpdateValue";
import NetworkStatus from "./components/NetworkStatus";
import Footer from "./components/Footer";
import Disconnected from "./components/Disconnected";

export default function Page() {
  const CONTRACT_ADDRESS = "0xB79Ba21eeF73994DE8cfbeE2d5209411EF866d03";
  const SIMPLE_STORAGE_ABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "oldOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnerSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "newValue",
          type: "uint256",
        },
      ],
      name: "ValueUpdated",
      type: "event",
    },
    {
      inputs: [],
      name: "getValue",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_value",
          type: "uint256",
        },
      ],
      name: "setValue",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const AVALANCHE_FUJI_CHAIN_ID = 43113;
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === AVALANCHE_FUJI_CHAIN_ID;
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [inputValue, setInputValue] = useState("");
  const [displayValue, setDisplayValue] = useState<bigint | undefined>();
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const displayedValue = displayValue !== undefined ? displayValue : value;

  async function handleSetValue() {
    if (!inputValue) return;

    if (!isCorrectNetwork) {
      toast.error("Please switch to Avalanche Fuji network (Chain ID: 43113)", {
        description: "Wrong Network",
      });
      return;
    }

    try {
      const toastId = toast.loading("Pending transaction...", {
        description: "Please confirm in your wallet",
      });

      const newValue = BigInt(inputValue);

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: "setValue",
        args: [newValue],
      });

      setDisplayValue(newValue);

      toast.dismiss(toastId);
      toast.success("Transaction completed successfully!", {
        description: "Contract value updated",
      });

      await refetch();
      setInputValue("");
    } catch (error: unknown) {
      await refetch();

      let errorMessage = "Transaction failed";
      let errorTitle = "Error";

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        const errorCode = (error as unknown as Record<string, unknown>).code;

        if (
          errorMsg.includes("user rejected") ||
          errorMsg.includes("user denied") ||
          errorMsg.includes("denied") ||
          errorMsg.includes("cancelled") ||
          errorMsg.includes("user cancelled") ||
          errorCode === "ACTION_REJECTED" ||
          errorCode === 4001
        ) {
          errorTitle = "Transaction Rejected";
          errorMessage =
            "You rejected the transaction. Please confirm in your wallet to proceed.";
        } else if (
          errorMsg.includes("wrong network") ||
          errorMsg.includes("chain mismatch") ||
          errorMsg.includes("network mismatch") ||
          errorMsg.includes("avalanche") ||
          errorCode === "NETWORK_ERROR" ||
          errorCode === -4902
        ) {
          errorTitle = "Wrong Network";
          errorMessage =
            "Please switch to Avalanche Fuji network in your wallet.";
        } else if (
          errorMsg.includes("revert") ||
          errorMsg.includes("execution reverted") ||
          errorMsg.includes("call revert") ||
          errorCode === "CALL_EXCEPTION"
        ) {
          errorTitle = "Transaction Reverted";
          errorMessage =
            "Transaction reverted. Please check your input and try again. Gas was consumed.";
        } else if (errorMsg.includes("insufficient funds")) {
          errorTitle = "Insufficient Funds";
          errorMessage =
            "You have insufficient funds to complete this transaction.";
        } else if (
          errorMsg.includes("network") ||
          errorMsg.includes("connection")
        ) {
          errorTitle = "Network Error";
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage, {
        description: errorTitle,
      });
      console.error("Transaction failed:", error);
    }
  }

  async function handleConnectWallet() {
    try {
      // Check if Core Wallet/Ethereum provider is available
      const ethereumProvider = (window as unknown as Record<string, unknown>)
        .ethereum;

      if (!ethereumProvider) {
        toast.error("Wallet not found", {
          description: "Please install Wallet extension to continue",
        });
        return;
      }

      await connect({ connector: injected() });
    } catch (error: unknown) {
      let errorMessage = "Failed to connect wallet";

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();

        if (
          errorMsg.includes("no ethereum provider") ||
          errorMsg.includes("not found")
        ) {
          errorMessage = "Core Wallet not found";
          toast.error(errorMessage, {
            description: "Please install Core Wallet extension",
          });
        } else if (errorMsg.includes("user rejected")) {
          errorMessage = "Connection rejected";
          toast.error(errorMessage, {
            description: "You rejected the connection request",
          });
        } else {
          toast.error(errorMessage, {
            description: error.message,
          });
        }
      }
    }
  }

  async function handleCopy() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  }

  return (
    <main className="min-h-screen flex justify-center w-full md:pt-20 pt-8 bg-dark">
      <div className="container">
        <div className="w-full mx-auto max-w-md border h-auto border-slate-200/10 bg-slate-800/20 rounded-2xl p-6 space-y-6">
          <div className="w-full flex justify-center items-center">
            <Header />
          </div>
          {!isConnected ? (
            <>
              <Disconnected />
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full bg-primary hover:bg-blue-600 transition-all duration-300 ease-in-out text-light font-bold py-2 rounded-xl"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            </>
          ) : (
            <>
              <div>
                <CardConnected
                  address={address}
                  handleCopy={handleCopy}
                  disconnect={() => disconnect()}
                />
              </div>

              {/* Network Status */}
              <NetworkStatus
                chainId={chainId}
                isCorrectNetwork={isCorrectNetwork}
              />

              {/* Value Card */}
              <CardValue
                value={
                  typeof displayedValue === "bigint"
                    ? displayedValue
                    : undefined
                }
                refresh={() => refetch()}
                isReading={isReading}
              />

              {/* Update Value */}
              <CardUpdateValue
                inputValue={
                  typeof inputValue === "string" ? inputValue : undefined
                }
                setValue={setInputValue}
                handleSetValue={handleSetValue}
                isWriting={isWriting}
              />

              {/* Footer */}
              <Footer />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
