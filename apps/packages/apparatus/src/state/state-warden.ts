import { Animatrix } from "./animatrix/animatrix";
import { AttributionVault } from "./attribution-vault"
import { Cartomancer } from "./cartomancer";
import { ChronoLens } from "./chrono-lens";
import { Engine } from "./engine";
import { SignaliumBureau } from "./signalium-bureau";

/**
 * Warden does what warden needs to do.
 * Guards the state and provides access to control mechanisms.
 */
export class StateWarden {
    public animatrix: Animatrix;
    public cartomancer: Cartomancer;

    public constructor(storage: StorageLike) {
        this.animatrix = new Animatrix(storage);
        this.cartomancer = new Cartomancer(storage);
    }

    public chronoLens = new ChronoLens();
    public attributionVault = new AttributionVault();
    public engine = new Engine();
    public signaliumBureau = new SignaliumBureau();
}
