import { BehaviorSubject } from "rxjs";
import { DateFormat, Option, ThemeName, TimeFormat } from "@ui";
import { formatTimestamp } from "@tinker-chest";
import { StorageKeeper } from "../storage-keeper";
import { IndividuatorSettings } from "./model";

export class Individuator {
    /**
     * Provides default settings which can be later changed by user.
     * @param defaultTheme Defaults to dark theme.
     * @returns 
     */
    private static getDefaultApplicationSettings = (defaultThemeName?: ThemeName): IndividuatorSettings => ({
        themeName: defaultThemeName || ThemeName.Dark,
        /**
         * When set to true, user will be shown a confirmation popup on page close or reload.
         */
        confirmBeforeLeave: false,
        dateFormat: this.defaultDateFormat,
        timeFormat: this.defaultTimeFormat,
    });

    private readonly settingsStorageId = 'application-settings';
    public readonly settings$: BehaviorSubject<IndividuatorSettings>;

    public static defaultDateFormat: DateFormat = DateFormat.EEEddMMyyyy;
    public static defaultTimeFormat: TimeFormat = TimeFormat.HHmmss;

    public static dateFormatOptions: Option<DateFormat>[] = [
        { value: DateFormat.EEEddMMyyyy, label: DateFormat.EEEddMMyyyy }
    ];

    public static timeFormatOptions: Option<TimeFormat>[] = [
        { value: TimeFormat.HHmmss, label: TimeFormat.HHmmss }
    ];

    public constructor(storageKeeper: StorageKeeper, prefersLightColorScheme: boolean) {
        const initialSettings = Individuator.getDefaultApplicationSettings(prefersLightColorScheme ? ThemeName.Light : ThemeName.Dark);
        this.settings$ = new BehaviorSubject<IndividuatorSettings>(initialSettings);
        storageKeeper.synchronizeSubjectWithStorage(this.settings$, this.settingsStorageId);
    }

    /**
     * Formats time in milliseconds since epoch according to individuator settings.
     */
    public formatTimestamp = (
        epochMs: number,
        settings: IndividuatorSettings,
    ): string => {
        return formatTimestamp(epochMs, { dateFormat: settings.dateFormat, timeFormat: settings.timeFormat });
    };
}
