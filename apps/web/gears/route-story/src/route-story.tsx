import { ComponentType } from 'react';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ToolProps, OverlayComponentProps } from '@apparatus';
import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { FileInput } from './FileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';
import { ApplicationSettingsType } from '@tinker-chest';

export class WebRouteStoryGear extends RouteStoryGear {
   public routeLayerFitBountsComponent: ComponentType<ToolProps> = ({ map }) => (
      <RouteLayerFitBounds map={map} data$={this.data$} onFitBounds={this.handleFitBounds} />
   );

   public fileInputComponent: ComponentType = () => (
      <FileInput data$={this.data$} images$={this.images$}/>
   );

   public playerComponent: ComponentType<ToolProps> = ({ map }) => (
      <Player
         map={map}
         data$={this.data$}
         routeTimes$={this.routeTimes$}
         images$={this.images$}
         progressMs$={this.progressMs$}
      />
   );

   public routeLayerComponent: ComponentType<OverlayComponentProps> = (props) => (
      <RouteLayer
         data$={this.data$}
         routeTimes$={this.routeTimes$}
         images$={this.images$}
         progressMs$={this.progressMs$}
         {...props}
      />
   );

   public imagesLayerComponent: ComponentType<OverlayComponentProps> = (props) => (
      <ImagesLayer data$={this.data$} images$={this.images$} {...props} />
   );

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
