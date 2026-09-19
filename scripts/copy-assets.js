import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  if (fs.existsSync(src)) {
    const files = fs.readdirSync(src);
    for (const file of files) {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
}

copyDir(path.resolve('./assets'), path.resolve('./public/assets'));
copyDir(path.resolve('./video'), path.resolve('./public/video'));

console.log('Successfully synced assets and video to public/');
