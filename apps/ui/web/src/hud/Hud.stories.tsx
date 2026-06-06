import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Hexagon } from './Hexagon';
import { FlexBox } from '../flex-box/FlexBox';

const meta = {
    title: 'Hud',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hexagons = {
    render: () => (
        <FlexBox direction="column" gap="xl">
            <span style={{ fontWeight: 700 }}>glow (default)</span>
            <FlexBox gap="md" alignItems="center">
                <Hexagon variant="pointy-top" interactive color="primary" style={{ width: 100 }}>
                    <span>1</span>
                </Hexagon>
                <Hexagon variant="flat-top" interactive hoverStyle="glow" color="secondary" style={{ width: 100 }}>
                    <span>2</span>
                </Hexagon>
            </FlexBox>

            <span style={{ fontWeight: 700 }}>fill</span>
            <FlexBox gap="md" alignItems="center">
                <Hexagon variant="pointy-top" interactive hoverStyle="fill" color="primary" style={{ width: 100 }}>
                    <span>1</span>
                </Hexagon>
                <Hexagon variant="flat-top" interactive hoverStyle="fill" color="secondary" style={{ width: 100 }}>
                    <span>2</span>
                </Hexagon>
                <Hexagon interactive hoverStyle="fill" color="tertiary" style={{ width: 100 }} />
            </FlexBox>

            <span style={{ fontWeight: 700 }}>animate-borders-glow</span>
            <FlexBox gap="md" alignItems="center">
                <Hexagon variant="pointy-top" interactive hoverStyle="animate-borders-glow" color="primary" style={{ width: 100 }}>
                    <span>1</span>
                </Hexagon>
                <Hexagon variant="flat-top" interactive hoverStyle="animate-borders-glow" color="secondary" style={{ width: 100 }}>
                    <span>2</span>
                </Hexagon>
            </FlexBox>

            <span style={{ fontWeight: 700 }}>sizes</span>
            <FlexBox gap="md" alignItems="center">
                <Hexagon interactive color="tertiary" style={{ width: 60 }} />
                <Hexagon interactive color="tertiary" style={{ width: 100 }} />
                <Hexagon interactive color="tertiary" style={{ width: 140 }} />
            </FlexBox>
            <span style={{ fontWeight: 700 }}>stroke width</span>
            <FlexBox gap="md" alignItems="center">
                <Hexagon interactive strokeWidth={1} color="primary" style={{ width: 100 }} />
                <Hexagon interactive strokeWidth={3} color="primary" style={{ width: 100 }} />
                <Hexagon interactive strokeWidth={5} color="primary" style={{ width: 100 }} />
            </FlexBox>
        </FlexBox>
    ),
} satisfies Story;
