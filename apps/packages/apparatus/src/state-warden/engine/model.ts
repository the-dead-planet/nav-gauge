import { StateWarden } from "../state-warden";

export interface Gear<T extends string = string> {
    id: T;
    engage: (stateWarden: StateWarden) => void;
    disengage: (stateWarden: StateWarden) => void;
}
