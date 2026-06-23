import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSync, stringify, INode } from "svgson";
import { Resvg, BBox } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.join(__dirname, "raw");
const OUT_DIR = path.join(__dirname, "output");
const REGISTRY_FILE = path.join(__dirname, "icon-registry.json");

fs.mkdirSync(OUT_DIR, { recursive: true });

const PADDING_Y = 2.5;
const PADDING_X = 2;

function applyPadding(bbox: BBox) {
  return {
    x: bbox.x - PADDING_X,
    y: bbox.y - PADDING_Y,
    width: bbox.width + PADDING_X * 2,
    height: bbox.height + PADDING_Y + PADDING_Y,
  };
}

function toViewBox(b: BBox) {
  return `${b.x} ${b.y} ${b.width} ${b.height}`;
}

function extractCreator(ast: INode): string {
  const chunks: string[] = [];

  function walk(node: INode) {
    if (!node) {
      return;
    };

    if (node.name === "metadata") {
      if (typeof node.value === "string") {
        chunks.push(node.value);
      }
      if (node.children) {
        node.children.forEach(walk);
      }
    }

    if (node.name === "text" || node.name === "tspan") {
      if (typeof node.value === "string") {
        chunks.push(node.value);
      }
    }

    if (typeof node.value === "string") {
      chunks.push(node.value);
    }

    node.children?.forEach(walk);
  }

  walk(ast);

  const full = chunks
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const match =
    full.match(/Created\s+by\s+(.+?)\s+from/i) ||
    full.match(/by\s+(.+?)\s+from/i);

  return match?.[1]?.trim() ?? "Unknown Artist";
}

function stripText(node: INode): INode {
  if (!node.children) return node;

  node.children = node.children
    .filter((c) => c.name !== "text")
    .map(stripText);

  return node;
}

function stripColors(node: INode): INode {
  if (node.attributes) {
    delete node.attributes.fill;
    delete node.attributes.stroke;
  }

  node.children?.forEach(stripColors);
  return node;
}

function toSVG(ast: INode) {
  const inner = (ast.children || [])
    .map((c) => stringify(c))
    .join("\n");

  return `
    <svg xmlns="http://www.w3.org/2000/svg">
    ${inner}
    </svg>`.trim();
}

function computeViewBox(svg: string) {
  const resvg = new Resvg(svg);
  const bbox = resvg.getBBox();
  if (!bbox) {
    throw new Error("Could not compute bounding box");
  }
  const padded = applyPadding(bbox);

  return toViewBox(padded);
}

interface RegistryEntry {
  id: string;
  title: string;
  creator: string;
  source: string;
  href: string;
  license: string;
}

const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith(".svg"));

const registry: RegistryEntry[] = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(RAW_DIR, file), "utf8");

  let ast = parseSync(raw);

  const creator = extractCreator(ast);

  ast = stripText(ast);
  ast = stripColors(ast);

  const baseSvg = toSVG(ast);
  const viewBox = computeViewBox(baseSvg);

  const finalSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
    ${baseSvg.replace(/<svg[^>]*>|<\/svg>/g, "")}
    </svg>`.trim();

  fs.writeFileSync(path.join(OUT_DIR, file), finalSvg);

  const id = path.basename(file, ".svg");

  registry.push({
    id,
    title: id.replace(/-/g, " "),
    creator,
    source: "The Noun Project",
    href: "https://thenounproject.com",
    license: "CC BY 3.0",
  });

  console.info(`✔ ${file} (${creator})`);
}

fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));

console.info("\nDone.");