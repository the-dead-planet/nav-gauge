import { Children, FC, ReactNode } from "react";
import { ResolvedThemeAppearance } from "@ui";
import { Text } from "../design-system/typography";

export const HudContent: FC<{
    children: ReactNode;
    appearance: ResolvedThemeAppearance;
}> = ({ children, appearance }) => (
    <>
        {Children.toArray(children).map((child, index) =>
            typeof child === "string" || typeof child === "number" ? (
                <Text
                    key={index}
                    fontWeight={appearance.fontWeight}
                    style={{ color: appearance.glyphs }}
                >
                    {child}
                </Text>
            ) : (
                child
            ),
        )}
    </>
);
