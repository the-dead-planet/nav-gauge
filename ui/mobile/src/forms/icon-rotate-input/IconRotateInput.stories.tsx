import { FC, useState } from 'react';
import { Icons } from '@ui';
import { IconRotateInput } from './IconRotateInput';
import { VariantGallery } from '../../storybook/VariantGallery';

export const Gallery: FC = () => (
    <VariantGallery
        variants={['default']}
        render={({ color, size }) => (
            <IconRotateInput
                icon={Icons.NounProject.CameraVideoFront}
                value={45}
                onChange={() => {}}
                color={color}
                size={size}
            />
        )}
    />
);

export const Playground: FC = () => {
    const [value, setValue] = useState(45);

    return <IconRotateInput icon={Icons.NounProject.CameraVideoFront} value={value} onChange={setValue} />;
};
