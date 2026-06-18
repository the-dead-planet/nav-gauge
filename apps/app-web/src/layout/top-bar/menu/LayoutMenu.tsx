import { FC, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, Dropdown, Menu, MenuItem, P, Span } from "@web-ui";
import { Individuator, Language, Translatron, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { DateFormat, TimeFormat } from "@ui";
import styles from './layout-menu.module.css';

export const LayoutMenu: FC = () => {
    const { individuator } = useMachineWard();
    const [_settings, setSettings] = useSubjectState(individuator.settings$);
    const [pendingSettings, setPendingSettings] = useState(individuator.settings$.value);
    const [showIndividuatorDialog, setShowIndividuatorDialog] = useState(false);

    return (
        <>
            <Menu placement="bottom-right" iconActiveColor="secondary">
                <MenuItem key="individuator" type="button" closeOnPress onClick={() => setShowIndividuatorDialog(true)}>
                    <Span>Individuator</Span>
                </MenuItem>
                <MenuItem
                    key="legal"
                    type="link"
                    href="/legal"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Span>Legal</Span>
                </MenuItem>
                <MenuItem
                    key="link"
                    type="link"
                    href="/privacy"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Span>Privacy</Span>
                </MenuItem>
            </Menu>

            {showIndividuatorDialog ? createPortal(
                <Dialog
                    placement="right-drawer"
                    header="Individuator"
                    onClose={() => setShowIndividuatorDialog(false)}
                    onSave={() => setSettings(pendingSettings)}
                >
                    <div className={styles['container']}>
                        <P id="individuator-language-label" shadow color="primary">Language</P>
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

                        <P shadow color="primary">Date format</P>
                        <Dropdown<DateFormat>
                            labelledBy="individuator-language-label"
                            size="xs"
                            color="primary"
                            variant="fill"
                            value={pendingSettings.dateFormat}
                            options={Individuator.dateFormatOptions}
                            onChange={(dateFormat) => setPendingSettings((prev) => ({ ...prev, dateFormat }))}
                        />

                        <P shadow color="primary">Time format</P>
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
