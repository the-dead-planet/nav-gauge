import { Gear } from "@apparatus";

export abstract class RecordRouteGear<TMap> extends Gear<TMap> {
    public readonly id = 'record-route';
    public readonly name = 'Record route';
    public readonly description = 'Record your traces';

    public engage = () => {
        // To be implemented
    };
    
    public disengage = () => {
        // To be implemented
    };
}
