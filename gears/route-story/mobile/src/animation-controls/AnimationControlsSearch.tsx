import { FC } from "react";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { ToolPanelProps, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";
import { TextInput } from "@mobile-ui";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileMarkerImageData } from "../images/image-parser";

export const AnimationControlsSearch: FC<ToolPanelProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
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
