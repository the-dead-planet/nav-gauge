import { ComponentType, FC, useCallback, useMemo, useRef, useState } from "react";
import {
    LayoutChangeEvent,
    PanResponder,
    View,
    ViewStyle,
} from "react-native";
import { IconRotateInputProps, useTheme } from "@ui";
import { SvgProps } from "react-native-svg";
import { RotationArrows } from "./RotationArrows";
import { RotateIconWrapper } from "./RotateIconWrapper";
import { RotateLabel } from "./RotateLabel";

interface Props extends Omit<IconRotateInputProps, 'icon'> {
    icon?: ComponentType<SvgProps>;
    style?: ViewStyle;
}

const sizeMap: Record<string, number> = { xs: 36, sm: 48, md: 60 };
const iconSizes: Record<string, number> = { xs: 12, sm: 20, md: 32 };

export const IconRotateInput: FC<Props> = ({
    icon,
    angle = 0,
    onAngleChange,
    color = 'neutral',
    highlightColor,
    size = 'md',
    min = 0,
    max = 360,
    step = 1,
    disabled = false,
    label,
    style,
}) => {
    const theme = useTheme();
    const activeHighlight = highlightColor || color;
    const svgSize = sizeMap[size];
    const center = svgSize / 2;
    const outerRadius = center - 4;
    const iconSize = iconSizes[size];

    const [isDragging, setIsDragging] = useState(false);
    const [displayAngle, setDisplayAngle] = useState(angle);
    const [displayWrapped, setDisplayWrapped] = useState(angle);
    const svgRef = useRef<View>(null);
    const svgPageCenterRef = useRef({ x: 0, y: 0 });
    const angleRef = useRef(angle);
    angleRef.current = angle;
    const onAngleChangeRef = useRef(onAngleChange);
    onAngleChangeRef.current = onAngleChange;
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;
    const prevMouseAngleRef = useRef(0);
    const displayAngleRef = useRef(angle);
    displayAngleRef.current = displayAngle;

    if (!isDragging && angle !== angleRef.current) {
        setDisplayAngle(angle);
        setDisplayWrapped(angle);
    }

    const snapAngle = useCallback((raw: number): number => {
        if (max - min >= 360) {
            const stepped = Math.round(raw / step) * step;
            return ((stepped % 360) + 360) % 360;
        }
        const stepped = Math.round((raw - min) / step) * step + min;
        return Math.min(max, Math.max(min, stepped));
    }, [min, max, step]);

    const handleLayout = useCallback((_e: LayoutChangeEvent) => {
        svgRef.current?.measureInWindow((x, y, width, height) => {
            svgPageCenterRef.current = {
                x: x + width / 2,
                y: y + height / 2,
            };
        });
    }, []);

    const handleInteraction = useCallback((pageX: number, pageY: number) => {
        if (disabledRef.current) {
            return;
        }
        const { x: cx, y: cy } = svgPageCenterRef.current;
        const dx = pageX - cx;
        const dy = pageY - cy;
        const svgDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        const currentMouseAngle = ((svgDeg + 90) % 360 + 360) % 360;
        const prevAngle = prevMouseAngleRef.current;
        let delta = currentMouseAngle - prevAngle;
        if (delta > 180) {
            delta -= 360;
        }
        if (delta < -180) {
            delta += 360;
        }
        prevMouseAngleRef.current = currentMouseAngle;
        const newDisplay = displayAngleRef.current + delta;
        const wrapped = snapAngle(newDisplay);
        displayAngleRef.current = newDisplay;
        setDisplayAngle(newDisplay);
        if (wrapped !== angleRef.current) {
            angleRef.current = wrapped;
            setDisplayWrapped(wrapped);
            onAngleChangeRef.current?.(wrapped);
        }
    }, [snapAngle]);

    const contextRef = useRef({ handleInteraction });
    contextRef.current = { handleInteraction };

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderGrant: (evt) => {
            if (disabledRef.current) {
                return;
            }
            setIsDragging(true);
            const { pageX, pageY } = evt.nativeEvent;
            const { x: cx, y: cy } = svgPageCenterRef.current;
            const dx = pageX - cx;
            const dy = pageY - cy;
            const svgDeg = Math.atan2(dy, dx) * (180 / Math.PI);
            prevMouseAngleRef.current = ((svgDeg + 90) % 360 + 360) % 360;
        },
        onPanResponderMove: (evt) => {
            if (disabledRef.current) {
                return;
            }
            contextRef.current.handleInteraction(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        },
        onPanResponderRelease: () => {
            setIsDragging(false);
        },
        onPanResponderTerminate: () => {
            setIsDragging(false);
        },
    }), []);

    const isLight = theme.isLight;

    const colorBase = theme.color(color, 500);
    const hlLight = theme.color(activeHighlight, 300);

    const ringStroke = isDragging ? hlLight : theme.color(color, 500, isLight ? 0.3 : 0.4);
    const arrowStroke = isDragging ? hlLight : colorBase;

    const iconColor = colorBase;

    return (
        <View
            style={[{
                alignItems: 'center',
                opacity: disabled ? 0.4 : 1,
            }, style]}
        >
            <View
                ref={svgRef}
                onLayout={handleLayout}
                collapsable={false}
                style={{ width: svgSize, height: svgSize }}
                {...panResponder.panHandlers}
            >
                <RotationArrows
                    svgSize={svgSize}
                    center={center}
                    outerRadius={outerRadius}
                    ringStroke={ringStroke}
                    arrowStroke={arrowStroke}
                />

                <RotateIconWrapper
                    icon={icon}
                    iconSize={iconSize}
                    svgSize={svgSize}
                    displayAngle={displayAngle}
                    iconColor={iconColor}
                />
            </View>

            <RotateLabel
                label={label}
                displayWrapped={displayWrapped}
                icon={icon}
            />
        </View>
    );
};
