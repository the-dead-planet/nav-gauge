import { FC, useState } from 'react';
import { ColorVariant, FillVariant, Icons, SizeVariant, Theme } from '@ui';
import { ColorBox } from '../colors';
import { VariantGallery } from '../storybook/VariantGallery';
import { Dropdown } from './Dropdown';

const options = [
    { value: 'brass', label: 'Brass Cog', prepend: <ColorBox color={Theme.palette.copper} />, icon: Icons.Beaker },
    { value: 'copper', label: 'Copper Valve', icon: Icons.Beaker },
    { value: 'steam', label: 'Steam Pipe', icon: Icons.Beaker },
    { value: 'gear', label: 'Gear Assembly', icon: Icons.Beaker },
];

const GalleryDropdown: FC<{
    color: ColorVariant;
    variant: FillVariant;
    size: SizeVariant;
}> = ({ color, variant, size }) => {
    const [value, setValue] = useState('brass');

    return (
        <Dropdown
            value={value}
            options={options}
            onChange={setValue}
            color={color}
            highlightColor={color}
            contentShade={700}
            highlightContentShade={200}
            variant={variant}
            size={size}
        />
    );
};

export const Playground: FC = () => {
    const [value, setValue] = useState('brass');

    return <Dropdown value={value} options={options} onChange={setValue} />;
};

export const Gallery: FC = () => (
    <VariantGallery render={(appearance) => <GalleryDropdown {...appearance} />} />
);
