import { FC } from "react";
import classNames from "classnames";
import { ToolPanelPlacement } from "@apparatus";
import styles from '../machine.module.css';

interface Props {
    placement: ToolPanelPlacement | "bottom-secondary";
}

export const PlaceholderToolPanel: FC<Props> = ({
    placement
}) => {
    return (
        <div className={classNames(styles['placeholder-toolbar'], styles[placement])} />
    );
};
