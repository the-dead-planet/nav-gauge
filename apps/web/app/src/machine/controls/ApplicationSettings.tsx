import { FC } from "react";
import { themeOptions, Theme } from "@ui";
import { Fieldset, Input } from "@web-ui";
import * as styles from './controls.module.css';
import { useStateWarden, useSubjectState } from "@apparatus";

export const ApplicationSettings: FC = () => {
    const stateWarden = useStateWarden();
    const [applicationSettings, setApplicationSettings] = useSubjectState(stateWarden.applicationSettings$);
    const { confirmBeforeLeave } = applicationSettings;

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setApplicationSettings((prev) => ({ ...prev, theme: event.target.value as Theme }));
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
                onContainerClick={() => setApplicationSettings((prev) => ({ ...prev, confirmBeforeLeave: !prev.confirmBeforeLeave }))}
                containerClassName={styles["checkbox"]}
            />

            {/* TODO: Move to reusable component and remove style */}
            <div>
                <label htmlFor="presets" style={{ fontSize: "12px" }}>Theme</label>
                <select name="presets" id="presets" value={applicationSettings.theme} onChange={handleThemeChange}>
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
