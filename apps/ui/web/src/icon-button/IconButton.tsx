import { FC } from "react";
import { Icon } from "../icons";

interface Props {
    src: string;
}
// filter: drop-shadow(0 0 8px rgba(0, 255, 242, 0.6));
// stroke-width 1px HUD layout and 2.5px for mech/gear
// Hexagonal borders / clipped corners
export const IconButton: FC<Props> = ({ src }) => {
    return (
        <button>
            <Icon src={src} />
        </button>
    );
};