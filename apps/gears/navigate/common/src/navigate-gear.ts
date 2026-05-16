import { Gear } from "@apparatus";

export abstract class NavigateGear<TMap> extends Gear<TMap> {
    public readonly id = 'navigate';

    public engage = () => {
        // To be implemented
    };
    
    public disengage = () => {
        // To be implemented
    };
}
