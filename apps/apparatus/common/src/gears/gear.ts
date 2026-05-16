import { Individuator } from "../machine-ward";
import { Animatrix, AttributionVault, Cartomancer, ChronoLens, SignaliumBureau, ToolsStation } from "../state-warden";

export interface GearStateWarden<TMap> {
    individuator: Individuator;
    signaliumBureau: SignaliumBureau;
    attributionVault: AttributionVault;
    chronoLens: ChronoLens;
    cartomancer: Cartomancer<TMap>;
    animatrix: Animatrix;
    toolsStation: ToolsStation<TMap>;
}

export abstract class Gear<TMap> {
    public abstract id: string;

    public stateWarden: GearStateWarden<TMap>;

    public abstract engage: () => void;
    public abstract disengage: () => void;

    public constructor(
        stateWarden: GearStateWarden<TMap>,
    ) {
        this.stateWarden = stateWarden;
    }
}
