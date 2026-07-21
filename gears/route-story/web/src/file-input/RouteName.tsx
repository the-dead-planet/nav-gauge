import { FC } from "react";
import { parsers, TopToolsProps, useMachineWard } from "@apparatus";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { BevelPanel, Button, FileInput } from "@web-ui";
import { WebMarkerImageData } from "../images/image-parser";
import { useSubjectState } from "@tinker-chest";
import { Icons } from "@ui";
import styles from './file-input.module.css';

export const RouteName: FC<TopToolsProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    gearId,
    translationKey,
    map,
    data$,
    fileOperator,
    fitBoundsHandler,
}) => {
    const { translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const [{ routeName, geojson }] = useSubjectState(data$);
    const fileLabel = translatron.translate(settings.language, registry, { n: gearId, t: routeName ? translationKey.ReplaceFile : translationKey.UploadFile });
    const purgeLabel = translatron.translate(settings.language, registry, { n: gearId, t: translationKey.PurgeStory });
    const cancelLabel = translatron.translate(settings.language, registry, { n: gearId, t: translationKey.Cancel });
    const noNameLabel = translatron.translate(settings.language, registry, { n: gearId, t: translationKey.NoName });
    const fitBoundsLabel = translatron.translate(settings.language, registry, { n: gearId, t: translationKey.FitBounds });

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
