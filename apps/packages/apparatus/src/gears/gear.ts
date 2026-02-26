import { Individuator } from "../machine-ward";
import { ChronoLens, StateWarden } from "../state-warden";

export abstract class Gear<TMap, TID extends string = string> {
    public abstract id: TID;
    
    protected individuator: Individuator;
    protected chronoLens: ChronoLens;

    public abstract engage: (stateWarden: StateWarden<TMap>, individuator: Individuator) => void;
    public abstract disengage: (stateWarden: StateWarden<TMap>, individuator: Individuator) => void;

    public constructor(
        individuator: Individuator,
        chronoLens: ChronoLens
    ) {
        this.individuator = individuator;
        this.chronoLens = chronoLens;
    }
}
