import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import bbox from "@turf/bbox";
import {
    GaugeContext,
    useSubjectState,
    ParsingResultWithError,
    Preset,
    PresetStation,
    PresetValues,
    useStateWarden,
    useStorageState,
    MachineWardMachineProps,
} from "@apparatus";
import {
    defaultGaugeControls,
    defaultMapLayout,
    GaugeControlsType,
    MapLayout,
    RouteTimes
} from "@tinker-chest";
import { parsers } from "../parsers";
import { useImageReader } from '../hooks';
import { Presets } from "./controls/Presets";
import { AnimationControls } from "./controls/AnimationControls";
import { MapLayoutControls } from "./controls/MapLayoutControls";
import { ApplicationSettings } from "./controls/ApplicationSettings";
import { GaugeControls } from "./controls/GaugeControls";
import { MapSection } from "./MapSection";
import { FileInput } from "./controls/FileInput";
import { MapStyleSelection } from "./controls/MapStyleSelection";
import * as styles from './machine.module.css';

export const Machine: FC<MachineWardMachineProps> = () => {
    const stateWarden = useStateWarden();
    const [applicationSettings] = useSubjectState(stateWarden.applicationSettings$);
    const { animatrix } = stateWarden;
    const [{ geojson, boundingBox, routeName, error }, setGeoJson] = useState<ParsingResultWithError>({});

    const routeTimes = useMemo(
        (): RouteTimes | undefined => {
            if (!geojson?.features[0]) {
                return;
            }
            const startTime = geojson.features[0].properties.time;
            const endTime = geojson.features.slice(-1)[0]?.properties.time;
            const startTimeEpoch = new Date(startTime).valueOf();
            const endTimeEpoch = new Date(endTime).valueOf();

            return {
                startTime,
                endTime,
                startTimeEpoch,
                endTimeEpoch,
                duration: endTimeEpoch - startTimeEpoch
            }
        },
        [geojson]
    );

    const [images, readImage, updateImageFeatureId] = useImageReader();
    const [gaugeControls, setGaugeControls] = useStorageState<GaugeControlsType>(localStorage, 'gauge-controls', defaultGaugeControls);
    const [mapLayout, setMapLayout] = useStorageState<MapLayout>(localStorage, 'map-layout', defaultMapLayout);
    const [preset, setPreset] = useState<Preset>(PresetStation.detectPreset(mapLayout, gaugeControls));

    // TODO: Handle from route gear??
    useEffect(() => {
        if (!applicationSettings.confirmBeforeLeave || (!geojson && images.length === 0)) {
            return;
        }
        const confirmationHandler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            return "Route and image data will be lost.";
        };
        window.addEventListener("beforeunload", confirmationHandler);

        return () => {
            window.removeEventListener('beforeunload', confirmationHandler);
        }
    }, [applicationSettings.confirmBeforeLeave, images, geojson]);

    const handlePresetChange = (preset: Preset, {
        presetMapLayout,
        presetGaugeControls,
        presetAnimationControls,
    }: PresetValues = {}) => {
        setPreset(preset);
        if (presetMapLayout) {
            setMapLayout(presetMapLayout);
        }
        if (presetGaugeControls) {
            setGaugeControls(presetGaugeControls);
        }
        if (presetAnimationControls) {
            animatrix.controls$.next(presetAnimationControls);
        }
    };

    const controlsCssStyle = useMemo(
        () => {
            const { top, bottom, right, left } = gaugeControls.controlPlacement;

            switch (gaugeControls.controlPosition) {
                case 'top-left': return { '--ctrl-top': top + 'px', '--ctrl-left': left + 'px' }
                case 'top-right': return { '--ctrl-top': top + 'px', '--ctrl-right': right + 'px' }
                case 'bottom-left': return { '--ctrl-bottom': bottom + 'px', '--ctrl-left': left + 'px' }
                case 'bottom-right': return { '--ctrl-bottom': bottom + 'px', '--ctrl-right': right + 'px' }
            }
        },
        [gaugeControls]
    );

    useEffect(() => {
        fetch('/example.gpx')
            .then((file) => file.text())
            .then((text) => parsers.get('.gpx')?.parseTextToGeoJson(text))
            .then((result) => setGeoJson(result ? {
                ...result,
                boundingBox: bbox(result.geojson)
            } : {}));
    }, []);

    return (
        <GaugeContext.Provider value={{ ...gaugeControls, ...mapLayout }}>
            <div className={styles.layout} style={{
                ...controlsCssStyle,
                '--map-width': mapLayout.size.type === 'full-screen' ? '100%' : `${mapLayout.size.width}px`,
                '--map-height': mapLayout.size.type === 'full-screen' ? '100%' : `${mapLayout.size.height}px`,
                '--map-border-width': mapLayout.borderWidth + 'px',
                '--map-border-color': mapLayout.borderColor,
                '--map-inner-border-width': mapLayout.innerBorderWidth + 'px',
                '--map-inner-border-color': mapLayout.innerBorderColor,
                '--map-radius': mapLayout.borderRadius,
                '--map-box-shadow': mapLayout.boxShadow,
                '--map-inner-box-shadow': mapLayout.innerBoxShadow,
                // TODO: Make draggable on mobile
                '--side-panel-height-sm': "240px",
            } as unknown as CSSProperties}>
                <div className={styles["side-panel"]}>
                    <FileInput
                        routeName={routeName}
                        error={error}
                        geojson={geojson}
                        onGeojsonChange={setGeoJson}
                        readImage={readImage}
                    />
                    <hr className={styles.divider} />
                    <Presets preset={preset} onPresetChange={handlePresetChange} mapLayout={mapLayout} gaugeControls={gaugeControls} />
                    <MapStyleSelection />
                    <MapLayoutControls mapLayout={mapLayout} onMapLayoutChange={setMapLayout} />
                    <GaugeControls gaugeControls={gaugeControls} onGaugeConrolsChange={setGaugeControls} />
                    <AnimationControls />
                    <ApplicationSettings />
                </div>
                <div className={styles["main-area"]}>
                    <MapSection
                        geojson={geojson}
                        boundingBox={boundingBox}
                        images={images}
                        onUpdateImageFeatureId={updateImageFeatureId}
                        routeTimes={routeTimes}
                    />
                </div>
            </div>
        </GaugeContext.Provider>
    );
};
