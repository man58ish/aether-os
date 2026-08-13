'use client';

import { useKernelWorker } from '@/hooks/useKernelWorker';

export default function WorkerTester() {
  const { isReady, isRunning, ticks, cpuLoad, startEngine, stopEngine } = useKernelWorker();

  return (
    <div className="p-6 max-w-xl mx-auto my-6 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-zinc-800 pb-3 flex items-center justify-between">
        <span>🧠 Aether Kernel Worker</span>
        <span className={`text-xs px-2 py-0.5 rounded ${isReady ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-zinc-800 text-zinc-500'}`}>
          {isReady ? 'WORKER LINKED' : 'INITIALIZING'}
        </span>
      </h2>

      {/* Real-time Zero-Copy Metrics */}
      <div className="grid grid-cols-2 gap-4 my-6">
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Kernel Instruction Ticks</div>
          <div className="text-3xl font-extrabold text-emerald-400">{ticks.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-600 mt-1">Direct SharedArrayBuffer Read</div>
        </div>

        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Worker CPU Sim</div>
          <div className="text-3xl font-extrabold text-fuchsia-400">{cpuLoad}%</div>
          <div className="text-[10px] text-zinc-600 mt-1">Atomic Lock-Free Memory</div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={startEngine}
            disabled={!isReady}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold py-2.5 px-4 rounded transition text-sm"
          >
            ▶ Start Off-Main-Thread Engine
          </button>
        ) : (
          <button
            onClick={stopEngine}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded transition text-sm"
          >
            ⏹ Pause Kernel Worker
          </button>
        )}
      </div>
    </div>
  );
}