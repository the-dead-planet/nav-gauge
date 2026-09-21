import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox, Dialog, Dropdown, Text } from "@mobile-ui";
import { Individuator, IndividuatorSettings, Language, Translatron, useTranslate } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { T } from "@mobile-apparatus";
import { DateFormat, DistanceUnit, TimeFormat, useSubjectState } from "@tinker-chest";
import { ThemeName, themeNameOptions } from "@ui";

const styles = StyleSheet.create({
    container: {
        rowGap: 10,
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

    return (
        <Dialog
            placement="right-drawer"
            style={{
                transform: [{ skewX: "-12deg" }],
            }}
            header={translate({ n: individuator.namespace, t: individuator.translationKey.IndividuatorName })}
            closeText={translate({ n: namespace, t: translationKey.Close })}
            onClose={onClose}
            save={{
                saveText: translate({ n: namespace, t: translationKey.Save }),
                onSave: () => setSettings(pendingSettings),
            }}
        >
            <View style={styles.container}>
                <Text color="primary" shadow>
                    <T n={individuator.namespace} t={individuator.translationKey.Language} />
                </Text>
                <Dropdown<Language>
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.language}
                    options={Object.entries(Translatron.languages)
                        .map(([language, { label, locale, symbol }]) => ({
                            value: language as Language,
                            label: `${symbol} ${label.toUpperCase()} (${locale})`,
                        }))}
                    onChange={(language) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, language }))}
                />

                <Text color="primary" shadow>
                    <T n={individuator.namespace} t={individuator.translationKey.DateFormat} />
                </Text>
                <Dropdown<DateFormat>
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.dateFormat.value}
                    options={Individuator.dateFormatOptions.map(({ value, _example }) => ({
                        value,
                        label: _example.toUpperCase(),
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

                <Text color="primary" shadow>
                    <T n={individuator.namespace} t={individuator.translationKey.TimeFormat} />
                </Text>
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

                <Text color="primary" shadow>
                    <T n={individuator.namespace} t={individuator.translationKey.DistanceUnit} />
                </Text>
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

                <Text color="primary" shadow>
                    <T n={individuator.namespace} t={individuator.translationKey.Theme} />
                </Text>
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

                <Text color="primary" shadow>
                    <T n={individuator.namespace} t={individuator.translationKey.ConfirmBeforeLeave} />
                </Text>
                <Checkbox
                    size="xs"
                    color="primary"
                    checked={pendingSettings.confirmBeforeLeave}
                    onChange={(checked) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, confirmBeforeLeave: checked }))}
                />
                {isDev ? (
                    <>
                        <Text color="primary" shadow>
                            <T n={individuator.namespace} t={individuator.translationKey.DebugMode} />
                        </Text>
                        <Checkbox
                            size="xs"
                            color="primary"
                            checked={pendingSettings.debugMode}
                            onChange={(checked) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, debugMode: checked }))}
                        />
                    </>
                ) : null}
            </View>
        </Dialog>
    );
}
