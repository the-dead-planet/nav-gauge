import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { H1, H2, H3, H4, H5, H6, P, Span, TypographyVariant } from './';

const variants: (TypographyVariant | undefined)[] = [undefined, 'primary', 'secondary', 'tertiary', 'neutral'];
const variantLabels = ['Default', 'Primary', 'Secondary', 'Tertiary', 'Neutral'];

const meta = {
    title: 'Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const All = {
    render: () => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${variants.length}, max-content)`,
            gap: '16px 32px',
            alignItems: 'center',
        }}>
            {variants.map((variant, i) => (
                <H5 key={variant}>{variantLabels[i]}</H5>
            ))}
            {(['P', 'Span', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const).map((Tag) => (
                variants.map((variant) => {
                    const Component = { P, Span, H1, H2, H3, H4, H5, H6 }[Tag];
                    return (
                        <Component key={`${Tag}-${variant}`} variant={variant}>
                            {Tag}
                        </Component>
                    );
                })
            ))}
        </div>
    ),
} satisfies Story;
