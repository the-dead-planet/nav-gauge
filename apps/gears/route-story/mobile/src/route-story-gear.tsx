import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story-common';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { FileInput } from './FileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';
import { MobileMap } from '@mobile-ui';

export class MobileRouteStoryGear extends RouteStoryGear<MobileMap> {
   public routeLayerFitBoundsComponent = RouteLayerFitBounds;
   public fileInputComponent = FileInput;
   public playerComponent = Player
   public routeLayerComponent = RouteLayer;
   public imagesLayerComponent = ImagesLayer;
}
