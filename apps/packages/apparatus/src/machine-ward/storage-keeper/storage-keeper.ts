import { BehaviorSubject } from "rxjs";

export class StorageKeeper {
    public storage: StorageLike;

    public constructor(storage: StorageLike) {
        this.storage = storage;
    }

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
    ): Promise<void> => {
        try {
            const savedData = await this.storage.getItem(storageId);
            if (savedData) {
                state$.next(Object.assign(state$.value, cleanUp(JSON.parse(savedData) as T)));
            }
        } catch (err) {
            console.error(`Error getting ${storageId} storage state`, err);
        }

        state$.subscribe((next) => {
            try {
                this.storage.setItem(storageId, JSON.stringify(next));
            } catch (err) {
                console.error(`Error setting ${storageId} storage state`, err);
            }
        });
    };
}
