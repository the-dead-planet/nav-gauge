import { FC, RefObject, useRef, useState } from "react";
import { HostInstance, StyleSheet } from "react-native";
import { ColorSelectFieldProps, useTheme } from "@ui";
import { Popup } from "../../popup";
import { ColorButton } from "../color-button";
import { ColorPicker } from "../color-picker";

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    popup: {
        width: 320,
        maxWidth: '90%',
        padding: 8,
        borderWidth: 1,
        borderRadius: 0,
    },
});

export const ColorSelectField: FC<ColorSelectFieldProps> = ({
    disabled = false,
    label = 'Color',
    value,
    opacityLabel,
    size = 'sm',
    variant = 'fill-inverse',
    onChange,
}) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HostInstance>(null);

    return (
        <>
            <ColorButton
                ref={anchorRef}
                value={value}
                label={label}
                size={size}
                selected={open}
                disabled={disabled}
                onPress={() => setOpen((current) => !current)}
            />
            <Popup
                visible={open}
                anchor={anchorRef as unknown as RefObject<HTMLElement | null>}
                triggerAnchor="bottom-left"
                popupAnchor="top-left"
                onClose={() => setOpen(false)}
                overlayStyle={styles.overlay}
                popupStyle={[
                    styles.popup,
                    {
                        backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                        borderColor: theme.componentColor('border'),
                    },
                ]}
            >
                <ColorPicker
                    label={label}
                    value={value}
                    opacityLabel={opacityLabel}
                    size={size}
                    variant={variant}
                    disabled={disabled}
                    onChange={onChange}
                />
            </Popup>
        </>
    );
};
