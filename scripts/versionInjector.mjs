import { cyan, green } from 'colorette';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const packageJson = JSON.parse(await readFile(resolve(process.cwd(), 'package.json'), 'utf8'));

async function versionInjector(path) {
  const fileNames = await readdir(resolve(path));

  for (const fileName of fileNames) {
    const file = await stat(resolve(path, fileName));

    if (file.isDirectory()) await versionInjector(resolve(path, fileName));
    else if (file.isFile() && fileName.endsWith('.js')) {
      const content = await readFile(resolve(path, fileName), 'utf8');

      if (content.includes('[@versionInjector]')) {
        console.log(`${green('[@versionInjector]')} ${cyan(`${path}${sep}${fileName}`)}`);

        await writeFile(resolve(path, fileName), content.replace(/\[@versionInjector\]/g, packageJson.version));
      }
    }
  }
}

await versionInjector(resolve(process.cwd(), 'dist'));
