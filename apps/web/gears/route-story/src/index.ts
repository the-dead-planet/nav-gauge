import { OverlayComponentProps, RouteStoryGear } from '@apparatus';
import { RouteLayer } from './RouteLayer';
import { ImagesLayer } from './images/ImagesLayer';
import { ComponentType } from 'react';

export * from './images/image-parser';

export class WebRouteStoryGear extends RouteStoryGear {
   public routeLayerComponent: ComponentType<OverlayComponentProps> = RouteLayer;
   public imagesLayerComponent: ComponentType<OverlayComponentProps> = ImagesLayer;
}
