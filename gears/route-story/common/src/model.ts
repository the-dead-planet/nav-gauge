import { MarkerImage } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { BehaviorSubject } from "rxjs";
import { FileOperator } from "./file-operator";
import { PlayerOperator } from "./player-operator";

export interface RouteTimes {
    startTime: string;
    endTime: string;
    startTimeEpoch: number;
    endTimeEpoch: number;
    duration: number;
}

export interface RouteStoryState {
    showRouteLine: boolean;
    showRoutePoints: boolean;
}

export interface RouteStoryProps<TMap, TFile extends RouteStoryFile, TImageData> {
    data$: BehaviorSubject<ParsingResultWithError>;
    state$: BehaviorSubject<RouteStoryState>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<TImageData>[]>;
    progressMs$: BehaviorSubject<number>;
    fileOperator: FileOperator<TMap, TFile, TImageData>;
    playerOperator: PlayerOperator<TMap, TFile, TImageData>;
}

export interface RouteFitBoundsProps<TMap> {
    data$: BehaviorSubject<ParsingResultWithError>;
    onFitBounds: (map: TMap, sw: [number, number], ne: [number, number]) => void;
}

export interface RouteStoryFile {
    name?: string | null;
    type: string | null;
}

export enum RouteStoryTranslationKey {
    FitBounds = 'fit-bounds',
    Player = 'player',
}
