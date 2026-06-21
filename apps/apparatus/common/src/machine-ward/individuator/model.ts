import { DateFormat, ThemeName, TimeFormat } from "@ui";
import { Language } from "../translatron";

export interface IndividuatorSettings {
    themeName: ThemeName;
    /**
     * When set to `true`, a native confirmation popup will be shown before closing or reloading the page.
     */
    confirmBeforeLeave: boolean;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
    language: Language;
}

export enum IndividuatorTranslationKey {
    IndividuatorName = "individuator-name",
    Language = "language",
    DateFormat = "date-format",
    TimeFormat = "time-format",
};
