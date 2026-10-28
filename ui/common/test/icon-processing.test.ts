import { expect } from 'chai';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { processIcons } from '../src/design-system/icons/svg/noun-project/process-icons';
import { RegistryEntry } from '../src/design-system/icons/svg/noun-project/model';

const rawIcon = (creator: string): string =>
    `<svg xmlns="http://www.w3.org/2000/svg"><path fill="black" d="M0 0h10v10H0z"/><text>Created by ${creator} from Noun Project</text></svg>`;

describe('Icon processing', () => {
    let directory: string;

    beforeEach(() => {
        directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nav-gauge-icons-'));
        fs.mkdirSync(path.join(directory, 'raw'));
    });

    afterEach(() => {
        fs.rmSync(directory, { recursive: true, force: true });
    });

    it('updates or appends only the requested icon and preserves unrelated registry entries and outputs', () => {
        fs.writeFileSync(
            path.join(directory, 'raw/first.svg'),
            rawIcon('Alice'),
        );
        fs.writeFileSync(
            path.join(directory, 'raw/second.svg'),
            rawIcon('Bob'),
        );
        processIcons(directory);

        const registryFile = path.join(directory, 'icon-registry.json');
        const originalRegistry: RegistryEntry[] = JSON.parse(
            fs.readFileSync(registryFile, 'utf8'),
        );
        const secondOutput = fs.readFileSync(
            path.join(directory, 'output/second.svg'),
            'utf8',
        );
        fs.writeFileSync(
            path.join(directory, 'raw/second.svg'),
            'invalid SVG must not be processed',
        );
        fs.writeFileSync(
            path.join(directory, 'raw/first.svg'),
            rawIcon('Carol'),
        );
        processIcons(directory, 'first');

        const updatedRegistry: RegistryEntry[] = JSON.parse(
            fs.readFileSync(registryFile, 'utf8'),
        );
        expect(updatedRegistry).to.deep.equal([
            { ...originalRegistry[0], creator: 'Carol' },
            originalRegistry[1],
        ]);
        expect(
            fs.readFileSync(path.join(directory, 'output/second.svg'), 'utf8'),
        ).to.equal(secondOutput);
        expect(
            fs.readFileSync(path.join(directory, 'output/first.svg'), 'utf8'),
        ).to.include('viewBox="-2 -2.5 14 15"');
        expect(
            fs.readFileSync(path.join(directory, 'output/first.svg'), 'utf8'),
        ).not.to.include('<text');

        fs.writeFileSync(
            path.join(directory, 'raw/third.svg'),
            rawIcon('Dave'),
        );
        processIcons(directory, 'third');
        const appendedRegistry: RegistryEntry[] = JSON.parse(
            fs.readFileSync(registryFile, 'utf8'),
        );
        expect(appendedRegistry.slice(0, 2)).to.deep.equal(updatedRegistry);
        expect(appendedRegistry[2]).to.include({
            id: 'third',
            creator: 'Dave',
        });

        fs.writeFileSync(
            path.join(directory, 'raw/second.svg'),
            rawIcon('Bob'),
        );
        fs.unlinkSync(path.join(directory, 'raw/third.svg'));
        processIcons(directory);
        expect(JSON.parse(fs.readFileSync(registryFile, 'utf8'))).to.deep.equal(
            updatedRegistry,
        );
    });

    it('rejects invalid and missing names before writing outputs', () => {
        for (const name of ['', '../first', 'first.svg', 'first/second']) {
            expect(() => processIcons(directory, name)).to.throw(
                'Expected an icon name',
            );
        }
        expect(() => processIcons(directory, 'missing')).to.throw(
            'Icon not found: raw/missing.svg',
        );
        expect(fs.readdirSync(directory)).to.deep.equal(['raw']);
    });
});
