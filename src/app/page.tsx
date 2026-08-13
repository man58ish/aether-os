import IsolationCheck from '@/components/system/IsolationCheck';
import WorkerTester from '@/components/system/WorkerTester';
import Terminal from '@/components/system/Terminal';
import CodeEditor from '@/components/system/CodeEditor';
import SnapshotManager from '@/components/system/SnapshotManager';
import WindowFrame from '@/components/os/WindowFrame';
import Dock from '@/components/os/Dock';

export default function Home() {
  return (
    <main className="min-h-screen bg-black bg-[linear-gradient(to_right,#0f0f11_1px,transparent_1px),linear-gradient(to_bottom,#0f0f11_1px,transparent_1px)] bg-size-[4rem_4rem] text-white flex flex-col items-center justify-start p-6 pb-32 overflow-x-hidden select-none relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-87.5 bg-linear-to-tr from-cyan-600/10 via-fuchsia-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* OS Branding Header */}
      <header className="text-center my-6 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-cyan-400 text-[10px] font-mono mb-3 tracking-widest uppercase glow-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Aether OS Runtime Architecture
        </div>
        <h1 className="text-5xl font-black tracking-widest bg-linear-to-r from-cyan-400 via-fuchsia-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-2xl">
          AETHER OS
        </h1>
        <p className="text-zinc-500 text-xs mt-2 font-mono tracking-wide">
          Web-Based Cloud IDE & Edge Operating System
        </p>
      </header>

      {/* Desktop Workspace */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-6 z-10">
        <WindowFrame id="diagnostics">
          <IsolationCheck />
        </WindowFrame>

        <WindowFrame id="kernel">
          <WorkerTester />
        </WindowFrame>

        <WindowFrame id="terminal">
          <Terminal />
        </WindowFrame>

        <WindowFrame id="editor">
          <CodeEditor />
        </WindowFrame>

        <div className="w-full max-w-2xl">
          <SnapshotManager />
        </div>
      </div>

      {/* Glass Desktop Dock */}
      <Dock />
    </main>
  );
}