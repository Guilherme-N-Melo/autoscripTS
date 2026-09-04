import { watch, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const fileScript = path.resolve("../src/");
const fileJSON = path.resolve("../package.json");

let timer;

let watcher = watch(fileScript, { recursive: true }, (eventType, filename) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    if (filename && filename.endsWith('.ts')) {
      const normalizedFilename = filename.replaceAll('\\', '/');
      let fullPath = path.join(fileScript, filename);
      const withoutExt = normalizedFilename.slice(0, -'.ts'.length);
      const name = withoutExt.split('/').join(':');

      let text = readFileSync(fileJSON, 'utf8');
      const jsonData = JSON.parse(text);
      jsonData.scripts = jsonData.scripts || {};

      if (existsSync(fullPath)) {
        jsonData.scripts[name] = `tsx src/${normalizedFilename}`;
      } else {
        delete jsonData.scripts[name];
      }

      writeFileSync(fileJSON, JSON.stringify(jsonData, null, 2), 'utf8');
    }
  }, 300);
});


