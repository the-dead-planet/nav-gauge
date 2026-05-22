/// <reference types="node" />

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync, stringify } from 'svgson';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function computeBBoxFromPaths(datas: string[]): { x: number; y: number; width: number; height: number } | null {
  const tokenRe = /[MLHVCSQTAZmlhvcsqtaz]|-?\d+\.?\d*(?:e[+-]?\d+)?/g;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let cx = 0, cy = 0;

  const update = (x: number, y: number): void => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };

  const absCoord = (ctx: number, v: number, rel: boolean): number => rel ? ctx + v : v;

  for (const d of datas) {
    const tokens: (string | number)[] = [];
    let mt: RegExpExecArray | null;
    while ((mt = tokenRe.exec(d)) !== null) {
      tokens.push(/[MLHVCSQTAZmlhvcsqtaz]/.test(mt[0]) ? mt[0] : parseFloat(mt[0]));
    }

    let i = 0;
    cx = 0; cy = 0;

    while (i < tokens.length) {
      const t = tokens[i];
      if (typeof t !== 'string') { i++; continue; }
      const rel = t === t.toLowerCase();
      i++;

      const nx = (v: number): number => absCoord(cx, v, rel);
      const ny = (v: number): number => absCoord(cy, v, rel);

      const endPt = (): void => {
        const x = tokens[i++] as number; const y = tokens[i++] as number;
        cx = nx(x); cy = ny(y);
        update(cx, cy);
      };

      switch (t.toLowerCase()) {
        case 'm': { endPt(); break; }
        case 'l': { while (i < tokens.length && typeof tokens[i] === 'number') { endPt(); } break; }
        case 'h': {
          while (i < tokens.length && typeof tokens[i] === 'number') {
            cx = nx(tokens[i++] as number);
            update(cx, cy);
          }
          break;
        }
        case 'v': {
          while (i < tokens.length && typeof tokens[i] === 'number') {
            cy = ny(tokens[i++] as number);
            update(cx, cy);
          }
          break;
        }
        case 'c': {
          while (i + 5 < tokens.length && typeof tokens[i] === 'number') {
            i += 4; // skip control points
            endPt();
          }
          break;
        }
        case 's': {
          while (i + 3 < tokens.length && typeof tokens[i] === 'number') {
            i += 2; // skip second control point
            endPt();
          }
          break;
        }
        case 'q': {
          while (i + 3 < tokens.length && typeof tokens[i] === 'number') {
            i += 2; // skip control point
            endPt();
          }
          break;
        }
        case 't': { while (i + 1 < tokens.length && typeof tokens[i] === 'number') { endPt(); } break; }
        case 'a': {
          while (i + 6 < tokens.length && typeof tokens[i] === 'number') {
            const rx = tokens[i++] as number;
            const ry = tokens[i++] as number;
            i += 3;
            endPt();
            update(cx - rx, cy - ry);
            update(cx + rx, cy + ry);
          }
          break;
        }
        case 'z': break;
      }
    }
  }

  if (minX === Infinity) return null;
  return { x: minX, y: minY, width: maxX - minX || 24, height: maxY - minY || 24 };
}

const RAW_DIR = path.join(__dirname, 'raw');
const OUTPUT_COMPONENTS_DIR = __dirname;
const REGISTRY_FILE = path.join(__dirname, 'icon-registry.json');
const OUTPUT_SVG_DIR = __dirname;

if (!fs.existsSync(OUTPUT_COMPONENTS_DIR)) fs.mkdirSync(OUTPUT_COMPONENTS_DIR, { recursive: true });

const files: string[] = fs.readdirSync(RAW_DIR).filter((file: string) => file.endsWith('.svg'));
const registryData: Array<{ id: string; title: string; creator: string; source: string; href: string; license: string; }> = [];

files.forEach((file: string) => {
  const filePath = path.join(RAW_DIR, file);
  const rawSvgString = fs.readFileSync(filePath, 'utf8');

  const ast = parseSync(rawSvgString);

  let creator = 'Unknown Artist';
  const textNodes: string[] = [];

  const findTextAndMetadata = (node: { name?: string; value?: string; children?: any[] }): void => {
    if (node.name === 'text') {
      textNodes.push(node.value || (node.children && node.children[0]?.value) || '');
    }
    if (node.children) node.children.forEach(findTextAndMetadata);
  };
  findTextAndMetadata(ast);

  const fullText = textNodes.join(' ');
  const creatorMatch = fullText.match(/Created\s+by\s+(.*?)\s+from/i);
  if (creatorMatch && creatorMatch[1]) {
    creator = creatorMatch[1].trim();
  }

  const filterOutTextTags = (node: { name?: string; children?: any[]; attributes?: Record<string, string>; value?: string }): any => {
    if (!node.children) return node;
    node.children = node.children.filter((child: { name?: string }) => child.name !== 'text');
    node.children.forEach(filterOutTextTags);
    return node;
  };
  const cleanedAst = filterOutTextTags(ast);

  const innerPathsString = cleanedAst.children.map((child: any) => stringify(child)).join('\n    ');

  const collectPathData = (node: any): string[] => {
    const data: string[] = [];
    if (node.name === 'path' && node.attributes?.d) {
      data.push(node.attributes.d);
    }
    if (node.children) node.children.forEach((c: any) => data.push(...collectPathData(c)));
    return data;
  };
  const pathData = collectPathData(cleanedAst);

  const bbox = computeBBoxFromPaths(pathData);
  const padding = 2;
  const paddedViewBox = bbox
    ? `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`
    : (ast.attributes.viewBox || "0 0 100 100");

  const standardizedSvgTemplate = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
  <svg viewBox="${paddedViewBox}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    ${innerPathsString}
  </svg>
</svg>`;

  fs.writeFileSync(path.join(OUTPUT_SVG_DIR, file), standardizedSvgTemplate);

  const baseName = path.basename(file, '.svg');
  registryData.push({
    id: baseName,
    title: baseName.replace(/-/g, ' ').toUpperCase(),
    creator,
    source: 'The Noun Project',
    href: 'https://thenounproject.com',
    license: "CC BY 3.0",
  });

  console.log(`Fixed & Processed: ${file} (Author: ${creator})`);
});

fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registryData, null, 2));
console.log(`\nProcess complete! Cleaned SVGs saved to ${OUTPUT_SVG_DIR}`);
