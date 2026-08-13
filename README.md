# ⚡ Aether OS 

[![Next.js](https://img.shields.io/badge/Built_with-Next.js_14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![WASM](https://img.shields.io/badge/Powered_by-WebAssembly-654FF0?logo=webassembly)](https://webassembly.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**A fully functional, web-based Cloud IDE & Edge Operating System running entirely in the browser.** 

Aether OS escapes the single-threaded limits of JavaScript by leveraging **Web Workers, SharedArrayBuffer, WebAssembly (WASM), and Atomics** to deliver a zero-latency, cross-origin isolated desktop environment. It simulates hardware, runs a real x86 Linux kernel, and provides a VS Code-level editing experience without ever blocking the main UI thread.

---

## 📸 System Interface
![Aether OS Demo](https://via.placeholder.com/1000x500.png?text=Aether+OS+Glassmorphic+UI+Screenshot) 
*(Note: Replace this image with a screenshot or GIF of your running Aether OS environment)*

---

## 🚀 The Architecture (God-Level Web Engineering)

Unlike standard web applications, Aether OS operates on a true multi-threaded architecture to ensure the Main UI Thread never blocks (maintaining a constant 60 FPS), even while booting a full x86 Linux Kernel in the background.

```text
+---------------------------------------------------------+
|                     MAIN UI THREAD                      |
|  +-------------+  +-------------+  +-----------------+  |
|  | Next.js Shell| | Monaco IDE  |  | Zustand State   |  |
|  +-------------+  +-------------+  +-----------------+  |
|         |                |                  |           |
|         +--------+-------+--------+---------+           |
|                  |                |                     |
|           [ DOM / UI Updates (60 FPS) ]                 |
+------------------|----------------|---------------------+
                   |                |
         [ SharedArrayBuffer + Atomics (Zero-Copy) ]
                   |                |
+------------------|----------------|---------------------+
|                  V                V                     |
|           WEB WORKER (Off-Main-Thread)                  |
|  +-----------------------------------------------+      |
|  | 🐧 v86 Emulator (x86 WASM Engine)             |      |
|  +-----------------------------------------------+      |
|  | 📁 Reactive VFS (JS Proxy Interceptors)       |      |
|  +-----------------------------------------------+      |
+------------------------|--------------------------------+
                         |
                 [ Snapshot Engine ]
                         V
           +---------------------------+
           | 💾 IndexedDB (RAM Dump)   |
           +---------------------------+

Core Engineering Features
🔒 COOP/COEP Cross-Origin Isolation: Configured strict edge security headers (Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy: credentialless) to unlock SharedArrayBuffer for zero-copy memory operations between the UI and Web Workers.

⚡ Off-Main-Thread Execution: Utilizes Atomics.load and Atomics.store for lock-free, high-frequency state synchronization.

📁 Reactive Virtual File System (VFS): Built from scratch using JavaScript Proxy objects to intercept FS mutations and instantly sync the Monaco Editor and Terminal without React re-renders.

💾 Zero-Server RAM Snapshotting: Dumps the entire emulated x86 RAM buffer and VFS tree directly into the browser's IndexedDB for 0-millisecond session restoration.

🖥️ Real x86 Hardware Boot: Integrates v86 WASM engine to boot actual SeaBIOS and Alpine Linux directly inside a web canvas.

🪟 Native Custom Window Manager: Bypassed heavy dragging libraries by orchestrating native HTML <dialog> APIs with CSS Subgrid and Zustand for a lag-free Glassmorphic windowing system.

📝 VS Code Engine: Fully integrated Monaco Editor with dynamic file routing linked directly to the custom VFS.

🛠️ Tech Stack
Frontend & UI
Framework: React 18 / Next.js (App Router)

Language: TypeScript (Strict Mode)

Styling: Tailwind CSS v4 (Glassmorphism, CSS Variables, Cyberpunk Theme)

Icons & Fonts: JetBrains Mono, Fira Code

State & Architecture
State Management: Zustand (Transient State Subscriptions)

Memory Sync: SharedArrayBuffer & Atomics

Storage: IndexedDB API

Emulation & Editor
Code Editor: @monaco-editor/react

Hardware Emulation: v86 (WebAssembly x86 emulator)

⚙️ Getting Started (Local Development)
Because Aether OS requires Cross-Origin Isolation to function, standard local setups might block memory sharing. Follow these steps carefully:

Clone the repository:

Bash
git clone [https://github.com/yourusername/aether-os.git](https://github.com/yourusername/aether-os.git)
cd aether-os
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Verify Isolation:
Open http://localhost:3000. The System Diagnostics window must show PASSED for Cross-Origin Isolation and SharedArrayBuffer.
(Note: If headers do not apply immediately, perform a hard refresh using Ctrl + Shift + R).

🛡️ Security & Vulnerability Patches Implemented
During the build phase, several browser-level vulnerabilities were explicitly audited and patched:

Terminal Sandbox Escape: Prevented malicious DOM execution via the custom node shell command string evaluator.

VFS Prototype Pollution: Blocked __proto__ mutations in the file tree system.

Monaco Form Accessibility: Injected headless ARIA labels and strict id/name attributes into the dynamically generated Monaco DOM to satisfy strict browser autofill and accessibility engines, achieving a 0-warning DevTools console.

👨‍💻 Architected & Developed By
Manish Anuragi

Platform Engineer / Software Developer

Built with a passion for pushing the limits of the modern browser.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
