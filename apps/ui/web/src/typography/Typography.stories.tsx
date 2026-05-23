import { useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { FontType, TypographyVariant } from '@ui';
import { H1, H2, H3, H4, H5, H6, P, Span } from './';

const variants: (TypographyVariant | undefined)[] = [undefined, 'primary', 'secondary', 'tertiary', 'neutral'];
const variantLabels = ['Default', 'Primary', 'Secondary', 'Tertiary', 'Neutral'];

const meta = {
    title: 'Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const All = {
    render: () => {
        const [fontType, setFontType] = useState<FontType>(FontType.Default);

        return (
            <div>
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
                    gridTemplateColumns: `repeat(${variants.length}, max-content)`,
                    gap: '16px 32px',
                    alignItems: 'center',
                }}>
                    {variants.map((variant, i) => (
                        <h5 key={variant} style={{ margin: 0 }}>{variantLabels[i]}</h5>
                    ))}
                    {(['P', 'Span', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const).map((Tag) => (
                        variants.map((variant) => {
                            const Component = { P, Span, H1, H2, H3, H4, H5, H6 }[Tag];

                            return (
                                <Component key={`${Tag}-${variant}`} variant={variant} fontType={fontType}>
                                    {Tag}{variant ? ` (${variant})` : ''}
                                </Component>
                            );
                        })
                    ))}
                </div>
            </div>
        );
    },
} satisfies Story;
