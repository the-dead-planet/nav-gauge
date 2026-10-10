import { ComponentProps, FC, useState } from 'react';
import { VariantGallery } from '../../storybook/VariantGallery';
import { TextInput } from './TextInput';

const GalleryTextInput: FC<ComponentProps<typeof TextInput>> = (props) => {
    const [value, setValue] = useState(props.value);

    return <TextInput {...props} value={value} onChange={setValue} />;
};

export const Playground: FC = () => {
    const [value, setValue] = useState('Hello');

    return (
        <TextInput
            label="Label"
            value={value}
            contentShade={700}
            highlightContentShade={200}
            onChange={setValue}
        />
    );
};

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <GalleryTextInput
                label="Label"
                value="Text"
                onChange={() => {}}
                color={color}
                size={size}
                variant={variant}
            />
        )}
    />
);
