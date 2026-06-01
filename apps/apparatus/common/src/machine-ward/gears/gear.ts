import { BehaviorSubject, Subscription } from "rxjs";
import { Animatrix, AttributionVault, Cartomancer, ChronoLens, Individuator, SignaliumBureau, ToolsStation, Translatron, TranslationTable, Language } from "../..";

export interface GearApparatus<TMap> {
    individuator: Individuator;
    signaliumBureau: SignaliumBureau;
    attributionVault: AttributionVault;
    chronoLens: ChronoLens;
    cartomancer: Cartomancer<TMap>;
    animatrix: Animatrix;
    toolsStation: ToolsStation<TMap>;
    translatron: Translatron;
}

export type GearTranslationTable = {
    [key in Language]?: { [key in 'name' | 'description']: string; } & { [key in string]: string };
}

export abstract class Gear<TMap> {
    public abstract id: string;
    public icon?: string;
    public abstract translations: GearTranslationTable

    public isEngaged$ = new BehaviorSubject(false);

    public apparatus: GearApparatus<TMap>;

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
                this.apparatus.translatron.register(this.id, this.translations);
                this.engage();
            } else {
                this.disengage();
                this.apparatus.translatron.deregister(this.id);
            }
        });
    };

    public cleanup = () => {
        this.subscription?.unsubscribe();
    };
}
