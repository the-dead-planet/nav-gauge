import { useState } from 'react';

export const useLinkInteraction = () => {
    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);

    return {
        focused,
        interacting: focused || hovered,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        onHoverIn: () => setHovered(true),
        onHoverOut: () => setHovered(false),
    };
};
