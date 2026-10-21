import { useMachineWard } from "../../useMachineWard";

export const useMapSection = () => {
    const { signaliumBureau } = useMachineWard();

    const handleError = (error: Error | null) => {
        const msg = 'Something went wrong while rendering the map';

        signaliumBureau.addNotice({
            id: 'map-section',
            type: 'glitch',
            error: error || new Error(msg),
            text: error?.message || msg,
        });
    };

    return { handleError };
};
