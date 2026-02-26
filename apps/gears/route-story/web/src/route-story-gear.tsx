import { combineLatest, Subscription } from 'rxjs';
import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story-common';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { RouteStoryFileInput } from './RouteStoryFileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';

export class WebRouteStoryGear extends RouteStoryGear<maplibregl.Map> {
   public routeLayerFitBoundsComponent = RouteLayerFitBounds;
   public fileInputComponent = RouteStoryFileInput;
   public playerComponent = Player
   public routeLayerComponent = RouteLayer;
   public imagesLayerComponent = ImagesLayer;

   private confirmBeforeLeaveSubscription: Subscription | null = null;

   public engageRouteStory = () => {
      this.confirmBeforeLeaveSubscription = this.subscribeConfirmBeforeLeave();
   };

   public disengageRouteStory = () => {
      this.confirmBeforeLeaveSubscription?.unsubscribe();
   };

   private confirmationHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      return "Route and image data will be lost.";
   };

   private subscribeConfirmBeforeLeave = (): Subscription => {
      return combineLatest([this.individuator.settings$, this.data$, this.images$])
         .subscribe(([settings, { geojson }, images]) => {
            if (settings.confirmBeforeLeave && (geojson || images.length > 0)) {
               window.addEventListener("beforeunload", this.confirmationHandler);
            } else {
               window.removeEventListener('beforeunload', this.confirmationHandler);
            }
         });
   };
}
