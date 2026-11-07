import { FC } from "react";
import { StyleSheet, View } from "react-native";
import {
    Cartomancer,
    MapLayout,
    ToolPanelProps,
    useTranslate,
} from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import { Text } from "@mobile-ui";
import { MobileMap } from "@mobile-apparatus";
import {
    Dropdown,
    Fieldset,
    ColorInput,
    Checkbox,
    Grid,
    NumberInput,
    TextArea,
    TextInput,
} from "@mobile-ui";

const styles = StyleSheet.create({
    container: {
        padding: 12,
        rowGap: 20,
    },
    section: {
        gap: 10,
    },
});

export const CartoConfigPanel: FC<ToolPanelProps<MobileMap>> = () => {
    const { cartomancer } = useMobileMachineWard();
    const translate = useTranslate();
    const t = (key: string) => translate({ n: cartomancer.namespace, t: key });
    const [selectedStyle, setSelectedStyle] = useSubjectState(
        cartomancer.selectedStyle$,
    );
    const [mapLayout, setMapLayout] = useSubjectState(cartomancer.mapLayout$);
    const [gaugeControls, setGaugeControls] = useSubjectState(
        cartomancer.gaugeControls$,
    );
    const { globeProjection, showZoomButtons, showCompass, showGreenScreen } =
        gaugeControls;

    const handleMapStyleChange = (value: string): void => {
        const id = value as keyof typeof Cartomancer.styles;
        if (id in Cartomancer.styles) {
            setSelectedStyle({ id });
        }
    };

    const styleOptions = [...Object.entries(Cartomancer.styles)].map(
        ([id, option]) => ({
            value: id,
            label: option.label,
        }),
    );

    return (
        <View style={styles.container}>
            <View>
                <Text>{t(cartomancer.translationKey.Style)}</Text>
                <Dropdown
                    value={selectedStyle.id}
                    options={styleOptions}
                    onChange={handleMapStyleChange}
                />
            </View>

            <View>
                <Fieldset
                    label={t(cartomancer.translationKey.CartoLayout)}
                    variant="outline"
                >
                    <Checkbox
                        checked={mapLayout.size.type === "full-screen"}
                        onChange={() =>
                            setMapLayout((prev): MapLayout => ({
                                ...prev,
                                size: {
                                    ...prev.size,
                                    type:
                                        prev.size.type === "full-screen"
                                            ? "manual"
                                            : "full-screen",
                                },
                            }))
                        }
                    >
                        {t(cartomancer.translationKey.FullScreen)}
                    </Checkbox>

                    <Grid cols="equal-2" style={styles.section}>
                        <NumberInput
                            value={mapLayout.size.width}
                            autoSelect
                            min={0}
                            onChange={(value: number) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    size: { ...prev.size, width: value },
                                }));
                            }}
                            disabled={mapLayout.size.type === "full-screen"}
                            label={t(cartomancer.translationKey.Width)}
                        />
                        <NumberInput
                            value={mapLayout.size.height}
                            autoSelect
                            min={0}
                            onChange={(value: number) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    size: { ...prev.size, height: value },
                                }));
                            }}
                            disabled={mapLayout.size.type === "full-screen"}
                            label={t(cartomancer.translationKey.Height)}
                        />

                        <NumberInput
                            value={mapLayout.borderWidth}
                            autoSelect
                            min={0}
                            onChange={(value: number) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    borderWidth: value,
                                }));
                            }}
                            label={t(cartomancer.translationKey.BorderWidth)}
                        />

                        <NumberInput
                            value={mapLayout.innerBorderWidth}
                            autoSelect
                            min={0}
                            onChange={(value: number) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    innerBorderWidth: value,
                                }));
                            }}
                            label={t(
                                cartomancer.translationKey.InnerBorderWidth,
                            )}
                        />

                        <ColorInput
                            value={mapLayout.borderColor || ""}
                            onChange={(value: string) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    borderColor: value,
                                }));
                            }}
                            label={t(cartomancer.translationKey.BorderColor)}
                        />

                        <ColorInput
                            value={mapLayout.innerBorderColor || ""}
                            onChange={(value: string) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    innerBorderColor: value,
                                }));
                            }}
                            label={t(
                                cartomancer.translationKey.InnerBorderColor,
                            )}
                        />

                        <TextArea
                            autoSelect
                            value={mapLayout.boxShadow}
                            onChange={(value) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    boxShadow: value,
                                }));
                            }}
                            label={t(cartomancer.translationKey.BoxShadow)}
                        />

                        <TextArea
                            autoSelect
                            value={mapLayout.innerBoxShadow}
                            onChange={(value) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    innerBoxShadow: value,
                                }));
                            }}
                            label={t(cartomancer.translationKey.InnerBoxShadow)}
                        />

                        <TextInput
                            autoSelect
                            value={mapLayout.borderRadius}
                            onChange={(value: string) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    borderRadius: value,
                                }));
                            }}
                            label={t(cartomancer.translationKey.Radius)}
                        />
                    </Grid>
                </Fieldset>
            </View>
            <Fieldset
                label={t(cartomancer.translationKey.GaugeControls)}
                variant="outline"
            >
                <Checkbox
                    checked={globeProjection}
                    onChange={() =>
                        setGaugeControls((prev) => ({
                            ...prev,
                            globeProjection: !prev.globeProjection,
                        }))
                    }
                >
                    {t(cartomancer.translationKey.GlobeView)}
                </Checkbox>

                <Checkbox
                    checked={showZoomButtons}
                    onChange={() =>
                        setGaugeControls((prev) => ({
                            ...prev,
                            showZoomButtons: !prev.showZoomButtons,
                        }))
                    }
                >
                    {t(cartomancer.translationKey.ShowZoomButtons)}
                </Checkbox>

                <Checkbox
                    checked={showCompass}
                    onChange={() =>
                        setGaugeControls((prev) => ({
                            ...prev,
                            showCompass: !prev.showCompass,
                        }))
                    }
                >
                    {t(cartomancer.translationKey.ShowCompassButton)}
                </Checkbox>

                <Checkbox
                    checked={showGreenScreen}
                    onChange={() =>
                        setGaugeControls((prev) => ({
                            ...prev,
                            showGreenScreen: !prev.showGreenScreen,
                        }))
                    }
                >
                    {t(cartomancer.translationKey.ShowGreenScreen)}
                </Checkbox>
            </Fieldset>
        </View>
    );
};
