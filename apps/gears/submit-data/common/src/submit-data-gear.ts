import { Gear, Individuator, StateWarden } from "@apparatus";

export abstract class SubmitDataGear<TMap> extends Gear<TMap> {
    public readonly id = 'submit-data';

    public engage = (_stateWarden: StateWarden<TMap>, _individuator: Individuator) => {
        // To be implemented
    };
    
    public disengage = (_stateWarden: StateWarden<TMap>, _individuator: Individuator) => {
        // To be implemented
    };
}
