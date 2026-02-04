import { Individuator } from "../machine-ward";
import { StateWarden } from "../state-warden";

export abstract class Gear<TMap, TID extends string = string> {
    public abstract id: TID;
    public abstract engage: (stateWarden: StateWarden<TMap>, individuator: Individuator) => void;
    public abstract disengage: (stateWarden: StateWarden<TMap>, individuator: Individuator) => void;

    public constructor() {}
}
