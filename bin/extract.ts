import { readFile, writeFile } from 'fs/promises';
import { extract } from '@formatjs/cli';
import glob from 'fast-glob';
import stringify from 'json-stable-stringify';

const OUT_FILE = 'src/translations/en-US.json';

(async () => {
  const files = await glob('src/**/*.tsx');
  const existing = JSON.parse(await readFile(OUT_FILE, 'utf8'));
  const extracted = JSON.parse(
    await extract(files, {
      idInterpolationPattern: '[sha512:contenthash:base64:6]',
      extractSourceLocation: true,
      format: 'crowdin',
    })
  );
  const merged = Object.assign({}, existing, extracted);

  await writeFile(OUT_FILE, stringify(merged, { space: 2 }), 'utf8');
})();
