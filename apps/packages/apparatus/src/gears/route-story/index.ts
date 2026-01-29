import { ComponentType } from "react";
import { OverlayComponentProps, StateWarden } from "../../state-warden";
import { Gear } from "../gear";
import { GearId } from "../model";

export abstract class RouteStoryGear extends Gear<GearId> {
    public id: GearId = 'route-story';

    public abstract routeLayerComponent: ComponentType<OverlayComponentProps>;
    public abstract imagesLayerComponent: ComponentType<OverlayComponentProps>;

    public engage = (stateWarden: StateWarden) => {
        stateWarden.cartomancer.addOverlay({
            id: 'route',
            component: this.routeLayerComponent,
        });
        stateWarden.cartomancer.addOverlay({
            id: 'images',
            component: this.imagesLayerComponent,
        });
    };

    public disengage = (stateWarden: StateWarden) => {
        stateWarden.cartomancer.removeOverlay('route');
        stateWarden.cartomancer.removeOverlay('images');
    };
};
