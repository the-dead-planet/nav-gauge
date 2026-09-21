import { ThemeMode, ThemeName } from "@ui";
import { DateFormat, DistanceUnit, TimeFormat } from "@tinker-chest";
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
    locale: string;
    distanceUnit: DistanceUnit;
    language: Language;
    /**
     * Will show additional debug layers and components when in dev mode
     */
    debugMode: boolean;
}

export enum IndividuatorTranslationKey {
    IndividuatorName = "individuator-name",
    Language = "language",
    DateFormat = "date-format",
    TimeFormat = "time-format",
    DistanceUnit = 'distance-unit',
    Metric = 'metric',
    Imperial = 'imperial',
    Theme = 'theme',
    ConfirmBeforeLeave = 'confirm-before-leave',
    DebugMode = 'debug-mode',
};
