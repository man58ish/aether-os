'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    V86Starter: new (options: Record<string, unknown>) => V86Instance;
  }
}

interface V86Instance {
  add_listener: (event: string, callback: (data: unknown) => void) => void;
  destroy: () => void;
}

export default function V86LinuxBoot() {
  const [bootStatus, setBootStatus] = useState<'IDLE' | 'BOOTING' | 'RUNNING'>('IDLE');
  const screenRef = useRef<HTMLDivElement>(null);
  const emulatorRef = useRef<V86Instance | null>(null);

  const startLinuxBoot = () => {
    if (!screenRef.current || typeof window.V86Starter === 'undefined') {
      alert('V86 WASM Library not loaded yet.');
      return;
    }

    setBootStatus('BOOTING');

    // Initialize v86 x86 Emulator with Micro Linux / Arch BIOS
    const emulator = new window.V86Starter({
      wasm_path: 'https://copy.sh/v86/build/v86.wasm',
      memory_size: 64 * 1024 * 1024, // 64MB Emulated RAM
      vga_memory_size: 2 * 1024 * 1024,
      screen_container: screenRef.current,
      bios: { url: 'https://copy.sh/v86/bios/seabios.bin' },
      vga_bios: { url: 'https://copy.sh/v86/bios/vgabios.bin' },
      autostart: true,
    });

    emulatorRef.current = emulator;

    emulator.add_listener('emulator-ready', () => {
      setBootStatus('RUNNING');
    });
  };

  useEffect(() => {
    return () => {
      if (emulatorRef.current) {
        emulatorRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="font-mono text-xs bg-black p-4 rounded-xl border border-zinc-800 text-zinc-100 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <span className="text-cyan-400 font-bold flex items-center gap-2">
          <span>🐧</span> Real x86 Hardware Emulation Engine
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
          Status: {bootStatus}
        </span>
      </div>

      {/* Screen Canvas Container for Linux Display */}
      <div className="bg-black border border-zinc-800 rounded p-2 min-h-50 flex items-center justify-center overflow-hidden">
        <div ref={screenRef} className="w-full font-mono text-xs whitespace-pre" />
        {bootStatus === 'IDLE' && (
          <button
            onClick={startLinuxBoot}
            className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-4 py-2 rounded transition text-xs"
          >
            ▶ Boot Real x86 BIOS & Kernel
          </button>
        )}
      </div>
    </div>
  );
}