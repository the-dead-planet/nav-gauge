import { FC, useState } from "react";
import { FileInputStatus } from "@web-ui";
import { useImageReader } from "./images/useImageReader";
import { useSubjectState, parsers, useStateWarden } from "@apparatus";
import { RouteFileInputProps, RouteStoryGear } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const RouteStoryFileInput: FC<RouteFileInputProps> = ({ data$, images$ }) => {
    const { signaliumBureau } = useStateWarden();
    const [{ geojson, routeName, error }, setData] = useSubjectState(data$);
    const [isLoading, setIsLoading] = useState(false);
    const [_images, setImages] = useSubjectState(images$);
    const readImage = useImageReader(setImages);

    const handleError = (error: Error) => {
        const id = 'file-upload';
        signaliumBureau.addNotice({
            id,
            type: 'error',
            text: 'File upload failed',
            error,
        });
        setIsLoading(false);
    };


    const handleInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        setIsLoading(true);
        const files: File[] = [];
        for (let i = 0; i < event.target.files.length; i++) {
            files.push(event.target.files.item(i)!);
        }
        
        try {
            await RouteStoryGear.uploadFile<File>(
                files,
                geojson,
                (file) => file.text(),
                handleError,
                setData,
                readImage
            );
        } catch (err) {
            handleError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input
                id="files"
                type="file"
                multiple
                accept={[...parsers.keys(), "image/png", "image/jpeg", "image/jpg"].join(', ')}
                onChange={handleInput}
            />
            <FileInputStatus
                isLoading={isLoading}
                ok={!!geojson && !error}
                error={error}
                routeName={routeName}
            />
        </div>
    );
};
