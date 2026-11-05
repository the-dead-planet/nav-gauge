import { FC } from "react";
import { StyleSheet } from "react-native";
import { parsers, TopToolsProps, useMultipleTranslations } from "@apparatus";
import { HexagonalPanel, Button, FileInput } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";
import { Icons } from "@ui";
import { MobileMap } from "@mobile-apparatus";
import { MobileRouteStoryProps } from "../model";

const styles = StyleSheet.create({
    panel: {
        flexShrink: 1,
        minWidth: 0,
        maxWidth: "100%",
        marginTop: 6,
        height: 40,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});

export const RouteName: FC<TopToolsProps<MobileMap> & MobileRouteStoryProps> = ({
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
        <HexagonalPanel
            variant="fill-translucent"
            color="primary"
            size="sm"
            style={styles.panel}
        >
            <FileInput
                mutiple
                fileIcon={routeName ? Icons.NounProject.ReplaceFile : Icons.NounProject.Upload}
                fileName={routeName}
                fileNameProps={{ variant: 'ghost' }}
                fileUploadButtonProps={{
                    variant: 'fill',
                    corners: 'circle',
                }}
                purgeButtonProps={{ corners: 'circle' }}
                purgeConfirmationDialogProps={{
                    variant: 'fill-translucent',
                }}
                fileLabel={fileLabel}
                fileTooltipPlacement="top"
                purgeLabel={purgeLabel}
                purgeTooltipPlacement="top"
                cancelLabel={cancelLabel}
                noNameLabel={noNameLabel}
                color="primary"
                variant="ghost"
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
                                tooltipPlacement="top"
                                showTooltipConnection
                                disabled={!geojson}
                            />
                        ),
                    },
                ]}
            />
        </HexagonalPanel>
    );
};
