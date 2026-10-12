import { FC } from "react";
import { LinkText } from "./LinkText";
import { TypographyPreview } from "./TypographyPreview";

export const ExternalLink: FC = () => (
    <TypographyPreview>{(props) => (
        <LinkText
            href="https://openstreetmap.org/copyright"
            highlightShade={800}
            accessibilityLabel="OpenStreetMap copyright"
            accessibilityHint="Opens in the browser"
            {...props}
        >
            OpenStreetMap copyright
        </LinkText>
    )}</TypographyPreview>
);
