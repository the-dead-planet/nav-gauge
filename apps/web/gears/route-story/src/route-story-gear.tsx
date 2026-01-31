import { ComponentType } from 'react';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ToolProps, OverlayComponentProps, ApplicationSettingsType } from '@apparatus';
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

   public constructor(applicationSettings$: BehaviorSubject<ApplicationSettingsType>) {
      super(applicationSettings$);

      this.setUpConfirmBeforeLeave(applicationSettings$);
   }

   private confirmationHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      return "Route and image data will be lost.";
   };

   private setUpConfirmBeforeLeave = (applicationSettings$: BehaviorSubject<ApplicationSettingsType>) => {
      combineLatest([applicationSettings$, this.data$, this.images$])
         .subscribe(([applicationSettings, { geojson }, images]) => {
            if (applicationSettings.confirmBeforeLeave && (geojson || images.length > 0)) {
               window.addEventListener("beforeunload", this.confirmationHandler);
            } else {
               window.removeEventListener('beforeunload', this.confirmationHandler);
            }
         });
   };
}
