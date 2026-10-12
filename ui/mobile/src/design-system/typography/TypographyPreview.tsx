import { FC, ReactNode, useState } from "react";
import { Switch, View } from "react-native";
import { TypographyProps } from "@ui";
import { Text } from "./Text";

const booleanProps = ['bold', 'uppercase', 'tabular', 'nowrap', 'shadow', 'disabled'] as const;

export type TypographyPreviewProps = Pick<TypographyProps, (typeof booleanProps)[number]>;

export const TypographyPreview: FC<{ children: (props: TypographyPreviewProps) => ReactNode }> = ({ children }) => {
    const [props, setProps] = useState<TypographyPreviewProps>({});

    return (
        <View style={{ rowGap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {booleanProps.map((prop) => (
                    <View key={prop} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Switch
                            value={!!props[prop]}
                            onValueChange={(value) => setProps({ ...props, [prop]: value })}
                            accessibilityLabel={prop}
                        />
                        <Text>{prop}</Text>
                    </View>
                ))}
            </View>
            {children(props)}
        </View>
    );
};
