import { BehaviorSubject } from "rxjs";
import { MarkerImage } from "@apparatus";

export function updateImageDistanceFraction<TImageData>(
    images$: BehaviorSubject<MarkerImage<TImageData>[]>,
    imageId: number,
    distanceFraction: number
) {
    images$.next(images$.value.map((im) => im.id === imageId ? { ...im, distanceFraction } : im))
}
