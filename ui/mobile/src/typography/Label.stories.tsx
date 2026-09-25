import { FC } from "react";
import { Label } from "./Label";
import { TypographyPreview } from "./TypographyPreview";

export const LabelVariants: FC = () => (
    <TypographyPreview>{(props) => <Label color="primary" {...props}>Label</Label>}</TypographyPreview>
);
