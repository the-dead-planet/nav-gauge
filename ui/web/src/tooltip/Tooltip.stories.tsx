import type { Meta } from 'storybook-react-rsbuild';
import { ColorVariant, Icons, SurfaceFillVariant, TooltipPlacement } from '@ui';
import { Tooltip } from './Tooltip';
import { Button } from '../button';
import { Text } from '../typography';

const meta = {
    title: 'Tooltip',
    component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;

const allPlacements: TooltipPlacement[] = ['top', 'bottom', 'left', 'right', 'auto'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const Placements = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 48 }}>
            <Text>Hover or focus the buttons to see tooltips.</Text>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {allPlacements.map((placement) => (
                    <Tooltip key={placement} content={`${placement} tooltip`} placement={placement}>
                        <Button icon={Icons.Beaker} variant="ghost" color="primary" corners="circle">
                            {placement}
                        </Button>
                    </Tooltip>
                ))}
            </div>
        </div>
    ),
};

export const Colors = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 48 }}>
            <Text>Color variants</Text>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {allColors.map((color) => (
                    <Tooltip key={color} content={`${color} tooltip`} color={color} placement="top">
                        <Button icon={Icons.Beaker} variant="ghost" color={color} corners="circle">
                            {color}
                        </Button>
                    </Tooltip>
                ))}
            </div>
        </div>
    ),
};

export const Variants = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 48 }}>
            <Text>Fill variants</Text>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {allVariants.map((variant) => (
                    <Tooltip key={variant} content={`${variant} style`} variant={variant} placement="top">
                        <Button icon={Icons.Beaker} variant="ghost" color="primary" corners="circle">
                            {variant}
                        </Button>
                    </Tooltip>
                ))}
            </div>
        </div>
    ),
};

export const AutoDemo = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 48, height: '90vh', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tooltip content="Auto (near left edge)" placement="auto">
                    <Button icon={Icons.Beaker} variant="ghost" color="primary" corners="circle" />
                </Tooltip>
                <Tooltip content="Auto (near right edge)" placement="auto">
                    <Button icon={Icons.Beaker} variant="ghost" color="primary" corners="circle" />
                </Tooltip>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tooltip content="Auto (centered)" placement="auto">
                    <Button icon={Icons.Beaker} variant="ghost" color="primary" corners="circle" />
                </Tooltip>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Tooltip content="Auto (near bottom-left)" placement="auto">
                    <Button icon={Icons.Beaker} variant="ghost" color="primary" corners="circle" />
                </Tooltip>
                <Tooltip content="Auto (near bottom-right)" placement="auto">
                    <Button icon={Icons.Beaker} variant="ghost" color="primary" corners="circle" />
                </Tooltip>
            </div>
        </div>
    ),
};

export const ShowConnection = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 48 }}>
            <Text>Tooltips with connection lines</Text>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {allPlacements.map((placement) => (
                    <Tooltip key={placement} content={`${placement} with line`} placement={placement} showConnection>
                        <Button icon={Icons.Beaker} variant="ghost" color="primary" corners="circle">
                            {placement}
                        </Button>
                    </Tooltip>
                ))}
            </div>
        </div>
    ),
};
