import { BehaviorSubject } from "rxjs";
import { Theme } from "@ui";
import { Animatrix } from "./animatrix";
import { AttributionVault } from "./attribution-vault"
import { Cartomancer } from "./cartomancer";
import { ChronoLens } from "./chrono-lens";
import { Engine } from "./engine";
import { SignaliumBureau } from "./signalium-bureau";
import { ApplicationSettingsType, getDefaultApplicationSettings } from "@tinker-chest";
import { synchronizeSubjectWithStorage } from "../state/tinkers";

/**
 * Warden does what warden needs to do.
 * Guards the state and provides access to control mechanisms.
 */
export class StateWarden {
    private applicationSettingsStorageId = 'application-settings';
    public applicationSettings$: BehaviorSubject<ApplicationSettingsType>;
    public animatrix: Animatrix;
    public cartomancer: Cartomancer;

    public constructor(storage: StorageLike, prefersLightColorScheme: boolean) {
        this.applicationSettings$ = new BehaviorSubject<ApplicationSettingsType>(getDefaultApplicationSettings(prefersLightColorScheme ? Theme.Light : Theme.Dark));
        synchronizeSubjectWithStorage(this.applicationSettings$, this.applicationSettingsStorageId, storage);

        this.animatrix = new Animatrix(storage);
        this.cartomancer = new Cartomancer(storage);
    }

    public chronoLens = new ChronoLens();
    public attributionVault = new AttributionVault();
    public engine = new Engine();
    public signaliumBureau = new SignaliumBureau();
}
