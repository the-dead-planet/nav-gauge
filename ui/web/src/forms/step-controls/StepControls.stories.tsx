import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { StepControls } from './StepControls';
import { NumberInput } from '../number-input';

const meta = {
    title: 'Forms/StepControls',
    component: StepControls,
} satisfies Meta<typeof StepControls>;

export default meta;

export const Default = {
    render: () => {
        const [value, setValue] = useState(5);
        return (
            <StepControls
                variant="fill-translucent"
                value={value}
                onChange={setValue}
                min={0}
                max={10}
            >
                <NumberInput value={value} onChange={setValue} showStepControls={false} />
            </StepControls>
        );
    },
};
