import { useContext } from "react";
import { StateWardenContext } from "./StateWardenContext";
import { StateWarden } from "./state-warden";

export const useStateWarden = (): StateWarden => {
    const context = useContext(StateWardenContext);

    if (!context) {
        throw new Error("useStateWarden must be used within a StateWardenContext provider");
    }

    return context;
};
