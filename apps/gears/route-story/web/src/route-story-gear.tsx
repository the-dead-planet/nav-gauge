import { combineLatest, Subscription } from 'rxjs';
import maplibregl from "maplibre-gl";
import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story-common';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { RouteStoryFileInput } from './file-input/RouteStoryFileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';
import { GeoJson, ParsingResultWithError } from '@tinker-chest';
import { Cartomancer, MarkerImage } from '@apparatus';
import { parseImage, WebMarkerImage } from './images/image-parser';

export class WebRouteStoryGear extends RouteStoryGear<maplibregl.Map, File> {
   public routeLayerFitBoundsComponent = RouteLayerFitBounds;
   public fileInputComponent = RouteStoryFileInput;
   public playerComponent = Player
   public routeLayerComponent = RouteLayer;
   public imagesLayerComponent = ImagesLayer;

   public fitBounds = (map: maplibregl.Map, sw: [number, number], ne: [number, number]) => {
      map.fitBounds([sw, ne], { animate: true, padding: 50 });
   }

   public readImage = async (file: File, geojson?: GeoJson) => {
      console.log("webn")
      const reader = new FileReader();

      reader.onloadstart = () => {
         this.fileOperator.pushInitialImage(file.name);
      };

      reader.onprogress = (e) => {
         this.fileOperator.updateImageProgress(file.name, e.loaded / e.total * 100)
      };

      reader.onload = async (e) => {
         const { data, bitmap, lngLat, error } = await parseImage(file, e);

         const nextImages: WebMarkerImage[] = this.images$.value.slice();
         const index = this.images$.value.findIndex((el) => el.name === file.name);
         const [featureId, feature] = geojson ? Cartomancer.getClosestFeature(geojson, lngLat) : [0, undefined];

         nextImages[index] = {
            ...nextImages[index],
            progress: 100,
            lngLat,
            data,
            bitmap,
            error,
            featureId,
         };

         if (feature) {
            const markerElement = document.createElement('div');
            const featureLngLat = new maplibregl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);

            nextImages[index].markerElement = markerElement;
            nextImages[index].marker = new maplibregl.Marker({
               element: markerElement,
               draggable: true,
            }).setLngLat(featureLngLat);
         }

         this.images$.next(nextImages);
      };

      reader.onerror = (e) => {
         this.fileOperator.updateImageError(file.name, e.target?.error?.message);
      };

      reader.readAsDataURL(file);
   };

   public onCleanupStory = async (_data: ParsingResultWithError, _images: MarkerImage[]): Promise<void> => { };

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
