import { Animatrix, AttributionVault, Cartomancer, ChronoLens, Individuator, SignaliumBureau, ToolsStation } from "../..";

export interface GearApparatus<TMap> {
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

    public apparatus: GearApparatus<TMap>;

    public abstract engage: () => void;
    public abstract disengage: () => void;

    public constructor(
        apparatus: GearApparatus<TMap>,
    ) {
        this.apparatus = apparatus;
    }
}
