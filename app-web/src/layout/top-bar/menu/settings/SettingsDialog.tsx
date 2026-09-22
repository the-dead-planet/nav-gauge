import { FC, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { DateTime } from "luxon";
import { Dialog, Dropdown } from "@web-ui";
import { Individuator, IndividuatorSettings, Language, Translatron, useTranslate } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { T } from "@web-apparatus";
import { DateFormat, DistanceUnit, TimeFormat, useSubjectState } from "@tinker-chest";
import { ThemeName, themeNameOptions, useTheme } from "@ui";
import { SettingsCheckbox } from "./SettingsCheckbox";
import { SettingsLabel } from "./SettingsLabel";
import styles from './settings-dialog.module.css';

interface Props {
    onClose: () => void;
}

export const SettingsDialog: FC<Props> = ({ onClose }) => {
    const { isDev, namespace, translationKey, individuator } = useWebMachineWard();
    const [settings, setSettings] = useSubjectState(individuator.settings$);
    const [pendingSettings, setPendingSettings] = useState(individuator.settings$.value);
    const translate = useTranslate();
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const isWide = !media.isLessThanSm;

    return createPortal(
        <Dialog
            placement="right-drawer"
            header={translate({ n: individuator.namespace, t: individuator.translationKey.IndividuatorName })}
            closeText={translate({ n: namespace, t: translationKey.Close })}
            onClose={onClose}
            save={{
                saveText: translate({ n: namespace, t: translationKey.Save }),
                onSave: () => setSettings(pendingSettings),
            }}
        >
            <div className={classNames(styles['container'], { [styles['wide']]: isWide })}>
                <div className={styles['field']}>
                    <SettingsLabel wide={isWide} id="individuator-language-label">
                        <T n={individuator.namespace} t={individuator.translationKey.Language} />
                    </SettingsLabel>
                    <Dropdown<Language>
                        popoverClassName={isWide ? styles['skewed-popover'] : undefined}
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
                                        <span>{label} ({locale})</span>
                                    </span>
                                ),
                            }))}
                        onChange={(language) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, language }))}
                    />
                </div>

                <div className={styles['field']}>
                    <SettingsLabel wide={isWide} id="individuator-date-format-label">
                        <T n={individuator.namespace} t={individuator.translationKey.DateFormat} />
                    </SettingsLabel>
                    <Dropdown<DateFormat>
                    popoverClassName={isWide ? styles['skewed-popover'] : undefined}
                    labelledBy="individuator-date-format-label"
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.dateFormat.value}
                    options={Individuator.dateFormatOptions.map(({ value, short }) => ({
                        value,
                        short,
                        label: DateTime.fromObject(
                            { year: 2026, month: 6, day: 17 },
                            { locale: Translatron.languages[pendingSettings.language].locale }
                        ).toFormat(value),
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
                </div>

                <div className={styles['field']}>
                    <SettingsLabel wide={isWide} id="individuator-time-format-label">
                        <T n={individuator.namespace} t={individuator.translationKey.TimeFormat} />
                    </SettingsLabel>
                    <Dropdown<TimeFormat>
                    popoverClassName={isWide ? styles['skewed-popover'] : undefined}
                    labelledBy="individuator-time-format-label"
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.timeFormat}
                    options={Individuator.timeFormatOptions}
                    onChange={(timeFormat) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, timeFormat }))}
                    />
                </div>

                <div className={styles['field']}>
                    <SettingsLabel wide={isWide} id="individuator-distance-unit-label">
                        <T n={individuator.namespace} t={individuator.translationKey.DistanceUnit} />
                    </SettingsLabel>
                    <Dropdown<DistanceUnit>
                    popoverClassName={isWide ? styles['skewed-popover'] : undefined}
                    labelledBy="individuator-distance-unit-label"
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
                </div>

                <div className={styles['field']}>
                    <SettingsLabel wide={isWide} id="individuator-theme-label">
                        <T n={individuator.namespace} t={individuator.translationKey.Theme} />
                    </SettingsLabel>
                    <Dropdown<ThemeName>
                    popoverClassName={isWide ? styles['skewed-popover'] : undefined}
                    labelledBy="individuator-theme-label"
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.themeName}
                    options={themeNameOptions}
                    onChange={(themeName) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, themeName }))}
                    />
                </div>

                <SettingsCheckbox
                    wide={isWide}
                    id="individuator-confirm-before-leave-label"
                    checked={pendingSettings.confirmBeforeLeave}
                    onChange={(checked) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, confirmBeforeLeave: checked }))}
                >
                    <T n={individuator.namespace} t={individuator.translationKey.ConfirmBeforeLeave} />
                </SettingsCheckbox>
                {isDev ? (
                    <SettingsCheckbox
                        wide={isWide}
                        id="individuator-debug-mode-label"
                        checked={pendingSettings.debugMode}
                        onChange={(checked) => setPendingSettings((prev): IndividuatorSettings => ({ ...prev, debugMode: checked }))}
                    >
                        <T n={individuator.namespace} t={individuator.translationKey.DebugMode} />
                    </SettingsCheckbox>
                ) : null}
            </div>
        </Dialog>,
        document.body,
    );
}
