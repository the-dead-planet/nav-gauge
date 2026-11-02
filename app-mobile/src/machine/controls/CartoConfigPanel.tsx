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
    FlexBox,
    NumberInput,
    TextArea,
    TextInput,
    ToggleSwitch,
} from "@mobile-ui";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 12,
        rowGap: 20,
    },
    inputRow: {
        gap: 8,
    },
    colorRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    colorPreview: {
        width: 32,
        height: 32,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        marginTop: 2,
    },
});

export const CartoConfigPanel: FC<ToolPanelProps<MobileMap>> = () => {
    const { cartomancer } = useMobileMachineWard();
    const translate = useTranslate();
    const t = (key: string) => translate({ n: cartomancer.namespace, t: key });
    const theme = useTheme();
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
                    <ToggleSwitch
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
                    />

                    <FlexBox
                        direction="row"
                        justifyContent="space-between"
                        style={styles.inputRow}
                    >
                        <NumberInput
                            value={mapLayout.size.width}
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
                            onChange={(value: number) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    size: { ...prev.size, height: value },
                                }));
                            }}
                            disabled={mapLayout.size.type === "full-screen"}
                            label={t(cartomancer.translationKey.Height)}
                        />
                    </FlexBox>

                    <NumberInput
                        value={mapLayout.borderWidth}
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
                        onChange={(value: number) => {
                            setMapLayout((prev): MapLayout => ({
                                ...prev,
                                innerBorderWidth: value,
                            }));
                        }}
                        label={t(cartomancer.translationKey.InnerBorderWidth)}
                    />

                    <View style={styles.colorRow}>
                        <View
                            style={[
                                styles.colorPreview,
                                {
                                    backgroundColor:
                                        mapLayout.borderColor ||
                                        theme.color("secondary", 500),
                                },
                            ]}
                        />
                        <TextInput
                            value={mapLayout.borderColor || ""}
                            onChange={(value: string) => {
                                setMapLayout((prev): MapLayout => ({
                                    ...prev,
                                    borderColor: value,
                                }));
                            }}
                            label={t(cartomancer.translationKey.BorderColor)}
                        />
                    </View>

                    <View style={styles.colorRow}>
                        <View
                            style={[
                                styles.colorPreview,
                                {
                                    backgroundColor:
                                        mapLayout.innerBorderColor ||
                                        theme.color("secondary", 500),
                                },
                            ]}
                        />
                        <TextInput
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
                    </View>

                    <TextArea
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
                        value={mapLayout.borderRadius}
                        onChange={(value: string) => {
                            setMapLayout((prev): MapLayout => ({
                                ...prev,
                                borderRadius: value,
                            }));
                        }}
                        label={t(cartomancer.translationKey.Radius)}
                    />
                </Fieldset>
            </View>
            <Fieldset
                label={t(cartomancer.translationKey.GaugeControls)}
                variant="outline"
            >
                <ToggleSwitch
                    checked={globeProjection}
                    onChange={() =>
                        setGaugeControls((prev) => ({
                            ...prev,
                            globeProjection: !prev.globeProjection,
                        }))
                    }
                >
                    {t(cartomancer.translationKey.GlobeView)}
                </ToggleSwitch>

                <ToggleSwitch
                    checked={showZoomButtons}
                    onChange={() =>
                        setGaugeControls((prev) => ({
                            ...prev,
                            showZoomButtons: !prev.showZoomButtons,
                        }))
                    }
                >
                    {t(cartomancer.translationKey.ShowZoomButtons)}
                </ToggleSwitch>

                <ToggleSwitch
                    checked={showCompass}
                    onChange={() =>
                        setGaugeControls((prev) => ({
                            ...prev,
                            showCompass: !prev.showCompass,
                        }))
                    }
                >
                    {t(cartomancer.translationKey.ShowCompassButton)}
                </ToggleSwitch>

                <ToggleSwitch
                    checked={showGreenScreen}
                    onChange={() =>
                        setGaugeControls((prev) => ({
                            ...prev,
                            showGreenScreen: !prev.showGreenScreen,
                        }))
                    }
                >
                    {t(cartomancer.translationKey.ShowGreenScreen)}
                </ToggleSwitch>
            </Fieldset>
        </View>
    );
};
