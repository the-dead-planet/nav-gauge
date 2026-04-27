import { Individuator } from "../machine-ward";
import { StateWarden } from "../state-warden";

export abstract class Gear<TMap> {
    public abstract id: string;

    public stateWarden: StateWarden<TMap>;
    protected individuator: Individuator;

    public abstract engage: (stateWarden: StateWarden<TMap>, individuator: Individuator) => void;
    public abstract disengage: (stateWarden: StateWarden<TMap>, individuator: Individuator) => void;

    public constructor(
        stateWarden: StateWarden<TMap>,
        individuator: Individuator,
    ) {
        this.stateWarden = stateWarden;
        this.individuator = individuator;
    }
}
