import { ChronoLens, GaugeControlsType, MapLayout, MarkerImage } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { BehaviorSubject } from "rxjs";
import { FileOperator } from "./file-operator";
import { PlayerOperator } from "./player-operator";
import { Animatrix } from "./animatrix";

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

export interface RouteStoryProps<TMap, TChronoLens extends ChronoLens, TFile extends RouteStoryFile, TImageData> {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    animatrix: Animatrix;
    data$: BehaviorSubject<ParsingResultWithError>;
    state$: BehaviorSubject<RouteStoryState>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage<TImageData>[]>;
    progressMs$: BehaviorSubject<number>;
    fileOperator: FileOperator<TMap, TChronoLens, TFile, TImageData>;
    playerOperator: PlayerOperator<TMap, TChronoLens, TFile, TImageData>;
    fitBoundsHandler: (map: TMap, boundingBox?: GeoJSON.BBox) => void;
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
    NoName = 'no-name',
    UploadFile = 'upload-file',
    ReplaceFile = 'replace-file',
    PurgeStory = 'purge-story',
    Cancel = 'cancel',
    DestroyRecording = 'destroy-recording',
    StartRecording = 'start-recording',
    StopRecording = 'stop-recording',
    PauseRecording = 'pause-recording',
    ResumeRecording = 'resume-recording',
    LayerConfiguration = 'layer-configuration',
    Lines = 'lines',
    Points = 'points',
    Slider = 'slider',
    Play = 'play',
    Pause = 'pause',
    Image = 'image',
    ShowImageMarkers = 'show-image-markers',
    HideImageMarkers = 'hide-image-markers',
    PurgeStoryText = 'purge-story-text',
}

export type Preset = 'default' | 'racing-game';

export interface PresetOption {
    value: Preset;
    label: string;
    mapLayout: MapLayout;
    gaugeControls: GaugeControlsType;
}
