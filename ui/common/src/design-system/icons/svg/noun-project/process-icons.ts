import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSync, stringify, INode } from "svgson";
import { Resvg, BBox } from "@resvg/resvg-js";
import { RegistryEntry } from "./model";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        const isOutline = node.attributes.fill === "none" && Boolean(node.attributes.stroke);

        delete node.attributes.fill;
        delete node.attributes.stroke;

        if (isOutline) {
            node.attributes.fill = "none";
            node.attributes.stroke = "currentColor";
        }
    }

    node.children?.forEach(stripColors);
    return node;
}

function toSVG(ast: INode) {
    const inner = (ast.children || [])
        .map((c) => stringify(c))
        .join("\n");

    return `<svg xmlns="http://www.w3.org/2000/svg">\n${inner}\n</svg>`;
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

export function processIcons(directory: string, iconName?: string): void {
    if (iconName !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(iconName)) {
        throw new Error('Expected an icon name such as foo-bar, without a path or .svg extension.');
    }

    const rawDirectory = path.join(directory, 'raw');
    const outputDirectory = path.join(directory, 'output');
    const registryFile = path.join(directory, 'icon-registry.json');
    const files = iconName
        ? [`${iconName}.svg`]
        : fs.readdirSync(rawDirectory).filter(file => file.endsWith('.svg'));
    if (iconName && !fs.existsSync(path.join(rawDirectory, files[0]))) {
        throw new Error(`Icon not found: raw/${iconName}.svg`);
    }
    const registry: RegistryEntry[] = iconName && fs.existsSync(registryFile)
        ? JSON.parse(fs.readFileSync(registryFile, 'utf8'))
        : [];

    fs.mkdirSync(outputDirectory, { recursive: true });

    for (const file of files) {
        const raw = fs.readFileSync(path.join(rawDirectory, file), 'utf8');
        let ast = parseSync(raw);
        const creator = extractCreator(ast);

        ast = stripText(ast);
        ast = stripColors(ast);

        const baseSvg = toSVG(ast);
        const viewBox = computeViewBox(baseSvg);
        const content = baseSvg.replace(/<svg[^>]*>|<\/svg>/g, '').trim();
        const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${content}\n</svg>\n`;

        fs.writeFileSync(path.join(outputDirectory, file), finalSvg);

        const id = path.basename(file, '.svg');
        const entry: RegistryEntry = {
            id,
            title: id.replace(/-/g, ' '),
            creator,
            source: 'The Noun Project',
            href: 'https://thenounproject.com',
            license: 'CC BY 3.0',
        };
        const existingIndex = registry.findIndex(existing => existing.id === id);
        if (existingIndex === -1) {
            registry.push(entry);
        } else {
            registry[existingIndex] = entry;
        }

        console.info(`✔ ${file} (${creator})`);
    }

    fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2));
    console.info('\nDone.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    if (process.argv.length > 3) {
        throw new Error('Usage: yarn icons [foo-bar]');
    }
    processIcons(__dirname, process.argv[2]);
}
