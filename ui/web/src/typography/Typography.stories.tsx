import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { FontType, ColorVariant } from '@ui';
import { H1, H2, H3, H4, H5, H6, Label, LinkText, P, Span, Text } from './';
import { TypographyPreview } from './TypographyPreview';

const colors: (ColorVariant | undefined)[] = [undefined, 'primary', 'secondary', 'tertiary', 'neutral'];
const variantLabels = ['Default', 'Primary', 'Secondary', 'Tertiary', 'Neutral'];

const meta = {
    title: 'Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextStory = {
    name: 'Text',
    args: {
        variant: 'body' as const,
        fontType: FontType.Default,
        shade: undefined,
        align: undefined,
        nowrap: false,
        shadow: false,
        tabular: false,
        bold: false,
        disabled: false,
        uppercase: false,
        children: 'The management of the dead planet wishes you a very fine day.',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['header', 'body', 'caption'],
        },
        as: {
            control: 'select',
            options: ['(auto)', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            mapping: { '(auto)': undefined },
        },
        color: {
            control: 'select',
            options: ['(default)', 'primary', 'secondary', 'tertiary', 'neutral'],
            mapping: { '(default)': undefined },
        },
        fontType: {
            control: 'select',
            options: Object.values(FontType),
        },
        shade: {
            control: 'select',
            options: ['(auto)', 100, 500, 900],
            mapping: { '(auto)': undefined },
        },
        align: {
            control: 'select',
            options: ['(default)', 'left', 'center', 'right'],
            mapping: { '(default)': undefined },
        },
        nowrap: { control: 'boolean' },
        shadow: { control: 'boolean' },
        tabular: { control: 'boolean' },
        bold: { control: 'boolean' },
        uppercase: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args: Record<string, unknown>) => (
        <Text
            variant={args.variant as 'header' | 'body' | 'caption'}
            as={args.as as 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | undefined}
            color={args.color as 'primary' | 'secondary' | 'tertiary' | 'neutral' | undefined}
            fontType={args.fontType as FontType}
            shade={args.shade as 100 | 500 | 900 | undefined}
            align={args.align as 'left' | 'center' | 'right' | undefined}
            nowrap={args.nowrap as boolean}
            shadow={args.shadow as boolean}
            tabular={args.tabular as boolean}
            bold={args.bold as boolean}
            uppercase={args.uppercase as boolean}
            disabled={args.disabled as boolean}
            style={{ maxWidth: 240 }}
        >
            {args.children as string}
        </Text>
    ),
} satisfies StoryObj;

export const Labels: Story = {
    render: () => (
        <TypographyPreview>{(props) => <Label color="primary" {...props}>Label</Label>}</TypographyPreview>
    ),
};

export const Spacing: Story = {
    render: () => (
        <Text color="primary" bold uppercase m="sm" p="md">
            Bold uppercase text with margin and padding
        </Text>
    ),
};

export const ExternalLink: Story = {
    render: () => (
        <TypographyPreview>{(props) => (
            <LinkText href="https://openstreetmap.org/copyright" {...props}>OpenStreetMap copyright</LinkText>
        )}</TypographyPreview>
    ),
};

export const All = {
    render: () => {
        const [fontType, setFontType] = useState<FontType>(FontType.Default);

        return (
            <TypographyPreview>{(typographyProps) => <div>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label htmlFor="font-select" style={{ fontWeight: 700 }}>Font Type:</label>
                    <select
                        id="font-select"
                        value={fontType}
                        onChange={(e) => setFontType(e.target.value as FontType)}
                        style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: 14 }}
                    >
                        {Object.values(FontType).map((ft) => (
                            <option key={ft} value={ft}>
                                {ft}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${colors.length}, max-content)`,
                    gap: '16px 32px',
                    alignItems: 'center',
                }}>
                    {colors.map((color, i) => (
                        <h5 key={color} style={{ margin: 0 }}>{variantLabels[i]}</h5>
                    ))}
                    {(['P', 'Span', 'Label', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const).map((Tag) => (
                        colors.map((color) => {
                            const Component = { P, Span, Label, H1, H2, H3, H4, H5, H6 }[Tag];

                            return (
                                <Component
                                    key={`${Tag}-${color}`}
                                    color={color}
                                    fontType={fontType}
                                    {...typographyProps}
                                >
                                    {Tag}{color ? ` (${color})` : ''}
                                </Component>
                            );
                        })
                    ))}
                </div>
            </div>}</TypographyPreview>
        );
    },
} satisfies Story;
