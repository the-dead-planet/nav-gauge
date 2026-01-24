import { createContext, } from "react";
import { StateWarden } from "./state-warden";

export const StateWardenContext = createContext<StateWarden | null>(null);
