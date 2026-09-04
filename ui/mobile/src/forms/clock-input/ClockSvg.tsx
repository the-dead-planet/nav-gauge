import { FC, ReactNode, useMemo, useRef, useState } from "react";
import {
    PanResponder,
    View,
} from "react-native";
import Svg, { G } from "react-native-svg";
import { snapSlice, svgAtan2ToClockAngle, ColorVariant, SurfaceFillVariant } from "@ui";
import { ClockDial } from "./ClockDial";
import { ClockTicks } from "./ClockTicks";
import { ClockPointer } from "./ClockPointer";
import { ClockThumb } from "./ClockThumb";

interface Props {
    svgSize: number;
    size: string;
    children?: ReactNode;
    center: number;
    outerRadius: number;
    strokeWidth: number;
    pointerX: number;
    pointerY: number;
    centerDotRadius: number;
    thumbRadius: number;
    min: number;
    max: number;
    color: ColorVariant;
    activeHighlight: ColorVariant;
    variant: SurfaceFillVariant;
    isLight: boolean;
    isFullCircle?: boolean;
    disabled: boolean;
    onChange?: (value: number) => void;
    step: number;
    value: number;
}

export const ClockSvg: FC<Props> = ({
    svgSize,
    size,
    children,
    center,
    outerRadius,
    strokeWidth,
    pointerX,
    pointerY,
    centerDotRadius,
    thumbRadius,
    min,
    max,
    color,
    activeHighlight,
    variant,
    isLight,
    isFullCircle,
    disabled,
    onChange,
    step,
    value,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const valueRef = useRef(value);
    valueRef.current = value;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;

    const handleInteraction = (locationX: number, locationY: number) => {
        if (disabledRef.current) {
            return;
        }
        const dx = locationX - center;
        const dy = locationY - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 4) {
            return;
        }
        const clockAngle = svgAtan2ToClockAngle(dx, dy);
        const snapped = snapSlice(clockAngle, min, max, step);
        if (snapped !== valueRef.current) {
            valueRef.current = snapped;
            onChangeRef.current?.(snapped);
        }
    };

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
            contextRef.current.handleInteraction(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        },
        onPanResponderMove: (evt) => {
            if (disabledRef.current) {
                return;
            }
            contextRef.current.handleInteraction(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        },
        onPanResponderRelease: () => {
            setIsDragging(false);
        },
        onPanResponderTerminate: () => {
            setIsDragging(false);
        },
    }), []);

    return (
        <View
            collapsable={false}
            {...panResponder.panHandlers}
        >
            <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                <G>
                    {children}
                    <ClockDial
                        center={center}
                        outerRadius={outerRadius}
                        strokeWidth={strokeWidth}
                        min={min}
                        max={max}
                        color={color}
                        variant={variant}
                        isLight={isLight}
                        isFullCircle={isFullCircle}
                    />
                    <ClockTicks
                        center={center}
                        outerRadius={outerRadius}
                        size={size}
                        strokeWidth={strokeWidth}
                        min={min}
                        max={max}
                        color={color}
                        activeHighlight={activeHighlight}
                        variant={variant}
                        isLight={isLight}
                    />
                    <ClockPointer
                        center={center}
                        pointerX={pointerX}
                        pointerY={pointerY}
                        strokeWidth={strokeWidth}
                        isDragging={isDragging}
                        centerDotRadius={centerDotRadius}
                        color={color}
                        activeHighlight={activeHighlight}
                        variant={variant}
                        isLight={isLight}
                    />
                    <ClockThumb
                        center={center}
                        pointerX={pointerX}
                        pointerY={pointerY}
                        thumbRadius={thumbRadius}
                        isDragging={isDragging}
                        strokeWidth={strokeWidth}
                        color={color}
                        activeHighlight={activeHighlight}
                        variant={variant}
                        isLight={isLight}
                    />
                </G>
            </Svg>
        </View>
    );
};
