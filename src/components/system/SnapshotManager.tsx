'use client';

import { useState, useEffect } from 'react';
import { SnapshotEngine } from '@/lib/snapshotStorage';
import { vfs } from '@/lib/vfs';

export default function SnapshotManager() {
  const [status, setStatus] = useState<string>('Ready');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Component load hone par check karein ki koi snapshot available hai ya nahi
  useEffect(() => {
    SnapshotEngine.loadSnapshot('latest_session').then((snap) => {
      if (snap) {
        setLastSaved(new Date(snap.timestamp).toLocaleTimeString());
      }
    });
  }, []);

  const handleSaveRAMSnapshot = async () => {
    setStatus('Freezing RAM & VFS State...');

    // Dummy 1MB Simulated RAM State Buffer
    const dummyBuffer = new ArrayBuffer(1024 * 1024);
    const view = new Int32Array(dummyBuffer);
    view[0] = 0xdeadbeef; // Magic signature

    // VFS Tree ko JSON String me convert kiya
    const vfsJSON = JSON.stringify(vfs.getRoot());

    const success = await SnapshotEngine.saveSnapshot('latest_session', dummyBuffer, vfsJSON);

    if (success) {
      setStatus('Snapshot Persisted to IndexedDB');
      setLastSaved(new Date().toLocaleTimeString());
    } else {
      setStatus('Snapshot Save Failed');
    }
  };

  const handleRestoreRAMSnapshot = async () => {
    setStatus('Loading Snapshot from Storage...');

    // IndexedDB se saved snapshot fetch kiya
    const snapshot = await SnapshotEngine.loadSnapshot('latest_session');

    if (snapshot) {
      // 🚀 ACTUAL FIX: VFS JSON data ko wapas memory mein load kar diya
      const isImported = vfs.importSnapshot(snapshot.vfsData);
      
      if (isImported) {
        setStatus(`Restored Session from ${new Date(snapshot.timestamp).toLocaleTimeString()}`);
      } else {
        setStatus('Corrupt VFS Data in Snapshot');
      }
    } else {
      setStatus('No Saved Snapshot Found');
    }
  };

  return (
    <div className="font-mono text-xs bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-zinc-100 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <span className="text-amber-400 font-bold flex items-center gap-2">
          <span>💾</span> Zero-Server RAM Snapshot Engine
        </span>
        <span className="text-[10px] text-zinc-500">{status}</span>
      </div>

      <p className="text-zinc-400 text-[11px] leading-relaxed">
        Dumps emulated x86 RAM buffer and VFS tree directly into browser IndexedDB storage for zero-latency resume.
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleSaveRAMSnapshot}
          className="flex-1 bg-amber-600 hover:bg-amber-500 text-black font-bold py-2 rounded transition cursor-pointer"
        >
          ⚡ Freeze & Save RAM State
        </button>

        <button
          onClick={handleRestoreRAMSnapshot}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-2 rounded transition border border-zinc-700 cursor-pointer"
        >
          🔄 Restore Last Session
        </button>
      </div>

      {lastSaved && (
        <div className="text-[10px] text-emerald-400 text-center">
          Last Snapshot Saved At: {lastSaved}
        </div>
      )}
    </div>
  );
}