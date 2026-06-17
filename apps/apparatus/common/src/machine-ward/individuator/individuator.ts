import { BehaviorSubject, Subscription } from "rxjs";
import { DateFormat, Option, ThemeName, TimeFormat, formatTimestamp } from "@ui";
import { StorageKeeper } from "../storage-keeper";
import { IndividuatorSettings } from "./model";
import { Translatron } from "../translatron";

export class Individuator {
    private readonly settingsStorageId = 'application-settings';
    private settingsStorageSubscription: Subscription | null = null;
    public readonly settings$: BehaviorSubject<IndividuatorSettings>;

    public static defaultDateFormat: DateFormat = DateFormat.EEEddMMyyyy;
    public static defaultTimeFormat: TimeFormat = TimeFormat.HHmmss;

    public static dateFormatOptions: Option<DateFormat>[] = [
        { value: DateFormat.EEEEMMMMdyyyy, label: 'Wednesday, June 17, 2026' },
        { value: DateFormat.EEEEMMMdyyyy, label: 'Wednesday, Jun 17, 2026' },
        { value: DateFormat.EEEEMMddyyyy, label: 'Wednesday 06/17/2026' },
        { value: DateFormat.EEEEdMMMMyyyy, label: 'Wednesday, 17 June, 2026' },
        { value: DateFormat.EEEEdMMMyyyy, label: 'Wednesday, 17 Jun, 2026' },
        { value: DateFormat.EEEEddMMyyyy, label: 'Wednesday 17/06/2026' },
        { value: DateFormat.EEEEMMMMdyyyy, label: 'Wednesday, 17 June, 2026' },
        { value: DateFormat.EEEMMMdyyyy, label: 'Wed, Jun 17, 2026' },
        { value: DateFormat.EEEMMddyyyy, label: 'Wed 06/17/2026' },
        { value: DateFormat.EEEdMMMMyyyy, label: 'Wed, 17 June, 2026' },
        { value: DateFormat.EEEdMMMyyyy, label: 'Wed, 17 Jun, 2026' },
        { value: DateFormat.EEEddMMyyyy, label: 'Wed 17/06/2026' },
        { value: DateFormat.MMMMdyyyy, label: 'June 17, 2026' },
        { value: DateFormat.MMMdyyyy, label: 'Jun 17, 2026' },
        { value: DateFormat.MMddyyyy, label: '06/17/2026' },
        { value: DateFormat.dMMMMyyyy, label: '17 June, 2026' },
        { value: DateFormat.dMMMyyyy, label: '17 Jun, 2026' },
        { value: DateFormat.ddMMyyyy, label: '17/06/2026' },
    ];

    public static timeFormatOptions: Option<TimeFormat>[] = [
        { value: TimeFormat.HHmmss, label: '14:30:00 (24h, zero-padded)' },
        { value: TimeFormat.Hmmss, label: '9:30:00 (24h)' },
        { value: TimeFormat.hhmmssa, label: '02:30:00 pm (12h, zero-padded)' },
        { value: TimeFormat.hmmssa, label: '9:30:00 am (12h)' },
    ];

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
        language: Translatron.defaultLanguage,
    });

    public constructor(
        prefersLightColorScheme: boolean
    ) {
        const initialSettings = Individuator.getDefaultApplicationSettings(prefersLightColorScheme ? ThemeName.Light : ThemeName.Dark);
        this.settings$ = new BehaviorSubject<IndividuatorSettings>(initialSettings);
    }

    public initialize = (storageKeeper: StorageKeeper) => {
        storageKeeper.synchronizeSubjectWithStorage(this.settings$, this.settingsStorageId)
            .then((s) => this.settingsStorageSubscription = s);
    };

    public cleanUp = () => {
        this.settingsStorageSubscription?.unsubscribe();
    };

    /**
     * Formats time in milliseconds since epoch according to individuator settings.
     */
    public formatTimestamp = (
        epochMs: number,
        settings: IndividuatorSettings,
    ): string => {
        return formatTimestamp(epochMs, { dateFormat: settings.dateFormat, timeFormat: settings.timeFormat });
    };

    /**
     * Toggles between light and dark mode.
     */
    public toggleMode = () => {
        this.settings$.next(({
            ...this.settings$.value,
            themeName: this.settings$.value.themeName === ThemeName.Dark
                ? ThemeName.Light
                : ThemeName.Dark
        }));
    };

}
