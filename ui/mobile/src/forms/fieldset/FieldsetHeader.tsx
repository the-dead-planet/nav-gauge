import { FC, ReactNode } from "react";
import { Pressable } from "react-native";

interface Props {
    expandable?: boolean;
    onToggle: () => void;
    children: ReactNode;
}

export const FieldsetHeader: FC<Props> = ({
    expandable,
    onToggle,
    children
}) => {
    if (!expandable) {
        return children;
    }

    return (
        <Pressable onPress={onToggle}>
            {children}
        </Pressable>
    );
};
