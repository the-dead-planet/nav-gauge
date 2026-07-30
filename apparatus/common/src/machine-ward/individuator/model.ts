import { DateFormat, ThemeMode, ThemeName, TimeFormat } from "@ui";
import { Language } from "../translatron";

export interface IndividuatorSettings {
    themeMode: ThemeMode;
    themeName: ThemeName;
    /**
     * When set to `true`, a native confirmation popup will be shown before closing or reloading the page.
     */
    confirmBeforeLeave: boolean;
    dateFormat: { value: DateFormat; short: DateFormat; };
    timeFormat: TimeFormat;
    language: Language;
}

export enum IndividuatorTranslationKey {
    IndividuatorName = "individuator-name",
    Language = "language",
    DateFormat = "date-format",
    TimeFormat = "time-format",
    Theme = 'theme',
    ConfirmBeforeLeave = 'confirm-before-leave',
};
