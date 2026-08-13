export interface VFSNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, VFSNode>;
  updatedAt: number;
}

type VFSChangeListener = (root: VFSNode) => void;

class ReactiveVFS {
  private root: VFSNode;
  private listeners: Set<VFSChangeListener> = new Set();

  constructor() {
    this.root = {
      name: 'root',
      type: 'directory',
      updatedAt: Date.now(),
      children: {
        'welcome.txt': {
          name: 'welcome.txt',
          type: 'file',
          content: 'Welcome to Aether OS Virtual File System!\nPowered by JS Proxy traps.',
          updatedAt: Date.now(),
        },
        'package.json': {
          name: 'package.json',
          type: 'file',
          content: '{\n  "name": "aether-app",\n  "version": "1.0.0",\n  "main": "src/index.js"\n}',
          updatedAt: Date.now(),
        },
        'src': {
          name: 'src',
          type: 'directory',
          updatedAt: Date.now(),
          children: {
            'index.js': {
              name: 'index.js',
              type: 'file',
              content: 'console.log("Hello from Aether Edge OS!");\nconst sum = (a, b) => a + b;\nconsole.log("Result:", sum(10, 20));',
              updatedAt: Date.now(),
            },
            'utils.js': {
              name: 'utils.js',
              type: 'file',
              content: '// Utility Functions\nexport const greet = (name) => `Hello ${name}`;\nconsole.log(greet("Developer"));',
              updatedAt: Date.now(),
            },
          },
        },
      },
    };
  }

  public getRoot(): VFSNode {
    return this.root;
  }

  public subscribe(listener: VFSChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.root));
  }

  // Helper method to recursively get ALL file paths
  public getAllFiles(node: VFSNode = this.root, currentPath: string = ''): string[] {
    let fileList: string[] = [];
    if (!node.children) return fileList;

    for (const key of Object.keys(node.children)) {
      const child = node.children[key];
      const fullPath = currentPath ? `${currentPath}/${key}` : key;
      if (child.type === 'file') {
        fileList.push(fullPath);
      } else if (child.type === 'directory') {
        fileList = fileList.concat(this.getAllFiles(child, fullPath));
      }
    }
    return fileList;
  }

  public listDir(pathStr: string = '/'): string[] {
    const parts = pathStr.split('/').filter(Boolean);
    let current: VFSNode | undefined = this.root;

    for (const part of parts) {
      if (!current || !current.children) return [];
      current = current.children[part];
    }

    return current && current.children ? Object.keys(current.children) : [];
  }

  public readFile(pathStr: string): string | null {
    const parts = pathStr.split('/').filter(Boolean);
    let current: VFSNode | undefined = this.root;

    for (const part of parts) {
      if (!current || !current.children) return null;
      current = current.children[part];
    }

    return current && current.type === 'file' ? (current.content ?? '') : null;
  }

  public writeFile(pathStr: string, content: string): boolean {
    const parts = pathStr.split('/').filter(Boolean);
    let current = this.root;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current.children || !current.children[part]) {
        current.children = current.children || {};
        current.children[part] = {
          name: part,
          type: 'directory',
          children: {},
          updatedAt: Date.now(),
        };
      }
      current = current.children[part];
    }

    const fileName = parts[parts.length - 1];
    current.children = current.children || {};
    current.children[fileName] = {
      name: fileName,
      type: 'file',
      content,
      updatedAt: Date.now(),
    };

    this.notify();
    return true;
  }

// Yeh method snapshot se VFS state replace karega
  public importSnapshot(vfsJSON: string): boolean {
    try {
      const parsedRoot = JSON.parse(vfsJSON);
      if (parsedRoot && parsedRoot.name === 'root') {
        this.root = parsedRoot;
        this.notify(); // Editor aur Terminal ko batayega ki file update ho gayi
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to parse VFS Snapshot:', error);
      return false;
    }
  }

}

export const vfs = new ReactiveVFS();