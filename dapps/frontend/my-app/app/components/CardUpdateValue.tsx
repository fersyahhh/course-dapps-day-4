import { Zap, Loader } from "lucide-react";

const CardUpdateValue = ({
  inputValue,
  setValue,
  handleSetValue,
  isWriting,
}: {
  inputValue: string | undefined;
  setValue: (value: string) => void;
  handleSetValue: () => void;
  isWriting: boolean;
}) => {
  return (
    <div>
      <h1 className="uppercase font-bold text-xs text-slate-400 mb-2">
        Update Value
      </h1>
      <div>
        <input
          className="w-full outline-none p-3 bg-dark rounded-lg border border-slate-200/20"
          type="number"
          value={inputValue}
          placeholder="New Value"
          onChange={(e) => setValue(e.target.value)}
          disabled={isWriting}
        />
        <button
          onClick={handleSetValue}
          disabled={isWriting}
          className={`flex items-center transition-all duration-300 ease-in-out text-center group w-full font-bold bg-primary rounded-xl py-3 mt-4 justify-center gap-3 ${
            isWriting
              ? "bg-slate-600 hover:bg-slate-600 cursor-not-allowed opacity-70"
              : "hover:bg-blue-600"
          }`}
        >
          {isWriting ? (
            <div className="flex items-center gap-3">
              <Loader size={20} className="animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="group-hover:rotate-12 group-hover:-translate-y-px">
                <Zap size={20} />
              </span>
              Set Contract Value
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default CardUpdateValue;
