import { Gear } from "@apparatus";

export abstract class RecordRouteGear<TMap> extends Gear<TMap> {
    public readonly id = 'record-route';

    public engage = () => {
        // To be implemented
    };
    
    public disengage = () => {
        // To be implemented
    };
}
