import { ChangeEvent, FC } from "react";
import { Fieldset, Input, TextArea } from "@web-ui";
import { Cartomancer, MapLayout, ToolPanelProps, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import styles from './controls.module.css';

export const CartoConfigPanel: FC<ToolPanelProps<maplibregl.Map>> = () => {
    const { cartomancer, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const t = (key: string) => translatron.translate(settings.language, registry, { n: cartomancer.namespace, t: key });
    const [selectedStyle, setSelectedStyle] = useSubjectState(cartomancer.selectedStyle$)
    const [mapLayout, setMapLayout] = useSubjectState(cartomancer.mapLayout$);
    const [gaugeControls, setGaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const {
        globeProjection,
        showZoomButtons,
        // TODO: Implement
        showCompass,
        showGreenScreen,
    } = gaugeControls;

    const handleMapStyleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value as keyof typeof Cartomancer.styles;
        if (id in Cartomancer.styles) {
            setSelectedStyle({ id });
        }
    }

    return (
        <div className={styles['container']}>
            <div className={styles['map-style-selection']}>
                {/* TODO: Move to reusable component */}
                <div>
                    <label htmlFor="map-style-selection" style={{ fontSize: "12px" }}>Map style</label>
                    <select name="map-style-selection" id="map-style-selection" value={selectedStyle.id} onChange={handleMapStyleChange}>
                        {[...Object.entries(Cartomancer.styles)].map(([id, option]) => (
                            <option key={id} value={id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <Fieldset label={t(cartomancer.translationKey.CartoLayout)}>
                <div className={styles["section"]}>
                    <Input
                        id="map-size"
                        name="map-size"
                        label={t(cartomancer.translationKey.FullScreen)}
                        labelPlacement="after"
                        type='checkbox'
                        checked={mapLayout.size.type === 'full-screen'}
                        onChange={() => { }}
                        onContainerClick={() => setMapLayout((prev): MapLayout => ({
                            ...prev, size: {
                                ...prev.size,
                                type: prev.size.type === 'full-screen'
                                    ? 'manual'
                                    : 'full-screen'
                            }
                        }))}
                        containerClassName={styles["checkbox"]}
                    />
                    <div />
                    <Input
                        id="map-width"
                        name="map-width"
                        label={t(cartomancer.translationKey.Width)}
                        type='number'
                        disabled={mapLayout.size.type === 'full-screen'}
                        autoSelect
                        min={0}
                        value={mapLayout.size.width}
                        onChange={(event) => {
                            if (!isNaN(Number(event.target.value))) {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    size: {
                                        ...prev.size,
                                        width: Number(event.target.value)
                                    }
                                }))
                            }
                        }}
                    />
                    <Input
                        id="map-height"
                        name="map-height"
                        label={t(cartomancer.translationKey.Height)}
                        type='number'
                        disabled={mapLayout.size.type === 'full-screen'}
                        autoSelect
                        min={0}
                        value={mapLayout.size.height}
                        onChange={(event) => {
                            if (!isNaN(Number(event.target.value))) {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    size: {
                                        ...prev.size,
                                        height: Number(event.target.value)
                                    }
                                }));
                            }
                        }}
                    />
                    <Input
                        id="map-border-width"
                        name="map-border-width"
                        label={t(cartomancer.translationKey.BorderWidth)}
                        type='number'
                        autoSelect
                        min={0}
                        value={mapLayout.borderWidth}
                        onChange={(event) => {
                            if (!isNaN(Number(event.target.value))) {
                                setMapLayout((prev): MapLayout => ({ ...prev, borderWidth: Number(event.target.value) }));
                            }
                        }}
                    />
                    <Input
                        id="map-inner-border-width"
                        name="map-inner-border-width"
                        label={t(cartomancer.translationKey.InnerBorderWidth)}
                        type='number'
                        autoSelect
                        min={0}
                        value={mapLayout.innerBorderWidth}
                        onChange={(event) => {
                            if (!isNaN(Number(event.target.value))) {
                                setMapLayout((prev): MapLayout => ({ ...prev, innerBorderWidth: Number(event.target.value) }));
                            }
                        }}
                    />
                    <Input
                        id="map-border-color"
                        name="map-border-color"
                        label={t(cartomancer.translationKey.BorderColor)}
                        type='color'
                        value={mapLayout.borderColor}
                        onChange={(event) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, borderColor: event.target.value }));
                        }}
                        className={styles["input-color"]}
                    />
                    <Input
                        id="map-inner-border-color"
                        name="map-inner-border-color"
                        label={t(cartomancer.translationKey.InnerBorderColor)}
                        type='color'
                        value={mapLayout.innerBorderColor}
                        onChange={(event) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, innerBorderColor: event.target.value }));
                        }}
                        className={styles["input-color"]}
                    />
                    <TextArea
                        id="map-border-box-shadow"
                        name="map-border-box-shadow"
                        label={t(cartomancer.translationKey.BoxShadow)}
                        value={mapLayout.boxShadow}
                        onChange={(event) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, boxShadow: event.target.value }));
                        }}
                        autoSelect
                        className={styles["textarea"]}
                    />
                    <TextArea
                        id="map-border-inner-box-shadow"
                        name="map-border-inner-box-shadow"
                        label={t(cartomancer.translationKey.InnerBoxShadow)}
                        value={mapLayout.innerBoxShadow}
                        onChange={(event) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, innerBoxShadow: event.target.value }));
                        }}
                        autoSelect
                        className={styles["textarea"]}
                    />
                    <Input
                        id="map-border-radius"
                        name="map-border-radius"
                        label={t(cartomancer.translationKey.Radius)}
                        type='text'
                        autoSelect
                        value={mapLayout.borderRadius}
                        onChange={(event) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, borderRadius: event.target.value }));
                        }}
                        className={styles["input-color"]}
                    />
                </div>
            </Fieldset>
            <Fieldset label={t(cartomancer.translationKey.GaugeControls)}>
                <Input
                    id="controls-globe-projection"
                    name="controls-globe-projection"
                    label={t(cartomancer.translationKey.GlobeView)}
                    labelPlacement="after"
                    type='checkbox'
                    checked={globeProjection}
                    onChange={() => { }}
                    onContainerClick={() => setGaugeControls((prev) => ({ ...prev, globeProjection: !prev.globeProjection }))}
                    containerClassName={styles["checkbox"]}
                />
                <Input
                    id="controls-zoom"
                    name="controls-zoom"
                    label={t(cartomancer.translationKey.ShowZoomButtons)}
                    labelPlacement="after"
                    type='checkbox'
                    checked={showZoomButtons}
                    onChange={() => { }}
                    onContainerClick={() => setGaugeControls((prev) => ({ ...prev, showZoomButtons: !prev.showZoomButtons }))}
                    containerClassName={styles["checkbox"]}
                />
                <Input
                    id="controls-compass"
                    name="controls-compass"
                    label={t(cartomancer.translationKey.ShowCompassButton)}
                    labelPlacement="after"
                    type='checkbox'
                    checked={showCompass}
                    onChange={() => { }}
                    onContainerClick={() => setGaugeControls((prev) => ({ ...prev, showCompass: !prev.showCompass }))}
                    containerClassName={styles["checkbox"]}
                />
                <Input
                    id="green-screen"
                    name="green-screen"
                    label={t(cartomancer.translationKey.ShowGreenScreen)}
                    labelPlacement="after"
                    type='checkbox'
                    checked={showGreenScreen}
                    onChange={() => { }}
                    onContainerClick={() => setGaugeControls((prev) => ({ ...prev, showGreenScreen: !prev.showGreenScreen }))}
                    containerClassName={styles["checkbox"]}
                />
            </Fieldset>
        </div>
    );
};
