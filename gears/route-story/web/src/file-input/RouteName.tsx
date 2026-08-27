import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { parsers, TopToolsProps, useMultipleTranslations } from "@apparatus";
import { BevelPanel, Button, FileInput } from "@web-ui";
import { useSubjectState } from "@tinker-chest";
import { Icons } from "@ui";
import { WebRouteStoryProps } from "../model";
import styles from './file-input.module.css';

export const RouteName: FC<TopToolsProps<maplibregl.Map> & WebRouteStoryProps> = ({
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

    return (
        <BevelPanel
            variant="fill-translucent"
            color="primary"
            padding="sm"
            className={styles['panel']}
        >
            <FileInput
                mutiple
                fileIcon={routeName ? Icons.NounProject.ReplaceFile : Icons.NounProject.Upload}
                fileName={routeName}
                fileLabel={fileLabel}
                fileTooltipPlacement="bottom"
                purgeLabel={purgeLabel}
                purgeTooltipPlacement="bottom"
                cancelLabel={cancelLabel}
                noNameLabel={noNameLabel}
                color="primary"
                accept={[...parsers.keys(), "image/png", "image/jpeg", "image/jpg"].join(', ')}
                onUpload={(files) => fileOperator.uploadFile(files, map)}
                onPurge={() => fileOperator.resetStory()}
                purgeText={purgeStoryText}
                actionButtons={[
                    {
                        id: 'fit-bounds',
                        element: (
                            <Button
                                variant="ghost"
                                color="primary"
                                corners="circle"
                                icon={Icons.NounProject.Target}
                                onClick={() => fitBoundsHandler(map, data$.value.boundingBox)}
                                aria-label={fitBoundsLabel}
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
