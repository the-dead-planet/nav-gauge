import { CameraRef, MapViewRef } from '@maplibre/maplibre-react-native';
import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { FileInput } from './FileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';
import { MobileMap } from '@the-dead-planet/nav-gauge-mobile-ui/src/model';

export class MobileRouteStoryGear extends RouteStoryGear<MobileMap> {
   public routeLayerFitBoundsComponent = RouteLayerFitBounds;
   public fileInputComponent = FileInput;
   public playerComponent = Player
   public routeLayerComponent = RouteLayer;
   public imagesLayerComponent = ImagesLayer;
}
