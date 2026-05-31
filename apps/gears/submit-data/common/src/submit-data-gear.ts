import { Gear } from "@apparatus";

export abstract class SubmitDataGear<TMap> extends Gear<TMap> {
    public readonly id = 'submit-data';
    public readonly name = 'Submit Data';
    public readonly description = 'Submit street art data points';

    public engage = () => {
        // To be implemented
    };
    
    public disengage = () => {
        // To be implemented
    };
}
