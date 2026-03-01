import { BehaviorSubject } from "rxjs";
import { parsers, FileToGeoJSONParser, MarkerImage, StateWarden } from "@apparatus";
import { GeoJson, getNext, ParsingResultWithError } from "@tinker-chest";

export class FileOperator<TMap> {
    private stateWarden: StateWarden<TMap>;
    private data$: BehaviorSubject<ParsingResultWithError>;
    private images$: BehaviorSubject<MarkerImage[]>;
    public isLoading$ = new BehaviorSubject(false);

    constructor(
        stateWarden: StateWarden<TMap>,
        data$: BehaviorSubject<ParsingResultWithError>,
        images$: BehaviorSubject<MarkerImage[]>,
    ) {
        this.stateWarden = stateWarden;
        this.data$ = data$;
        this.images$ = images$;
    }

    public onError = (error: Error) => {
        const id = 'file-upload';
        this.stateWarden.signaliumBureau.addNotice({
            id,
            type: 'error',
            text: 'File upload failed',
            error,
        });
    };

    public uploadFile = async <TFile extends { name?: string | null; type: string | null; }>(
        files: TFile[],
        getText: (file: TFile) => Promise<string>,
        readImage: (file: TFile, geojson?: GeoJson) => void,
    ) => {
        try {
            if (files.length === 0) {
                return;
            }
            this.isLoading$.next(true);
            let currentGeojson: GeoJson | undefined = this.data$.value.geojson;
            let geojsonFile: TFile | undefined = undefined;
            let imageFiles: TFile[] = [];
            const geoExtensions = [...parsers.values()].flatMap((p) => p.acceptedFileExtensions);

            for (const file of files) {
                if (!file.name) {
                    continue;
                }
                if (file.type?.includes('image')) {
                    imageFiles.push(file);
                } else if (geoExtensions.some((ext) => file.name!.endsWith(ext))) {
                    geojsonFile = file;
                }
            }

            if (geojsonFile) {
                this.data$.next({});
                const text = await getText(geojsonFile).catch((error: Error) => {
                    this.onError(error);
                    this.isLoading$.next(false);
                }) ?? '';
                const result = await parsers
                    .get(FileToGeoJSONParser.getFileExtension(geojsonFile.name!))
                    ?.parse(text);

                this.data$.next(result ?? { error: new Error('No parser found for file.') });
                currentGeojson = result?.geojson
            }

            imageFiles.forEach((file) => readImage(file, currentGeojson));
        } catch (err) {
            this.onError(err as Error);
        } finally {
            this.isLoading$.next(false);
        }
    };

    public pushInitialImage = (fileName: string) => {
        const current = this.images$.value;
        const nextImages = current
            .filter((el) => el.name !== fileName)
            .concat([{
                id: getNext(current.map((el) => el.id)),
                name: fileName,
                progress: 0
            }]);

        this.images$.next(nextImages);
    };

    public updateImageProgress = (fileName: string, progress: number) => {
        const current = this.images$.value;
        const nextImages = current.slice();
        const index = current.findIndex((el) => el.name === fileName);
        nextImages[index] = { ...nextImages[index], progress: Number(progress.toFixed(0)) };

        this.images$.next(nextImages);
    };

    public updateImageError = (fileName: string, message?: string) => {
        const current = this.images$.value;
        const nextImages = current.slice();
        const index = current.findIndex((el) => el.name === fileName);
        nextImages[index] = { ...nextImages[index], error: message ?? 'Cannot read file' };

        this.images$.next(nextImages);
    }
}