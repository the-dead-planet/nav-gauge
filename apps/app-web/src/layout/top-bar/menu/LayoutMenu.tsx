import { FC, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, Dropdown, Menu, MenuItem, P, Span } from "@web-ui";
import { Individuator, Language, Translatron, useMachineWard } from "@apparatus";
import { T } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { DateFormat, TimeFormat } from "@ui";
import styles from './layout-menu.module.css';

export const LayoutMenu: FC = () => {
    const { namespace, individuator, translatron } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings, setSettings] = useSubjectState(individuator.settings$);
    const [pendingSettings, setPendingSettings] = useState(individuator.settings$.value);
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);

    return (
        <>
            <Menu placement="bottom-right" iconActiveColor="secondary">
                <MenuItem key="individuator" type="button" closeOnPress onClick={() => setShowIndividuatorDialog(true)}>
                    <T n={individuator.namespace} t="individuator-name" />
                </MenuItem>
                <MenuItem
                    key="legal"
                    type="link"
                    href="/legal"
                    target="_blank"
                    rel="noreferrer"
                >
                    <T n={namespace} t="legal" />
                </MenuItem>
                <MenuItem
                    key="privacy"
                    type="link"
                    href="/privacy"
                    target="_blank"
                    rel="noreferrer"
                >
                    <T n={namespace} t="privacy" />
                </MenuItem>
            </Menu>

            {showIndividuatorDialog ? createPortal(
                <Dialog
                    placement="right-drawer"
                    header="Individuator"
                    closeText={translatron.translate(settings.language, registry, { n: namespace, t: 'close' })}
                    onClose={() => setShowIndividuatorDialog(false)}
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
                                            <span>{label} ({locale})</span>
                                        </span>
                                    ),
                                }))}
                            onChange={(language) => setPendingSettings((prev) => ({ ...prev, language }))}
                        />

                        <P shadow color="primary"><T n={individuator.namespace} t="date-format" /></P>
                        <Dropdown<DateFormat>
                            labelledBy="individuator-language-label"
                            size="xs"
                            color="primary"
                            variant="fill"
                            value={pendingSettings.dateFormat}
                            options={Individuator.dateFormatOptions}
                            onChange={(dateFormat) => setPendingSettings((prev) => ({ ...prev, dateFormat }))}
                        />

                        <P shadow color="primary"><T n={individuator.namespace} t="time-format" /></P>
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
            ) : null}
        </>
    );
}
