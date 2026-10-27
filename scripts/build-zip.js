import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createZip() {
  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Run npm run build first.');
    process.exit(1);
  }

  const zip = new JSZip();

  function addDirToZip(currentDir, relativePath = '') {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      if (file === 'birthday-website.zip') continue; // Don't self-nest
      const fullPath = path.join(currentDir, file);
      const relPath = path.join(relativePath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addDirToZip(fullPath, relPath);
      } else {
        const content = fs.readFileSync(fullPath);
        zip.file(relPath, content);
      }
    }
  }

  addDirToZip(distDir);

  // Guarantee Netlify _redirects and netlify.toml exist in root of zip
  const redirectsPath = path.resolve('public/_redirects');
  if (fs.existsSync(redirectsPath)) {
    zip.file('_redirects', fs.readFileSync(redirectsPath));
  } else {
    zip.file('_redirects', '/*    /index.html   200\n');
  }

  const netlifyTomlPath = path.resolve('netlify.toml');
  if (fs.existsSync(netlifyTomlPath)) {
    zip.file('netlify.toml', fs.readFileSync(netlifyTomlPath));
  }

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outPath = path.join(publicDir, 'birthday-website.zip');
  fs.writeFileSync(outPath, zipBuffer);

  // Also write to dist so direct URL download works from live app
  fs.writeFileSync(path.join(distDir, 'birthday-website.zip'), zipBuffer);

  console.log(`Successfully generated ${outPath} (${(zipBuffer.length / 1024).toFixed(1)} KB)`);
}

createZip().catch((err) => {
  console.error(err);
  process.exit(1);
});
