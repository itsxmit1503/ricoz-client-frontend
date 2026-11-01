export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-300" />

      <div className="relative flex flex-col items-center">
        {/* Spinner */}
        <div className="relative">
          <div className="w-24 h-24 border-4 border-slate-700 rounded-full"></div>

          <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-cyan-400 border-r-blue-500 rounded-full animate-spin"></div>

          <div className="absolute inset-4 bg-slate-950 rounded-full"></div>
        </div>

        {/* Brand Name */}
        <h1 className="mt-8 text-3xl font-bold text-white tracking-widest">
          RICOZ
        </h1>

        {/* Loading Text */}
        <p className="mt-3 text-slate-400 animate-pulse">
          Loading amazing experience...
        </p>

        {/* Dots */}
        <div className="flex gap-2 mt-6">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
          <div
            className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}