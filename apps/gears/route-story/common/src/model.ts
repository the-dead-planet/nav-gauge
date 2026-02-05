import { MarkerImage, StateWarden } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { BehaviorSubject } from "rxjs";

export interface RouteTimes {
    startTime: string;
    endTime: string;
    startTimeEpoch: number;
    endTimeEpoch: number;
    duration: number;
}

export interface RouteToolProps {
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage[]>;
    progressMs$: BehaviorSubject<number>;
}

export interface RouteFileInputProps {
    data$: BehaviorSubject<ParsingResultWithError>;
    images$: BehaviorSubject<MarkerImage[]>;
}

export interface RouteFitBoundsProps {
    data$: BehaviorSubject<ParsingResultWithError>;
    onFitBounds: (stateWarden: StateWarden, map: maplibregl.Map, bbox: ParsingResultWithError['boundingBox'], options?: {
        padding?: number;
        animate?: boolean;
    }) => void;
    /**
     * Defaults to `50`.
     */
    padding?: number;
    /**
     * Defaults to `true`.
     */
    animate?: boolean;
}
