import type { Meta } from "storybook-react-rsbuild";
import { Divider } from "./Divider";
import { ColorVariant } from "@ui";
import { Text } from "../typography";

const meta = {
    title: "Divider",
    component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;

const allColors: ColorVariant[] = ["neutral", "primary", "secondary", "tertiary"];

export const DividerVariants = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24 }}>
            <Text style={{ fontWeight: 700 }}>Horizontal (default)</Text>
            <Divider />

            <Text style={{ fontWeight: 700 }}>Horizontal with colors</Text>
            {allColors.map((c) => (
                <div key={c} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Text>{c}</Text>
                    <Divider color={c} />
                </div>
            ))}

            <Text style={{ fontWeight: 700 }}>Vertical</Text>
            <div style={{ display: "flex", gap: 16, height: 80, alignItems: "stretch" }}>
                <Text>Left</Text>
                <Divider orientation="vertical" />
                <Text>Center</Text>
                <Divider orientation="vertical" color="primary" />
                <Text>Right</Text>
            </div>

            <Text style={{ fontWeight: 700 }}>Vertical with all colors</Text>
            <div style={{ display: "flex", gap: 16, height: 80, alignItems: "stretch" }}>
                {allColors.map((c) => (
                    <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <Divider orientation="vertical" color={c} />
                        <Text>{c}</Text>
                    </div>
                ))}
            </div>
        </div>
    ),
};
