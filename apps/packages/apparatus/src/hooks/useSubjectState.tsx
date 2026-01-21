import { useCallback, useEffect, useState } from 'react';
import { BehaviorSubject} from 'rxjs';

export function useSubjectState<T>(subject$: BehaviorSubject<T>): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [subject, setSubject] = useState<T>(subject$.value);

    useEffect(() => {
        const subscription = subject$.subscribe(setSubject);

        return () => {
            subscription.unsubscribe();
        };
    }, [subject$]);

    const handleChange = useCallback(
        (value: T | ((prev: T) => T)) => {
            if (typeof value === 'function') {
                const nextValue = (value as (prev: T) => T)(subject$.value);
                subject$.next(nextValue)
            } else {
                subject$.next(value);
            }
        },
        [subject$]
    );

    return [subject, handleChange];
}

export function useNullableSubjectState<T>(subject$: BehaviorSubject<T> | undefined, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [subject, setSubject] = useState<T>(subject$?.value ?? initialValue);

    useEffect(() => {
        if (!subject$) {
            return;
        }
        const subscription = subject$.subscribe(setSubject);

        return () => {
            subscription.unsubscribe();
        };
    }, [subject$]);

    const handleChange = useCallback(
        (value: T | ((prev: T) => T)) => {
            if (!subject$) {
                setSubject(value);
            } else if (typeof value === 'function') {
                const nextValue = (value as (prev: T) => T)(subject$.value);
                subject$.next(nextValue)
            } else {
                subject$.next(value);
            }
        },
        [subject$]
    );

    return [subject, handleChange];
}
