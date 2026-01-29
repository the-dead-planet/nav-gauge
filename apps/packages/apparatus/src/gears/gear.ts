import { StateWarden } from "../state-warden";

export abstract class Gear<T extends string = string> {
    public abstract id: T;
    public abstract engage: (stateWarden: StateWarden) => void;
    public abstract disengage: (stateWarden: StateWarden) => void;
}
