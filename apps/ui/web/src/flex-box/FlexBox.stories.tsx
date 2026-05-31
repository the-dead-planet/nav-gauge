import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { FlexBox } from './FlexBox';
import { FlexBoxProps } from '@ui';

const meta = {
    title: 'FlexBox',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const directions: Array<FlexBoxProps['direction']> = ['row', 'column', 'row-reverse', 'column-reverse'];
const justifyOptions: Array<FlexBoxProps['justifyContent']> = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
const alignOptions: Array<FlexBoxProps['alignItems']> = ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'];

export const All = {
    render: () => (
        <FlexBox direction="column" gap="24px">
            {directions.map((direction) => (
                <FlexBox key={direction} direction="column" gap="8px">
                    <span style={{ fontWeight: 700 }}>direction: {direction}</span>
                    <FlexBox direction={direction} gap="8px">
                        <span style={{ padding: '4px 12px', border: '1px solid var(--color-border)' }}>1</span>
                        <span style={{ padding: '4px 12px', border: '1px solid var(--color-border)' }}>2</span>
                        <span style={{ padding: '4px 12px', border: '1px solid var(--color-border)' }}>3</span>
                    </FlexBox>
                </FlexBox>
            ))}
            <span style={{ fontWeight: 700, marginTop: 16 }}>justifyContent</span>
            {justifyOptions.map((j) => (
                <FlexBox key={j} direction="column" gap="4px">
                    <span style={{ fontSize: 12 }}>{j}</span>
                    <FlexBox justifyContent={j} gap="4px">
                        <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>A</span>
                        <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>B</span>
                        <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>C</span>
                    </FlexBox>
                </FlexBox>
            ))}
            <span style={{ fontWeight: 700, marginTop: 16 }}>alignItems</span>
            {alignOptions.map((a) => (
                <FlexBox key={a} direction="column" gap="4px">
                    <span style={{ fontSize: 12 }}>{a}</span>
                    <div style={{ height: 60 }}>
                        <FlexBox alignItems={a} gap="4px">
                            <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>S</span>
                            <span style={{ padding: '12px 8px', border: '1px solid var(--color-border)' }}>M</span>
                            <span style={{ padding: '24px 8px', border: '1px solid var(--color-border)' }}>L</span>
                        </FlexBox>
                    </div>
                </FlexBox>
            ))}
            <span style={{ fontWeight: 700, marginTop: 16 }}>gap</span>
            <FlexBox direction="column" gap="8px">
                <FlexBox gap="8px">
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>gap 8</span>
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>gap 8</span>
                </FlexBox>
                <FlexBox gap="24px">
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>gap 24</span>
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>gap 24</span>
                </FlexBox>
                <FlexBox colGap="8px" rowGap="16px">
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>col 8 row 16</span>
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>col 8 row 16</span>
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>col 8 row 16</span>
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>col 8 row 16</span>
                </FlexBox>
            </FlexBox>
        </FlexBox>
    ),
} satisfies Story;
