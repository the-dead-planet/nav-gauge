import { BehaviorSubject, Subscription } from "rxjs";
import { DateFormat, Option, ThemeName, TimeFormat } from "@ui";
import { formatTimestamp } from "@tinker-chest";
import { StorageKeeper } from "../storage-keeper";
import { IndividuatorSettings, Orientation, OrientationSubscriptionDefinition } from "./model";

export class Individuator {
    public readonly orientation$: BehaviorSubject<Orientation>;

    private readonly settingsStorageId = 'application-settings';
    private settingsStorageSubscription: Subscription | null = null;
    public readonly settings$: BehaviorSubject<IndividuatorSettings>;

    public static defaultDateFormat: DateFormat = DateFormat.EEEddMMyyyy;
    public static defaultTimeFormat: TimeFormat = TimeFormat.HHmmss;

    public static dateFormatOptions: Option<DateFormat>[] = [
        { value: DateFormat.EEEddMMyyyy, label: DateFormat.EEEddMMyyyy }
    ];

    public static timeFormatOptions: Option<TimeFormat>[] = [
        { value: TimeFormat.HHmmss, label: TimeFormat.HHmmss }
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
    });

    private orientationSubscription: { unsubscribe: () => void } | null = null;

    public constructor(
        prefersLightColorScheme: boolean,
        protected orientation: OrientationSubscriptionDefinition
    ) {
        const initialSettings = Individuator.getDefaultApplicationSettings(prefersLightColorScheme ? ThemeName.Light : ThemeName.Dark);
        this.settings$ = new BehaviorSubject<IndividuatorSettings>(initialSettings);

        this.orientation$ = new BehaviorSubject<Orientation>(orientation.initial());
    }

    public initialize = (storageKeeper: StorageKeeper) => {
        this.settingsStorageSubscription = storageKeeper.synchronizeSubjectWithStorage(this.settings$, this.settingsStorageId);
        this.orientationSubscription = this.orientation.subscribe((o) => this.orientation$.next(o));
    };

    public cleanUp = () => {
        this.settingsStorageSubscription?.unsubscribe();
        this.orientationSubscription?.unsubscribe();
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
}
