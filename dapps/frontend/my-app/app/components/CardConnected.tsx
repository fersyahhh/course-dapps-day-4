import { LogOut, Copy } from "lucide-react";

const CardConnected = ({
  address,
  disconnect,
  handleCopy
}: {
  address: string | undefined;
  disconnect: () => void;
  handleCopy: () => void
}) => {
  return (
    <div className="w-full rounded-xl bg-dark border border-slate-200/20 p-5">
      <div className="text-center mb-4">
        <h1 className="uppercase text-xs text-slate-400 font-semibold">
          Connected Address
        </h1>
      </div>

      <div className="flex items-center gap-6 justify-center">
        <div className="flex items-center bg-slate-800/50 py-1.5 backdrop-blur justify-between px-3 rounded-full w-[60%]">
        {/* Address for mobile */}
          <p className="text-xs md:hidden text-slate-200">
            {address?.substring(0, 15)}
            {address !== undefined ? "..." : ""}
          </p>
        {/* Adress for tablet and desktop */}
          <p className="text-xs hidden md:inline text-slate-200">
            {address?.substring(0, 23)}
            {address !== undefined ? "..." : ""}
          </p>
          <button className="group" onClick={handleCopy}>
            <span className="text-slate-400 group-hover:text-primary">
              <Copy size={15} />
            </span>
          </button>
        </div>

        <div>
          <button
            onClick={disconnect}
            className="flex items-center hover:text-red-300  text-xs text-red-400 gap-2"
          >
            <h1>Disconnect</h1>
            <span>
              <LogOut size={13} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardConnected;
