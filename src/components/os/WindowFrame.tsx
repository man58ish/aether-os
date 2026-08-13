'use client';

import { ReactNode } from 'react';
import { useWindowStore } from '@/store/windowStore';

interface WindowFrameProps {
  id: string;
  children: ReactNode;
}

export default function WindowFrame({ id, children }: WindowFrameProps) {
  const windowData = useWindowStore((state) => state.windows[id]);
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow } = useWindowStore();

  if (!windowData || !windowData.isOpen || windowData.isMinimized) {
    return null;
  }

  return (
    <dialog
      open
      onClick={() => focusWindow(id)}
      style={{ zIndex: windowData.zIndex }}
      className={`fixed transition-all duration-200 backdrop-blur-xl bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-0 text-zinc-100 ${
        windowData.isMaximized
          ? 'inset-3 w-[calc(100vw-24px)] h-[calc(100vh-100px)]'
          : 'relative my-4 w-full max-w-2xl'
      }`}
    >
      {/* OS Glass Window Header */}
      <div className="bg-zinc-900/60 border-b border-zinc-800/60 px-4 py-2.5 flex items-center justify-between select-none backdrop-blur-md">
        {/* Window Controls (macOS Dots Style) */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 border border-red-600/50 transition-colors"
            title="Close"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 border border-amber-600/50 transition-colors"
            title="Minimize"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize(id);
            }}
            className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-600/50 transition-colors"
            title="Maximize"
          />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-400">
          <span>{windowData.icon}</span>
          <span>{windowData.title}</span>
        </div>

        <div className="w-12" /> {/* Spacer for centering */}
      </div>

      {/* Window Body */}
      <div className="p-4 flex-1 overflow-auto">{children}</div>
    </dialog>
  );
}