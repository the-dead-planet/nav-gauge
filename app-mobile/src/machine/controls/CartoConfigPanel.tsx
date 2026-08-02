import { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Cartomancer, MapLayout, ToolPanelProps, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-ui";
import { Dropdown, Fieldset, FlexBox, NumberInput, TextArea, TextInput, ToggleSwitch } from "@mobile-ui";
import { useTheme } from "@ui";

export const CartoConfigPanel: FC<ToolPanelProps<MobileMap>> = () => {
    const { cartomancer, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const t = (key: string) => translatron.translate(settings.language, registry, { n: cartomancer.namespace, t: key });
    const theme = useTheme();
    const [selectedStyle, setSelectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [mapLayout, setMapLayout] = useSubjectState(cartomancer.mapLayout$);
    const [gaugeControls, setGaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const { globeProjection, showZoomButtons, showCompass, showGreenScreen } = gaugeControls;

    const handleMapStyleChange = (value: string): void => {
        const id = value as keyof typeof Cartomancer.styles;
        if (id in Cartomancer.styles) {
            setSelectedStyle({ id });
        }
    };

    const styleOptions = [...Object.entries(Cartomancer.styles)].map(([id, option]) => ({
        value: id,
        label: option.label,
    }));

    return (
        <ScrollView style={styles.container}>
            <Fieldset label={t(cartomancer.translationKey.Style)}>
                <Dropdown
                    value={selectedStyle.id}
                    options={styleOptions}
                    onChange={handleMapStyleChange}
                    color="secondary"
                />
            </Fieldset>

            <Fieldset label={t(cartomancer.translationKey.CartoLayout)}>
                <Fieldset label={t(cartomancer.translationKey.FullScreen)}>
                    <ToggleSwitch
                        checked={mapLayout.size.type === 'full-screen'}
                        onChange={() => setMapLayout((prev): MapLayout => ({
                            ...prev, size: {
                                ...prev.size,
                                type: prev.size.type === 'full-screen' ? 'manual' : 'full-screen'
                            }
                        }))}
                        color="secondary"
                    />
                </Fieldset>

                <FlexBox direction="row" justifyContent="space-between" style={styles.inputRow}>
                    <NumberInput
                        value={mapLayout.size.width}
                        onChange={(value: number) => {
                            setMapLayout((prev): MapLayout => ({
                                ...prev, size: { ...prev.size, width: value }
                            }));
                        }}
                        disabled={mapLayout.size.type === 'full-screen'}
                        label={t(cartomancer.translationKey.Width)}
                        color="secondary"
                    />
                    <NumberInput
                        value={mapLayout.size.height}
                        onChange={(value: number) => {
                            setMapLayout((prev): MapLayout => ({
                                ...prev, size: { ...prev.size, height: value }
                            }));
                        }}
                        disabled={mapLayout.size.type === 'full-screen'}
                        label={t(cartomancer.translationKey.Height)}
                        color="secondary"
                    />
                </FlexBox>

                <NumberInput
                    value={mapLayout.borderWidth}
                    onChange={(value: number) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, borderWidth: value }));
                    }}
                    label={t(cartomancer.translationKey.BorderWidth)}
                    color="secondary"
                />

                <NumberInput
                    value={mapLayout.innerBorderWidth}
                    onChange={(value: number) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, innerBorderWidth: value }));
                    }}
                    label={t(cartomancer.translationKey.InnerBorderWidth)}
                    color="secondary"
                />

                <View style={styles.colorRow}>
                    <View style={[styles.colorPreview, { backgroundColor: mapLayout.borderColor || theme.color('secondary', 500) }]} />
                    <TextInput
                        value={mapLayout.borderColor || ''}
                        onChange={(value: string) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, borderColor: value }));
                        }}
                        label={t(cartomancer.translationKey.BorderColor)}
                        color="secondary"
                    />
                </View>

                <View style={styles.colorRow}>
                    <View style={[styles.colorPreview, { backgroundColor: mapLayout.innerBorderColor || theme.color('secondary', 500) }]} />
                    <TextInput
                        value={mapLayout.innerBorderColor || ''}
                        onChange={(value: string) => {
                            setMapLayout((prev): MapLayout => ({ ...prev, innerBorderColor: value }));
                        }}
                        label={t(cartomancer.translationKey.InnerBorderColor)}
                        color="secondary"
                    />
                </View>

                <TextArea
                    value={mapLayout.boxShadow}
                    onChange={(e) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, boxShadow: e.nativeEvent.text }));
                    }}
                    label={t(cartomancer.translationKey.BoxShadow)}
                    color="secondary"
                />

                <TextArea
                    value={mapLayout.innerBoxShadow}
                    onChange={(e) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, innerBoxShadow: e.nativeEvent.text }));
                    }}
                    label={t(cartomancer.translationKey.InnerBoxShadow)}
                    color="secondary"
                />

                <TextInput
                    value={mapLayout.borderRadius}
                    onChange={(value: string) => {
                        setMapLayout((prev): MapLayout => ({ ...prev, borderRadius: value }));
                    }}
                    label={t(cartomancer.translationKey.Radius)}
                    color="secondary"
                />
            </Fieldset>

            <Fieldset label={t(cartomancer.translationKey.GaugeControls)}>
                <ToggleSwitch
                    checked={globeProjection}
                    onChange={() => setGaugeControls((prev) => ({ ...prev, globeProjection: !prev.globeProjection }))}
                    color="secondary"
                >
                    {t(cartomancer.translationKey.GlobeView)}
                </ToggleSwitch>

                <ToggleSwitch
                    checked={showZoomButtons}
                    onChange={() => setGaugeControls((prev) => ({ ...prev, showZoomButtons: !prev.showZoomButtons }))}
                    color="secondary"
                >
                    {t(cartomancer.translationKey.ShowZoomButtons)}
                </ToggleSwitch>

                <ToggleSwitch
                    checked={showCompass}
                    onChange={() => setGaugeControls((prev) => ({ ...prev, showCompass: !prev.showCompass }))}
                    color="secondary"
                >
                    {t(cartomancer.translationKey.ShowCompassButton)}
                </ToggleSwitch>

                <ToggleSwitch
                    checked={showGreenScreen}
                    onChange={() => setGaugeControls((prev) => ({ ...prev, showGreenScreen: !prev.showGreenScreen }))}
                    color="secondary"
                >
                    {t(cartomancer.translationKey.ShowGreenScreen)}
                </ToggleSwitch>
            </Fieldset>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    inputRow: {
        gap: 8,
    },
    colorRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    colorPreview: {
        width: 32,
        height: 32,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginTop: 2,
    },
});
