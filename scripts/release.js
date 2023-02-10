/**
 * 这个文件是用来发布项目的，发布的时候会自动执行这个文件
 * 将out下的auto-intranet-win32-x64文件夹压缩成zip包
 * 并且将zip包放到zip-package文件夹下，如果没有zip-package文件夹会自动创建，如果有会覆盖
 */

const fs = require('fs');
const path = require('path');

const archiver = require('archiver');

const outPath = path.resolve(__dirname, '../out/auto-intranet-win32-x64');

// 如果没有zip-package，则新建
if (!fs.existsSync(path.resolve(__dirname, '../zip-package'))) {
  fs.mkdirSync(path.resolve(__dirname, '../zip-package'));
}

const zipPath = path.resolve(__dirname, '../zip-package/auto-intranet-win32-x64.zip');

const output = fs.createWriteStream(zipPath);

const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.directory(outPath, false);

archive.finalize();

