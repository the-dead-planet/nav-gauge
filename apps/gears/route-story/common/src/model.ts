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

export interface RouteToolProps<TMap, TFile extends { name?: string | null; type: string | null; }> {
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage[]>;
    progressMs$: BehaviorSubject<number>;
    playerOperator: PlayerOperator<TMap, TFile>;
}

export interface RouteFileInputProps<TMap, TFile extends { name?: string | null; type: string | null; }> {
    data$: BehaviorSubject<ParsingResultWithError>;
    images$: BehaviorSubject<MarkerImage[]>;
    fileOperator: FileOperator<TMap, TFile>;
}

export interface RouteFitBoundsProps<TMap> {
    data$: BehaviorSubject<ParsingResultWithError>;
    onFitBounds: (map: TMap, sw: [number, number], ne: [number, number]) => void;
}
