import { ComponentProps, useState } from 'react';
import { appearanceColorOptions, fillVariantOptions } from '@ui';
import { Popup } from './Popup';
import { Button } from '../../gizmos/button';
import { VariantGallery } from '../../storybook/VariantGallery';

export const PopupPreview = ({
    args,
    gallery = false,
}: {
    args: ComponentProps<typeof Popup>;
    gallery?: boolean;
}) => {
    const [active, setActive] = useState<ComponentProps<typeof Popup> | null>(
        null,
    );
    return (
        <>
            {gallery ? (
                <VariantGallery
                    colors={appearanceColorOptions}
                    sizes={['sm']}
                    variants={fillVariantOptions}
                    render={({ color, variant }) => (
                        <Button
                            color={color}
                            onPress={() =>
                                setActive({
                                    ...args,
                                    color,
                                    variant,
                                    shape: 'default',
                                    visible: true,
                                    onClose: () => setActive(null),
                                })
                            }
                        >
                            {color} / {variant}
                        </Button>
                    )}
                />
            ) : (
                <Button
                    onPress={() =>
                        setActive({
                            ...args,
                            visible: true,
                            onClose: () => setActive(null),
                        })
                    }
                >
                    Open popup
                </Button>
            )}
            {active && <Popup {...active} />}
        </>
    );
};
