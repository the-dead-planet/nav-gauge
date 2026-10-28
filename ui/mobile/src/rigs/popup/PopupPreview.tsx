import { ComponentProps, RefObject, useRef, useState } from 'react';
import { ViewInstance } from 'react-native';
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
    const anchors = useRef<Record<string, ViewInstance | null>>({});
    const [active, setActive] = useState<ComponentProps<typeof Popup> | null>(
        null,
    );
    const openPopup = (key: string, props: ComponentProps<typeof Popup>) => {
        setActive({
            ...props,
            position: undefined,
            anchor: {
                current: anchors.current[key],
            } as unknown as RefObject<HTMLElement | null>,
            visible: true,
            onClose: () => setActive(null),
        });
    };
    return (
        <>
            {gallery ? (
                <VariantGallery
                    colors={appearanceColorOptions}
                    variants={fillVariantOptions}
                    render={({ color, variant }) => (
                        <Button
                            forwardRef={(element) => {
                                anchors.current[`${color}-${variant}`] =
                                    element;
                            }}
                            color={color}
                            onPress={() =>
                                openPopup(`${color}-${variant}`, {
                                    ...args,
                                    color,
                                    variant,
                                })
                            }
                        >
                            {color} / {variant}
                        </Button>
                    )}
                />
            ) : (
                <Button
                    forwardRef={(element) => {
                        anchors.current.preview = element;
                    }}
                    onPress={() => openPopup('preview', args)}
                >
                    Open popup
                </Button>
            )}
            {active && <Popup {...active} />}
        </>
    );
};
