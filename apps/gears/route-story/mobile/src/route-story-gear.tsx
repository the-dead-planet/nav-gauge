import RNFS from 'react-native-fs';
import * as Exify from '@lodev09/react-native-exify';
import { RouteStoryGear } from '@the-dead-planet/nav-gauge-gears-route-story-common';
import { RouteLayer } from './layers/RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { RouteStoryFileInput } from './RouteStoryFileInput';
import { RouteLayerFitBounds } from './layers/RouteLayerFitBounds';
import { Player } from './player/Player';
import { MobileMap } from '@mobile-ui';
import { GeoJson, getExifError, getExifLngLat, ParsingResultWithError } from '@tinker-chest';
import { Cartomancer, MarkerImage } from '@apparatus';
import { cacheReducedImage, prependFilePrefix, MobileMarkerImageData, resetTempSubfolder } from './images/image-parser';
import { DocumentPickerResponse } from '@react-native-documents/picker';

export class MobileRouteStoryGear extends RouteStoryGear<MobileMap, DocumentPickerResponse, MobileMarkerImageData> {
   public routeLayerFitBoundsComponent = RouteLayerFitBounds;
   public fileInputComponent = RouteStoryFileInput;
   public playerComponent = Player
   public routeLayerComponent = RouteLayer;
   public imagesLayerComponent = ImagesLayer;

   public engageRouteStory = () => {
      resetTempSubfolder();
   };

   public fitBounds = (map: MobileMap, sw: [number, number], ne: [number, number]) => {
      map.camera.current?.fitBounds(sw, ne, 20);
   }

   public fileToText = async (file: DocumentPickerResponse) => RNFS.readFile(file.uri, 'utf8');

   public readImage = async (file: DocumentPickerResponse, geojson?: GeoJson) => {
      const fileName = file.name;
      if (!fileName) {
         return;
      }
      this.fileOperator.pushInitialImage(fileName);

      try {
         const exif = await Exify.read(file.uri);
         const { fullSize, thumbnail } = await cacheReducedImage(file, (error) => {
            this.stateWarden.signaliumBureau.addNotice({
               id: 'image-resize',
               type: 'error',
               error,
               text: 'Error processing images',
            });
         });

         const nextImages = this.images$.value.slice();
         const index = this.images$.value.findIndex((el) => el.name === file.name);
         const lngLat = exif ? getExifLngLat(exif) : undefined;
         const [featureId, _feature] = geojson ? Cartomancer.getClosestFeature(geojson, lngLat) : [0, undefined];

         nextImages[index] = {
            ...nextImages[index],
            progress: 100,
            lngLat,
            data: {
               uri: file.uri,
               fullSize: fullSize ? prependFilePrefix(fullSize) : undefined,
               thumbnail: thumbnail ? prependFilePrefix(thumbnail) : undefined,
            },
            error: getExifError(exif),
            featureId,
         };
         this.images$.next(nextImages);
      } catch (err) {
         this.fileOperator.updateImageError(file.name!, (err as Error)?.message);
      }
   }

   public onCleanupStory = async (
      _data: ParsingResultWithError,
      _images: MarkerImage<MobileMarkerImageData>[]
   ): Promise<void> => {
      resetTempSubfolder();
   };
}
