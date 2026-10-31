import { FC } from "react";
import { ClockDurationInputProps } from "@ui";
import { ClockControl } from "./ClockControl";

export const ClockDurationInput: FC<
    ClockDurationInputProps & { className?: string }
> = (props) => <ClockControl step={1000} {...props} mode="duration" />;
