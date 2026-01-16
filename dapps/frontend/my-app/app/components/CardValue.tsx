import { RotateCw } from "lucide-react";

const CardValue = ({
  value,
  refresh,
  isReading,
}: {
  value?: bigint | undefined;
  refresh: () => void;
  isReading: boolean;
}) => {
  return (
    <div className="w-full bg-dark rounded-xl relative border border-slate-200/20 p-8 mb-6">
      <button
        onClick={refresh}
        className="absolute top-4 right-4 text-slate-400 rounded-xl p-2 hover:bg-slate-700/20"
      >
        <RotateCw size={17} />
      </button>
      <div className="text-center">
        <h1 className="uppercase text-xs text-slate-500 font-semibold mb-3">
          Current Contract Value
        </h1>
        {isReading ? (
          <p className="mb-4 text-sm text-slate-400">Loading...</p>
        ) : (
          <div className="flex justify-center items-end">
            <h1 className="text-5xl font-bold">{value?.toString()}</h1>
            <p className="uppercase font-semibold text-primary">Avax</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardValue;
