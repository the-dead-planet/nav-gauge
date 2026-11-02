import { useState } from "react";
import { FieldsetProps } from "./model";

export const useFieldsetExpansion = ({
    expandable = true,
    expanded,
    onExpandedChange,
    disabled,
}: Pick<
    FieldsetProps,
    "expandable" | "expanded" | "onExpandedChange" | "disabled"
>) => {
    const [internalExpanded, setInternalExpanded] = useState(true);
    const isExpanded = !expandable || (expanded ?? internalExpanded);

    const toggle = () => {
        if (!expandable || disabled) {
            return;
        }
        const nextExpanded = !isExpanded;
        if (expanded === undefined) {
            setInternalExpanded(nextExpanded);
        }
        onExpandedChange?.(nextExpanded);
    };

    return { isExpanded, toggle };
};
