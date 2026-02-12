import { FC } from "react";
import { View,  } from "react-native";
import { RouteFileInputProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { FileInputStatus, FileInput } from "@mobile-ui";
import { useSubjectState } from "@apparatus";

export const RouteStoryFileInput: FC<RouteFileInputProps> = ({ data$, images$ }) => {
    const [{ geojson, routeName, error }, setData] = useSubjectState(data$);
    const [_images, setImages] = useSubjectState(images$);
    // const readImage = useImageReader(setImages);

    return (
        <View>
            <FileInput />
            <FileInputStatus ok={!!geojson && !error} error={error} routeName={routeName} />
        </View>
    );
};
