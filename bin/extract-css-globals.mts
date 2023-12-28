import { readFile, writeFile } from 'fs/promises';
import postcss from 'postcss';
import extract from '@csstools/postcss-extract';

await Promise.all([
  /* Extract color palette for display in the docs */
  postcss([
    extract({
      extractLate: false,
      queries: { 'colors': 'Rule[selector*=":root" i] > decl[variable]' },
      async results({ colors }) {
        const colorsMap = colors.reduce((obj, { prop, value }) => ({ ...obj, [prop as string]: value }), {});
        await writeFile('src/styles/globals/colors.json', JSON.stringify(colorsMap, null, 2));
      }
    })
  ]).process(
    await readFile('src/styles/globals/colors.css', 'utf8'),
    { from: 'src/styles/globals/colors.css' }
  ),
  /* Extract breakpoints for use in JS */
  postcss([
    extract({
      extractLate: false,
      queries: { 'customMedia': 'AtRule[name=custom-media]' },
      async results({ customMedia }) {
        const customMediaMap = customMedia.reduce((obj, { params }) => {
          const parsed = /--(\w+)\s+(.*)/.exec(params as string);
          if (!parsed) return obj;

          return {
            ...obj,
            [parsed[1]]: parsed[2]
          };
        }, {});
        await writeFile('src/styles/globals/breakpoints.json', JSON.stringify(customMediaMap, null, 2));
      }
    })
  ]).process(
    await readFile('src/styles/globals/breakpoints.css', 'utf8'),
    { from: 'src/styles/globals/breakpoints.css' }
  )
]);