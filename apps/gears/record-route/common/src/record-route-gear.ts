import { Gear, Individuator, StateWarden } from "@apparatus";
// TODO: Delete - test
import RouteStoryGear from "@the-dead-planet/nav-gauge-gears-route-story-common";
RouteStoryGear;

export abstract class RecordRouteGear<TMap> extends Gear<TMap> {
    public readonly id = 'record-route';

    public engage = (_stateWarden: StateWarden<TMap>, _individuator: Individuator) => {
        // To be implemented
    };
    
    public disengage = (_stateWarden: StateWarden<TMap>, _individuator: Individuator) => {
        // To be implemented
    };
}
