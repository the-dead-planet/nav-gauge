import { DateFormat, ThemeName, TimeFormat } from "@ui";

export interface IndividuatorSettings {
    themeName: ThemeName;
    /**
     * When set to `true`, a native confirmation popup will be shown before closing or reloading the page.
     */
    confirmBeforeLeave: boolean;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
}
