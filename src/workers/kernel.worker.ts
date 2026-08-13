import { KernelMessage } from '../types/kernel';

let sharedInt32Array: Int32Array | null = null;
let simulationInterval: NodeJS.Timeout | null = null;

// Worker Message Listener
self.onmessage = (event: MessageEvent<KernelMessage>) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'INIT_SHARED_MEMORY':
      if (payload?.sharedBuffer) {
        // Shared Memory bind kar rahe hain
        sharedInt32Array = new Int32Array(payload.sharedBuffer);
        
        // Initial state set karein using Atomics (Thread Safety)
        Atomics.store(sharedInt32Array, 0, 0); // Index 0: Tick Counter
        Atomics.store(sharedInt32Array, 1, 100); // Index 1: Emulated CPU Load %

        self.postMessage({ type: 'READY', message: 'SharedArrayBuffer Linked & Worker Ready' });
      }
      break;

    case 'START_SIMULATION':
      if (!sharedInt32Array) return;
      
      // Background Heavy Loop Simulation (e.g. WASM Instruction Cycles)
      if (simulationInterval) clearInterval(simulationInterval);
      
      simulationInterval = setInterval(() => {
        if (!sharedInt32Array) return;

        // Zero-Copy Direct Memory Mutation via Atomics
        // Atomic Increment: Tick Counter
        Atomics.add(sharedInt32Array, 0, 1);

        // Simulated Fluctuating CPU Load
        const randomCpu = Math.floor(20 + Math.random() * 60);
        Atomics.store(sharedInt32Array, 1, randomCpu);
      }, 16); // ~60 Ticks per second
      break;

    case 'STOP_SIMULATION':
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      break;
  }
};