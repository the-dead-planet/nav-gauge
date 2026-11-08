import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { makeLiveEditStory } from 'storybook-addon-code-editor';
import { appearanceColorOptions, buttonCorners, buttonStoryArgs, buttonStoryControls, Icons } from '@ui';
import { Button } from './Button';
import styles from './button-stories.module.css';
import { VariantGallery } from '../../storybook/VariantGallery';
import {
    surfaceVariantOptions,
} from '../../storybook/controls';

const meta = {
    title: 'Gizmos/Button',
    component: Button,
    args: {
        ...buttonStoryArgs,
        icon: Icons.Beaker,
    },
    argTypes: {
        ...buttonStoryControls,
        icon: {
            control: 'select',
            options: ['None', 'Beaker', 'Light bulb'],
            mapping: {
                None: undefined,
                Beaker: Icons.Beaker,
                'Light bulb': Icons.NounProject.LightBulbCogWheel,
            },
        },
        onClick: { control: false },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: 'Playground with Live code editor',
};

export const Captions: Story = {
    args: {
        children: undefined,
        corners: 'circle',
        size: 'md',
    },
    render: (args) => (
        <div className={styles['caption-row']}>
            <Button {...args} icon={Icons.RecordCapture} caption="Record" aria-label="Start recording" />
            <Button {...args} icon={Icons.NounProject.PauseRecording} caption="Pause recording" aria-label="Pause recording" />
            <Button {...args} icon={Icons.Beaker} aria-label="Without caption" />
        </div>
    ),
};

export const HexagonCaption: Story = {
    args: {
        children: undefined,
        corners: 'hexagon',
        caption: 'Record',
        tooltip: 'Record',
        size: 'md',
    },
    render: (args) => <Button {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { '@web-ui': { Button } },
    code: `import { Button } from '@web-ui';

export default Button;`,
    modifyEditor: (monaco) => monaco.editor.setTheme('vs-dark'),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        corners: { table: { disable: true } },
    },
    render: (args) => (
        <div style={{ display: 'grid', gap: 40 }}>
            {buttonCorners.map((corners) => (
                <section key={corners}>
                    <h2>{corners}</h2>
                    <VariantGallery
                        size={args.size}
                        colors={appearanceColorOptions}
                        variants={surfaceVariantOptions}
                        render={({ color, size, variant }) => (
                        <Button
                            {...args}
                            color={color}
                            size={size}
                            variant={variant}
                            corners={corners}
                            title={`Color: ${color}`}
                            aria-label={corners === 'square' ? undefined : `${corners} button`}
                        >
                            {corners === 'square' ? args.children : null}
                        </Button>
                        )}
                    />
                </section>
            ))}
        </div>
    ),
};
