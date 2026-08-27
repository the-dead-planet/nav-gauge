import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { Checkbox, ColorInput, Dropdown, Fieldset, Label, NumberInput, TextArea, TextInput } from "@web-ui";
import { Cartomancer, MapLayout, ToolPanelProps } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import styles from './controls.module.css';

export const CartoConfigPanel: FC<ToolPanelProps<maplibregl.Map>> = () => {
    const { cartomancer, translatron, individuator } = useWebMachineWard();
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
                    <NumberInput
                        id="map-width"
                        label={t(cartomancer.translationKey.Width)}
                        disabled={mapLayout.size.type === 'full-screen'}
                        autoSelect
                        min={0}
                        value={mapLayout.size.width}
                        onChange={(value) => {
                            setMapLayout((prev): MapLayout => ({
                                ...prev,
                                size: {
                                    ...prev.size,
                                    width: value
                                }
                            }))
                        }}
                    />
                    <NumberInput
                        id="map-height"
                        label={t(cartomancer.translationKey.Height)}
                        disabled={mapLayout.size.type === 'full-screen'}
                        autoSelect
                        min={0}
                        value={mapLayout.size.height}
                        onChange={(value) => {
                            setMapLayout((prev): MapLayout => ({
                                ...prev,
                                size: {
                                    ...prev.size,
                                    height: value
                                }
                            }));
                        }}
                    />
                    <NumberInput
                        id="map-border-width"
                        label={t(cartomancer.translationKey.BorderWidth)}
                        autoSelect
                        min={0}
                        value={mapLayout.borderWidth}
                        onChange={(value) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, borderWidth: value }));
                        }}
                    />
                    <NumberInput
                        id="map-inner-border-width"
                        label={t(cartomancer.translationKey.InnerBorderWidth)}
                        autoSelect
                        min={0}
                        value={mapLayout.innerBorderWidth}
                        onChange={(value) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, innerBorderWidth: value }));
                        }}
                    />
                    <ColorInput
                        id="map-border-color"
                        label={t(cartomancer.translationKey.BorderColor)}
                        value={mapLayout.borderColor}
                        onChange={(value) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, borderColor: value }));
                        }}
                        className={styles["input-color"]}
                    />
                    <ColorInput
                        id="map-inner-border-color"
                        label={t(cartomancer.translationKey.InnerBorderColor)}
                        value={mapLayout.innerBorderColor}
                        onChange={(value) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, innerBorderColor: value }));
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
                    <TextInput
                        id="map-border-radius"
                        label={t(cartomancer.translationKey.Radius)}
                        autoSelect
                        value={mapLayout.borderRadius}
                        onChange={(value) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, borderRadius: value }));
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
