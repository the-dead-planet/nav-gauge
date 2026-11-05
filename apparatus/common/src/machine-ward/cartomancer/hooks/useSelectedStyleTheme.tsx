import { Theme, useTheme } from "@ui";
import { Cartomancer } from "../cartomancer";
import { useObservableState } from "@tinker-chest";

export function useSelectedStyleTheme<TMap>(cartomancer: Cartomancer<TMap>): Theme {
    const theme = useTheme();
    const selectedStyleThemeMode = useObservableState(cartomancer.selectedStyleThemeMode$, theme.mode);
    
    return theme.forMode(selectedStyleThemeMode);
};
