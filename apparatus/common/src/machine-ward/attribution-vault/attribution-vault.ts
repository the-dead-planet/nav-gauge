import { BehaviorSubject } from "rxjs";
import { AttributionEntry } from "./model";

export class AttributionVault {
    public attributions$ = new BehaviorSubject<Map<string, AttributionEntry[]>>(new Map());

    public constructor() { }

    /**
     * Adds new entry. If an entry with a given id already exists, it will be overwritten.
     */
    public addEntry = (id: string, entry: AttributionEntry | AttributionEntry[]) => {
        const nextValue = new Map(this.attributions$.value);
        nextValue.set(id, Array.isArray(entry) ? entry : [entry]);
        this.attributions$.next(nextValue);
    };

    /**
     * Removes an entry with a given id.
     */
    public removeEntry = (id: string) => {
        const nextValue = new Map(this.attributions$.value);
        nextValue.delete(id);
        this.attributions$.next(nextValue);
    }
}
