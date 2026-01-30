import { MarkerImage, RouteTimes } from "@apparatus";
import { ParsingResultWithError } from "@tinker-chest";
import { BehaviorSubject } from "rxjs";

export interface RouteMapToolProps {
    data$: BehaviorSubject<ParsingResultWithError>;
    routeTimes$: BehaviorSubject<RouteTimes | null>;
    images$: BehaviorSubject<MarkerImage[]>;
    progressMs$: BehaviorSubject<number>;
}
