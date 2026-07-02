import { FC } from "react";
import { TopToolsProps, useMachineWard } from "@apparatus";
import { RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button, H4, BevelPanel } from "@web-ui";
import { WebMarkerImageData } from "../images/image-parser";
import { useSubjectState } from "@tinker-chest";
import { T } from "@web-apparatus";
import { Icons, useTheme } from "@ui";
import styles from './file-input.module.css';
import classNames from "classnames";

export const RouteName: FC<TopToolsProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    gearId,
    translationKey,
    data$
}) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const [{ geojson, routeName, error }] = useSubjectState(data$);
    const fileButtonLabel = translatron.translate(settings.language, registry, { n: gearId, t: translationKey.File });
    const clearButtonLabel = translatron.translate(settings.language, registry, { n: gearId, t: translationKey.PurgeStory });

    return (
        <BevelPanel
            variant="fill-translucent"
            color="primary"
            padding="sm"
            className={styles['panel']}
            contentClassName={styles['panel-content']}
        >
            <Button
                aria-label={fileButtonLabel}
                variant="fill"
                color="primary"
                corners="circle"
                icon={Icons.NounProject.Upload}
                onClick={() => { }}
            >
                {media.isLessThanMd ? null : <T n={gearId} t={translationKey.File} />}
            </Button>
            <H4 color="primary" title={routeName} className={classNames(styles['route-name'], {
                [styles['sm']]: media.isLessThanMd
            })}>
                {routeName || <T n={gearId} t={translationKey.NoName} />}
            </H4>
            <Button
                variant="ghost"
                color="primary"
                corners="circle"
                icon={Icons.NounProject.Clear}
                onClick={() => { }}
                aria-label={clearButtonLabel}
                tooltip={clearButtonLabel}
                showTooltipConnection
                className={styles['purge-button']}
            />
        </BevelPanel>
    );
};
