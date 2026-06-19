import { FC, useState } from "react";
import { createPortal } from "react-dom";
import { DateTime } from "luxon";
import { Dialog, Dropdown, P } from "@web-ui";
import { Individuator, Language, Translatron, useMachineWard } from "@apparatus";
import { T } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { DateFormat, TimeFormat } from "@ui";
import styles from './settings-dialog.module.css';

interface Props {
    onClose: () => void;
}

export const SettingsDialog: FC<Props> = ({ onClose }) => {
    const { namespace, individuator, translatron } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings, setSettings] = useSubjectState(individuator.settings$);
    const [pendingSettings, setPendingSettings] = useState(individuator.settings$.value);

    return createPortal(
        <Dialog
            placement="right-drawer"
            header={translatron.translate(settings.language, registry, { n: individuator.namespace, t: 'individuator-name' })}
            closeText={translatron.translate(settings.language, registry, { n: namespace, t: 'close' })}
            onClose={onClose}
            save={{
                saveText: translatron.translate(settings.language, registry, { n: namespace, t: 'save' }),
                onSave: () => setSettings(pendingSettings),
            }}
        >
            <div className={styles['container']}>
                <P id="individuator-language-label" shadow color="primary">
                    <T n={individuator.namespace} t="language" />
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
                    onChange={(language) => setPendingSettings((prev) => ({ ...prev, language }))}
                />

                <P shadow color="primary">
                    <T n={individuator.namespace} t="date-format" />
                </P>
                <Dropdown<DateFormat>
                    labelledBy="individuator-language-label"
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
                    onChange={(dateFormat) => setPendingSettings((prev) => ({ ...prev, dateFormat }))}
                />

                <P shadow color="primary">
                    <T n={individuator.namespace} t="time-format" />
                </P>
                <Dropdown<TimeFormat>
                    labelledBy="individuator-language-label"
                    size="xs"
                    color="primary"
                    variant="fill"
                    value={pendingSettings.timeFormat}
                    options={Individuator.timeFormatOptions}
                    onChange={(timeFormat) => setPendingSettings((prev) => ({ ...prev, timeFormat }))}
                />
            </div>
        </Dialog>,
        document.body,
    );
}
