'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { vfs } from '@/lib/vfs';

interface HistoryItem {
  command: string;
  output: string;
  type: 'info' | 'error' | 'success';
}

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'aether-kernel --version',
      output: 'Aether OS v1.0.0 (x86_64 WASM/SharedMemory Emulated Shell)',
      type: 'info',
    },
    {
      command: 'help',
      output: 'Available commands: ls, cat <file>, write <file> <content>, node <file>, clear, help',
      type: 'info',
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';
    let type: 'info' | 'error' | 'success' = 'info';

    switch (cmd) {
      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'help':
        output = 'Commands:\n  ls                       - List files\n  cat <file>               - View file contents\n  write <file> <text>      - Write text to file\n  node <file>              - Execute JS file in browser VFS\n  clear                    - Clear terminal';
        break;

      case 'ls': {
        const files = vfs.listDir('/');
        output = files.length ? files.join('   ') : '(empty directory)';
        type = 'success';
        break;
      }

      case 'cat': {
        if (!args[0]) {
          output = 'Usage: cat <filename>';
          type = 'error';
        } else {
          const content = vfs.readFile(args[0]);
          if (content !== null) {
            output = content;
          } else {
            output = `cat: ${args[0]}: No such file`;
            type = 'error';
          }
        }
        break;
      }

      case 'write': {
        if (args.length < 2) {
          output = 'Usage: write <filename> <content...>';
          type = 'error';
        } else {
          const filename = args[0];
          const text = args.slice(1).join(' ');
          vfs.writeFile(filename, text);
          output = `Successfully wrote to ${filename}`;
          type = 'success';
        }
        break;
      }

      case 'node': {
        if (!args[0]) {
          output = 'Usage: node <filename>';
          type = 'error';
        } else {
          const code = vfs.readFile(args[0]);
          if (code === null) {
            output = `node: cannot find module '${args[0]}'`;
            type = 'error';
          } else {
            try {
              const logs: string[] = [];
              const customConsole = {
                log: (...msg: unknown[]) => logs.push(msg.map(m => typeof m === 'object' ? JSON.stringify(m) : String(m)).join(' ')),
                error: (...msg: unknown[]) => logs.push(`[ERROR] ${msg.join(' ')}`),
              };

              const runFn = new Function('console', code);
              runFn(customConsole);

              output = logs.join('\n') || '[Process exited with code 0]';
              type = 'success';
            } catch (err: unknown) {
              output = `Runtime Error: ${err instanceof Error ? err.message : String(err)}`;
              type = 'error';
            }
          }
        }
        break;
      }

      default:
        output = `command not found: ${cmd}. Type 'help' for available commands.`;
        type = 'error';
    }

    setHistory((prev) => [...prev, { command: trimmed, output, type }]);
    setInput('');
  };

  return (
    <div className="font-mono text-xs bg-black/95 p-4 rounded-xl min-h-70 flex flex-col justify-between border border-zinc-800 text-zinc-300">
      <div className="space-y-3 overflow-y-auto max-h-75 pr-2">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <span>aether@edge-node:~$</span>
              <span className="text-white font-semibold">{item.command}</span>
            </div>
            <pre
              className={`whitespace-pre-wrap pl-4 border-l-2 ${
                item.type === 'error'
                  ? 'border-red-500 text-red-400'
                  : item.type === 'success'
                  ? 'border-emerald-500 text-emerald-300'
                  : 'border-zinc-700 text-zinc-400'
              }`}
            >
              {item.output}
            </pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4 pt-2 border-t border-zinc-800">
        <label htmlFor="terminal-cli-input" className="text-emerald-400 font-bold select-none">
          aether@edge-node:~$
        </label>
        <input
          id="terminal-cli-input"
          name="terminalCliInput"
          aria-label="Terminal Command Input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type command (e.g. 'ls', 'node src/index.js')..."
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-600 font-mono text-xs"
          autoFocus
          autoComplete="off"
        />
      </form>
    </div>
  );
}