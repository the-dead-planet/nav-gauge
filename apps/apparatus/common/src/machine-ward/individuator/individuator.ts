import { BehaviorSubject, Subscription } from "rxjs";
import { DateFormat, Option, ThemeName, TimeFormat, formatTimestamp } from "@ui";
import { StorageKeeper } from "../storage-keeper";
import { IndividuatorSettings } from "./model";
import { TranslationTable, Translatron } from "../translatron";
import * as Translations from "./translations";

export class Individuator {
    public namespace = 'individuator';
    public translations: TranslationTable = Translations;

    private readonly settingsStorageId = 'application-settings';
    private settingsStorageSubscription: Subscription | null = null;
    public readonly settings$: BehaviorSubject<IndividuatorSettings>;

    public static defaultDateFormat: DateFormat = DateFormat.EEEddMMyyyy;
    public static defaultTimeFormat: TimeFormat = TimeFormat.HHmmss;

    public static dateFormatOptions: { value: DateFormat; _example: string }[] = [
        { value: DateFormat.EEEEMMMMdyyyy, _example: 'Wednesday, June 17, 2026' },
        { value: DateFormat.EEEEMMMdyyyy, _example: 'Wednesday, Jun 17, 2026' },
        { value: DateFormat.EEEEMMddyyyy, _example: 'Wednesday 06/17/2026' },
        { value: DateFormat.EEEEdMMMMyyyy, _example: 'Wednesday, 17 June, 2026' },
        { value: DateFormat.EEEEdMMMyyyy, _example: 'Wednesday, 17 Jun, 2026' },
        { value: DateFormat.EEEEddMMyyyy, _example: 'Wednesday 17/06/2026' },
        { value: DateFormat.EEEEMMMMdyyyy, _example: 'Wednesday, 17 June, 2026' },
        { value: DateFormat.EEEMMMdyyyy, _example: 'Wed, Jun 17, 2026' },
        { value: DateFormat.EEEMMddyyyy, _example: 'Wed 06/17/2026' },
        { value: DateFormat.EEEdMMMMyyyy, _example: 'Wed, 17 June, 2026' },
        { value: DateFormat.EEEdMMMyyyy, _example: 'Wed, 17 Jun, 2026' },
        { value: DateFormat.EEEddMMyyyy, _example: 'Wed 17/06/2026' },
        { value: DateFormat.MMMMdyyyy, _example: 'June 17, 2026' },
        { value: DateFormat.MMMdyyyy, _example: 'Jun 17, 2026' },
        { value: DateFormat.MMddyyyy, _example: '06/17/2026' },
        { value: DateFormat.dMMMMyyyy, _example: '17 June, 2026' },
        { value: DateFormat.dMMMyyyy, _example: '17 Jun, 2026' },
        { value: DateFormat.ddMMyyyy, _example: '17/06/2026' },
    ];

    public static timeFormatOptions: Option<TimeFormat>[] = [
        { value: TimeFormat.HHmmss, label: '09:30:00 (24h, 0H)' },
        { value: TimeFormat.Hmmss, label: '9:30:00 (24h, H)' },
        { value: TimeFormat.hhmmssa, label: '02:30:00 pm (12h, 0H)' },
        { value: TimeFormat.hmmssa, label: '2:30:00 pm (12h, H)' },
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
