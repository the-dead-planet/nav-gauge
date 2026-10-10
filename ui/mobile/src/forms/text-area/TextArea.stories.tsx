import { ComponentProps, FC, useState } from 'react';
import { VariantGallery } from '../../storybook/VariantGallery';
import { TextArea } from './TextArea';

const GalleryTextArea: FC<ComponentProps<typeof TextArea>> = (props) => {
    const [value, setValue] = useState(String(props.value));

    return <TextArea {...props} value={value} onChangeText={setValue} />;
};

export const Playground: FC = () => {
    const [value, setValue] = useState('Some text');

    return (
        <TextArea
            label="Label"
            value={value}
            contentShade={700}
            highlightContentShade={200}
            onChangeText={setValue}
        />
    );
};

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <GalleryTextArea
                label="Label"
                value="Text"
                color={color}
                size={size}
                variant={variant}
            />
        )}
    />
);
