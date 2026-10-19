export const TRANSLUCENT_OPACITY = 0.24;
export const TRANSLUCENT_OPACITY_BACKGROUND = 0.4;
import { BehaviorSubject } from "rxjs";
import { TopBarBackAction } from "./model";

export const topBarBackAction$ = new BehaviorSubject<TopBarBackAction | null>(
  null,
);
