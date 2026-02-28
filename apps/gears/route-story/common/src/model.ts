import { MarkerImage, SignaliumBureau, StateWarden } from "@apparatus";
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
    pushInitialImage: (fileName: string) => void;
    updateImageProgress: (fileName: string, progress: number) => void;
    updateImageError: (fileName: string, message?: string) => void;
}

export interface PlayerOperator {
    onPlay: () => void;
    onRecord: () => void;
    onRecordPause: () => void;
    updateProgress: (
        value: number,
        updateLayer?: (
            currentPoint: GeoJSON.Feature<GeoJSON.Point>,
            lines: GeoJSON.GeoJSON,
        ) => void,
    ) => void,
}