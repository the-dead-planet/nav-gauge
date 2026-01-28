import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useStateWarden } from "../state-warden";

/**
 * On mount initializes the state with the data in storage, if available (otherwise with the `defaultState`).
 * On each change of `state` value, updates storage.
 */
export function useStorageState<T extends Object>(
    storageId: string,
    defaultState: T,
    cleanUp: (state: unknown) => Partial<T> = ((state) => state as Partial<T>)
): [T, Dispatch<SetStateAction<T>>] {
    const stateWarden = useStateWarden();
    const [state, setState] = useState<T>(defaultState);

    useEffect(() => {
        (async () => {
            try {
                const storedValue = await stateWarden.storageKeeper.storage.getItem(storageId);

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
            stateWarden.storageKeeper.storage.setItem(storageId, JSON.stringify(state));
        } catch (err) {
            console.error(`Error setting ${storageId} storage state`, err);
        }
    }, [state]);

    return [state, setState];
}
