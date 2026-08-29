import fs from 'fs';
import path from 'path';

function getFiles(dir, exts = ['.js', '.ts', '.jsx', '.tsx', '.css', '.html']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build', 'coverage', '.system_generated'].includes(entry.name)) {
        files = files.concat(getFiles(full, exts));
      }
    } else if (entry.isFile()) {
      if (exts.includes(path.extname(entry.name))) {
        files.push(full);
      }
    }
  }
  return files;
}

function countLoc(files) {
  let total = 0;
  for (const f of files) {
    total += fs.readFileSync(f, 'utf8').split('\n').length;
  }
  return total;
}

const root = process.cwd();
const srcFiles = getFiles(path.join(root, 'src'));
const engineFiles = getFiles(path.join(root, 'js', 'engine'));
const allJsFiles = getFiles(path.join(root, 'js'));
const testFrontendFiles = getFiles(path.join(root, 'tests', 'frontend'));
const serverFiles = getFiles(path.join(root, 'server'));

const categories = {
  'UI Components': srcFiles.filter(f => (f.includes(path.join('src', 'components')) || f.includes(path.join('src', 'features'))) && !f.includes(path.join('src', 'features', 'terminal')) && !f.includes(path.join('src', 'features', 'levels')) && !f.includes(path.join('src', 'features', 'game')) && !f.includes(path.join('src', 'features', 'auth'))),
  'Pages/Screens': srcFiles.filter(f => f.includes(path.join('src', 'pages'))),
  'Frontend Game Integration': srcFiles.filter(f => f.includes(path.join('src', 'features', 'game')) || f.includes(path.join('src', 'game'))),
  'Game Engine Adapter': srcFiles.filter(f => f.includes(path.join('src', 'adapters'))),
  'Authentication': srcFiles.filter(f => f.includes(path.join('src', 'auth')) || f.includes(path.join('src', 'features', 'auth'))),
  'State Management': srcFiles.filter(f => f.includes(path.join('src', 'state'))),
  'API/Services': srcFiles.filter(f => f.includes(path.join('src', 'services')) || f.includes(path.join('src', 'api'))),
  'Level/Progress UI': srcFiles.filter(f => f.includes(path.join('src', 'levels')) || f.includes(path.join('src', 'progression')) || f.includes(path.join('src', 'features', 'levels'))),
  'Terminal Integration': srcFiles.filter(f => f.includes(path.join('src', 'terminal')) || f.includes(path.join('src', 'features', 'terminal'))),
  'Hooks/Utilities/Types': srcFiles.filter(f => f.includes(path.join('src', 'hooks')) || f.includes(path.join('src', 'utils')) || f.includes(path.join('src', 'types'))),
  'Frontend Tests': testFrontendFiles
};

console.log('==================================================');
console.log('GITHERO LOC AUDIT REPORT');
console.log('==================================================');

let categorizedTotal = 0;
for (const [name, files] of Object.entries(categories)) {
  const loc = countLoc(files);
  categorizedTotal += loc;
  console.log(`${name.padEnd(30)}: ${loc.toString().padStart(6)} LOC (${files.length} files)`);
}

console.log('--------------------------------------------------');
const totalSrcLoc = countLoc(srcFiles);
const totalFrontendTestsLoc = countLoc(testFrontendFiles);
const totalFrontendLoc = totalSrcLoc + totalFrontendTestsLoc;
const engineLoc = countLoc(engineFiles);
const totalJsLoc = countLoc(allJsFiles);
const totalServerLoc = countLoc(serverFiles);

console.log(`TOTAL FRONTEND LOC (src + frontend tests): ${totalFrontendLoc}`);
console.log(`  - src/ LOC                             : ${totalSrcLoc}`);
console.log(`  - tests/frontend/ LOC                  : ${totalFrontendTestsLoc}`);
console.log(`EXISTING GAME ENGINE LOC (js/engine)     : ${engineLoc}`);
console.log(`ALL js/ DIRECTORY LOC                    : ${totalJsLoc}`);
console.log(`SERVER LOC (server/)                     : ${totalServerLoc}`);
console.log(`TOTAL PROJECT LOC                        : ${totalFrontendLoc + totalJsLoc + totalServerLoc}`);
console.log('==================================================');
