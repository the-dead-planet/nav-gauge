import { Gear, Individuator, StateWarden } from "@apparatus";

export abstract class __PascalName__Gear<TMap> extends Gear<TMap> {
    public readonly id = "__name__";

    public engage = (_stateWarden: StateWarden<TMap>, _individuator: Individuator) => {
        // TODO implement
    };

    public disengage = (_stateWarden: StateWarden<TMap>, _individuator: Individuator) => {
        // TODO implement
    };
}
