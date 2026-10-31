import { forwardRef } from "react";
import { ViewStyle, type ViewInstance } from "react-native";
import { ClockInputProps } from "@ui";
import { ClockControl } from "./ClockControl";

export const ClockSliceInput = forwardRef<
    ViewInstance,
    ClockInputProps & { style?: ViewStyle }
>((props, ref) => (
    <ClockControl max={85} step={1} {...props} ref={ref} mode="slice" />
));
ClockSliceInput.displayName = "ClockSliceInput";
