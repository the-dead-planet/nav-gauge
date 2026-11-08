import { ComponentProps, FC } from "react";
import { Text } from "./Text";

export const Caption: FC<Omit<ComponentProps<typeof Text>, "usage" | "as">> = (
    props,
) => <Text {...props} usage="caption" as="span" />;
