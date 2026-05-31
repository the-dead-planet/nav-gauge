import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Grid } from './Grid';
import { FlexBox } from '../flex-box/FlexBox';

const meta = {
    title: 'Grid',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const All = {
    render: () => (
        <FlexBox direction="column" gap="24px">
            <span style={{ fontWeight: 700 }}>cols</span>
            <Grid cols="1fr 1fr" gap="8px">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>2</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>3</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>4</span>
            </Grid>
            <Grid cols="repeat(3, 1fr)" gap="4px">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>2</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>3</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>rows</span>
            <Grid cols="1fr 1fr" rows="40px 60px" gap="8px">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>A</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>B</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>C</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>D</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>templateAreas</span>
            <Grid
                cols="1fr 1fr 1fr"
                rows="auto auto"
                gap="8px"
                templateAreas={`"header header header" "sidebar main main"`}
            >
                <span style={{ gridArea: 'header', padding: '8px 12px', textAlign: 'center', border: '1px solid var(--color-border)' }}>header</span>
                <span style={{ gridArea: 'sidebar', padding: '8px 12px', border: '1px solid var(--color-border)' }}>sidebar</span>
                <span style={{ gridArea: 'main', padding: '8px 12px', border: '1px solid var(--color-border)' }}>main</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>justifyContent</span>
            <Grid cols="80px 80px" gap="4px" justifyContent="center">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>2</span>
            </Grid>
            <Grid cols="80px 80px" gap="4px" justifyContent="space-between">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>2</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>alignItems</span>
            <div style={{ height: 80 }}>
                <Grid cols="1fr 1fr 1fr" gap="4px" alignItems="center">
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>A</span>
                    <span style={{ padding: '12px 8px', border: '1px solid var(--color-border)' }}>B</span>
                    <span style={{ padding: '24px 8px', border: '1px solid var(--color-border)' }}>C</span>
                </Grid>
            </div>
            <span style={{ fontWeight: 700, marginTop: 8 }}>gap</span>
            <Grid cols="1fr 1fr" gap="16px">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>gap 16</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>gap 16</span>
            </Grid>
            <Grid cols="1fr 1fr" colGap="24px" rowGap="8px">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>col 24 row 8</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>col 24 row 8</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>col 24 row 8</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>col 24 row 8</span>
            </Grid>
        </FlexBox>
    ),
} satisfies Story;
