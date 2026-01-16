const Footer = () => {
  return (
    <div className="w-full text-center">
      <div className="inline-flex px-3 items-center gap-2 border border-slate-200/10 py-1.5 justify-center rounded-lg bg-green-700/30">
        <div className="w-2 h-2 animate-pulse rounded-full bg-green-400"></div>
        <p className="uppercase text-xs font-bold text-green-500">Network Operational</p>
      </div>
      <p className="text-xs text-gray-500 pt-2">
        Smart contract = single source of truth
      </p>
    </div>
  );
};

export default Footer;