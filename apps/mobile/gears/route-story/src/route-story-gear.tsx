import { MapViewRef } from '@maplibre/maplibre-react-native';
import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { FileInput } from './FileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';

export class MobileRouteStoryGear extends RouteStoryGear<MapViewRef | null> {
   public routeLayerFitBoundsComponent = RouteLayerFitBounds;
   public fileInputComponent = FileInput;
   public playerComponent = Player
   public routeLayerComponent = RouteLayer;
   public imagesLayerComponent = ImagesLayer;
}
