import { Wallet } from "lucide-react";

const Disconnected = () => {
  return (
    <div className="w-full flex flex-col justify-center gap-6">
      <div className="text-primary mx-auto bg-dark inline-flex items-center justify-center w-20 h-20 rounded-2xl border-slate-200/20 border">
        <Wallet size={35} />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-white bg-clip-text text-transparent">
          Connect Your Wallet
        </h1>
        <p className="text-sm text-slate-400">
          Please connect your Avalanche wallet to interact with the smart
          contract and view your assets.
        </p>
      </div>
    </div>
  );
};

export default Disconnected;
