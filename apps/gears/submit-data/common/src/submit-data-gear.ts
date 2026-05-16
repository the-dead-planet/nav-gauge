import { Gear } from "@apparatus";

export abstract class SubmitDataGear<TMap> extends Gear<TMap> {
    public readonly id = 'submit-data';

    public engage = () => {
        // To be implemented
    };
    
    public disengage = () => {
        // To be implemented
    };
}
