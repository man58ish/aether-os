'use client';

import { useState, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { vfs } from '@/lib/vfs';

export default function CodeEditor() {
  const [fileList, setFileList] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState('src/index.js');
  const [code, setCode] = useState('');
  const [savedStatus, setSavedStatus] = useState('SYNCED');

  // Load files list and listen to VFS updates
  useEffect(() => {
    const updateFilesAndContent = () => {
      const files = vfs.getAllFiles();
      setFileList(files);

      // Read current file content
      const content = vfs.readFile(activeFile) ?? '';
      setCode(content);
    };

    updateFilesAndContent();

    // VFS subscription auto-updates file list and editor on change
    const unsubscribe = vfs.subscribe(() => {
      updateFilesAndContent();
    });

    return () => {
      unsubscribe();
    };
  }, [activeFile]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value ?? '';
    setCode(newCode);
    setSavedStatus('MODIFIED');
  };

  const handleSave = () => {
    vfs.writeFile(activeFile, code);
    setSavedStatus('SAVED');
    setTimeout(() => setSavedStatus('SYNCED'), 1500);
  };

  const handleEditorMount: OnMount = (editor) => {
    const domNode = editor.getDomNode();
    const textarea = domNode?.querySelector('textarea');
    if (textarea) {
      textarea.setAttribute('id', 'monaco-hidden-inputarea');
      textarea.setAttribute('name', 'monacoHiddenInputarea');
      textarea.setAttribute('aria-label', 'Monaco Code Editor Input');
    }
  };

  const getLanguage = (filename: string) => {
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
    if (filename.endsWith('.json')) return 'json';
    return 'plaintext';
  };

  return (
    <div className="font-mono text-xs bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-100 flex flex-col h-95 overflow-hidden">
      {/* Dynamic File Selector Bar */}
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <label htmlFor="workspace-file-selector" className="text-zinc-500 text-[11px]">
            Workspace:
          </label>
          <select
            id="workspace-file-selector"
            name="workspaceFileSelector"
            aria-label="Select Workspace File"
            value={activeFile}
            onChange={(e) => setActiveFile(e.target.value)}
            className="bg-zinc-800 text-cyan-300 text-xs px-2 py-1 rounded outline-none border border-zinc-700 cursor-pointer"
          >
            {fileList.map((filePath) => (
              <option key={filePath} value={filePath}>
                {filePath}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
              savedStatus === 'SAVED'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : savedStatus === 'MODIFIED'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {savedStatus}
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-3 py-1 rounded transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>💾</span> Save
          </button>
        </div>
      </div>

      {/* VS Code Monaco Editor */}
      <div className="flex-1 w-full overflow-hidden pt-1 bg-[#09090b]">
        <Editor
          height="100%"
          language={getLanguage(activeFile)}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          options={{
            ariaLabel: 'Code Editor Content',
            fontSize: 12,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 8, bottom: 8 },
          }}
        />
      </div>
    </div>
  );
}