import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Grid } from './Grid';
import { FlexBox } from '../flex-box/FlexBox';

const meta = {
    title: 'Chassis/Grid',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const All = {
    render: () => (
        <FlexBox direction="column" gap="xl">
            <span style={{ fontWeight: 700 }}>cols equal</span>
            <Grid cols="equal-2" gap="sm">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>2</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>3</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>4</span>
            </Grid>
            <Grid cols="equal-3" gap="xs">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>2</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>3</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>cols max-content</span>
            <Grid cols="max-content-3" gap="sm">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>short</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>much longer text</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>mid</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>rows equal</span>
            <Grid cols="equal-2" gap="sm">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>A</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>B</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>C</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>D</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>justifyContent</span>
            <Grid cols="equal-2" gap="xs" justifyContent="center">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>2</span>
            </Grid>
            <Grid cols="equal-2" gap="xs" justifyContent="space-between">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>1</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>2</span>
            </Grid>
            <span style={{ fontWeight: 700, marginTop: 8 }}>alignItems</span>
            <div style={{ height: 80 }}>
                <Grid cols="equal-3" gap="xs" alignItems="center">
                    <span style={{ padding: '4px 8px', border: '1px solid var(--color-neutral-500)' }}>A</span>
                    <span style={{ padding: '12px 8px', border: '1px solid var(--color-neutral-500)' }}>B</span>
                    <span style={{ padding: '24px 8px', border: '1px solid var(--color-neutral-500)' }}>C</span>
                </Grid>
            </div>
            <span style={{ fontWeight: 700, marginTop: 8 }}>gap</span>
            <Grid cols="equal-2" gap="md">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>gap md</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>gap md</span>
            </Grid>
            <Grid cols="equal-2" colGap="lg" rowGap="sm">
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>col lg row sm</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>col lg row sm</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>col lg row sm</span>
                <span style={{ padding: '8px 12px', border: '1px solid var(--color-neutral-500)' }}>col lg row sm</span>
            </Grid>
        </FlexBox>
    ),
} satisfies Story;
