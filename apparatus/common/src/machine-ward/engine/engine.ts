import { BehaviorSubject, combineLatest, of, switchMap, map } from "rxjs";
import { Gear } from "../gears";
import { ChronoLens } from "../chrono-lens";

export class Engine<TMap, TChronoLens extends ChronoLens> {
    public constructor() { }

    public gears$ = new BehaviorSubject<Gear<TMap, TChronoLens>[]>([]);

    public gearsWithEngaged$ = this.gears$.pipe(switchMap((gears) => {
        if (gears.length === 0) {
            return of([]);
        }

        return combineLatest(gears.map((gear) => gear.isEngaged$.pipe(
            map((isEngaged) => ({ gear, isEngaged }))
        )));
    }));

    public addGears = (gear: Gear<TMap, TChronoLens> | Gear<TMap, TChronoLens>[]) => {
        const gears = Array.isArray(gear) ? gear : [gear];
        const existingIds = this.gears$.value.filter((g) => gears.some((gear) => gear.id === g.id)).map((g) => g.id);
        if (existingIds.length > 0) {
            throw new Error(`Gear${existingIds.length > 1 ? 's' : ''} with id: ${existingIds.join(', ')} already exist${existingIds.length === 1 ? 's' : ''}!`);
        }
        this.gears$.next(this.gears$.value.concat(gears));
    };

    public removeGears = (id: string | string[]) => {
        const ids = new Set(Array.isArray(id) ? id : [id]);
        this.gears$.next(this.gears$.value.filter((g) => !ids.has(g.id)));
    };

    public openValves = (gears: Gear<TMap, TChronoLens>[]) => {
        for (const gear of gears) {
            gear.setup();
        }
    };

    public closeValves = (gears: Gear<TMap, TChronoLens>[] = this.gears$.value) => {
        for (const gear of gears) {
            gear.cleanup();
        }
    };

    public engageGear = (gear: Gear<TMap, TChronoLens>) => {
        gear.isEngaged$.next(true);
    };

    public disengageGear = (gear: Gear<TMap, TChronoLens>) => {
        gear.isEngaged$.next(false);
    };
}
