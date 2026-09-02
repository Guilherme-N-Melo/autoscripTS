# ts-runner-generator

A Node.js developer-experience (DX) tool that watches a project folder for TypeScript files and automatically injects the corresponding commands into the `scripts` section of `package.json` — no more manual editing.

## Status

Work in progress — a learning project focused on backend/tooling fundamentals (`fs`, `path`, file watching, JSON manipulation).

## Why

Manually editing `package.json` every time a new `.ts` script is added is repetitive and error-prone. This tool automates that step with a file watcher.

## How it works

The tool watches a folder in real time using Node's native `fs.watch`. When a new `.ts` file is created, it adds a matching entry to `scripts`. When a tracked `.ts` file is removed, it removes the corresponding entry.

By default, the watched folder is `src/`, but this can be changed by editing the path directly in `runGen.js` — no configuration file needed.

> ℹ️ Watching is set up with `recursive: true`. Subfolder tracking was verified working on Linux (Node v22) — files created inside nested folders correctly trigger the watcher. Behavior on Windows/macOS hasn't been tested yet.

## Tech stack

- **`node:fs`** — reading `package.json`, watching the target folder, writing changes back to disk.
- **`node:path`** — resolving absolute paths so the script behaves consistently regardless of the current working directory.
- Plain JavaScript, no external dependencies.

## Project structure

The example below is just one possible layout, used for local testing — the watched folder and target `package.json` don't have to be arranged this way, as long as the paths in `runGen.js` are updated to match:

```
Project/
├── ts-runner-generator/     ← this tool
│   ├── package.json
│   └── runGen.js
├── src/                     ← watched folder (target project's .ts files)
└── package.json             ← target project's package.json (gets modified)
```

## Requirements

- [Node.js](https://nodejs.org/) v16 or later (uses native ES modules and `fs.watch`)
- No external dependencies — nothing to install via `npm install`

## Setup

1. Clone the repo:

   ```
   git clone https://github.com/Guilherme-N-Melo/ts-runner-generator.git
   ```

2. Place it alongside the project you want to manage, and adjust the watched folder and target `package.json` paths in `runGen.js` if your layout differs from the example above.

## Usage

Navigate into the `ts-runner-generator` folder — this is required, since paths are currently resolved relative to the current working directory. Then start the watcher.

These commands are the same on any terminal — bash/zsh (Linux/macOS) or PowerShell/CMD (Windows):

```
cd ts-runner-generator
npm start
```

This runs `node runGen.js` under the hood. The process stays running in the terminal, actively watching the target folder for changes:

- **Creating** a new `.ts` file adds a matching entry to the target `package.json`'s `scripts` section.
- **Deleting** a tracked `.ts` file removes its entry from `scripts`.

To stop the watcher, press `Ctrl+C` in the terminal where it's running.

> ⚠️ **Important:** the command must be run from inside the `ts-runner-generator` folder. Running it from anywhere else will cause the relative paths to resolve incorrectly.
