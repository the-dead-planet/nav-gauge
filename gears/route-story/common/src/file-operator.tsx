import { BehaviorSubject } from "rxjs";
import { parsers, FileToGeoJSONParser, ChronoLens } from "@apparatus";
import { GeoJson, getNext } from "@tinker-chest";
import { RouteStoryGear } from "./route-story-gear";
import { RouteStoryFile } from "./model";

export class FileOperator<TMap, TChronoLens extends ChronoLens, TFile extends RouteStoryFile, TImageData> {
    private gear: RouteStoryGear<TMap, TChronoLens, TFile, TImageData>;
    public isLoading$ = new BehaviorSubject(false);

    public constructor(
        gear: RouteStoryGear<TMap, TChronoLens, TFile, TImageData>,
    ) {
        this.gear = gear;
    }

    public resetStory = async (): Promise<void> => {
        this.isLoading$.next(true);
        await this.gear.onCleanupStory(this.gear.data$.value, this.gear.images$.value);
        this.gear.progressMs$.next(0);
        this.gear.data$.next({});
        this.gear.images$.next([]);
        this.gear.routeTimes$.next(null);
        this.gear.fileOperator.isLoading$.next(false);
    };

    public onError = (error: Error) => {
        const id = 'file-upload';
        this.gear.apparatus.signaliumBureau.addNotice({
            id,
            type: 'error',
            text: 'File upload failed',
            error,
        });
    };

    public uploadFile = async (files: TFile[], map: TMap) => {
        try {
            if (files.length === 0) {
                return;
            }
            this.isLoading$.next(true);
            let currentGeojson: GeoJson | undefined = this.gear.data$.value.geojson;
            let geojsonFile: TFile | undefined = undefined;
            const imageFiles: TFile[] = [];
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
                this.gear.data$.next({});
                const text = await this.gear.fileToText(geojsonFile).catch((error: Error) => {
                    this.onError(error);
                    this.isLoading$.next(false);
                }) ?? '';
                const result = await parsers
                    .get(FileToGeoJSONParser.getFileExtension(geojsonFile.name!))
                    ?.parse(text);

                this.gear.data$.next(result ?? { error: new Error('No parser found for file.') });
                currentGeojson = result?.geojson;
                this.gear.fitBoundsHandler(map, result?.boundingBox);
            }

            imageFiles.forEach((file) => this.gear.readImage(file, currentGeojson));
        } catch (err) {
            this.onError(err as Error);
        } finally {
            this.isLoading$.next(false);
        }
    };

    public pushInitialImage = (fileName: string) => {
        const current = this.gear.images$.value;
        const nextImages = current
            .filter((el) => el.name !== fileName)
            .concat([{
                id: getNext(current.map((el) => el.id)),
                name: fileName,
                progress: 0
            }]);

        this.gear.images$.next(nextImages);
    };

    public updateImageProgress = (fileName: string, progress: number) => {
        const current = this.gear.images$.value;
        const nextImages = current.slice();
        const index = current.findIndex((el) => el.name === fileName);
        nextImages[index] = { ...nextImages[index], progress: Number(progress.toFixed(0)) };

        this.gear.images$.next(nextImages);
    };

    public updateImageError = (fileName: string, message?: string) => {
        const current = this.gear.images$.value;
        const nextImages = current.slice();
        const index = current.findIndex((el) => el.name === fileName);
        nextImages[index] = { ...nextImages[index], error: message ?? 'Cannot read file' };

        this.gear.images$.next(nextImages);
    }
}