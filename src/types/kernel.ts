export type KernelCommandType = 'INIT_SHARED_MEMORY' | 'START_SIMULATION' | 'STOP_SIMULATION';

export interface KernelMessage {
  type: KernelCommandType;
  payload?: {
    sharedBuffer?: SharedArrayBuffer;
    int32Offset?: number;
  };
}

export interface WorkerResponse {
  type: 'READY' | 'TICK' | 'ERROR';
  message?: string;
  timestamp?: number;
}