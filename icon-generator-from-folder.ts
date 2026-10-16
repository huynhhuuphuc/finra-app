import { transform, type Config } from '@svgr/core';
import fs from 'fs-extra';
import path from 'path';
import svgrConfig from './svgr.config';

const srcRefactor = (svgCode: string, componentName: string) => {
  let result = svgCode;

  const customProps: string[] = [];

  let fillIndex = -1;
  result = result.replace(/fill="([^"]*)"/g, (match, color) => {
    if (color === 'none') return match;
    fillIndex++;
    const propName = `fill${fillIndex}`;
    if (!customProps.includes(propName)) customProps.push(propName);
    return `fill={${propName} ?? '${color}'}`;
  });

  let strokeIndex = -1;
  result = result.replace(/stroke="([^"]*)"/g, (match, color) => {
    if (color === 'none') return match;
    strokeIndex++;
    const propName = `stroke${strokeIndex}`;
    if (!customProps.includes(propName)) customProps.push(propName);
    return `stroke={${propName} ?? '${color}'}`;
  });

  const propDecl = customProps.map((name) => `  ${name}?: string;`).join('\n');

  const interf = `\nexport interface I${componentName}Props extends React.SVGProps<SVGSVGElement> {${
    propDecl ? `\n${propDecl}\n` : ''
  }}`;

  const destructure =
    customProps.length > 0
      ? `{ ${customProps.join(', ')}, ...restProps }`
      : 'restProps';

  result = result.replace(
    /import type \{ SvgProps \} from ['"]react-native-svg['"];?\n?/g,
    '',
  );
  result = result.replace(
    /import type \{ SVGProps \} from ['"]react['"];?\n?/g,
    '',
  );

  if (
    !result.includes("import * as React from 'react'") &&
    !result.includes('import * as React from "react"') &&
    !result.includes("import React from 'react'")
  ) {
    result = `import * as React from 'react';\n${result}`;
  }

  result = result.replace(/xmlns="[^"]*"\s*/g, '');

  result = result.replace(
    /\(\s*props\s*:\s*SVGProps<SVGSVGElement>\s*\)/,
    `(${destructure}: I${componentName}Props)`,
  );
  result = result.replace(
    /\(\s*props\s*:\s*SvgProps\s*\)/,
    `(${destructure}: I${componentName}Props)`,
  );

  result = result.replace(/\{\s*\.\.\.props\s*\}/g, '{...restProps}');

  result = result.replace(/(const \w+ = \()/, `${interf}\n\n$1`);

  return result;
};

const toPascal = (str: string) => {
  return str
    .replace(/[-_/=]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(
      /\s+(.)(\w*)/g,
      (_, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`,
    )
    .replace(/\w/, (s) => s.toUpperCase())
    .trim();
};

const toPascalCase = (str: string) => `${toPascal(str)}Icon`;

const ICONS_DIRECTORY_PATH = path.resolve(__dirname, './src/icons/components');
const ICONS_INDEX_PATH = path.resolve(__dirname, './src/icons/index.ts');
const SVG_DIRECTORY_PATH = path.resolve(__dirname, 'figma-icon-svgs');

process.env.from_file = 'true';

const collectSvgFiles = (dirPath: string): string[] => {
  const entries = fs.readdirSync(dirPath);
  return entries.flatMap((name) => {
    const fullPath = path.join(dirPath, name);
    if (fs.statSync(fullPath).isDirectory()) return collectSvgFiles(fullPath);
    return fullPath.toLowerCase().endsWith('.svg') ? [fullPath] : [];
  });
};

const buildIndex = (componentNames: string[]) => {
  if (componentNames.length === 0) return 'export {};\n';

  return (
    componentNames
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .map(
        (componentName) =>
          `export { default as ${componentName} } from './components/${componentName}';\nexport type { I${componentName}Props } from './components/${componentName}';`,
      )
      .join('\n') + '\n'
  );
};

async function main() {
  await fs.ensureDir(SVG_DIRECTORY_PATH);
  await fs.ensureDir(ICONS_DIRECTORY_PATH);

  const files = collectSvgFiles(SVG_DIRECTORY_PATH);
  if (files.length === 0) {
    await fs.outputFile(ICONS_INDEX_PATH, 'export {};\n');
    console.log('No SVG files in', SVG_DIRECTORY_PATH);
    return;
  }

  const written: string[] = [];
  const seen = new Set<string>();

  for (const filePath of files) {
    const iconName = path
      .relative(SVG_DIRECTORY_PATH, filePath)
      .replace(/\\/g, '/')
      .replace(/\.svg$/i, '');
    const componentName = toPascalCase(iconName);

    if (seen.has(componentName)) {
      throw new Error(
        `Duplicate icon component "${componentName}" from ${iconName}`,
      );
    }
    seen.add(componentName);

    const svgCode = await fs.readFile(filePath, 'utf8');
    console.log('processing file', iconName, '->', componentName);

    const generated = await transform(
      svgCode,
      { ...(svgrConfig as Config), typescript: true, runtimeConfig: false },
      { componentName },
    );
    const componentCode = srcRefactor(generated, componentName);
    const outputPath = path.resolve(
      ICONS_DIRECTORY_PATH,
      `${componentName}.tsx`,
    );
    await fs.outputFile(outputPath, componentCode);
    written.push(componentName);
    console.log('wrote component to', outputPath);
  }

  const existing = await fs.readdir(ICONS_DIRECTORY_PATH);
  await Promise.all(
    existing
      .filter(
        (name) =>
          name.endsWith('.tsx') &&
          !written.includes(name.slice(0, -'.tsx'.length)),
      )
      .map((name) => fs.remove(path.join(ICONS_DIRECTORY_PATH, name))),
  );

  await fs.outputFile(ICONS_INDEX_PATH, buildIndex(written));
  console.log('wrote index to', ICONS_INDEX_PATH);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
