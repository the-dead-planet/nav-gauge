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
        <FlexBox direction="column" gap="xl">
            <span style={{ fontWeight: 700 }}>cols equal</span>
            <Grid cols="equal-2" gap="sm">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>2</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>3</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>4</span>
            </Grid>
            <Grid cols="equal-3" gap="xs">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>2</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>3</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>cols max-content</span>
            <Grid cols="max-content-3" gap="sm">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>short</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>much longer text</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>mid</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>rows equal</span>
            <Grid cols="equal-2" gap="sm">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>A</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>B</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>C</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>D</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>justifyContent</span>
            <Grid cols="equal-2" gap="xs" justifyContent="center">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>2</span>
            </Grid>
            <Grid cols="equal-2" gap="xs" justifyContent="space-between">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>2</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>alignItems</span>
            <div style={{ height: 80 }}>
                <Grid cols="equal-3" gap="xs" alignItems="center">
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-border)' }}>A</span>
                    <span style={{ padding: '12px 8px', border: '1px solid var(--color-border)' }}>B</span>
                    <span style={{ padding: '24px 8px', border: '1px solid var(--color-border)' }}>C</span>
                </Grid>
            </div>
            <span style={{ fontWeight: 700, marginTop: 8 }}>gap</span>
            <Grid cols="equal-2" gap="md">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>gap md</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>gap md</span>
            </Grid>
            <Grid cols="equal-2" colGap="lg" rowGap="sm">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>col lg row sm</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>col lg row sm</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>col lg row sm</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-border)' }}>col lg row sm</span>
            </Grid>
        </FlexBox>
    ),
} satisfies Story;
