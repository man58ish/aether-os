'use client';

import { useWindowStore } from '@/store/windowStore';

export default function Dock() {
  const windows = useWindowStore((state) => state.windows);
  const { openWindow, focusWindow } = useWindowStore();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-2xl rounded-2xl shadow-2xl">
        {Object.values(windows).map((win) => {
          const isActive = win.isOpen && !win.isMinimized;

          return (
            <button
              key={win.id}
              onClick={() => {
                if (!win.isOpen || win.isMinimized) {
                  openWindow(win.id);
                } else {
                  focusWindow(win.id);
                }
              }}
              className={`relative group p-3 rounded-xl transition-all duration-200 flex flex-col items-center justify-center ${
                isActive
                  ? 'bg-zinc-800/80 text-white scale-105 border border-zinc-700/50'
                  : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
              }`}
            >
              <span className="text-2xl">{win.icon}</span>

              {/* Tooltip */}
              <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-zinc-800 text-zinc-200 text-[10px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                {win.title}
              </span>

              {/* Active Dot Indicator */}
              {win.isOpen && (
                <span
                  className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                    win.isMinimized ? 'bg-zinc-500' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}