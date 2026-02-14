import { combineLatest, Subscription } from 'rxjs';
import { Individuator } from '@apparatus';
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

   public engageRouteStory = (individuator: Individuator) => {
      this.confirmBeforeLeaveSubscription = this.subscribeConfirmBeforeLeave(individuator);
   };

   public disengageRouteStory = () => {
      this.confirmBeforeLeaveSubscription?.unsubscribe();
   };

   private confirmationHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      return "Route and image data will be lost.";
   };

   private subscribeConfirmBeforeLeave = (individuator: Individuator): Subscription => {
      return combineLatest([individuator.settings$, this.data$, this.images$])
         .subscribe(([settings, { geojson }, images]) => {
            if (settings.confirmBeforeLeave && (geojson || images.length > 0)) {
               window.addEventListener("beforeunload", this.confirmationHandler);
            } else {
               window.removeEventListener('beforeunload', this.confirmationHandler);
            }
         });
   };
}
