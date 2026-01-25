import { BehaviorSubject } from "rxjs";
import { Gear } from "./model";
import { StateWarden } from "../state-warden";

export class Engine {
    public constructor() { }

    public gears$ = new BehaviorSubject<Gear[]>([]);

    public addGears = (gear: Gear | Gear[]) => {
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

    public openValves = (gears: Gear[], stateWarden: StateWarden) => {
        for (const gear of gears) {
            gear.engage(stateWarden);
        }
    };

    public closeValves = (gears: Gear[], stateWarden: StateWarden) => {
        for (const gear of gears) {
            gear.disengage(stateWarden);
        }
    };
}
