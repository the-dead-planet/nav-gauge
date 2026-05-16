import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMachineWard } from "../useMachineWard";

/**
 * On mount initializes the state with the data in storage, if available (otherwise with the `defaultState`).
 * On each change of `state` value, updates storage.
 */
export function useStorageState<T extends object>(
    storageId: string,
    defaultState: T,
    cleanUp: (state: unknown) => Partial<T> = ((state) => state as Partial<T>)
): [T, Dispatch<SetStateAction<T>>] {
    const { storageKeeper } = useMachineWard();
    const [state, setState] = useState<T>(defaultState);

    useEffect(() => {
        (async () => {
            try {
                const storedValue = await storageKeeper.storage.getItem(storageId);

                if (storedValue !== null) {
                    setState({
                        ...defaultState,
                        ...cleanUp(JSON.parse(storedValue) as T)
                    })
                }
            } catch (err) {
                console.error(`Error getting ${storageId} storage state`, err);
            }
        })();
    }, []);

    useEffect(() => {
        try {
            storageKeeper.storage.setItem(storageId, JSON.stringify(state));
        } catch (err) {
            console.error(`Error setting ${storageId} storage state`, err);
        }
    }, [state]);

    return [state, setState];
}
