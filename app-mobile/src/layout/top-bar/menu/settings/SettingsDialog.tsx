import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dialog, Dropdown } from "@mobile-ui";
import { Individuator, IndividuatorSettings, Language, Translatron, useTranslate } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { T } from "@mobile-apparatus";
import { DateFormat, DistanceUnit, TimeFormat, useSubjectState } from "@tinker-chest";
import { ThemeName, themeNameOptions, useTheme } from "@ui";
import { SettingsCheckbox } from "./SettingsCheckbox";
import { SettingsLabel } from "./SettingsLabel";

const styles = StyleSheet.create({
    container: {
        rowGap: 10,
    },
    field: {
        gap: 6,
    },
    wideField: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    wideDialog: {
        width: 520,
    },
    wideControl: {
        flex: 1,
    },
    control: {
        width: '100%',
    },
});

interface Props {
    onClose: () => void;
}

export const SettingsDialog: FC<Props> = ({ onClose }) => {
    const { isDev, namespace, translationKey, individuator } = useMobileMachineWard();
    const [_settings, setSettings] = useSubjectState(individuator.settings$);
    const [pendingSettings, setPendingSettings] = useState(individuator.settings$.value);
    const translate = useTranslate();
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const isWide = !media.isLessThanSm;

    return (
        <Dialog
            placement="right-drawer"
            style={isWide ? styles.wideDialog : undefined}
            header={translate({ n: individuator.namespace, t: individuator.translationKey.IndividuatorName })}
            closeText={translate({ n: namespace, t: translationKey.Close })}
            onClose={onClose}
            save={{
                saveText: translate({ n: namespace, t: translationKey.Save }),
                onSave: () => setSettings(pendingSettings),
            }}
        >
            <View style={styles.container}>
                <View style={[styles.field, isWide && styles.wideField]}>
                    <SettingsLabel wide={isWide}>
                        <T n={individuator.namespace} t={individuator.translationKey.Language} />
                    </SettingsLabel>
                    <View style={isWide ? styles.wideControl : styles.control}>
                        <Dropdown<Language>
                            size="xs"
                            color="primary"
                            variant="fill"
                            value={pendingSettings.language}
                            options={Object.entries(Translatron.languages)
                                .map(([language, { label, locale, symbol }]) => ({
                                    value: language as Language,
                                    label: `${symbol} ${label} (${locale})`,
                                }))}
                            onChange={(language) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, language }))}
                        />
                    </View>
                </View>

                <View style={[styles.field, isWide && styles.wideField]}>
                    <SettingsLabel wide={isWide}>
                        <T n={individuator.namespace} t={individuator.translationKey.DateFormat} />
                    </SettingsLabel>
                    <View style={isWide ? styles.wideControl : styles.control}>
                        <Dropdown<DateFormat>
                            size="xs"
                            color="primary"
                            variant="fill"
                            value={pendingSettings.dateFormat.value}
                            options={Individuator.dateFormatOptions.map(({ value, _example }) => ({
                                value,
                                label: _example,
                            }))}
                            onChange={(dateFormat) => setPendingSettings((prev): IndividuatorSettings => {
                                const option = Individuator.dateFormatOptions.find((option) => option.value === dateFormat);
                                if (!option) {
                                    return prev;
                                }
                                return {
                                    ...prev,
                                    dateFormat: {
                                        value: option.value,
                                        short: option.short,
                                    }
                                };
                            })}
                        />
                    </View>
                </View>

                <View style={[styles.field, isWide && styles.wideField]}>
                    <SettingsLabel wide={isWide}>
                        <T n={individuator.namespace} t={individuator.translationKey.TimeFormat} />
                    </SettingsLabel>
                    <View style={isWide ? styles.wideControl : styles.control}>
                        <Dropdown<TimeFormat>
                            size="xs"
                            color="primary"
                            variant="fill"
                            value={pendingSettings.timeFormat}
                            options={Individuator.timeFormatOptions.map(({ value, label }) => ({
                                value,
                                label: String(label),
                            }))}
                            onChange={(timeFormat) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, timeFormat }))}
                        />
                    </View>
                </View>

                <View style={[styles.field, isWide && styles.wideField]}>
                    <SettingsLabel wide={isWide}>
                        <T n={individuator.namespace} t={individuator.translationKey.DistanceUnit} />
                    </SettingsLabel>
                    <View style={isWide ? styles.wideControl : styles.control}>
                        <Dropdown<DistanceUnit>
                            size="xs"
                            color="primary"
                            variant="fill"
                            value={pendingSettings.distanceUnit}
                            options={Individuator.distanceUnitOptions.map(({ value, translationKey }) => ({
                                value,
                                label: translate({ n: individuator.namespace, t: translationKey }),
                            }))}
                            onChange={(distanceUnit) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, distanceUnit }))}
                        />
                    </View>
                </View>

                <View style={[styles.field, isWide && styles.wideField]}>
                    <SettingsLabel wide={isWide}>
                        <T n={individuator.namespace} t={individuator.translationKey.Theme} />
                    </SettingsLabel>
                    <View style={isWide ? styles.wideControl : styles.control}>
                        <Dropdown<ThemeName>
                            size="xs"
                            color="primary"
                            variant="fill"
                            value={pendingSettings.themeName}
                            options={themeNameOptions.map(({ value, label }) => ({
                                value,
                                label: String(label),
                            }))}
                            onChange={(themeName) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, themeName }))}
                        />
                    </View>
                </View>

                <SettingsCheckbox
                    wide={isWide}
                    checked={pendingSettings.confirmBeforeLeave}
                    onChange={(checked) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, confirmBeforeLeave: checked }))}
                >
                    <T n={individuator.namespace} t={individuator.translationKey.ConfirmBeforeLeave} />
                </SettingsCheckbox>
                {isDev ? (
                    <SettingsCheckbox
                        wide={isWide}
                        checked={pendingSettings.debugMode}
                        onChange={(checked) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, debugMode: checked }))}
                    >
                        <T n={individuator.namespace} t={individuator.translationKey.DebugMode} />
                    </SettingsCheckbox>
                ) : null}
            </View>
        </Dialog>
    );
}
