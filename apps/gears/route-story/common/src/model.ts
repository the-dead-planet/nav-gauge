import { ChronoLens, MarkerImage, SignaliumBureau, StateWarden } from "@apparatus";
import { GeoJson, ParsingResultWithError } from "@tinker-chest";
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
    playerOperator: PlayerOperator;
}

export interface RouteFileInputProps {
    data$: BehaviorSubject<ParsingResultWithError>;
    images$: BehaviorSubject<MarkerImage[]>;
    fileOperator: FileOperator;
}

export interface RouteFitBoundsProps<TMap> {
    data$: BehaviorSubject<ParsingResultWithError>;
    onFitBounds: (
        stateWarden: StateWarden,
        handler: () => void
    ) => void;
}

export interface FileOperator {
    isLoading$: BehaviorSubject<boolean>;
    onError: (error: Error, signaliumBureau: SignaliumBureau) => void;
    uploadFile: <TFile extends { name?: string | null; type: string | null; }>(
        files: TFile[],
        signaliumBureau: SignaliumBureau,
        getText: (file: TFile) => Promise<string>,
        readImage: (file: TFile, geojson?: GeoJson) => void,
    ) => void;
    pushInitialImage: (current: MarkerImage[], fileName: string) => MarkerImage[];
    updateImageProgress: (current: MarkerImage[], fileName: string, progress: number) => MarkerImage[];
    updateImageError: (current: MarkerImage[], fileName: string, message?: string) => MarkerImage[];
}

export interface PlayerOperator {
    updateProgress: (
        value: number,
        chronoLens: ChronoLens,
        updateLayer: (geojson: GeoJson, routeTimes: RouteTimes, value: number) => void,
    ) => void,
}