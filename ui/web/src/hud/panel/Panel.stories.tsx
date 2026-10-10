import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Text } from '../../typography';
import { Panel } from './Panel';
import { colorOptions as colors, fillVariantOptions as variants } from '../../storybook/controls';

const meta = { title: 'Hud/Panel', component: Panel } satisfies Meta<typeof Panel>;
export default meta;
type Story = StoryObj<typeof meta>;
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 } as const;

export const Playground: Story = { args: { color: 'primary', variant: 'fill-translucent', active: false, disabled: false, children: <Text>Preview</Text> } };
export const Gallery: Story = { render: () => <div style={{ display: 'grid', gap: 24 }}>{variants.map((variant) => <section key={variant} style={{ display: 'grid', gap: 10 }}><strong>{variant}</strong><div style={gridStyle}>{colors.map((color) => <Panel key={color} color={color} variant={variant}><Text>{color}</Text></Panel>)}</div></section>)}</div> };
export const InteractiveGlow: Story = { render: () => <div style={gridStyle}><Panel interactive color="primary"><Text>Default glow</Text></Panel><Panel interactive glowStyle="glow" color="secondary"><Text>Glow</Text></Panel><Panel interactive glowStyle="animate-borders-glow" color="tertiary"><Text>Borders</Text></Panel></div> };
export const States: Story = { render: () => <div style={gridStyle}><Panel active color="primary" variant="fill-inverse"><Text>Active</Text></Panel><Panel disabled color="primary" variant="fill-inverse"><Text>Disabled</Text></Panel></div> };
