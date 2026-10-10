import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Text } from '../../typography';
import { BevelPanel } from './BevelPanel';
import { colorOptions as colors, fillVariantOptions as variants } from '../../storybook/controls';

const meta = { title: 'Hud/BevelPanel', component: BevelPanel } satisfies Meta<typeof BevelPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 } as const;

export const Playground: Story = { args: { color: 'primary', variant: 'fill-translucent', size: 'md', children: <Text>Preview</Text> } };
export const Gallery: Story = { render: () => <div style={{ display: 'grid', gap: 24 }}>{variants.map((variant) => <section key={variant} style={{ display: 'grid', gap: 10 }}><strong>{variant}</strong><div style={gridStyle}>{colors.map((color) => <BevelPanel key={color} color={color} variant={variant} size="md"><Text>{color}</Text></BevelPanel>)}</div></section>)}</div> };
export const InteractiveGlow: Story = { render: () => <div style={gridStyle}><BevelPanel interactive color="primary" size="md"><Text>Default glow</Text></BevelPanel><BevelPanel interactive glowStyle="glow" color="secondary" size="md"><Text>Glow</Text></BevelPanel><BevelPanel interactive glowStyle="animate-borders-glow" color="tertiary" size="md"><Text>Borders</Text></BevelPanel></div> };
export const States: Story = { render: () => <div style={gridStyle}><BevelPanel active color="primary" variant="fill-inverse" size="md"><Text>Active</Text></BevelPanel><BevelPanel disabled color="primary" variant="fill-inverse" size="md"><Text>Disabled</Text></BevelPanel></div> };
export const TranslucentBackdrop: Story = { render: () => <div style={{ padding: 32, background: 'repeating-linear-gradient(45deg, #fff 0 12px, #111 12px 24px)' }}><BevelPanel color="primary" variant="fill-translucent" size="md"><Text>Colored blur over high contrast</Text></BevelPanel></div> };
