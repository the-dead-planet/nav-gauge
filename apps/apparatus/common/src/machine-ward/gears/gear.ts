import { BehaviorSubject, Subscription } from "rxjs";
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
    public abstract name: string;
    public abstract description: string;
    public icon?: string;

    public isEngaged$ = new BehaviorSubject(false);

    protected apparatus: GearApparatus<TMap>;

    public abstract engage: () => void;
    public abstract disengage: () => void;

    public constructor(
        apparatus: GearApparatus<TMap>,
    ) {
        this.apparatus = apparatus;
    }

    private subscription: Subscription | null = null;

    public setup = () => {
        this.subscription = this.isEngaged$.subscribe((isEngaged) => {
            if (isEngaged) {
                this.engage();
            } else {
                this.disengage();
            }
        });
    };

    public cleanup = () => {
        this.subscription?.unsubscribe();
    };
}
