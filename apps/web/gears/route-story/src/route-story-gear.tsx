import { ComponentType } from 'react';
import { combineLatest } from 'rxjs';
import { ToolProps, OverlayComponentProps, Individuator } from '@apparatus';
import { RouteToolProps, RouteStoryGear, RouteFileInputProps, RouteFitBoundsProps } from '@the-dead-planet/nav-gauge-gears-route-story';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { FileInput } from './FileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';

export class WebRouteStoryGear extends RouteStoryGear {
   public routeLayerFitBountsComponent: ComponentType<ToolProps & RouteFitBoundsProps> = RouteLayerFitBounds;
   public fileInputComponent: ComponentType<RouteFileInputProps> = FileInput;
   public playerComponent: ComponentType<OverlayComponentProps & RouteToolProps> = Player
   public routeLayerComponent: ComponentType<OverlayComponentProps & RouteToolProps> = RouteLayer;
   public imagesLayerComponent: ComponentType<OverlayComponentProps & RouteToolProps> = ImagesLayer;

   public constructor(Individuator: Individuator) {
      super(Individuator);

      this.setUpConfirmBeforeLeave(Individuator);
   }

   private confirmationHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      return "Route and image data will be lost.";
   };

   private setUpConfirmBeforeLeave = (individuator: Individuator) => {
      combineLatest([individuator.settings$, this.data$, this.images$])
         .subscribe(([settings, { geojson }, images]) => {
            if (settings.confirmBeforeLeave && (geojson || images.length > 0)) {
               window.addEventListener("beforeunload", this.confirmationHandler);
            } else {
               window.removeEventListener('beforeunload', this.confirmationHandler);
            }
         });
   };
}
