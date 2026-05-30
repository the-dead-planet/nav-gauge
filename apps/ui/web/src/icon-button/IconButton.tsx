import { ComponentProps, FC } from "react";
import { Icon } from "../icons";
import { Button } from "../button";

interface Props {
    icon: string;
}

// filter: drop-shadow(0 0 8px rgba(0, 255, 242, 0.6));
// stroke-width 1px HUD layout and 2.5px for mech/gear
// Hexagonal borders / clipped corners
export const IconButton: FC<ComponentProps<typeof Button> & Props> = ({ icon, ...props }) => {
    const size = {
        xs: 12,
        sm: 16,
        md: 20,
    }

    return (
        <Button {...props}>
            <Icon src={icon} width={size[props.size || 'md']} color={props.color} />
        </Button>
    );
};