import { FC } from "react";
import { Checkbox, Dropdown, Fieldset, Input, Label, TextArea } from "@web-ui";
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

    const handleMapStyleChange = (value: string) => {
        const id = value as keyof typeof Cartomancer.styles;
        if (id in Cartomancer.styles) {
            setSelectedStyle({ id });
        }
    }

    return (
        <div className={styles['container']}>
            <div className={styles['map-style-selection']}>
                <Label
                    id="map-style-label"
                >
                    {t(cartomancer.translationKey.Style)}
                </Label>
                <Dropdown
                    value={selectedStyle.id}
                    labelledBy="map-style-label"
                    options={[...Object.entries(Cartomancer.styles)].map(([id, option]) => ({ value: id, label: option.label }))}
                    onChange={handleMapStyleChange}
                />
            </div>
            <Fieldset label={t(cartomancer.translationKey.CartoLayout)}>
                <div className={styles["section"]}>
                    <Checkbox
                        id="map-size"
                        checked={mapLayout.size.type === 'full-screen'}
                        onChange={() => setMapLayout((prev): MapLayout => ({
                            ...prev, size: {
                                ...prev.size,
                                type: prev.size.type === 'full-screen'
                                    ? 'manual'
                                    : 'full-screen'
                            }
                        }))}
                    >
                        {t(cartomancer.translationKey.FullScreen)}
                    </Checkbox>
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
                <Checkbox
                    id="controls-globe-projection"
                    checked={globeProjection}
                    onChange={() => setGaugeControls((prev) => ({ ...prev, globeProjection: !prev.globeProjection }))}
                >
                    {t(cartomancer.translationKey.GlobeView)}
                </Checkbox>
                <Checkbox
                    id="controls-zoom"
                    checked={showZoomButtons}
                    onChange={() => setGaugeControls((prev) => ({ ...prev, showZoomButtons: !prev.showZoomButtons }))}
                >
                    {t(cartomancer.translationKey.ShowZoomButtons)}
                </Checkbox>
                <Checkbox
                    id="controls-compass"
                    checked={showCompass}
                    onChange={() => setGaugeControls((prev) => ({ ...prev, showCompass: !prev.showCompass }))}
                >
                    {t(cartomancer.translationKey.ShowCompassButton)}
                </Checkbox>
                <Checkbox
                    id="green-screen"
                    checked={showGreenScreen}
                    onChange={() => setGaugeControls((prev) => ({ ...prev, showGreenScreen: !prev.showGreenScreen }))}
                >
                    {t(cartomancer.translationKey.ShowGreenScreen)}
                </Checkbox>
            </Fieldset>
        </div>
    );
};
