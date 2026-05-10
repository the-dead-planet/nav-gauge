import { Gear, Individuator, StateWarden } from "@apparatus";
import { MobileMap } from "@mobile-ui";

export class Mobile__PascalName__Gear extends Gear<MobileMap> {
    public readonly id = "__name__";

    public engage = (_stateWarden: StateWarden<MobileMap>, _individuator: Individuator) => {
        // TODO: implement
    };

    public disengage = (_stateWarden: StateWarden<MobileMap>, _individuator: Individuator) => {
        // TODO: implement
    };
}
