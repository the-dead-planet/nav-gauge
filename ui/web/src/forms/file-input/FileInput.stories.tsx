import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { FileInput } from './FileInput';
import { Text } from '../../typography';
import { ColorVariant } from '@ui';

const meta = {
    title: 'Forms/FileInput',
    component: FileInput,
} satisfies Meta<typeof FileInput>;

export default meta;

const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const Default = {
    render: () => (
        <div style={{ padding: 24 }}>
            <FileInput
                accept="*"
                fileName={null}
                fileLabel="Upload file"
                purgeLabel="Purge"
                cancelLabel="Cancel"
                noNameLabel="No file selected"
                onUpload={() => {}}
                onPurge={() => {}}
            />
        </div>
    ),
};

export const WithFile = {
    render: () => (
        <div style={{ padding: 24 }}>
            <FileInput
                accept="*"
                fileName="my-route.gpx"
                fileLabel="Upload file"
                purgeLabel="Purge"
                cancelLabel="Cancel"
                noNameLabel="No file selected"
                onUpload={() => {}}
                onPurge={() => {}}
            />
        </div>
    ),
};

export const Colors = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
            {allColors.map(color => (
                <FileInput
                    key={color}
                    accept="*"
                    color={color}
                    fileName={`route-${color}.gpx`}
                    fileLabel="Upload file"
                    purgeLabel="Purge"
                    cancelLabel="Cancel"
                    noNameLabel="No file selected"
                    onUpload={() => {}}
                    onPurge={() => {}}
                />
            ))}
        </div>
    ),
};

export const Interactive = {
    render: () => {
        const [fileName, setFileName] = useState<string | null>(null);
        const [color, setColor] = useState<ColorVariant>('primary');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, maxWidth: 480 }}>
                <FileInput
                    accept="*"
                    color={color}
                    fileName={fileName}
                    fileLabel="Upload file"
                    purgeLabel="Purge"
                    cancelLabel="Cancel"
                    noNameLabel="No file selected"
                    onUpload={(files) => setFileName(files[0]?.name ?? null)}
                    onPurge={() => setFileName(null)}
                />
                <Text>Current file: {fileName ?? 'none'}</Text>
                <div style={{ display: 'flex', gap: 8 }}>
                    {allColors.map(c => (
                        <label key={c}>
                            <input type="radio" name="color" checked={color === c} onChange={() => setColor(c)} />
                            {c}
                        </label>
                    ))}
                </div>
            </div>
        );
    },
};
