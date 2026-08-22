import { FC } from "react";
import { StyleSheet } from "react-native";
import { parsers, TopToolsProps, useMultipleTranslations } from "@apparatus";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { BevelPanel, Button, FileInput } from "@mobile-ui";
import { MobileMarkerImageData } from "../images/image-parser";
import { useSubjectState } from "@tinker-chest";
import { Icons } from "@ui";
import { MobileMap } from "@mobile-apparatus";
import { DocumentPickerResponse } from "@react-native-documents/picker";

const styles = StyleSheet.create({
    panel: {
        marginTop: 6,
        height: 40,
    },
});

export const RouteName: FC<TopToolsProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    gearId,
    translationKey,
    map,
    data$,
    fileOperator,
    fitBoundsHandler,
}) => {
    const [{ routeName, geojson }] = useSubjectState(data$);

    const [
        fileLabel,
        purgeLabel,
        cancelLabel,
        noNameLabel,
        fitBoundsLabel,
        purgeStoryText
    ] = useMultipleTranslations([
        { n: gearId, t: routeName ? translationKey.ReplaceFile : translationKey.UploadFile },
        { n: gearId, t: translationKey.PurgeStory },
        { n: gearId, t: translationKey.Cancel },
        { n: gearId, t: translationKey.NoName },
        { n: gearId, t: translationKey.FitBounds },
        { n: gearId, t: translationKey.PurgeStoryText },
    ]);
    const acceptedFileTypes = [...[...parsers.values()].flatMap((el) => el.fileTypes), "image/png", "image/jpeg", "image/jpg"];

    return (
        <BevelPanel
            variant="fill-translucent"
            color="primary"
            padding="sm"
            style={styles.panel}
        >
            <FileInput
                mutiple
                fileName={routeName}
                fileLabel={fileLabel}
                fileTooltipPlacement="bottom"
                purgeLabel={purgeLabel}
                purgeTooltipPlacement="bottom"
                cancelLabel={cancelLabel}
                noNameLabel={noNameLabel}
                color="primary"
                type={acceptedFileTypes}
                purgeText={purgeStoryText}
                onUpload={(files) => fileOperator.uploadFile(files, map)}
                onPurge={() => fileOperator.resetStory()}
                actionButtons={[
                    {
                        id: 'fit-bounds',
                        element: (
                            <Button
                                variant="ghost"
                                color="primary"
                                corners="circle"
                                icon={Icons.NounProject.Target}
                                onPress={() => fitBoundsHandler(map, data$.value.boundingBox)}
                                accessibilityLabel={fitBoundsLabel}
                                tooltip={fitBoundsLabel}
                                tooltipPlacement="bottom"
                                showTooltipConnection
                                disabled={!geojson}
                            />
                        ),
                    },
                ]}
            />
        </BevelPanel>
    );
};
