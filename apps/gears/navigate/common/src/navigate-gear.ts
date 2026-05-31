import { Gear } from "@apparatus";

export abstract class NavigateGear<TMap> extends Gear<TMap> {
    public readonly id = 'navigate';
    public readonly name = 'Navigate';
    public readonly description = 'Navigate using a custom route';

    public engage = () => {
        // To be implemented
    };
    
    public disengage = () => {
        // To be implemented
    };
}
