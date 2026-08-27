import { BehaviorSubject, Subscription } from "rxjs";
import { GearApparatus, GearTranslationKey, GearTranslationTable } from "./model";
import { ChronoLens } from "../chrono-lens";

export abstract class Gear<TMap, TChronoLens extends ChronoLens> {
    public abstract id: string;
    public icon?: string;
    public abstract translations: GearTranslationTable;
    public translationKey = GearTranslationKey;

    public isEngaged$ = new BehaviorSubject(false);

    public apparatus: GearApparatus<TMap, TChronoLens>;

    public abstract engage: () => void;
    public abstract disengage: () => void;

    public constructor(apparatus: GearApparatus<TMap, TChronoLens>) {
        this.apparatus = apparatus;
    }

    private subscription: Subscription | null = null;

    public setup = () => {
        this.apparatus.translatron.register(this.id, this.translations);
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
        this.apparatus.translatron.deregister(this.id);
    };
}
