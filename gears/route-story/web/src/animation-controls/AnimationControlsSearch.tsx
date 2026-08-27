import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { ToolPanelProps, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { TextInput } from "@web-ui";
import { WebRouteStoryProps } from "../model";
import styles from './animation-controls.module.css';

export const AnimationControlsSearch: FC<ToolPanelProps<maplibregl.Map> & WebRouteStoryProps> = ({
    animatrix,
}) => {
    const [searchQuery, setSearchQuery] = useSubjectState(animatrix.searchQuery$);

    const [
        searchLabel,
    ] = useMultipleTranslations([
        { n: animatrix.namespace, t: animatrix.translationKey.Search },
    ]);

    return (
        <TextInput
            id="animation-controls-search"
            variant="fill-inverse"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={searchLabel}
            aria-label={searchLabel}
            size="sm"
            className={styles['search']}
        />
    );
};
