import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox, Dialog, Dropdown, Text } from "@mobile-ui";
import { Individuator, IndividuatorSettings, Language, Translatron } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { T } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import { DateFormat, ThemeName, themeNameOptions, TimeFormat } from "@ui";

const styles = StyleSheet.create({
    container: {
        rowGap: 10,
    },
});

interface Props {
    onClose: () => void;
}

export const SettingsDialog: FC<Props> = ({ onClose }) => {
    const { namespace, translationKey, individuator, translatron } = useMobileMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings, setSettings] = useSubjectState(individuator.settings$);
    const [pendingSettings, setPendingSettings] = useState(individuator.settings$.value);

    return (
        <Dialog
            placement="right-drawer"
            style={{
                transform:  [{ skewX: "-12deg" }],
            }}
            header={translatron.translate(settings.language, registry, { n: individuator.namespace, t: individuator.translationKey.IndividuatorName })}
            closeText={translatron.translate(settings.language, registry, { n: namespace, t: translationKey.Close })}
            onClose={onClose}
            save={{
                saveText: translatron.translate(settings.language, registry, { n: namespace, t: translationKey.Save }),
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
            </View>
        </Dialog>
    );
}
