import { FC } from "react";
import { ToolPanelProps, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";
import { TextInput } from "@mobile-ui";
import { MobileRouteStoryProps } from "../model";

export const AnimationControlsSearch: FC<ToolPanelProps<MobileMap> & MobileRouteStoryProps> = ({
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
            // id="animation-controls-search"
            variant="fill-inverse"
            value={searchQuery}
            onChange={setSearchQuery}
            // placeholder={searchLabel}
            aria-label={searchLabel}
            size="sm"
        // className={styles['search']}
        />
    );
};
