import { BehaviorSubject } from "rxjs";
import { Gear } from "./model";
import { StateWarden } from "../state-warden";

export class Engine {
    public constructor() { }

    public gears$ = new BehaviorSubject<Gear[]>([]);

    public addGear = (gear: Gear | Gear[]) => {
        const gears = Array.isArray(gear) ? gear : [gear];
        const existingIds = this.gears$.value.filter((g) => gears.some((gear) => gear.id === g.id)).map((g) => g.id);
        if (existingIds.length > 0) {
            throw new Error(`Gear${existingIds.length > 1 ? 's' : ''} with id: ${existingIds.join(', ')} already exist${existingIds.length === 1 ? 's' : ''}!`);
        }
        this.gears$.next(this.gears$.value.concat(gears));
    };

    public removeGear = (id: string) => {
        this.gears$.next(this.gears$.value.filter((g) => g.id !== id));
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
