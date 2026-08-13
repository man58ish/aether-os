import { create } from 'zustand';

export interface WindowItem {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowState {
  windows: Record<string, WindowItem>;
  activeZIndex: number;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
}

const INITIAL_WINDOWS: Record<string, WindowItem> = {
  diagnostics: {
    id: 'diagnostics',
    title: 'System Diagnostics',
    icon: '⚡',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
  },
  kernel: {
    id: 'kernel',
    title: 'Aether Kernel Worker',
    icon: '🧠',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
  },
  terminal: {
    id: 'terminal',
    title: 'x86 Linux Terminal',
    icon: '💻',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
  },
  editor: {
    id: 'editor',
    title: 'Code Editor',
    icon: '📝',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 13,
  },
};

export const useWindowStore = create<WindowState>((set) => ({
  windows: INITIAL_WINDOWS,
  activeZIndex: 20,

  openWindow: (id) =>
    set((state) => {
      const nextZ = state.activeZIndex + 1;
      return {
        activeZIndex: nextZ,
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
          },
        },
      };
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: false },
      },
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true },
      },
    })),

  focusWindow: (id) =>
    set((state) => {
      if (state.windows[id].zIndex === state.activeZIndex) return state;
      const nextZ = state.activeZIndex + 1;
      return {
        activeZIndex: nextZ,
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], zIndex: nextZ, isMinimized: false },
        },
      };
    }),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMaximized: !state.windows[id].isMaximized,
        },
      },
    })),
}));