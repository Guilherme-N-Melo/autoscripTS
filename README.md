# autoscripTS

> ⚠️ **This is a study project.** It was built to learn and practice Node.js fundamentals (`fs`, `path`, file watching, JSON manipulation) — it is not intended for real development workflows.

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
- **`node:path`** — resolving absolute paths so the script behaves consistently.
- **`node:url`** — resolving the script's own location (`import.meta.url`), so paths work no matter where the command is run from.
- Plain JavaScript, no external dependencies.

## Project structure

The example below is just one possible layout, used for local testing — the watched folder and target `package.json` don't have to be arranged this way, as long as the paths in `runGen.js` are updated to match:

```
Project/
├── autoscripTS/     ← this tool
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
git clone https://github.com/Guilherme-N-Melo/autoscripTS.git
```

2. Place it alongside the project you want to manage, and adjust the watched folder and target `package.json` paths in `runGen.js` if your layout differs from the example above.

## Usage

Paths are resolved relative to the location of `runGen.js` itself, not the current working directory — so the *command* can be run from anywhere, as long as you point to the correct file path.

This is different from where the `autoscripTS` **folder** must sit: it still needs to stay a sibling of `src/` and the target `package.json` (see [Project structure](#project-structure)), since the code looks for them via `../src` and `../package.json` relative to its own location on disk.

These commands are the same on any terminal — bash/zsh (Linux/macOS) or PowerShell/CMD (Windows):

```
node autoscripTS/runGen.js
```

Or, if you're already inside the `autoscripTS` folder:

```
node runGen.js
```

The process stays running in the terminal, actively watching the target folder for changes:

- **Creating** a new `.ts` file adds a matching entry to the target `package.json`'s `scripts` section.
- **Deleting** a tracked `.ts` file removes its entry from `scripts`.

To stop the watcher, press `Ctrl+C` in the terminal where it's running.
