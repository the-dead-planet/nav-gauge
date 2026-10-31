import { ComponentProps, FC } from "react";
import { ClockInputProps } from "@ui";
import { ClockControl } from "./ClockControl";

export const ClockSliceInput: FC<
    ClockInputProps & Omit<ComponentProps<"div">, "onChange" | "value">
> = (props) => <ClockControl max={85} step={1} {...props} mode="slice" />;
