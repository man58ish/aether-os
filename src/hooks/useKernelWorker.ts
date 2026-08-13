'use client';

import { useEffect, useRef, useState } from 'react';

export function useKernelWorker() {
  const workerRef = useRef<Worker | null>(null);
  const sharedBufferRef = useRef<SharedArrayBuffer | null>(null);
  const sharedArrayRef = useRef<Int32Array | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [ticks, setTicks] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(0);

  useEffect(() => {
    // 1. Allocate SharedArrayBuffer (4KB Memory Space)
    const sab = new SharedArrayBuffer(1024 * 4);
    sharedBufferRef.current = sab;
    sharedArrayRef.current = new Int32Array(sab);

    // 2. Instantiate Web Worker
    const worker = new Worker(
      new URL('../workers/kernel.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    // 3. Worker Event Listener
    worker.onmessage = (e) => {
      if (e.data.type === 'READY') {
        setIsReady(true);
      }
    };

    // 4. Send Shared Buffer to Worker
    worker.postMessage({
      type: 'INIT_SHARED_MEMORY',
      payload: { sharedBuffer: sab },
    });

    return () => {
      worker.terminate();
    };
  }, []);

  // Main Thread Polling Loop (requestAnimationFrame for 60 FPS UI Sync)
  useEffect(() => {
    if (!isRunning || !sharedArrayRef.current) return;

    let animFrameId: number;

    const syncUIWithMemory = () => {
      if (sharedArrayRef.current) {
        // Zero-Copy Read: Main Thread reads memory directly written by Worker!
        const currentTicks = Atomics.load(sharedArrayRef.current, 0);
        const currentCpu = Atomics.load(sharedArrayRef.current, 1);

        setTicks(currentTicks);
        setCpuLoad(currentCpu);
      }

      animFrameId = requestAnimationFrame(syncUIWithMemory);
    };

    animFrameId = requestAnimationFrame(syncUIWithMemory);

    return () => cancelAnimationFrame(animFrameId);
  }, [isRunning]);

  const startEngine = () => {
    if (workerRef.current && isReady) {
      workerRef.current.postMessage({ type: 'START_SIMULATION' });
      setIsRunning(true);
    }
  };

  const stopEngine = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'STOP_SIMULATION' });
      setIsRunning(false);
    }
  };

  return {
    isReady,
    isRunning,
    ticks,
    cpuLoad,
    startEngine,
    stopEngine,
  };
}