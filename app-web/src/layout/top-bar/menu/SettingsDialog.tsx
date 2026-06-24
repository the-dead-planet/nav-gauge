import { FC, useState } from "react";
import { createPortal } from "react-dom";
import { DateTime } from "luxon";
import { Checkbox, Dialog, Dropdown, P } from "@web-ui";
import { Individuator, IndividuatorSettings, Language, Translatron, useMachineWard } from "@apparatus";
import { T } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { DateFormat, ThemeName, themeNameOptions, TimeFormat } from "@ui";
import styles from './settings-dialog.module.css';

interface Props {
    onClose: () => void;
}

export const SettingsDialog: FC<Props> = ({ onClose }) => {
    const { namespace, translationKey, individuator, translatron } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings, setSettings] = useSubjectState(individuator.settings$);
    const [pendingSettings, setPendingSettings] = useState(individuator.settings$.value);

    return createPortal(
        <Dialog
            placement="right-drawer"
            header={translatron.translate(settings.language, registry, { n: individuator.namespace, t: individuator.translationKey.IndividuatorName })}
            closeText={translatron.translate(settings.language, registry, { n: namespace, t: translationKey.Close })}
            onClose={onClose}
            save={{
                saveText: translatron.translate(settings.language, registry, { n: namespace, t: translationKey.Save }),
                onSave: () => setSettings(pendingSettings),
            }}
        >
            <div className={styles['container']}>
                <P id="individuator-language-label" shadow color="primary">
                    <T n={individuator.namespace} t={individuator.translationKey.Language} />
                </P>
                <Dropdown<Language>
                    labelledBy="individuator-language-label"
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.language}
                    options={Object.entries(Translatron.languages)
                        .map(([language, { label, locale, symbol }]) => ({
                            value: language as Language,
                            label: (
                                <span className={styles['option']}>
                                    <span>{symbol}</span>
                                    <span>{label.toUpperCase()} ({locale})</span>
                                </span>
                            ),
                        }))}
                    onChange={(language) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, language }))}
                />

                <P id="individuator-date-format-label" shadow color="primary">
                    <T n={individuator.namespace} t={individuator.translationKey.DateFormat} />
                </P>
                <Dropdown<DateFormat>
                    labelledBy="individuator-date-format-label"
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.dateFormat}
                    options={Individuator.dateFormatOptions.map(({ value }) => ({
                        value,
                        label: DateTime.fromObject(
                            { year: 2026, month: 6, day: 17 },
                            { locale: Translatron.languages[pendingSettings.language].locale }
                        ).toFormat(value).toUpperCase(),
                    }))}
                    onChange={(dateFormat) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, dateFormat }))}
                />

                <P id="individuator-time-format-label" shadow color="primary">
                    <T n={individuator.namespace} t={individuator.translationKey.TimeFormat} />
                </P>
                <Dropdown<TimeFormat>
                    labelledBy="individuator-time-format-label"
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.timeFormat}
                    options={Individuator.timeFormatOptions}
                    onChange={(timeFormat) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, timeFormat }))}
                />

                <P id="individuator-theme-label" shadow color="primary">
                    <T n={individuator.namespace} t={individuator.translationKey.Theme} />
                </P>
                <Dropdown<ThemeName>
                    labelledBy="individuator-theme-label"
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.themeName}
                    options={themeNameOptions}
                    onChange={(themeName) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, themeName }))}
                />

                <P id="individuator-confirm-before-leave-label" shadow color="primary">
                    <T n={individuator.namespace} t={individuator.translationKey.ConfirmBeforeLeave} />
                </P>
                <Checkbox
                    labelledBy="individuator-confirm-before-leave-label"
                    size="xs"
                    color="primary"
                    checked={pendingSettings.confirmBeforeLeave}
                    onChange={(checked) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, confirmBeforeLeave: checked }))}
                />
            </div>
        </Dialog>,
        document.body,
    );
}
