import { AlertCircle, CheckCircle } from "lucide-react";

const NetworkStatus = ({
  isCorrectNetwork,
}: {
  chainId: number;
  isCorrectNetwork: boolean;
}) => {
  const AVALANCHE_FUJI_CHAIN_ID = 43113;

  return (
    <div>
      {isCorrectNetwork ? (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
          <CheckCircle size={18} className="text-green-400" />
          <p className="text-green-400 text-sm">
            Connected to Avalanche Fuji ✓
          </p>
        </div>
      ) : (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} className="text-yellow-400" />
          <div className="flex-1">
            <p className="text-yellow-400 text-sm font-semibold">
              Wrong Network
            </p>
            <p className="text-yellow-300 text-xs">
              Please switch to Avalanche Fuji (Chain ID:{" "}
              {AVALANCHE_FUJI_CHAIN_ID})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
