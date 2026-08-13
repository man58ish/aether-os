'use client';

import { useEffect, useState } from 'react';

interface SystemCapabilities {
  crossOriginIsolated: boolean;
  sharedArrayBuffer: boolean;
  wasmSupport: boolean;
  estimatedMemoryMB: number | null;
}

export default function IsolationCheck() {
  const [caps, setCaps] = useState<SystemCapabilities | null>(null);

  useEffect(() => {
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? null;

    setCaps({
      crossOriginIsolated: window.crossOriginIsolated ?? false,
      sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      wasmSupport: typeof WebAssembly !== 'undefined',
      estimatedMemoryMB: memory ? memory * 1024 : null,
    });
  }, []);

  if (!caps) {
    return (
      <div className="p-4 text-zinc-400 font-mono">
        Auditing Browser Isolation Engine...
      </div>
    );
  }

  const isSystemReady = caps.crossOriginIsolated && caps.sharedArrayBuffer;

  return (
    <div className="p-6 max-w-xl mx-auto my-12 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 font-mono shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-emerald-400 border-b border-zinc-800 pb-3 flex items-center gap-2">
        <span>⚡</span> Aether OS :: Runtime System Diagnostics
      </h2>

      <div className="space-y-3 text-sm">
        <StatusRow
          label="Cross-Origin Isolation (COOP/COEP)"
          status={caps.crossOriginIsolated}
        />
        <StatusRow
          label="SharedArrayBuffer (Zero-Copy RAM)"
          status={caps.sharedArrayBuffer}
        />
        <StatusRow
          label="WebAssembly (WASM Runtime)"
          status={caps.wasmSupport}
        />
        <StatusRow
          label="Hardware RAM Detection"
          status={true}
          extra={caps.estimatedMemoryMB ? `~${caps.estimatedMemoryMB} MB` : 'Unknown'}
        />
      </div>

      {isSystemReady ? (
        <div className="mt-6 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded text-emerald-300 text-xs">
          ✅ <strong>SYSTEM READY:</strong> Browser engine fully isolated. WASM 3.0 & Web Workers can allocate shared memory without main-thread blocking.
        </div>
      ) : (
        <div className="mt-6 p-3 bg-red-950/60 border border-red-800/80 rounded text-red-300 text-xs">
          ⚠️ <strong>ISOLATION BLOCKED:</strong> COOP/COEP headers are not active. Check next.config.mjs configuration.
        </div>
      )}
    </div>
  );
}

function StatusRow({ label, status, extra }: { label: string; status: boolean; extra?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
      <span className="text-zinc-400">{label}</span>
      <div className="flex items-center gap-3">
        {extra && <span className="text-zinc-500 text-xs">{extra}</span>}
        <span
          className={`px-2.5 py-0.5 text-xs font-semibold rounded ${
            status
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}
        >
          {status ? 'PASSED' : 'FAILED'}
        </span>
      </div>
    </div>
  );
}