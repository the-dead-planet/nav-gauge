import { BehaviorSubject, Subscription } from "rxjs";
import { glitchmitter } from "../..";

export class StorageKeeper {
    public storage: StorageLike;

    public constructor(storage: StorageLike) {
        this.storage = storage;
    }

    public initialize = () => {

    };

    public cleanUp = () => {

    };

    /**
     * Finds data with a given `storageId` in provided `storage` and updates the `state$` object using found value (if one exists).
     * 
     * Subscribes to the changes of `state$` and updates the storage whenever `state$` value changes. 
     * 
     * @param state$ Behavior subject to synchronize with local storage.
     * @param storageId Object ID to look for in `storage`.
     * @param storage Storage to get the state from.
     * @param cleanUp Optionally, clean up function to adjust the state from storage to fit into current model `T`.
     */
    public synchronizeSubjectWithStorage = async <T extends {}>(
        state$: BehaviorSubject<T>,
        storageId: string,
        cleanUp: (state: unknown) => Partial<T> = ((state) => state as Partial<T>)
    ): Promise<Subscription> => {
        const setState = (savedData: string | null) => {
            if (savedData) {
                let sanitized = {};
                try {
                    sanitized = cleanUp(JSON.parse(savedData));
                } catch { }
                state$.next({ ...state$.value, ...sanitized });
            }
        };

        try {
            const maybePromise = this.storage.getItem(storageId);
            if (typeof maybePromise === 'string') {
                setState(maybePromise);
            } else if (maybePromise) {
                const s = await maybePromise
                setState(s);
            }
        } catch (err) {
            glitchmitter.transmit(`Error getting ${storageId} storage state`, err);
        }

        return state$.subscribe((next) => {
            try {
                this.storage.setItem(storageId, JSON.stringify(next));
            } catch (err) {
                glitchmitter.transmit(`Error setting ${storageId} storage state`, err);
            }
        });
    };
}
