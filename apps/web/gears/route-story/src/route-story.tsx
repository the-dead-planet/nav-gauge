import { ComponentType } from 'react';
import { combineLatest } from 'rxjs';
import { ToolProps, OverlayComponentProps, RouteStoryGear, StateWarden } from '@apparatus';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { FileInput } from './FileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';

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

   public constructor(stateWarden: StateWarden) {
      super(stateWarden);

      this.setUpConfirmBeforeLeave(stateWarden);
   }

   private confirmationHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      return "Route and image data will be lost.";
   };

   private setUpConfirmBeforeLeave = (stateWarden: StateWarden) => {
      combineLatest([stateWarden.applicationSettings$, this.data$, this.images$])
         .subscribe(([applicationSettings, { geojson }, images]) => {
            if (applicationSettings.confirmBeforeLeave && (geojson || images.length > 0)) {
               window.addEventListener("beforeunload", this.confirmationHandler);
            } else {
               window.removeEventListener('beforeunload', this.confirmationHandler);
            }
         });
   };
}
