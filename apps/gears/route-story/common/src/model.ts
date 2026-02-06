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

export interface RouteFitBoundsProps<TMap> {
    data$: BehaviorSubject<ParsingResultWithError>;
    onFitBounds: (
        stateWarden: StateWarden,
        handler: () => void
    ) => void;
}
