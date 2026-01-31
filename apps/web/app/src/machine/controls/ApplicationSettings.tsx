import { FC } from "react";
import { themeOptions, ThemeName } from "@ui";
import { Fieldset, Input } from "@web-ui";
import { IndividuatorSettings, useMachineWard, useSubjectState } from "@apparatus";
import * as styles from './controls.module.css';

export const ApplicationSettingsSection: FC = () => {
    const { individuator } = useMachineWard();
    const [settings, setSettings] = useSubjectState(individuator.settings$);
    const { confirmBeforeLeave } = settings;

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings((prev): IndividuatorSettings => ({
            ...prev,
            themeName: event.target.value as ThemeName
        }));
    };

    return (
        <Fieldset label="Application settings">
            <Input
                id="confirm-before-leave"
                name="confirm-before-leave"
                label="Confirm before leave"
                labelPlacement="after"
                type='checkbox'
                checked={confirmBeforeLeave}
                onChange={() => { }}
                onContainerClick={() => setSettings((prev) => ({ ...prev, confirmBeforeLeave: !prev.confirmBeforeLeave }))}
                containerClassName={styles["checkbox"]}
            />

            {/* TODO: Move to reusable component and remove style */}
            <div>
                <label htmlFor="presets" style={{ fontSize: "12px" }}>Theme</label>
                <select name="presets" id="presets" value={settings.themeName} onChange={handleThemeChange}>
                    {themeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </Fieldset>
    );
};
